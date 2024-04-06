
import { FileStore } from '../datastore/filestore';
import { Event } from '../types/datastore';
import { mostFrequent } from './utils';

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

export function frequencyRecommend(user_id: string, filestore: FileStore): Event[] {
    const userCoupons = filestore.getUserCoupons(user_id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    const user_events_id= userCoupons.map(coupon => coupon.selections[0].event_id);

    const user_events_details = user_events_id.map(eventId => filestore.getEventById(eventId));
    
    const sports = user_events_details.map(event => event.sport);

    const leagues = user_events_details.map(event => event.league);

    const mostFrequentSport = mostFrequent(sports);

    const mostFrequentLeague = mostFrequent(leagues);

    //Get the events that match the most frequent sport and league that the user hasn't selected
    const recommendedEvents = filestore.getEvents().filter(event => event.sport === mostFrequentSport && event.league === mostFrequentLeague && !user_events_id.includes(event.event_id));

    if (recommendedEvents.length === 0) {
        return randomRecommend();
    }
    
    return recommendedEvents;
}