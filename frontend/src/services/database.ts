import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { eventSchema } from "../schema/eventSchema";
import Event from "../model/Event";

const adapter = new LokiJSAdapter({
  schema: eventSchema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Event],
});
