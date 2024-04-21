import express, { Request, Response } from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { frequencyRecommend } from './tools/recommender';
import KafkaProducer from './messager/kafka/kafkaProducer';
import KafkaHead from './messager/kafka/kafkaHead';
import logger from './tools/logger';
import MongoStore from './datastore/mongostore';
import asyncify from 'express-asyncify';

export default class Api {
    private app: express.Express;

    private store: MongoStore;

    private kafkaHead: KafkaHead;

    private producer: KafkaProducer

    constructor() {
        this.app = asyncify(express());
        this.store = new MongoStore();
        this.kafkaHead = new KafkaHead();
        this.producer = new KafkaProducer(this.kafkaHead);
    }

    public async init(storePath: string) {
        this.app.use(express.json());

        await this.store.initialize(storePath);

        await this.producer.connect();

        this.registerEndpoints();
    }

    public registerEndpoints() {
        this.app.post('/user', this.asyncWrapper(this.createUser.bind(this)));

        this.app.post('/event', this.asyncWrapper(this.createEvent.bind(this)));

        this.app.post('/coupon', this.asyncWrapper(this.createCoupon.bind(this)));

        this.app.get('/user/:user_id', this.asyncWrapper(this.getUser.bind(this)));
    }

    private createUser = async (req: Request, res: Response) => {
        const validated = validator('user', req.body as User);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const inserted = await this.store.insertUser(req.body as User);

        if (!inserted) {
            res.status(409).send('User already exists');
            return;
        }

        res.send('POST request received at /user');
    }

    private async createEvent(req: Request, res: Response): Promise<void> {
        const validated = validator('event', req.body as Event);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const inserted = await this.store.insertEvent(req.body as Event);

        if (!inserted) {
            res.status(409).send('Event already exists');
            return;
        }

        res.send('POST request received at /event');
    }

    private async createCoupon(req: Request, res: Response): Promise<void> {
        const validated = validator('coupon', req.body as Coupon);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const inserted = await this.store.insertCoupon(req.body as Coupon);

        if (!inserted) {
            res.status(409).send('Coupon already exists');
            return;
        }

        res.send('POST request received at /coupon');
    }

    private async getUser(req: Request, res: Response): Promise<void> {
        const user = await this.store.getUserById(req.params.user_id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const recommendations = await frequencyRecommend(req.params.user_id, this);

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

    private asyncWrapper(fn: (req: Request, res: Response) => Promise<void>) {
        return (req: Request, res: Response) => {
            fn(req, res).catch((err) => {
                logger.error(err);
                res.status(500).send('Internal server error');
            });
        };
    }

    public getStore() {
        return this.store;
    }
}