// components/SeatsLeftBadge.tsx
import React from "react";

export const SeatsLeftBadge: React.FC<{ seatsLeft: number }> = ({
  seatsLeft,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "rgba(0, 170, 255, 0.85)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "clamp(0.6rem, 2vw, 0.75rem)",
        padding: "4px 8px",
        borderRadius: "6px",
        zIndex: 2,
      }}
    >
      {seatsLeft} left
    </div>
  );
};
