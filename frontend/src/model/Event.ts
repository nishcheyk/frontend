import { Model } from "@nozbe/watermelondb";
import { field, json, children } from "@nozbe/watermelondb/decorators";
import Booking from "./Booking";

export default class Event extends Model {
  static table = "events";

  @field("name") name!: string;
  @field("date") date!: string;
  @field("location") location?: string;
  @field("description") description?: string;
  @field("total_seats") totalSeats!: number;

  @json("booked_seats", (value) => (Array.isArray(value) ? value : []))
  bookedSeats!: number[];

  @field("image_url") imageUrl!: string;

  @children("bookings") bookings!: Booking[];
}
