import { Kafka } from "kafkajs";

export default class KafkaHead {
    private kafka: Kafka;

    constructor() {
        this.kafka = new Kafka({
            brokers: [process.env.KAFKA_URL]
        });
    }

    public getProducer() {
        return this.kafka.producer();
    }

    public getConsumer(groupId: string) {
        return this.kafka.consumer({ groupId: groupId });
    }
}