// model/Booking.ts
import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import Event from "./Event";
import User from "./User";

export default class Booking extends Model {
  static table = "bookings";

  @field("seat_number") seatNumber!: string;
  @field("seat_category") seatCategory!: string;
  @field("status") status!: string;
  @field("qr_code") qrCode?: string;

  @relation("events", "event_id") event!: Event;
  @relation("users", "user_id") user!: User;
}
