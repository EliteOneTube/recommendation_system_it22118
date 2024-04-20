import { Kafka, Producer } from 'kafkajs';
import { AbstractProducer } from '../producer';

export default class KafkaProducer extends AbstractProducer {
    private producer: Producer;

    constructor() {
        super();
        this.producer = new Kafka({
            clientId: 'recommendation_system',
            brokers: ['localhost:9092']
        }).producer();
    }

    async produce(topic: string, message: string): Promise<void> {
        await this.producer.connect();
        await this.producer.send({
            topic: topic,
            messages: [
                { value: message }
            ]
        });
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }
}