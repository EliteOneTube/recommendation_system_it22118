import { Event } from '../types/datastore';
import { getAllEventIds, mostFrequent } from './utils';
import Api from 'src/api';

export function randomRecommend(): Event[] {    
    return [
        {
            event_id: '1234',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
            sport: 'Football',
            begin_timestamp: '2021-01-01T00:00:00Z',
            end_timestamp: '2021-01-01T01:00:00Z',
            country: 'US'
        },
        {
            event_id: '5678',
            league: 'NBA',
            participants: ['Team C', 'Team D'],
            sport: 'Basketball',
            begin_timestamp: '2021-01-01T02:00:00Z',
            end_timestamp: '2021-01-01T03:00:00Z',
            country: 'US'
        }
    ];
}

export async function frequencyRecommend(user_id: string, api: Api): Promise<Event[]> {
    const store = api.getStore();

    const userCoupons = (await store.getUserCoupons(user_id)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    if(userCoupons.length === 0){
        return randomRecommend();
    }

    const user_events_id = getAllEventIds(userCoupons);
    
    const user_events_details: Event[] = []

    for(const user_event_id of user_events_id) {
        const event = await store.getEventById(user_event_id);

        if(event){
            user_events_details.push(event);
        }
    }

    const sports = user_events_details.map(event => event.sport);

    const leagues = user_events_details.map(event => event.league);

    const mostFrequentSport = mostFrequent(sports);

    const mostFrequentLeague = mostFrequent(leagues);

    //Get the events that match the most frequent sport and league that the user hasn't selected
    //they dont have to both match, just one of them and not be in the user's events
    const recommendedEvents = (await store.getEvents()).filter(event => (event.sport === mostFrequentSport || event.league === mostFrequentLeague) && !user_events_id.includes(event.event_id));
    
    return recommendedEvents;
}