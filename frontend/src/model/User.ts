import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";
import Booking from "./Booking";

export default class User extends Model {
  static table = "users";

  @field("name") name!: string;
  @field("email") email!: string;
  @field("is_admin") isAdmin!: boolean;

  @children("bookings") bookings!: Booking[];
}
