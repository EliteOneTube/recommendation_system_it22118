import { Coupon, User, Event } from "../types/datastore";

export abstract class Store {
    public abstract initialize(path: string): void;
    public abstract getUsers(client_id: string): User[] | Promise<User[]>;
    public abstract getEvents(client_id: string): Event[] | Promise<Event[]>;
    public abstract getCoupons(client_id: string): Coupon[] | Promise<Coupon[]>;
    public abstract getUserById(user_id: string, client_id: string): User | undefined | Promise<User | undefined>;
    public abstract getEventById(event_id: string, client_id: string): Event | undefined | Promise<Event | undefined>;
    public abstract getCouponById(coupon_id: string, client_id: string): Coupon | undefined | Promise<Coupon | undefined>;
    public abstract getUserCoupons(user_id: string, client_id: string): Coupon[] | Promise<Coupon[]>;
    public abstract getEventCoupons(event_id: string, client_id: string): Coupon[] | Promise<Coupon[]>;
    public abstract insertUser(user: User): boolean | Promise<boolean>;
    public abstract insertEvent(event: Event): boolean | Promise<boolean>;
    public abstract insertCoupon(coupon: Coupon): boolean | Promise<boolean>;
}