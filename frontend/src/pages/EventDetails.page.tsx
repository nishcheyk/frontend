import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import ErrorBoundary from "../services/ErrorBoundary";
import { EventDetailsSkeleton } from "../components/skeleton/EventDetailsSkeleton";
import { EventHeader } from "../components/EventHeader";
import { PhoneNumberField } from "../components/PhoneNumberField";
import { SeatGrid } from "../components/SeatGrid";
import { BookButton } from "../components/BookButton";

type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  bookedSeats: number[];
  imageUrl?: string;
};

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Fetch event
  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await api.getEvent(id);
        setEvent(data?.message === "Event not found" ? null : data);
      } catch {
        setError("Failed to load event. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSeatClick = (seatNumber: number) => {
    if (event?.bookedSeats.includes(seatNumber)) return;
    setSelectedSeat(seatNumber);
  };

  const book = async () => {
    if (!token) return toast.error("Please log in first.");
    if (!selectedSeat) return toast.error("Please select a seat.");
    if (!user) return toast.error("User info missing.");
    if (!phone) return toast.error("Please enter a valid phone number.");

    try {
      const data = await api.bookEvent(token, {
        userId: user.id,
        email: user.email,
        phone,
        seatNumber: selectedSeat,
        eventId: id!,
      });
      if (!data.success) return toast.error(data.message || "Booking failed");
      toast.success("🎉 Booking successful!");

      const updatedEvent = await api.getEvent(id!);

      console.log("Updated event after booking:", updatedEvent);

      setEvent(updatedEvent);
      setSelectedSeat(null);
      setPhone("");
    } catch (err: any) {
      toast.error(err.message || "Server error");
    }
  };

  if (loading) return <EventDetailsSkeleton />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          padding: "2rem",
          background: "linear-gradient(165deg, #1e1e1e, #151515)",
          borderRadius: 15,
          boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
          color: "#9c1298ff",
        }}
      >
        <EventHeader
          title={event.title}
          description={event.description}
          date={new Date(event.date)}
          userName={user?.name}
          userId={user?.id}
          userEmail={user?.email}
        />

        {/* Phone input */}
        <PhoneNumberField value={phone} onChange={setPhone} />

        <h3 style={{ margin: "1rem 0", color: "#f5f5f5" }}>Select Your Seat</h3>

        {/* Seat grid */}
        <SeatGrid
          totalSeats={event.totalSeats}
          bookedSeats={event.bookedSeats}
          selectedSeat={selectedSeat}
          onSeatClick={handleSeatClick}
        />

        {/* Book now */}
        <BookButton disabled={!selectedSeat || !phone} onClick={book} />
      </motion.div>
    </ErrorBoundary>
  );
};
