import React from "react";
import { motion } from "framer-motion";

interface CategoryRange {
  start: number;
  end: number;
  label: string;
}

interface SeatGridProps {
  totalSeats: number;
  bookedSeats: number[];
  selectedSeat: number | null;
  onSeatClick: (seatNumber: number) => void;
  categories: {
    diamond: CategoryRange;
    premium: CategoryRange;
    silver: CategoryRange;
  };
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  totalSeats,
  bookedSeats,
  selectedSeat,
  onSeatClick,
  categories,
}) => {
  const getCategory = (seatNumber: number) => {
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

  const getBaseGradient = (category: string) => {
    switch (category) {
      case "diamond":
        return "linear-gradient(135deg, #FFD700, #FFA500)";
      case "premium":
        return "linear-gradient(135deg, #4FACFE, #00F2FE)";
      case "silver":
      default:
        return "linear-gradient(135deg, #BDC3C7, #95a5a6)";
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
        gap: 8,
        marginBottom: 30,
        maxWidth: "100%",
      }}
    >
      {Array.from({ length: totalSeats }, (_, i) => {
        const seat = i + 1;
        const category = getCategory(seat);
        const gradient = getBaseGradient(category);
        const isBooked = bookedSeats.includes(seat);
        const isSelected = seat === selectedSeat;

        return (
          <motion.div
            key={seat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            whileHover={!isBooked ? { scale: 1.4 } : {}}
            whileTap={!isBooked ? { scale: 0.95 } : {}}
            style={{
              cursor: isBooked ? "not-allowed" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={() => !isBooked && onSeatClick(seat)}
            title={`${category} Seat`}
          >
            <div
              style={{
                width: "90%",
                height: 25,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                background: isBooked
                  ? "linear-gradient(135deg, #555, #333)"
                  : isSelected
                    ? "linear-gradient(135deg, #ff784e, #ff416c)"
                    : gradient,
                boxShadow: isSelected
                  ? "0 0 8px rgba(255,120,78,0.9)"
                  : "inset 0 -2px 3px rgba(0,0,0,0.25)",
                transition: "box-shadow 0.1s linear",
              }}
            />
            <div
              style={{
                width: "100%",
                height: 12,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                background: isBooked ? "#333" : isSelected ? "#ff5a3d" : "#222",
                boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.4)",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                marginTop: 2,
                fontWeight: 600,
                color: isBooked ? "#777" : "#fff",
              }}
            >
              {seat}
            </span>
          </motion.div>
        );
      })}

      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        {[
          { name: "Diamond", gradient: getBaseGradient("diamond") },
          { name: "Premium", gradient: getBaseGradient("premium") },
          { name: "Silver", gradient: getBaseGradient("silver") },
        ].map((cat) => (
          <div
            key={cat.name}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: cat.gradient,
              }}
            />
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
