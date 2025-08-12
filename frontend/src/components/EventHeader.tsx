import React from "react";
import { motion } from "framer-motion";

interface EventHeaderProps {
  title: string;
  description: string;
  date: Date;
  imageUrl?: string; // new prop for background image
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  description,
  date,
  imageUrl,
}) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: userTimeZone,
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: userTimeZone,
  }).format(date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: 16,
        padding: "2rem 2.5rem",
        color: "#f5f5f5",
        marginBottom: "1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Overlay for better readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 0,
          borderRadius: 16,
        }}
      />
      {/* Content placed over overlay */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.1,
              flexGrow: 1,
              minWidth: 0,
              color: "#fff",
              userSelect: "text",
            }}
            title={title}
          >
            {title}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(0,0,0,0.6)",
              borderRadius: 12,
              padding: "0.6rem 1rem",
              minWidth: 110,
              userSelect: "none",
              color: "#f5a623",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                fontSize: "1rem",
                letterSpacing: 0.5,
                marginBottom: 4,
                whiteSpace: "nowrap",
              }}
              title={`Date (${userTimeZone})`}
            >
              {formattedDate}
            </div>
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                width: "100%",
                marginBottom: 4,
              }}
            />
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                color: "#ccc",
              }}
              title="Time (Your timezone)"
            >
              {formattedTime}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                marginTop: 2,
                fontWeight: 400,
                fontStyle: "italic",
                color: "#999",
              }}
              title="Your local timezone"
            >
              {userTimeZone.replace("_", " ")}
            </div>
          </div>
        </div>

        <p
          style={{
            marginTop: "1rem",
            fontWeight: 400,
            color: "#ddd",
            lineHeight: 1.5,
            userSelect: "text",
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};
