import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import ErrorBoundary from "../services/ErrorBoundary";
import { EventDetailsSkeleton } from "../components/skeleton/EventDetailsSkeleton";
import { EventHeader } from "../components/EventHeader";
import { PhoneNumberField } from "../components/PhoneNumberField";
import { SeatGrid } from "../components/SeatGrid";
import { BookButton } from "../components/BookButton";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useGetEventQuery, useBookEventMutation } from "../services/api";

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();

  const {
    data: eventData,
    isLoading,
    isError,
    refetch,
  } = useGetEventQuery(id!, { skip: !id });
  const [bookEvent, { isLoading: bookingLoading }] = useBookEventMutation();

  const [phone, setPhone] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]); // ✅ Array now
  const [showPayment, setShowPayment] = useState(false);

  const totalSeats = eventData?.totalSeats ?? 0;
  const diamondCount = Math.ceil(totalSeats * 0.1);
  const premiumCount = Math.ceil(totalSeats * 0.3);

  const categories = useMemo(
    () => ({
      diamond: { start: 1, end: diamondCount, label: "Diamond" },
      premium: {
        start: diamondCount + 1,
        end: diamondCount + premiumCount,
        label: "Premium",
      },
      silver: {
        start: diamondCount + premiumCount + 1,
        end: totalSeats,
        label: "Silver",
      },
    }),
    [diamondCount, premiumCount, totalSeats]
  );

  const categoryPrices = { diamond: 1000, premium: 700, silver: 400 };

  const getSeatCategory = useCallback(
    (seatNumber: number) => {
      if (
        seatNumber >= categories.diamond.start &&
        seatNumber <= categories.diamond.end
      )
        return "diamond" as const;
      if (
        seatNumber >= categories.premium.start &&
        seatNumber <= categories.premium.end
      )
        return "premium" as const;
      return "silver" as const;
    },
    [categories]
  );

  // ✅ Toggle seat selection in array
  const handleSeatClick = (seatNumber: number) => {
    if (eventData?.bookedSeats.includes(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleShowPayment = () => {
    if (!token) return toast.error("Please log in first.");
    if (selectedSeats.length === 0)
      return toast.error("Please select at least 1 seat.");
    if (!user) return toast.error("User info missing.");
    if (!phone) return toast.error("Please enter a valid phone number.");
    confirmBooking();
  };

  const confirmBooking = async () => {
    if (!eventData || selectedSeats.length === 0 || !user || !token) return;
    const seatCategories = selectedSeats.map((seat) => getSeatCategory(seat));

    try {
      const result: any = await bookEvent({
        userId: user.id,
        name: user.name,
        email: user.email,
        phone,
        seatNumbers: selectedSeats,
        seatCategories,
        eventId: id!,
      }).unwrap();

      if (!result?.success) {
        toast.error(result?.message || "Booking failed");
        return;
      }

      toast.success("🎉 Booking successful!");
      refetch();
      setSelectedSeats([]);
      setPhone("");
      setShowPayment(false);
    } catch (err: any) {
      toast.error(err.message || "Server error during booking.");
    }
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + categoryPrices[getSeatCategory(seat)],
    0
  );

  if (isLoading) return <EventDetailsSkeleton />;
  if (isError) return <div style={{ color: "red" }}>Failed to load event</div>;
  if (!eventData) return <div>Event not found</div>;

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
          title={eventData.title}
          description={eventData.description}
          date={new Date(eventData.date)}
          imageUrl={eventData.imageUrl}
        />

        <PhoneNumberField value={phone} onChange={setPhone} />

        <h3 style={{ margin: "1rem 0", color: "#f5f5f5" }}>
          Select Your Seats
        </h3>

        <SeatGrid
          totalSeats={eventData.totalSeats}
          bookedSeats={eventData.bookedSeats}
          selectedSeats={selectedSeats} // ✅ pass array
          onSeatClick={handleSeatClick}
          categories={categories}
        />

        {!showPayment ? (
          <BookButton
            disabled={selectedSeats.length === 0 || !phone || bookingLoading}
            onClick={handleShowPayment}
          />
        ) : (
          <div>
            <p style={{ margin: "0.5rem 0" }}>
              Pay ₹{totalPrice} for seats #{selectedSeats.join(", ")}
            </p>
            <PayPalScriptProvider
              options={{ clientId: "test", currency: "USD" }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(_, actions) =>
                  actions.order!.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      { amount: { value: (totalPrice / 80).toFixed(2) } },
                    ],
                  })
                }
                onApprove={async (_, actions) => {
                  await actions.order!.capture();
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

export default EventDetails;
