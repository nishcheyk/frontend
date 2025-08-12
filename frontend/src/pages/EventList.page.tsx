import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import EventListSkeleton from "../components/skeleton/EventListSkeleton";
import { Toaster } from "react-hot-toast";
import { EventCard } from "../components/EventCard";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <style>
        {`
  
        .event-list-heading {
          font-family: 'Inter', 'Georgia', serif;
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 0.5rem;
          margin-bottom: 1.1rem;
          letter-spacing: 0.01em;
          text-align: center;
        }
       .event-list-bg {
  background: radial-gradient(ellipse at 55% 20%, #161623 80%, #0d0d0d 100%);
  min-height: 100vh;
  color: #fff;
  padding: 0;
  border-radius:55px
}
.event-list-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem 2rem 1.2rem;
}
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 2rem;
  justify-items: center;             /* Ensures cards center in each column */
  justify-content: center;           /* Ensures grid as a whole is centered */
  width: 100%;
}
@media (max-width: 700px) {
  .event-list-container {
    padding: 0.6rem;
  }
  .event-grid {
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  }
}

        `}
      </style>
      <div className="event-list-bg">
        <Toaster position="top-right" />
        <div className="event-list-container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="event-list-heading"
          >
            Upcoming Events
          </motion.h2>
          <div className="event-list-divider" />
          {loading ? (
            <EventListSkeleton />
          ) : (
            <div className="event-grid">
              {events.map((ev, index) => (
                <EventCard key={ev.id} ev={ev} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
