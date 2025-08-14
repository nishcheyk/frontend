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
    { name: "seat_numbers", type: "string", isOptional: true }, // JSON stringified array
    { name: "seat_categories", type: "string", isOptional: true }, // JSON stringified array
    { name: "qr_codes", type: "string", isOptional: true }, // JSON stringified array
  ],
});
