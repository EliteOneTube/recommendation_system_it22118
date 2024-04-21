import { Coupon, User, Event } from "../types/datastore";

export abstract class Store {
    public abstract initialize(path: string): void;
    public abstract getUsers(): User[] | Promise<User[]>;
    public abstract getEvents(): Event[] | Promise<Event[]>;
    public abstract getCoupons(): Coupon[] | Promise<Coupon[]>;
    public abstract getUserById(userId: string): User | undefined | Promise<User | undefined>;
    public abstract getEventById(eventId: string): Event | undefined | Promise<Event | undefined>;
    public abstract getCouponById(couponId: string): Coupon | undefined | Promise<Coupon | undefined>;
    public abstract getUserCoupons(userId: string): Coupon[] | Promise<Coupon[]>;
    public abstract getEventCoupons(eventId: string): Coupon[] | Promise<Coupon[]>;
    public abstract insertUser(user: User): boolean | Promise<boolean>;
    public abstract insertEvent(event: Event): boolean | Promise<boolean>;
    public abstract insertCoupon(coupon: Coupon): boolean | Promise<boolean>;
}