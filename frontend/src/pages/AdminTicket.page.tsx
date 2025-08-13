import {
  useGetAllBookingsWithUserAndEventQuery,
  useDeleteBookingMutation,
} from "../services/api";
import { useAuth } from "../store/AuthContext";
import { useState, useMemo, useCallback } from "react";

export default function AdminTicketsPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } =
    useGetAllBookingsWithUserAndEventQuery(undefined, {
      skip: !user?.isAdmin,
    });

  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const bookings = data?.bookings || [];

  const events = useMemo(() => {
    const evMap = new Map();
    bookings.forEach((b) => {
      if (b.event && !evMap.has(b.event._id)) evMap.set(b.event._id, b.event);
    });
    return Array.from(evMap.values());
  }, [bookings]);

  const usersForEvent = useMemo(() => {
    if (!selectedEventId) return [];
    const userMap = new Map();
    bookings.forEach((b) => {
      if (
        b.event?._id === selectedEventId &&
        b.user &&
        !userMap.has(b.user._id)
      ) {
        userMap.set(b.user._id, b.user);
      }
    });
    return Array.from(userMap.values());
  }, [bookings, selectedEventId]);

  const tickets = useMemo(() => {
    if (!selectedEventId || !selectedUserId) return [];
    return bookings.filter(
      (b) => b.event?._id === selectedEventId && b.user?._id === selectedUserId
    );
  }, [bookings, selectedEventId, selectedUserId]);

  const handleEventClick = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setSelectedUserId(null);
  }, []);

  const handleUserClick = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const handleDelete = useCallback(
    async (bookingId: string) => {
      if (!window.confirm("Are you sure you want to delete this booking?"))
        return;
      try {
        await deleteBooking(bookingId).unwrap();
        alert(" Booking deleted successfully");
        refetch();
        if (selectedUserId && tickets.some((t) => t.bookingId === bookingId)) {
          setSelectedUserId(null);
        }
      } catch (err: any) {
        alert(err.message || " Error deleting booking");
      }
    },
    [deleteBooking, refetch, selectedUserId, tickets]
  );
  if (!user?.isAdmin) return <p style={styles.errorText}>Access denied</p>;
  if (isLoading) return <p style={styles.loadingText}>Loading...</p>;
  if (error) return <p style={styles.errorText}>Error Loading</p>;
  return (
    <div style={styles.container}>
      {/* LEFT: Events */}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>📅 Events</h2>
        {events.map((ev: any) => (
          <div
            key={ev._id}
            style={{
              ...styles.item,
              background:
                selectedEventId === ev._id ? "#d1e7ff" : "transparent",
            }}
            onClick={() => handleEventClick(ev._id)}
          >
            {ev.title}
          </div>
        ))}
      </div>

      {/* MIDDLE: Users */}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>👤 Users</h2>
        {usersForEvent.map((usr: any) => (
          <div
            key={usr._id}
            style={{
              ...styles.item,
              background:
                selectedUserId === usr._id ? "#ffe9d6" : "transparent",
            }}
            onClick={() => handleUserClick(usr._id)}
          >
            {usr.name} ({usr.email})
          </div>
        ))}
      </div>

      {/* RIGHT: Tickets */}
      <div style={styles.mainContent}>
        <h2 style={styles.heading}>🎟 Tickets</h2>
        {tickets.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Seat</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>QR Code</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t: any) => (
                <tr key={t.bookingId} style={styles.tr}>
                  <td style={styles.td}>{t.seatNumber}</td>
                  <td style={styles.td}>{t.seatCategory}</td>
                  <td style={styles.td}>{t.status}</td>
                  <td style={styles.td}>
                    {t.qrCode && (
                      <img
                        src={t.qrCode}
                        alt="QR"
                        width={50}
                        style={{ borderRadius: "5px" }}
                      />
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      disabled={isDeleting}
                      style={{
                        ...styles.deleteButton,
                        opacity: isDeleting ? 0.6 : 1,
                      }}
                      onClick={() => handleDelete(t.bookingId)}
                    >
                      {isDeleting ? "⏳ Deleting..." : "🗑 Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : selectedUserId ? (
          <p style={styles.noData}>No tickets found for this user</p>
        ) : (
          <p style={styles.noData}>Select a user to view tickets</p>
        )}
      </div>
    </div>
  );
}

/* ------- INLINE STYLES ------- */
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f9f9f9",
  },
  sidebar: {
    flex: 1,
    borderRight: "1px solid #ccc",
    overflowY: "auto",
    backgroundColor: "#fff",
    padding: "10px",
  },
  heading: {
    marginBottom: "10px",
    fontSize: "1.2rem",
    borderBottom: "2px solid #ddd",
    paddingBottom: "6px",
  },
  item: {
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  mainContent: {
    flex: 2,
    overflowY: "auto",
    backgroundColor: "#fff",
    padding: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    borderBottom: "2px solid #ccc",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#fafafa",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "8px",
    verticalAlign: "middle",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noData: {
    padding: "10px",
    color: "#888",
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "#555",
    padding: "20px",
  },
  errorText: {
    fontSize: "1.1rem",
    color: "red",
    padding: "20px",
  },
};
