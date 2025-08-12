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
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

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
  const [showPayment, setShowPayment] = useState(false);

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

  const handleShowPayment = () => {
    if (!token) return toast.error("Please log in first.");
    if (!selectedSeat) return toast.error("Please select a seat.");
    if (!user) return toast.error("User info missing.");
    if (!phone) return toast.error("Please enter a valid phone number.");
    setShowPayment(true);
  };

  const confirmBooking = async () => {
    if (!event || !selectedSeat || !user || !token) return;

    try {
      const data = await api.bookEvent(token, {
        userId: user.id,
        email: user.email,
        phone,
        seatNumber: selectedSeat,
        seatCategory: currentCategory, // 👈 NEW FIELD: send category
        eventId: id!,
      });

      if (!data.success) return toast.error(data.message || "Booking failed");

      toast.success("🎉 Booking successful!");
      const updatedEvent = await api.getEvent(id!);
      setEvent(updatedEvent);
      setSelectedSeat(null);
      setPhone("");
      setShowPayment(false);
    } catch (err: any) {
      toast.error(err.message || "Server error during booking.");
    }
  };
  if (loading) return <EventDetailsSkeleton />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!event) return <div>Event not found</div>;

  const total = event.totalSeats;
  const diamondCount = Math.ceil(total * 0.1);
  const premiumCount = Math.ceil(total * 0.3);

  const categories = {
    diamond: { start: 1, end: diamondCount, label: "Diamond" },
    premium: {
      start: diamondCount + 1,
      end: diamondCount + premiumCount,
      label: "Premium",
    },
    silver: {
      start: diamondCount + premiumCount + 1,
      end: total,
      label: "Silver",
    },
  };

  // Category pricing
  const categoryPrices = { diamond: 1000, premium: 700, silver: 400 };

  const getSeatCategory = (seatNumber: number) => {
    if (
      seatNumber >= categories.diamond.start &&
      seatNumber <= categories.diamond.end
    )
      return "diamond";
    if (
      seatNumber >= categories.premium.start &&
      seatNumber <= categories.premium.end
    )
      return "premium";
    return "silver";
  };

  const currentCategory = selectedSeat ? getSeatCategory(selectedSeat) : null;
  const seatPrice = currentCategory ? categoryPrices[currentCategory] : 0;

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
          color: "#f5f5f5",
        }}
      >
        <EventHeader
          title={event.title}
          description={event.description}
          date={new Date(event.date)}
          imageUrl={event.imageUrl}
        />

        <PhoneNumberField value={phone} onChange={setPhone} />

        <h3 style={{ margin: "1rem 0", color: "#f5f5f5" }}>Select Your Seat</h3>

        <SeatGrid
          totalSeats={event.totalSeats}
          bookedSeats={event.bookedSeats}
          selectedSeat={selectedSeat}
          onSeatClick={handleSeatClick}
          categories={categories}
        />

        {!showPayment ? (
          <BookButton
            disabled={!selectedSeat || !phone}
            onClick={handleShowPayment}
          />
        ) : (
          <div>
            <p style={{ margin: "0.5rem 0" }}>
              Pay ₹{seatPrice} for {currentCategory?.toUpperCase()} seat #
              {selectedSeat}
            </p>
            <PayPalScriptProvider
              options={{ "client-id": "test", currency: "INR" }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: (seatPrice / 80).toFixed(2) }, // ₹ to USD approx
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  await actions.order.capture();
                  confirmBooking();
                }}
                onError={(err) => {
                  console.error(err);
                  toast.error("Payment failed");
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};
