import React from "react";
import { motion } from "framer-motion";

interface SeatGridProps {
  totalSeats: number;
  bookedSeats: number[];
  selectedSeat: number | null;
  onSeatClick: (seatNumber: number) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  totalSeats,
  bookedSeats,
  selectedSeat,
  onSeatClick,
}) => {
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
        const isBooked = bookedSeats.includes(seat);
        const isSelected = seat === selectedSeat;

        return (
          <motion.button
            key={seat}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.01 }}
            whileHover={!isBooked ? { scale: 1.05 } : {}}
            whileTap={!isBooked ? { scale: 0.95 } : {}}
            style={{
              width: "100%",
              height: 40, 
              borderRadius: "10px 10px 4px 4px", 
              border: "none",
              color: "#fff",
              backgroundColor: isBooked
                ? "#333" 
                : isSelected
                  ? "#ff784e" 
                  : "#00c853", 

              cursor: isBooked ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              boxShadow: isSelected
                ? "0 0 8px rgba(0,0,0,0.4)"
                : "0 2px 4px rgba(0,0,0,0.2)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
            disabled={isBooked}
            onClick={() => onSeatClick(seat)}
          >
            {seat}
          </motion.button>
        );
      })}
    </div>
  );
};

export default SeatGrid;
