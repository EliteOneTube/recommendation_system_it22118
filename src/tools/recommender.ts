import { FileStore } from '../datastore/filestore';
import { Event, Coupon } from '../types/datastore';
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

    //check all the events that the user has selected
    const user_events_id= getAllEventIds(userCoupons);

    const user_events_details = user_events_id.map(eventId => filestore.getEventById(eventId));
    
    const sports = user_events_details.map(event => event.sport);

    const leagues = user_events_details.map(event => event.league);

    const mostFrequentSport = mostFrequent(sports);

    const mostFrequentLeague = mostFrequent(leagues);

    //Get the events that match the most frequent sport and league that the user hasn't selected
    //they dont have to both match, just one of them and not be in the user's events
    const recommendedEvents = filestore.getEvents().filter(event => (event.sport === mostFrequentSport || event.league === mostFrequentLeague) && !user_events_id.includes(event.event_id));

    if (recommendedEvents.length === 0) {
        return randomRecommend();
    }
    
    return recommendedEvents;
}

function getAllEventIds(coupons: Coupon[]): string[] {
    const eventIds: string[] = [];
    for (const coupon of coupons) {
        for (const selection of coupon.selections) {
            eventIds.push(selection.event_id);
        }
    }
    return eventIds;
}