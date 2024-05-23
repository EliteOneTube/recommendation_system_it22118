import { AbstractConsumer } from "../consumer";
import { Consumer, EachMessagePayload,  KafkaMessage} from "kafkajs";
import KafkaHead from "./kafkaHead";
import MongoStore from "src/datastore/mongostore";
import { FileStore } from "src/datastore/filestore";
import { User, Event, Coupon } from "src/types/datastore";

export class KafkaConsumer extends AbstractConsumer {
    private consumer: Consumer;

    private store: MongoStore | FileStore;

    constructor(kafkaHead: KafkaHead, store: MongoStore | FileStore, group: string) {
        super();
        this.consumer = kafkaHead.getConsumer(group);
        this.store = store;
    }

    async consume(): Promise<void> {
        await this.consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                await this.handle(payload);

                await payload.heartbeat();
            },
        });
    }
    

    async handle(payload: EachMessagePayload): Promise<void> {
        const message: KafkaMessage = payload.message;
        const value = message.value.toString();
        
        try {
            const parsedValue= JSON.parse(value) as User | Event | Coupon;
            switch (payload.topic) {
                case 'user':
                    await this.store.insertUser(parsedValue as User);
                    break;
                case 'event':
                    await this.store.insertEvent(parsedValue as Event);
                    break;
                case 'coupon':
                    await this.store.insertCoupon(parsedValue as Coupon);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    async connect(topic: string): Promise<void> {
        await this.consumer.connect();
        await this.consumer.subscribe({ 
            topic: topic
        });
    }
}