export interface User {
    birth_year: string;
    country: string;
    currency: string;
    gender: string;
    regisration_date: string;
    user_id: string;
}

export interface Event {
    begin_timestamp: string;
    country: string;
    end_timestamp: string;
    event_id: string;
    league: string;
    participants: string[];
    sport: string;
}

export interface Coupon {
    coupon_id: string;
    selections: Selection[];
    stake: number;
    timestamp: string;
    user_id: string;
}

export interface Selection {
    event_id: string;
    odds: number;
}