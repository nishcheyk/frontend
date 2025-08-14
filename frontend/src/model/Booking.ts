import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import User from "./User";
import Event from "./Event";

export default class Booking extends Model {
  static table = "bookings";

  @field("event_id") eventId!: string;
  @field("user_id") userId!: string;

  @relation("users", "user_id") user!: User;
  @relation("events", "event_id") event!: Event;

  @field("seat_number") seatNumber!: string;
  @field("seat_category") seatCategory!: string;
  @field("qr_code") qrCode?: string;

  @field("seat_numbers") seatNumbersJson?: string;
  @field("seat_categories") seatCategoriesJson?: string;
  @field("qr_codes") qrCodesJson?: string;

  @field("status") status!: string;

  // --- Getters to parse JSON strings into arrays ---
  get seatNumbers(): string[] {
    try {
      return this.seatNumbersJson ? JSON.parse(this.seatNumbersJson) : [];
    } catch {
      return [];
    }
  }
  get seatCategories(): string[] {
    try {
      return this.seatCategoriesJson ? JSON.parse(this.seatCategoriesJson) : [];
    } catch {
      return [];
    }
  }
  get qrCodes(): string[] {
    try {
      return this.qrCodesJson ? JSON.parse(this.qrCodesJson) : [];
    } catch {
      return [];
    }
  }
}
