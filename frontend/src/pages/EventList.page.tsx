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
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        padding: "2rem",
        color: "#fff",
      }}
    >
      <Toaster position="top-right" />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "2rem",
          marginBottom: "1.5rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Upcoming Events
      </motion.h2>

      {loading ? (
        <EventListSkeleton />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {events.map((ev, index) => (
            <EventCard key={ev.id} ev={ev} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
