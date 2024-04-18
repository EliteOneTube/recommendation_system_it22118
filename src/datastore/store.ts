import { Coupon, User, Event } from "src/types/datastore";

export abstract class Store {
    public abstract initialize(path: string): void;
    public abstract getUsers(): User[];
    public abstract getEvents(): Event[];
    public abstract getCoupons(): Coupon[];
    public abstract getUserById(userId: string): User | undefined;
    public abstract getEventById(eventId: string): Event | undefined;
    public abstract getCouponById(couponId: string): Coupon | undefined;
    public abstract getUserCoupons(userId: string): Coupon[];
    public abstract getEventCoupons(eventId: string): Coupon[];
}