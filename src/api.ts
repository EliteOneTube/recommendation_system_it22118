import express, { Request, Response } from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { frequencyRecommend } from './tools/recommender';
import KafkaHead from './messager/kafka/kafkaHead';
import { logger } from './tools/logger';
import MongoStore from './datastore/mongostore';
import asyncify from 'express-asyncify';
import { FileStore } from './datastore/filestore';
import { Store } from './datastore/store';

export default class Api {
    private app: express.Express;

    private store: Store;

    private kafkaHead: KafkaHead;

    private FileStore: FileStore;

    private MongoStore: MongoStore;

    constructor() {
        this.app = asyncify(express());
        this.MongoStore = new MongoStore();
        this.kafkaHead = new KafkaHead(this.store);
        this.FileStore = new FileStore();
    }

    public async init(storePath: string) {
        this.app.use(express.json());

        if (!storePath || !storePath.includes('mongo')) {
            logger.warn('This is not recommended for production use');
            if(!storePath) storePath = 'data.json';

            this.FileStore.initialize(storePath);

            this.store = this.FileStore;
        } else {
            this.store = this.MongoStore;
            await this.store.initialize(storePath);
        }
        
        if (process.env.KAFKA_URL) {
            await this.kafkaHead.init();
        }

        this.registerEndpoints();
    }

    public registerEndpoints() {
        this.app.post('/user', this.asyncWrapper(this.createUser.bind(this)));

        this.app.post('/event', this.asyncWrapper(this.createEvent.bind(this)));

        this.app.post('/coupon', this.asyncWrapper(this.createCoupon.bind(this)));

        this.app.get('/recommend', this.asyncWrapper(this.getRec.bind(this)));

        this.app.get('/ping', this.ping.bind(this));

        this.app.get('/random', this.asyncWrapper(this.getRandomRec.bind(this)));
    }

    private createUser = async (req: Request, res: Response) => {
        const validated = validator('user', req.body as User);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        this.kafkaHead.increaseEventsPerMinute('user');

        const user = req.body as User;

        if(this.kafkaHead.returnConsumer('user')) {
            await this.kafkaHead.returnProducer('user').produce('user', JSON.stringify(user));
        } else {
            await this.store.insertUser(user);
        }

        res.send('POST request received at /user');
    }

    private async createEvent(req: Request, res: Response): Promise<void> {
        const validated = validator('event', req.body as Event);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        this.kafkaHead.increaseEventsPerMinute('event');

        const event = req.body as Event;

        if(this.kafkaHead.returnConsumer('event')) {
            await this.kafkaHead.returnProducer('event').produce('event', JSON.stringify(event));
        } else {
            await this.store.insertEvent(event);
        }

        res.send('POST request received at /event');
    }

    private async createCoupon(req: Request, res: Response): Promise<void> {
        const validated = validator('coupon', req.body as Coupon);

        if (!validated.valid) {
            res.status(400).send(validated.errors);
            return;
        }

        this.kafkaHead.increaseEventsPerMinute('coupon');

        const coupon = req.body as Coupon;

        if(this.kafkaHead.returnConsumer('coupon')) {
            await this.kafkaHead.returnProducer('coupon').produce('coupon', JSON.stringify(coupon));
        } else {
            await this.store.insertCoupon(coupon);
        }

        res.send('POST request received at /coupon');
    }

    private async getRec(req: Request, res: Response): Promise<void> {
        const user_id = req.query.user_id as string;
        const client_id = req.query.client_id as string;

        const user = await this.store.getUserById(user_id, client_id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const recommendations = await frequencyRecommend(user_id, client_id, this);

        res.send(recommendations);
    }

    private async getRandomRec(req: Request, res: Response): Promise<void> {
        const user = await this.store.getUsers(req.query.client_id as string);

        const client_id = req.query.client_id as string;

        //calculate a random number between 0 and the number of users
        const random = Math.floor(Math.random() * user.length);

        const recommendations = await frequencyRecommend(user[random].user_id, client_id, this);

        res.send(recommendations);
    }

    public startServer() {
        const server = this.app.listen(Number(process.env.PORT), '0.0.0.0', () => {
            logger.info(`Server running on port ${process.env.PORT}`);
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