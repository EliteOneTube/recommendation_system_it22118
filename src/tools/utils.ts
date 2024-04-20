import { Coupon } from "../types/datastore";

export function mostFrequent<T>(arr: T[]): T {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
}

export function getAllEventIds(coupons: Coupon[]): string[] {
    const eventIds: string[] = [];
    for (const coupon of coupons) {
        for (const selection of coupon.selections) {
            eventIds.push(selection.event_id);
        }
    }
    return eventIds;
}