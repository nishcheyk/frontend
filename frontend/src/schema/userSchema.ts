import { tableSchema } from "@nozbe/watermelondb";

export const userTable = tableSchema({
  name: "users",
  columns: [
    { name: "name", type: "string", isIndexed: true },
    { name: "email", type: "string", isIndexed: true },
    { name: "is_admin", type: "boolean" },
  ],
});
