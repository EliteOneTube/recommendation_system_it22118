import { EachMessagePayload } from "kafkajs";

export abstract class AbstractConsumer {
    abstract consume(topic: string): void;

    abstract handle(payload: EachMessagePayload): Promise<void>;

    abstract disconnect(): void;

    abstract connect(): void;
}