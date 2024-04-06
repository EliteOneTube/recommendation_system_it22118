import express from 'express';
import { validator } from './tools/validator';
import { User, Event, Coupon } from './types/datastore';
import { randomRecommend } from './tools/recommender';
import { FileStore } from './datastore/fileStore';

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

    fileStore.insertUser(req.body as User);

    res.send('POST request received at /user');
});

app.post('/event', (req, res) => {
    const validated = validator('event', req.body as Event);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
        return;
    }

    fileStore.insertEvent(req.body as Event);

    res.send('POST request received at /event');
});

app.post('/coupon', (req, res) => {
    const validated = validator('coupon', req.body as Coupon);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
        return;
    }

    fileStore.insertCoupon(req.body as Coupon);

    res.send('POST request received at /coupon');
});

app.get('/user/:user_id', (req, res) => {
    const reccommendations = randomRecommend();

    res.send(reccommendations);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});