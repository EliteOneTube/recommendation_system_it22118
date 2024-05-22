import { Kafka, logLevel } from "kafkajs";
import { kafkaLogger  } from "../../tools/logger";

export default class KafkaHead {
    private kafka: Kafka;

    constructor() {
        try {
            this.kafka = new Kafka({
                brokers: [process.env.KAFKA_URL],
                logCreator: kafkaLogger,
                logLevel: logLevel.ERROR
            });
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
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
        });
    }
}