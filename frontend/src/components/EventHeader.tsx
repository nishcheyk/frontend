import React from "react";

interface EventHeaderProps {
  title: string;
  description: string;
  date: Date;
  userName?: string;
  userId?: string;
  userEmail?: string;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  description,
  date,
  userName,
  userId,
  userEmail,
}) => {
  return (
    <>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{title}</h2>
      <p style={{ fontWeight: 500, color: "#555" }}>{description}</p>
      <p style={{ color: "#888", marginBottom: 20 }}>
        {new Date(date).toLocaleString()}
      </p>
      <p style={{ fontWeight: 600 }}>
        User: {userName || userId} ({userEmail})
      </p>
    </>
  );
};
