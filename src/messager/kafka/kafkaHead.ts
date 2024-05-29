import { Admin, Kafka, logLevel } from "kafkajs";
import { kafkaLogger, logger  } from "../../tools/logger";
import KafkaProducer from "./kafkaProducer";
import { KafkaConsumer } from "./kafkaConsumer";
import { FileStore } from "src/datastore/filestore";
import MongoStore from "src/datastore/mongostore";

export default class KafkaHead {
    private kafka: Kafka;

    private eventsPerMinute: { [key: string]: number } = {};

    private producers: { [key: string]: KafkaProducer } = {};

    private consumers: { [key: string]: [KafkaConsumer?] } = {};

    private static topicList: string[] = ['user', 'event', 'coupon'];

    private kafkaAdmin: Admin;

    private store: MongoStore | FileStore;

    constructor(store: MongoStore | FileStore) {
        try {
            this.kafka = new Kafka({
                brokers: [process.env.KAFKA_URL],
                logCreator: kafkaLogger,
                logLevel: logLevel.ERROR
            });

            this.kafkaAdmin = this.kafka.admin();

            this.store = store;
        } catch (error) {
            return null;
        }
    }

    public admin() {
        return this.kafka.admin();
    }

    public getProducer() {
        return this.kafka.producer();
    }

    public getConsumer(groupId: string) {
        return this.kafka.consumer({ 
            groupId: groupId, 
            sessionTimeout: 60000,
            heartbeatInterval: 6000,
            
        });
    }

    public async init() {
        for (const topic of KafkaHead.topicList) {
            this.eventsPerMinute[topic] = 0;
            this.consumers[topic] = [];
        }

        //get all topics from kafka
        const topics = await this.kafkaAdmin.listTopics();

        //create topics if they don't exist
        for (const topic of KafkaHead.topicList) {
            if (!topics.includes(topic)) {
                await this.kafkaAdmin.createTopics({
                    topics: [{ 
                        topic: topic,
                        numPartitions: 2,
                    }]
                });
            }
        }
        
        //create producer for each topic
        for(const topic of KafkaHead.topicList) {
            this.producers[topic] = new KafkaProducer(this);
            await this.producers[topic].connect();
        }

        //create consumer for each topic
        for(const topic of KafkaHead.topicList) {
            const consumer = new KafkaConsumer(this, this.store, topic+this.consumers[topic].length);
            await consumer.connect(topic);
            await consumer.consume();

            this.consumers[topic].push(consumer);
        }

        setInterval(() => {
            this.checkEventsPerMinute();
        }, 60000);
    }

    public increaseEventsPerMinute(topic: string) {
        this.eventsPerMinute[topic]++;
    }

    public returnProducer(topic: string) {
        return this.producers[topic];
    }

    public returnConsumer(topic: string) {
        return this.consumers[topic];
    }

    public checkEventsPerMinute() {
        //For each topic check the number of events per minute. If  num of consmers * 60 < eventsPerMinute then return else create consumers to handle the load
        for (const topic of KafkaHead.topicList) {
            const numOfConsumers = this.getNumOfConsumers(topic);

            const missingConsumers = Math.ceil(this.eventsPerMinute[topic] / 60) - numOfConsumers;

            if (missingConsumers > 0) {
                for (let i = 0; i < missingConsumers; i++) {
                    const newConsumer = new KafkaConsumer(this, this.store, topic+this.consumers[topic].length);
                    newConsumer.connect(topic).then(() => {
                        newConsumer.consume().then(() => {
                            this.consumers[topic].push(newConsumer);
                        }).catch((error) => {
                            console.error(error);
                        });
                    }).catch((error) => {
                        console.error(error);
                    });
                }

                logger.info(`Created ${missingConsumers} new consumers for topic ${topic}`);
            }

            const excessConsumers = (numOfConsumers * 60 - this.eventsPerMinute[topic]) / 60 - 1 ;  

            if (excessConsumers > 0 && this.consumers[topic].length > 1) {
                for(let i = 0; i < excessConsumers; i++) {
                    const consumer = this.consumers[topic].pop();
                    consumer.disconnect().then(() => {
                    }).catch((error) => {
                        console.error(error);
                    });
                }

                logger.info(`Removed ${excessConsumers} consumers for topic ${topic}`);
            }

            this.eventsPerMinute[topic] = 0;
        }
    }

    public getNumOfConsumers(topic: string) {
        //count how many this.consumers[topic] exist
        return this.consumers[topic].length;
    }
}