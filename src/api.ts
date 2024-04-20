import express, { Request, Response } from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { frequencyRecommend } from './tools/recommender';
import { FileStore } from './datastore/filestore';


export default class Api {
    private app: express.Express;

    private fileStore: FileStore;

    constructor() {
        this.app = express();
        this.fileStore = new FileStore();
    }

    public init() {
        this.app.use(express.json());

        this.fileStore.initialize('./data.json');

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
        const server = this.app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });

        return server;
    }
}