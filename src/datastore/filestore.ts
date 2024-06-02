import { User, Event, Coupon, Data } from "../types/datastore";
import * as fs from "fs";
import { Store } from "./store";

export class FileStore extends Store {
    private users: User[];
    private events: Event[];
    private coupons: Coupon[];
    private path: string;

    public initialize(path: string): void {
        this.path = path;

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify({ users: [], events: [], coupons: [] }), {mode: 0o666});
        }

        const fileData = fs.readFileSync(this.path, "utf8");

        if (!fileData) {
            throw new Error("Data not found");
        }

        const { users, events, coupons } = JSON.parse(fileData) as Data;

        this.users = users;
        this.events = events;
        this.coupons = coupons;
    }

    public getUsers(client_id: string): User[] {
        return this.users.filter((user) => user.client_id === client_id);
    }

    public getEvents(client_id: string): Event[] {
        return this.events.filter((event) => event.client_id === client_id);
    }

    public getCoupons(client_id: string): Coupon[] {
        return this.coupons.filter((coupon) => coupon.client_id === client_id);
    }

    public getUserById(user_id: string, client_id: string): User | undefined {
        return this.users.find((user) => user.user_id === user_id && user.client_id === client_id);
    }

    public getEventById(event_id: string, client_id: string): Event | undefined {
        return this.events.find((event) => event.event_id === event_id && event.client_id === client_id);
    }

    public getCouponById(coupon_id: string, client_id: string): Coupon | undefined {
        return this.coupons.find((coupon) => coupon.coupon_id === coupon_id && coupon.client_id === client_id);
    }

    public getUserCoupons(user_id: string, client_id: string): Coupon[] {
        return this.coupons.filter((coupon) => coupon.user_id === user_id && coupon.client_id === client_id);
    }

    public getEventCoupons(event_id: string, client_id: string): Coupon[] {
        return this.coupons.filter((coupon) => coupon.selections.some((selection) => selection.event_id === event_id) && coupon.client_id === client_id);
    }

    public insertUser(user: User): boolean {
        if (this.getUserById(user.user_id, user.client_id)) {
            return false;
        }

        this.users.push(user);
        this.save();
        return true;
    }

    public insertEvent(event: Event): boolean {
        if (this.getEventById(event.event_id, event.client_id)) {
            return false;
        }

        this.events.push(event);
        this.save();

        return true;
    }

    public insertCoupon(coupon: Coupon): boolean {
        if (this.getCouponById(coupon.coupon_id, coupon.client_id)) {
            return false;
        }

        this.coupons.push(coupon);
        this.save();
        
        return true;
    }

    public save(): void {
        fs.writeFileSync(this.path, JSON.stringify({ users: this.users, events: this.events, coupons: this.coupons }));
    }

    public writeData(data: Data): void {
        fs.writeFileSync(this.path, JSON.stringify(data));

        for (const key in data) {
            if (key === "users") {
                this.users = data.users;
            } else if (key === "events") {
                this.events = data.events;
            } else if (key === "coupons") {
                this.coupons = data.coupons;
            }
        }
    }
}
