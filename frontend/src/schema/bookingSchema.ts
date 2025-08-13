// schema/bookingSchema.ts
import { tableSchema } from "@nozbe/watermelondb";

export const bookingTable = tableSchema({
  name: "bookings",
  columns: [
    { name: "event_id", type: "string", isIndexed: true },
    { name: "user_id", type: "string", isIndexed: true },
    { name: "seat_number", type: "string" },
    { name: "seat_category", type: "string" },
    { name: "status", type: "string" },
    { name: "qr_code", type: "string", isOptional: true },
  ],
});
