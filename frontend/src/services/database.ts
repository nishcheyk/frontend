// db/database.ts
import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { appSchema } from "@nozbe/watermelondb";

import { eventTable } from "../schema/eventSchema";
import { userTable } from "../schema/userSchema";
import { bookingTable } from "../schema/bookingSchema";

import Event from "../model/Event";
import User from "../model/User";
import Booking from "../model/Booking";

// Create the one unified schema for the DB
const schema = appSchema({
  version: 1,
  tables: [eventTable, userTable, bookingTable],
});

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Event, User, Booking],
  actionsEnabled: true,
});
