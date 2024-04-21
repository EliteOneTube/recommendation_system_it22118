import { EachMessagePayload } from "kafkajs";

export abstract class AbstractConsumer {
    abstract consume(): void;

    abstract handle(payload: EachMessagePayload): Promise<void>;

    abstract disconnect(): void;

    abstract connect(topic: string): void;
}