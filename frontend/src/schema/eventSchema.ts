// schema/eventSchema.ts
import { tableSchema } from "@nozbe/watermelondb";

export const eventTable = tableSchema({
  name: "events", // must match Event.static table
  columns: [
    { name: "name", type: "string", isIndexed: true },
    { name: "date", type: "string", isIndexed: true },
    { name: "location", type: "string", isOptional: true },
    { name: "description", type: "string", isOptional: true },
    { name: "total_seats", type: "number" },
    { name: "booked_seats", type: "string", isOptional: true },
    { name: "image_url", type: "string", isOptional: true },
  ],
});
