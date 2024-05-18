import express, { Request, Response } from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { frequencyRecommend } from './tools/recommender';
import KafkaProducer from './messager/kafka/kafkaProducer';
import KafkaHead from './messager/kafka/kafkaHead';
import { logger } from './tools/logger';
import MongoStore from './datastore/mongostore';
import asyncify from 'express-asyncify';
import { FileStore } from './datastore/filestore';
import { KafkaConsumer } from './messager/kafka/kafkaConsumer';
import { Admin } from 'kafkajs';

export default class Api {
    private app: express.Express;

    private store: MongoStore | FileStore;

    private kafkaHead: KafkaHead;

    //producers should be an array of objects, one for each topic
    private producers: { [key: string]: KafkaProducer } = {};

    private fallbackStore: FileStore;

    private consumers: KafkaConsumer[] = [];

    private kafkaAdmin: Admin;

    private static topicList: string[] = ['user', 'event', 'coupon', 'recommendation'];

    constructor() {
        this.app = asyncify(express());
        this.store = new MongoStore();
        this.kafkaHead = new KafkaHead();
        this.fallbackStore = new FileStore();
    }

    public async init(storePath: string) {
        this.kafkaAdmin = this.kafkaHead.admin();

        this.app.use(express.json());

        if (!storePath) {
            logger.warn('This is not recommended for production use');
            this.fallbackStore.initialize('data.json');
            this.store = this.fallbackStore;
        } else {
            await this.store.initialize(storePath);
        }

        //get all topics from kafka
        const topics = await this.kafkaAdmin.listTopics();

        //create topics if they don't exist
        for (const topic of Api.topicList) {
            if (!topics.includes(topic)) {
                await this.kafkaAdmin.createTopics({
                    topics: [{ topic: topic }]
                });
            }
        }
        
        //create producer for each topic
        for(let i = 0; i < Api.topicList.length; i++) {
            this.producers[Api.topicList[i]] = new KafkaProducer(this.kafkaHead);
            await this.producers[Api.topicList[i]].connect();
        }

        //create consumer for each topic
        for(let i = 0; i < Api.topicList.length; i++) {
            this.consumers.push(new KafkaConsumer(this.kafkaHead));
            await this.consumers[i].connect(Api.topicList[i]);
            await this.consumers[i].consume();
        }

        this.registerEndpoints();
    }

    public registerEndpoints() {
        this.app.post('/user', this.asyncWrapper(this.createUser.bind(this)));

        this.app.post('/event', this.asyncWrapper(this.createEvent.bind(this)));

        this.app.post('/coupon', this.asyncWrapper(this.createCoupon.bind(this)));

        this.app.get('/user/:user_id', this.asyncWrapper(this.getUser.bind(this)));

        this.app.get('/ping', this.ping.bind(this));
    }

    private createUser = async (req: Request, res: Response) => {
        const validated = validator('user', req.body as User);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        const user = req.body as User;

        const inserted = await this.store.insertUser(user);

        await this.producers['user'].produce('user', user.user_id);

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

    private ping(req: Request, res: Response) {
        res.send('Pong');
    }
}