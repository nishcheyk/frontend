import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import EventListSkeleton from "../components/skeleton/EventListSkeleton";
import { EventCard } from "../components/EventCard";
import { database } from "../services/database";
import EventModel from "../model/Event";
import { Q } from "@nozbe/watermelondb";
import { useGetEventsQuery } from "../services/api";

type Event = {
  id: string;
  name: string;
  date: string;
  location?: string;
  description: string;
  totalSeats: number;
  bookedSeats: number[];
  imageUrl?: string;
};

export const EventList: React.FC = () => {
  const { data: events = [], isLoading, error } = useGetEventsQuery();

  useEffect(() => {
    async function syncToLocalDB() {
      if (!events.length) return;
      try {
        const eventsCollection = database.get<EventModel>("events");

        await database.write(async () => {
          for (const ev of events) {
            try {
              const existing = await eventsCollection.find(ev.id);
              await existing.update((record) => {
                record.name = ev.name;
                record.date = ev.date;
                record.location = ev.location || "";
                record.description = ev.description;
                record.totalSeats = ev.totalSeats;
                record.bookedSeats = ev.bookedSeats;
                record.imageUrl = ev.imageUrl || "";
              });
            } catch {
              await eventsCollection.create((record) => {
                record._raw.id = ev.id;
                record.name = ev.name;
                record.date = ev.date;
                record.location = ev.location || "";
                record.description = ev.description;
                record.totalSeats = ev.totalSeats;
                record.bookedSeats = ev.bookedSeats;
                record.imageUrl = ev.imageUrl || "";
              });
            }
          }
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to sync events locally");
      }
    }

    syncToLocalDB();
  }, [events]);

  if (error) {
    toast.error("Failed to load events");
  }

  return (
    <>
      <style>
        {`
          .event-list-heading {
            font-family: 'Inter', 'Georgia', serif;
            font-size: 2.4rem;
            font-weight: 700;
            margin-top: 0.5rem;
            margin-bottom: 1.2rem;
            letter-spacing: 0.01em;
            text-align: center;
            color: #fff;
          }
          .event-list-bg {
            background: radial-gradient(ellipse at 55% 20%, #161623 80%, #0d0d0d 100%);
            min-height: 100vh;
            padding: 0;
          }
          .event-list-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 2.5rem 1.2rem 3rem 1.2rem;
          }
          .event-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            justify-items: center;
            width: 100%;
          }
          @media (max-width: 700px) {
            .event-list-container {
              padding: 1rem;
            }
            .event-grid {
              gap: 1.2rem;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            }
          }
          .event-list-divider {
            height: 3px;
            width: 80px;
            background: #f1774e;
            margin: 0 auto 2rem auto;
            border-radius: 2px;
          }
        `}
      </style>

      <div className="event-list-bg">
        <Toaster position="top-right" />
        <div className="event-list-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="event-list-heading"
          >
            Upcoming Events
          </motion.h2>
          <div className="event-list-divider" />

          {isLoading ? (
            <EventListSkeleton />
          ) : events.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                color: "#888",
                fontSize: "1.1rem",
              }}
            >
              No events found.
            </motion.p>
          ) : (
            <motion.div
              className="event-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {events.map((ev, index) => (
                <motion.div
                  key={ev.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <EventCard key={index} ev={ev} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};
