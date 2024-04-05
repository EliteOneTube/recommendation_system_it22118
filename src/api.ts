import express from 'express';
import { validator } from './utils';
import { User, Event, Coupon } from './types/database';

const app = express();
app.use(express.json());

app.post('/user', (req, res) => {
    const validated = validator('user', req.body as User);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
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

    res.send('POST request received at /event');
});

app.post('/coupon', (req, res) => {
    const validated = validator('coupon', req.body as Coupon);

    if (!validated.valid) {
        res.status(400).send(validated.errors);
        return;
    }

    res.send('POST request received at /coupon');
});

// GET endpoint
app.get('/user/:user_id', (req, res) => {
    // Handle the request and send a response
    res.send('GET request received at /endpoint');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});