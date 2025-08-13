import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { database } from "../services/database";
import { Q } from "@nozbe/watermelondb";
import Event from "../model/Event";
import User from "../model/User";
import Booking from "../model/Booking";
import {
  useGetAllBookingsWithUserAndEventQuery,
  useDeleteBookingMutation,
} from "../services/api";

export default function AdminTicketsPage() {
  const { user } = useAuth();
  const { data, isLoading: apiLoading } =
    useGetAllBookingsWithUserAndEventQuery(undefined, {
      skip: !user?.isAdmin,
    });
  const [deleteBooking] = useDeleteBookingMutation();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Booking[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isLoading = apiLoading;

  // Selected event to use its image as faded background for ticket panel
  const selectedEvent = events.find((ev) => ev.id === selectedEventId) || null;

  const ticketsPanelBackground = selectedEvent?.imageUrl
    ? {
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(17,17,17,0.7) 0%,
            rgba(17,17,17,0.6) 60%,
            rgba(17,17,17,0.5) 100%
          ),
          url(${selectedEvent.imageUrl})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#111",
      }
    : { backgroundColor: "#111" };

  /** Load from DB immediately (offline support) */
  useEffect(() => {
    loadEvents();
    if (selectedEventId) loadUsers();
    if (selectedEventId && selectedUserId) loadTickets();
  }, [selectedEventId, selectedUserId]);

  /** Sync API data into local DB */
  useEffect(() => {
    if (!data?.bookings?.length) return;
    (async () => {
      await database.write(async () => {
        for (const b of data.bookings) {
          if (!b.event || !b.user) continue;

          const eventCol = database.get<Event>("events");
          const existingEvent = await eventCol
            .find(b.event._id)
            .catch(() => null);
          if (!existingEvent) {
            await eventCol.create((ev) => {
              ev._raw.id = b.event!._id;
              ev.name = b.event!.title;
              ev.date = b.event!.date;
              ev.location = b.event!.location || "";
              ev.description = b.event!.description || "";
              ev.totalSeats = b.event!.total_seats;
              ev.bookedSeats = b.event!.booked_seats || [];
              ev.imageUrl = b.event!.imageUrl || ""; // camelCase
            });
          }

          const userCol = database.get<User>("users");
          const existingUser = await userCol.find(b.user._id).catch(() => null);
          if (!existingUser) {
            await userCol.create((u) => {
              u._raw.id = b.user!._id;
              u.name = b.user!.name;
              u.email = b.user!.email;
              u.isAdmin = b.user!.isAdmin;
            });
          }

          const bookingCol = database.get<Booking>("bookings");
          const existingBooking = await bookingCol
            .find(b.bookingId)
            .catch(() => null);
          if (!existingBooking) {
            await bookingCol.create((bk) => {
              bk._raw.id = b.bookingId;
              bk._raw.user_id = b.user!._id;
              bk._raw.event_id = b.event!._id;
              bk._raw.seat_number = String(b.seatNumber);
              bk.seatNumber = String(b.seatNumber);
              bk.seatCategory = b.seatCategory;
              bk.status = b.status;
              bk.qrCode = b.qrCode || "";
            });
          }
        }
      });

      await loadEvents();
      if (selectedEventId) await loadUsers();
      if (selectedEventId && selectedUserId) await loadTickets();
    })();
  }, [data, selectedEventId, selectedUserId]);

  /** Loaders from DB */
  const loadEvents = useCallback(async () => {
    const col = database.get<Event>("events");
    setEvents(await col.query().fetch());
  }, []);
  const loadUsers = useCallback(async () => {
    if (!selectedEventId) return setUsers([]);
    const col = database.get<Booking>("bookings");
    const bookingsForEvent = await col
      .query(Q.where("event_id", selectedEventId))
      .fetch();
    const map = new Map<string, User>();
    for (const bk of bookingsForEvent) {
      const usr = await bk.user.fetch();
      if (usr) map.set(usr.id, usr);
    }
    setUsers(Array.from(map.values()));
  }, [selectedEventId]);
  const loadTickets = useCallback(async () => {
    if (!selectedEventId || !selectedUserId) return setTickets([]);
    const col = database.get<Booking>("bookings");
    setTickets(
      await col
        .query(
          Q.where("event_id", selectedEventId),
          Q.where("user_id", selectedUserId)
        )
        .fetch()
    );
  }, [selectedEventId, selectedUserId]);

  const handleDelete = useCallback(
    async (bookingId: string) => {
      if (!window.confirm("Are you sure you want to delete this booking?"))
        return;

      // Optimistically update local DB so UI is instant
      await database.write(async () => {
        try {
          const col = database.get<Booking>("bookings");
          const rec = await col.find(bookingId).catch(() => null);
          if (rec) {
            await rec.markAsDeleted(); // soft delete for offline sync
          }
        } catch (err) {
          console.error("Local delete failed:", err);
        }
      });

      // If online, call API to delete immediately on backend
      try {
        await deleteBooking(bookingId).unwrap();
      } catch (err) {
        console.error("API delete failed - will sync later:", err);
        // Optionally: queue this delete in a "pendingChanges" table
      }

      // Reload data from DB
      await loadTickets();
      await loadUsers();
    },
    [deleteBooking, loadTickets, loadUsers]
  );

  if (!user?.isAdmin) return <p style={styles.errorText}>Access denied</p>;

  return (
    <>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,120,78,0.6) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255,120,78,0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255,120,78,0.8);
        }
      `}</style>

      <div style={styles.container}>
        {/* Events */}
        <div style={styles.sidebar} className="custom-scrollbar">
          <h2 style={styles.heading}>Events</h2>
          {isLoading && events.length === 0 ? (
            <SidebarSkeleton rows={6} />
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  ...styles.item,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  background:
                    ev.id === selectedEventId
                      ? "linear-gradient(135deg, rgba(255,120,78,0.15), rgba(255,255,255,0.05))"
                      : "transparent",
                  border:
                    ev.id === selectedEventId
                      ? "1px solid rgba(255,120,78,0.9)"
                      : "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedEventId(ev.id);
                  setSelectedUserId(null);
                }}
                title={ev.name}
              >
                {ev.name}
              </div>
            ))
          )}
        </div>

        {/* Users */}
        <div style={styles.sidebar} className="custom-scrollbar">
          <h2 style={styles.heading}>Users</h2>
          {isLoading && users.length === 0 ? (
            <SidebarSkeleton rows={6} />
          ) : (
            users.map((usr) => (
              <div
                key={usr.id}
                style={{
                  ...styles.item,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  background:
                    usr.id === selectedUserId
                      ? "linear-gradient(135deg, rgba(255,120,78,0.15), rgba(255,255,255,0.05))"
                      : "transparent",
                  border:
                    usr.id === selectedUserId
                      ? "1px solid rgba(255,120,78,0.9)"
                      : "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedUserId(usr.id)}
                title={`${usr.name} (${usr.email})`}
              >
                {usr.name} ({usr.email})
              </div>
            ))
          )}
        </div>

        {/* Tickets */}
        <div style={{ ...styles.mainContent, ...ticketsPanelBackground }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(17,17,17,0.7)",
              borderRadius: 12,
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={styles.heading}>Tickets</h2>
            {isLoading && tickets.length === 0 ? (
              <TableSkeleton rows={5} />
            ) : tickets.length > 0 ? (
              <div style={{ overflowX: "auto" }} className="custom-scrollbar">
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Seat</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>QR</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id}>
                        <td style={styles.td}>{t.seatNumber}</td>
                        <td style={styles.td}>{t.seatCategory}</td>
                        <td style={styles.td}>{t.status}</td>
                        <td style={styles.td}>
                          {t.qrCode && (
                            <img
                              src={t.qrCode}
                              alt="QR"
                              style={{ maxWidth: 50, borderRadius: 5 }}
                            />
                          )}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.deleteButton}
                            onClick={() => handleDelete(t.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={styles.noData}>
                {selectedUserId
                  ? "No tickets found"
                  : "Select a user to view tickets"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Skeletons */
const SidebarSkeleton = ({ rows = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="shimmer"
        style={{ height: "20px", borderRadius: "6px", marginBottom: "8px" }}
      />
    ))}
  </>
);
const TableSkeleton = ({ rows = 5 }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", tableLayout: "fixed" }}>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: 5 }).map((__, j) => (
              <td key={j}>
                <div
                  className="shimmer"
                  style={{ height: 16, borderRadius: "4px", margin: "4px 0" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#111",
    color: "#fff",
    gap: "20px",
  },
  sidebar: {
    flex: "0 1 280px",
    padding: "10px",
    overflowY: "auto",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
  heading: { marginBottom: "10px", color: "#ff784e" },
  item: {
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "6px",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    borderRadius: 12,
    position: "relative",
    overflowY: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  th: {
    padding: "8px",
    color: "#ff784e",
    textAlign: "left",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
  },
  td: {
    padding: "8px",
    color: "#ddd",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
  },
  noData: { color: "#aaa", fontStyle: "italic" },
  errorText: { color: "red", padding: "20px" },
};
