import { AbstractConsumer } from "../consumer";
import { Kafka, Consumer, EachMessagePayload } from "kafkajs";

export class KafkaConsumer extends AbstractConsumer {
    private consumer: Consumer

    constructor() {
        super();
        this.consumer = new Kafka({
            clientId: 'recommendation_system',
            brokers: ['localhost:9092']
        }).consumer({ groupId: 'test-group' });
    }

    async consume(topic: string): Promise<void> {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: topic });
        await this.consumer.run({
            eachMessage: async (payload) => {
                await this.handle(payload);
            },
        });
    }

    handle(payload: EachMessagePayload): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    async connect(): Promise<void> {
        await this.consumer.connect();
    }
}