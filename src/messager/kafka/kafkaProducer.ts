import { Producer } from 'kafkajs';
import { AbstractProducer } from '../producer';
import KafkaHead from './kafkaHead';

export default class KafkaProducer extends AbstractProducer {
    private producer: Producer;

    constructor(kafkaHead: KafkaHead) {
        super();
        this.producer = kafkaHead.getProducer();
    }

    async produce(topic: string, message: string): Promise<void> {
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
