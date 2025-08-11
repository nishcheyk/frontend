import React from "react";

export const EventListSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          style={{
            background: "linear-gradient(165deg, #1e1e1e, #151515)",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "180px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <div
            style={{
              height: "20px",
              background: "#333",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          />
          <div
            style={{
              height: "14px",
              background: "#333",
              borderRadius: "6px",
              width: "60%",
              marginBottom: "0.8rem",
            }}
          />
          <div
            style={{
              height: "14px",
              background: "#333",
              borderRadius: "6px",
              width: "40%",
            }}
          />
        </div>
      ))}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};
