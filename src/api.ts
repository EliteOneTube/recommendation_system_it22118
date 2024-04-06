import express from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { frequencyRecommend } from './tools/recommender';
import { FileStore } from './datastore/filestore';

const app = express();
app.use(express.json());

const fileStore = new FileStore();

fileStore.initialize('./data.json');

app.post('/user', (req, res) => {
    const validated = validator('user', req.body as User);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
        return;
    }

    const inserted = fileStore.insertUser(req.body as User);

    if (!inserted) {
        res.status(409).send('User already exists');
        return;
    }

    res.send('POST request received at /user');
});

app.post('/event', (req, res) => {
    const validated = validator('event', req.body as Event);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
        return;
    }

    const inserted = fileStore.insertEvent(req.body as Event);

    if (!inserted) {
        res.status(409).send('Event already exists');
        return;
    }

    res.send('POST request received at /event');
});

app.post('/coupon', (req, res) => {
    const validated = validator('coupon', req.body as Coupon);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
        return;
    }

    const inserted = fileStore.insertCoupon(req.body as Coupon);

    if (!inserted) {
        res.status(409).send('Coupon already exists');
        return;
    }

    res.send('POST request received at /coupon');
});

app.get('/user/:user_id', (req, res) => {
    const user = fileStore.getUserById(req.params.user_id);

    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    const recommendations = frequencyRecommend(req.params.user_id, fileStore);

    res.send(recommendations);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});