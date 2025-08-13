import React from "react";
import { useAuth } from "../store/AuthContext";
import { TicketCard } from "../components/TicketCard";
import { useGetUserBookedEventsWithSeatsQuery } from "../services/api";

const TicketSkeleton = () => {
  const shimmer = {
    background: "linear-gradient(90deg,#211f1f 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  const styles = {
    card: {
      display: "flex",
      justifyContent: "space-between",
      background: "#211f1f",
      borderRadius: "16px",
      overflow: "hidden",
      marginBottom: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    left: {
      display: "flex",
      gap: "20px",
      flex: 2,
      alignItems: "flex-start",
      padding: "20px",
    },
    img: { ...shimmer, width: "100px", height: "140px", borderRadius: "8px" },
    details: {
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      flex: 1,
    },
    line: { ...shimmer, height: "16px", borderRadius: "4px", marginTop: "8px" },
    right: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      borderLeft: "1px dashed #c4baa0",
    },
    qr: {
      ...shimmer,
      width: "80px",
      height: "80px",
      borderRadius: "6px",
      marginBottom: "12px",
    },
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.img} />
          <div style={styles.details}>
            <div style={{ ...styles.line, width: "180px" }} />
            <div style={{ ...styles.line, width: "140px" }} />
            <div style={{ ...styles.line, width: "140px" }} />
            <div style={{ ...styles.line, width: "120px" }} />
          </div>
        </div>
        <div style={styles.right}>
          <div style={styles.qr} />
          <div style={{ ...styles.line, width: "100px" }} />
        </div>
      </div>
    </>
  );
};

export const MyTicketsPage: React.FC = () => {
  const { user, token } = useAuth();

  const { data, isLoading, isError } = useGetUserBookedEventsWithSeatsQuery(
    user?.id!,
    { skip: !user?.id }
  );

  if (!user || !token) {
    return <div>Please log in to view your tickets.</div>;
  }

  return (
    <>
      {/* Google Fonts import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Merriweather:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          maxWidth: 880,
          margin: "32px auto",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#211f1f",
          padding: 32,
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Merriweather', serif",
            fontSize: "2rem",
            marginBottom: 24,
            color: "#f1774e",
          }}
        >
          My Tickets
        </h1>

        {isLoading ? (
          <>
            <TicketSkeleton />
            <TicketSkeleton />
            <TicketSkeleton />
          </>
        ) : isError ? (
          <div style={{ color: "#f1774e" }}>Failed to load tickets.</div>
        ) : !data || data.events.length === 0 ? (
          <div style={{ fontSize: "1.1rem", color: "#f1774e" }}>
            You have no tickets booked.
          </div>
        ) : (
          data.events.map((ticket, idx) => (
            <div
              key={ticket._id || idx}
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <TicketCard
                eventTitle={ticket.title}
                eventDate={ticket.date}
                eventLocation={ticket.location}
                seatNumbers={ticket.seatNumbers}
                seatCategories={ticket.seatCategories}
                imageUrl={ticket.imageUrl}
                qrCodes={ticket.qrCodes}
                ticketNo={ticket._id}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};
