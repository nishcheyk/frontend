import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const eventSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "events", // This should match your model's static table
      columns: [
        { name: "name", type: "string", isIndexed: true },
        { name: "date", type: "string", isIndexed: true },
        { name: "location", type: "string", isOptional: true },
        { name: "description", type: "string" },
        { name: "total_seats", type: "number" },
        { name: "booked_seats", type: "string" }, // Stored as JSON string
        { name: "image_url", type: "string", isOptional: true },
      ],
    }),
  ],
});
