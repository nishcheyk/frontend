// components/TicketSkeleton.tsx
import React from "react";
import "./TicketSkeleton.css";

export const TicketSkeleton: React.FC = () => {
  return (
    <div className="ticket-card skeleton">
      <div className="ticket-left">
        <div className="skeleton-img" />
        <div className="ticket-details">
          <div className="skeleton-text title" />
          <div className="skeleton-text small" />
          <div className="skeleton-text small" />
          <div className="skeleton-text small" />
        </div>
      </div>
      <div className="ticket-right">
        <div className="skeleton-qr" />
        <div className="skeleton-text small" />
      </div>
    </div>
  );
};
