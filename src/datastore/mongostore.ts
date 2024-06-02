import { User, Event, Coupon } from "../types/datastore";
import { Store } from "./store";
import { Schema, Model, connect, model } from "mongoose";

export default class MongoStore extends Store {
    private userSchema: Schema<User>;
    
    private eventSchema: Schema<Event>;

    private couponSchema: Schema<Coupon>;
    
    private userModel: Model<User>;

    private eventModel: Model<Event>;

    private couponModel: Model<Coupon>;

    constructor() {
        super();
        this.userSchema = new Schema<User>({
            birth_year: String,
            country: String,
            currency: String,
            gender: String,
            registration_date: String,
            user_id: String,
            client_id: String
        });

        this.eventSchema = new Schema<Event>({
            begin_timestamp: String,
            country: String,
            end_timestamp: String,
            event_id: String,
            league: String,
            participants: [String],
            sport: String,
            client_id: String
        });

        this.couponSchema = new Schema<Coupon>({
            coupon_id: String,
            selections: [{ event_id: String, odds: Number }],
            stake: Number,
            timestamp: String,
            user_id: String,
            client_id: String
        });

        this.userModel = model<User>('User', this.userSchema);

        this.eventModel = model<Event>('Event', this.eventSchema);

        this.couponModel = model<Coupon>('Coupon', this.couponSchema);
    }

    public async initialize(path: string): Promise<void> {
        await connect(path);
    }

    public async getUsers(client_id: string): Promise<User[]> {
        return this.userModel.find({ client_id });
    }

    public async getEvents(client_id: string): Promise<Event[]> {
        return this.eventModel.find({ client_id});
    }

    public async getCoupons(client_id: string): Promise<Coupon[]> {
        return this.couponModel.find({ client_id});
    }

    public async getUserById(user_id: string, client_id: string): Promise<User | undefined> {
        const query = { user_id, client_id };

        return await this.userModel.findOne(query);
    }

    public async getEventById(event_id: string, client_id: string): Promise<Event | undefined> {
        return this.eventModel.findOne({ event_id, client_id });
    }

    public async getCouponById(coupon_id: string, client_id: string): Promise<Coupon | undefined> {
        return this.couponModel.findOne({ coupon_id, client_id});
    }

    public async getUserCoupons(user_id: string, client_id: string): Promise<Coupon[]> {
        return this.couponModel.find({ user_id, client_id});
    }

    public async getEventCoupons(event_id: string, client_id: string): Promise<Coupon[]> {
        return this.couponModel.find({ 'selections.event_id': event_id, client_id });
    }

    public async insertUser(user: User): Promise<boolean> {
        if (await this.userModel.exists({ user_id: user.user_id })) return false;

        await this.userModel.create(user);

        return true;
    }

    public async insertEvent(event: Event): Promise<boolean> {
        if (await this.eventModel.exists({ event_id: event.event_id })) return false;

        await this.eventModel.create(event);

        return true;
    }

    public async insertCoupon(coupon: Coupon): Promise<boolean> {
        if (await this.couponModel.exists({ coupon_id: coupon.coupon_id })) return false;

        await this.couponModel.create(coupon);

        return true;
    }
}