import React from "react";
import { motion } from "framer-motion";

interface BookButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const BookButton: React.FC<BookButtonProps> = ({
  disabled,
  onClick,
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileTap={{ scale: 0.95 }}
    style={{
      width: "100%",
      padding: "15px",
      backgroundColor: disabled ? "#ccc" : "#ff5722",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontSize: 18,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    Book Now
  </motion.button>
);
