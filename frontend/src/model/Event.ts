import { Model } from "@nozbe/watermelondb";
import { field, json, children } from "@nozbe/watermelondb/decorators";
import Booking from "./Booking";

export default class Event extends Model {
  static table = "events";

  @field("name") name!: string;
  @field("date") date!: string;

  @field("location") location?: string; // optional in schema
  @field("description") description?: string; // optional in schema

  @field("total_seats") totalSeats!: number;

  // booked_seats is stored as a JSON string in DB,
  // here it's deserialized into number[]
  @json("booked_seats", (value) => (Array.isArray(value) ? value : []))
  bookedSeats!: number[];

  @field("image_url") imageUrl!: string;

  /** Relation: each event can have many bookings */
  @children("bookings") bookings!: Booking[];
}
