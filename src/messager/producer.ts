export abstract class AbstractProducer {
    abstract produce(topic: string, message: string): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract connect(): Promise<void>;
}