import express, { Request, Response } from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { frequencyRecommend } from './tools/recommender';
import { FileStore } from './datastore/filestore';
import KafkaProducer from './messager/kafka/kafkaProducer';
import KafkaHead from './messager/kafka/kafkaHead';
import logger from './tools/logger';


export default class Api {
    private app: express.Express;

    private fileStore: FileStore;

    private kafkaHead: KafkaHead;

    private producer: KafkaProducer

    constructor() {
        this.app = express();
        this.fileStore = new FileStore();
        this.kafkaHead = new KafkaHead();
        this.producer = new KafkaProducer(this.kafkaHead);
    }

    public async init(storePath: string) {
        this.app.use(express.json());

        this.fileStore.initialize(storePath);

        await this.producer.connect();

        this.registerEndpoints();
    }

    public registerEndpoints() {
        this.app.post('/user', this.createUser.bind(this));

        this.app.post('/event', this.createEvent.bind(this));

        this.app.post('/coupon', this.createCoupon.bind(this));

        this.app.get('/user/:user_id', this.getUser.bind(this));
    }

    private createUser(req: Request, res: Response): void {
        const validated = validator('user', req.body as User);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const inserted = this.fileStore.insertUser(req.body as User);

        if (!inserted) {
            res.status(409).send('User already exists');
            return;
        }

        res.send('POST request received at /user');
    }

    private createEvent(req: Request, res: Response): void {
        const validated = validator('event', req.body as Event);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const inserted = this.fileStore.insertEvent(req.body as Event);

        if (!inserted) {
            res.status(409).send('Event already exists');
            return;
        }

        res.send('POST request received at /event');
    }

    private createCoupon(req: Request, res: Response): void {
        const validated = validator('coupon', req.body as Coupon);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const inserted = this.fileStore.insertCoupon(req.body as Coupon);

        if (!inserted) {
            res.status(409).send('Coupon already exists');
            return;
        }

        res.send('POST request received at /coupon');
    }

    private getUser(req: Request, res: Response): void {
        const user = this.fileStore.getUserById(req.params.user_id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const recommendations = frequencyRecommend(req.params.user_id, this.fileStore);

        res.send(recommendations);
    }

    public startServer() {
        const server = this.app.listen(process.env.PORT || 3000, () => {
            logger.info(`Server running on port ${process.env.PORT || 3000}`);
        });

        return server;
    }

    public getApp() {
        return this.app;
    }
}