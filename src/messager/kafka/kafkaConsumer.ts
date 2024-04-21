import { AbstractConsumer } from "../consumer";
import { Consumer, EachMessagePayload } from "kafkajs";
import KafkaHead from "./kafkaHead";

export class KafkaConsumer extends AbstractConsumer {
    private consumer: Consumer

    constructor(kafkaHead: KafkaHead) {
        super();
        this.consumer = kafkaHead.getConsumer('rec-consumer');
    }

    async consume(): Promise<void> {
        await this.consumer.run({
            eachMessage: async (payload) => {
                await this.handle(payload);
            },
        });
    }

    async handle(payload: EachMessagePayload): Promise<void> {
        console.log(`Received message: ${payload.message.value.toString()}`);
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    async connect(topic: string): Promise<void> {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: topic });
    }
}