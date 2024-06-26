import { faker } from '@faker-js/faker';
import { User, Event, Coupon, Selection } from '../src/types/datastore';
import axios from 'axios';

const leagues = {
    "Football": ["NFL", "NCAA", "CFL", "AFL"],
    "Basketball": ["NBA", "NCAA", "WNBA"],
    "Tennis": ["ATP", "WTA"],
    "Hockey": ["NHL", "AHL"]
}

const client_ids = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"
]

// Function to generate a random user
const generateUser = (): User => {
    return {
        birth_year: faker.date.past().toISOString(),
        country: faker.location.country(),
        currency: faker.finance.currencyCode(),
        gender: faker.helpers.arrayElement(['M', 'F']),
        registration_date: faker.date.past().toISOString(),
        user_id: faker.string.uuid(),
        client_id: faker.helpers.arrayElement(client_ids)
    }
};

// Function to generate a random event
const generateEvent = (): Event => {
    const sport = faker.helpers.arrayElement(Object.keys(leagues));

    const league: string = faker.helpers.arrayElement(leagues[sport] as string[]);

    return {
        begin_timestamp: faker.date.future().toISOString(),
        country: faker.location.country(),
        end_timestamp: faker.date.future().toISOString(),
        event_id: faker.string.uuid(),
        league: league,
        participants: [faker.lorem.word(), faker.lorem.word()],
        sport: sport,
        client_id: faker.helpers.arrayElement(client_ids)
    };
};

// Function to generate a random selection
const generateSelection = (eventIds: string[]): Selection => {
    return {
        event_id: faker.helpers.arrayElement(eventIds),
        odds: parseFloat(faker.finance.amount())
    };
};

// Function to generate a random coupon
const generateCoupon = (userIds: string[], eventIds: string[]): Coupon => {
    const selections: Selection[] = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
        selections.push(generateSelection(eventIds));
    }
    return {
        coupon_id: faker.string.uuid(),
        selections,
        stake: parseFloat(faker.finance.amount()),
        timestamp: faker.date.past().toISOString(),
        user_id: faker.helpers.arrayElement(userIds),
        client_id: faker.helpers.arrayElement(client_ids)
    };
};

// Generate dummy data
export const generateDummyData = (numUsers: number, numEvents: number, numCoupons: number) => {
    const users: User[] = [];
    const events: Event[] = [];
    const coupons: Coupon[] = [];

    // Generate users
    const userIds: string[] = [];
    for (let i = 0; i < numUsers; i++) {
        const user = generateUser();
        users.push(user);
        userIds.push(user.user_id);
    }

    // Generate events
    const eventIds: string[] = [];
    for (let i = 0; i < numEvents; i++) {
        const event = generateEvent();
        events.push(event);
        eventIds.push(event.event_id);
    }

    // Generate coupons
    for (let i = 0; i < numCoupons; i++) {
        coupons.push(generateCoupon(userIds, eventIds));
    }

    return { users, events, coupons };
};

const sendDummyData = async (numUsers: number, numEvents: number, numCoupons: number, url: string) => {
    const isRunning = await axios.get(url+'/ping').then(() => {
        console.log('Server is running, sending data...')
        return true;
    }).catch(() => {
        console.log('Server is not running...')
        return false;
    });

    if(!isRunning) return;

    // Generate dummy data and send it to the server
    const dummyData = generateDummyData(numUsers, numEvents, numCoupons);
    
    //send data to server
    for(const user of dummyData.users){
        axios.post(url+'/user', user).catch((err) => {
            console.log(err)
        });
    }

    console.log('Sent ' + dummyData.users.length + ' users to server')

    for(const event of dummyData.events){
        axios.post(url+'/event', event).catch((err) => {
            console.log(err)
        });
    }

    console.log('Sent ' + dummyData.events.length + ' events to server')

    for(const coupon of dummyData.coupons){
        axios.post(url+'/coupon', coupon).catch((err) => {
            console.log(err)
        });
    }

    console.log('Sent ' + dummyData.coupons.length + ' coupons to server')
};

const url = process.argv[2] ?? 'http://localhost:8080'
const amount = Number(process.argv[3]) ?? 1000

console.log('Starting dummy data generator in 5 seconds...')

void sendDummyData(amount, amount, amount, url)