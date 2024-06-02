import MongoStore from 'src/datastore/mongostore';
import { Event } from '../types/datastore';
import { getAllEventIds, mostFrequent } from './utils';
import Api from 'src/api';
import { Store } from 'src/datastore/store';

export function randomRecommend(): Event[] {    
    return [
        {
            event_id: '1234',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
            sport: 'Football',
            begin_timestamp: '2021-01-01T00:00:00Z',
            end_timestamp: '2021-01-01T01:00:00Z',
            country: 'US',
            client_id: '1234'
        },
        {
            event_id: '5678',
            league: 'NBA',
            participants: ['Team C', 'Team D'],
            sport: 'Basketball',
            begin_timestamp: '2021-01-01T02:00:00Z',
            end_timestamp: '2021-01-01T03:00:00Z',
            country: 'US',
            client_id: '1234'
        }
    ];
}

export async function frequencyRecommend(user_id: string, api: Api, client_id: string): Promise<Event[]> {
    const store = api.getStore();

    const mostFrequentSport = await getMostFrequentItem('sport', store, user_id, client_id);

    const mostFrequentLeague = await getMostFrequentItem('league', store, user_id, client_id);

    const user_events_id = await getUserEventIds(user_id, store, client_id);

    //Get the events that match the most frequent sport and league that the user hasn't selected
    //they dont have to both match, just one of them and not be in the user's events
    const recommendedEvents = (await store.getEvents(client_id)).filter(event => (event.sport === mostFrequentSport || event.league === mostFrequentLeague) && !user_events_id.includes(event.event_id));
    
    return recommendedEvents;
}

export async function similaritiesRecommend(user_id: string, api: Api, client_id: string): Promise<Event[]> {
    const store = api.getStore();

    const user_events_id = await getUserEventIds(user_id, store, client_id);

    //Get other users that have selected the same sport or league
    const similarUsers = (await store.getUsers(client_id)).filter(async user => {
        const user_events_id = getAllEventIds(await store.getUserCoupons(user.user_id, client_id));
        return user_events_id.some(event_id => user_events_id.includes(event_id));
    });

    //Get the events from the first 5 similar users and filter out the ones the user has already selected
    const recommendedEvents = (await store.getEvents(client_id)).filter(event => similarUsers.slice(0, 5).some(user => user.user_id === user_id) && !user_events_id.includes(event.event_id));

    return recommendedEvents;
}

async function getMostFrequentItem(field: string, store: MongoStore | Store, user_id: string, client_id: string): Promise<string> {
    const userCoupons = (await store.getUserCoupons(user_id, client_id)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    if(userCoupons.length === 0){
        return null;
    }

    const user_events_id = getAllEventIds(userCoupons);

    const user_events_details: Event[] = []

    for(const user_event_id of user_events_id) {
        const event = await store.getEventById(user_event_id, client_id);

        if(event){
            user_events_details.push(event);
        }
    }

    const items = user_events_details.map(event => event[field] as string);
    
    return mostFrequent(items);
}

async function getUserEventIds(user_id: string, store: MongoStore | Store, client_id: string): Promise<string[]> {
    const userCoupons = (await store.getUserCoupons(user_id, client_id)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    if(userCoupons.length === 0){
        return [];
    }

    return getAllEventIds(userCoupons);
}