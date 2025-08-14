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

  const {
    data,
    isLoading: apiLoading,
    refetch,
  } = useGetAllBookingsWithUserAndEventQuery(undefined, {
    skip: !user?.isAdmin,
  });

  const [deleteBooking] = useDeleteBookingMutation();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Booking[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isLoading = apiLoading;

  const selectedEvent = events.find((ev) => ev.id === selectedEventId) || null;

  // Auto-refetch on window focus
  useEffect(() => {
    const onFocus = () => {
      if (user?.isAdmin) refetch();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user, refetch]);

  // Sync API → WatermelonDB
  useEffect(() => {
    if (!data?.bookings?.length) return;
    (async () => {
      await database.write(async () => {
        const eventCol = database.get<Event>("events");
        const userCol = database.get<User>("users");
        const bookingCol = database.get<Booking>("bookings");

        for (const b of data.bookings) {
          // Skip only if event is missing; create fallback user if user is missing
          if (!b.event) continue;
          if (!b.user) {
            b.user = {
              _id: `unknown-${b.bookingId}`,
              name: b.name || "Unknown User",
              email: b.email || "",
              isAdmin: false,
            };
          }

          // Event: update or create
          const existingEvent = await eventCol
            .find(b.event._id)
            .catch(() => null);
          if (existingEvent) {
            await existingEvent.update((ev) => {
              ev.name = b.event!.title;
              ev.date = b.event!.date;
              ev.location = b.event!.location || "";
              ev.description = b.event!.description || "";
              ev.totalSeats = b.event!.totalSeats;
              ev.bookedSeats = b.event!.bookedSeats || [];
              ev.imageUrl = b.event!.imageUrl || "";
            });
          } else {
            await eventCol.create((ev) => {
              ev._raw.id = b.event!._id;
              ev.name = b.event!.title;
              ev.date = b.event!.date;
              ev.location = b.event!.location || "";
              ev.description = b.event!.description || "";
              ev.totalSeats = b.event!.totalSeats;
              ev.bookedSeats = b.event!.bookedSeats || [];
              ev.imageUrl = b.event!.imageUrl || "";
            });
          }

          // User: update or create
          const existingUser = await userCol.find(b.user._id).catch(() => null);
          if (existingUser) {
            await existingUser.update((u) => {
              u.name = b.user!.name;
              u.email = b.user!.email;
              u.isAdmin = b.user!.isAdmin;
            });
          } else {
            await userCol.create((u) => {
              u._raw.id = b.user!._id;
              u.name = b.user!.name;
              u.email = b.user!.email;
              u.isAdmin = b.user!.isAdmin;
            });
          }

          // Booking: update or create
          const existingBooking = await bookingCol
            .find(b.bookingId)
            .catch(() => null);
          if (existingBooking) {
            await existingBooking.update((bk) => {
              bk.seatNumber = b.seatNumber || "";
              bk.seatCategory = b.seatCategory || "";
              bk.status = b.status || "";
              bk.qrCode = b.qrCode || "";
              bk._raw.seat_numbers = JSON.stringify(b.seatNumbers || []);
              bk._raw.seat_categories = JSON.stringify(b.seatCategories || []);
              bk._raw.qr_codes = JSON.stringify(b.qrCodes || []);
            });
          } else {
            await bookingCol.create((bk) => {
              bk._raw.id = b.bookingId;
              bk._raw.user_id = b.user!._id;
              bk._raw.event_id = b.event!._id;
              bk.seatNumber = b.seatNumber || "";
              bk.seatCategory = b.seatCategory || "";
              bk.status = b.status || "";
              bk.qrCode = b.qrCode || "";
              bk._raw.seat_numbers = JSON.stringify(b.seatNumbers || []);
              bk._raw.seat_categories = JSON.stringify(b.seatCategories || []);
              bk._raw.qr_codes = JSON.stringify(b.qrCodes || []);
            });
          }
        }
      });
      await loadEvents();
      if (selectedEventId) await loadUsers();
      if (selectedEventId && selectedUserId) await loadTickets();
    })();
  }, [data, selectedEventId, selectedUserId]);

  // Load events
  const loadEvents = useCallback(async () => {
    const bookingCol = database.get<Booking>("bookings");
    const allBookings = await bookingCol.query().fetch();
    const eventIds = Array.from(new Set(allBookings.map((b) => b.eventId)));
    if (eventIds.length === 0) return setEvents([]);
    const eventCol = database.get<Event>("events");
    setEvents(await eventCol.query(Q.where("id", Q.oneOf(eventIds))).fetch());
  }, []);

  // Load users for selected event
  const loadUsers = useCallback(async () => {
    if (!selectedEventId) return setUsers([]);
    const bookingsForEvent = await database
      .get<Booking>("bookings")
      .query(Q.where("event_id", selectedEventId))
      .fetch();
    const map = new Map<string, User>();
    for (const bk of bookingsForEvent) {
      const usr = await bk.user?.fetch().catch(() => null);
      if (usr) map.set(usr.id, usr);
    }
    setUsers(Array.from(map.values()));
  }, [selectedEventId]);

  // Load tickets for selected event + user
  const loadTickets = useCallback(async () => {
    if (!selectedEventId || !selectedUserId) return setTickets([]);
    setTickets(
      await database
        .get<Booking>("bookings")
        .query(
          Q.where("event_id", selectedEventId),
          Q.where("user_id", selectedUserId)
        )
        .fetch()
    );
  }, [selectedEventId, selectedUserId]);

  const handleDelete = useCallback(
    async (bookingId: string) => {
      if (!window.confirm("Are you sure?")) return;
      await database.write(async () => {
        const rec = await database
          .get<Booking>("bookings")
          .find(bookingId)
          .catch(() => null);
        if (rec) await rec.markAsDeleted();
      });
      try {
        await deleteBooking(bookingId).unwrap();
      } catch {}
      await loadTickets();
      await loadUsers();
    },
    [deleteBooking, loadTickets, loadUsers]
  );

  if (!user?.isAdmin) return <p style={styles.errorText}>Access denied</p>;

  return (
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
            >
              {usr.name} ({usr.email})
            </div>
          ))
        )}
      </div>

      {/* Tickets */}
      <div
        style={{
          ...styles.mainContent,
          ...(selectedEvent
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.7) 0%,
                rgba(17,17,17,0.6) 60%, rgba(17,17,17,0.5) 100%),
                url(${selectedEvent.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        }}
      >
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
                    <td style={styles.td}>
                      {t.seatNumbers.length
                        ? t.seatNumbers.join(", ")
                        : t.seatNumber || ""}
                    </td>
                    <td style={styles.td}>
                      {t.seatCategories.length
                        ? t.seatCategories.join(", ")
                        : t.seatCategory || ""}
                    </td>
                    <td style={styles.td}>{t.status || ""}</td>
                    <td style={styles.td}>
                      {Array.isArray(t.qrCodes) && t.qrCodes.length > 0 ? (
                        t.qrCodes.map((qr, i) => (
                          <img
                            key={i}
                            src={qr}
                            alt={`QR ${i + 1}`}
                            style={{
                              maxWidth: 50,
                              borderRadius: 5,
                              marginRight: 4,
                            }}
                          />
                        ))
                      ) : t.qrCode ? (
                        <img
                          src={t.qrCode}
                          alt="QR"
                          style={{ maxWidth: 50, borderRadius: 5 }}
                        />
                      ) : null}
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
  );
}

const SidebarSkeleton = ({ rows = 6 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <div
      key={i}
      className="shimmer"
      style={{ height: 20, borderRadius: 6, marginBottom: 8 }}
    />
  ));

const TableSkeleton = ({ rows = 5 }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%" }}>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: 5 }).map((__, j) => (
              <td key={j}>
                <div
                  className="shimmer"
                  style={{ height: 16, borderRadius: 4, margin: "4px 0" }}
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
  item: { padding: "10px", borderRadius: "6px", marginBottom: "6px" },
  mainContent: {
    flex: 1,
    padding: "20px",
    borderRadius: 12,
    position: "relative",
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
