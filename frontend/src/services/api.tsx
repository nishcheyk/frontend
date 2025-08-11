const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Types
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type BookingData = {
  eventId: string;
  seatNumber: number;
  phone: string;
  userId: string;
  email: string;
};

export type EventType = {
  id: string;
  name: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  totalSeats: number;
  bookedSeats: number[];
};

export type CreateEventData = {
  title: string;
  description: string;
  date: string | Date;
  totalSeats: number;
};

export const api = {
  // REGISTER
  register: (data: RegisterData) =>
    fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // LOGIN
  login: (data: LoginData) =>
    fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // EVENT LIST (normalized result)
  getEvents: async (): Promise<EventType[]> => {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
    const data = await res.json();

    return data.map((e: any) => ({
      id: e._id ?? e.id,
      name: e.title,
      title: e.title,
      description: e.description || "",
      date: e.date,
      location: e.location || "TBA",
      totalSeats: e.totalSeats ?? 0,
      bookedSeats: Array.isArray(e.bookedSeats) ? e.bookedSeats : [],
    }));
  },

  // SINGLE EVENT DETAILS
  getEvent: async (id: string): Promise<EventType> => {
    const res = await fetch(`${API_BASE}/events/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
    const e = await res.json();

    return {
      id: e._id ?? e.id,
      name: e.title,
      title: e.title,
      description: e.description || "",
      date: e.date,
      location: e.location || "TBA",
      totalSeats: e.totalSeats ?? 0,
      bookedSeats: Array.isArray(e.bookedSeats) ? e.bookedSeats : [],
    };
  },

  // BOOK EVENT
  bookEvent: (token: string, bookingData: BookingData) =>
    fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    }).then((res) => res.json()),

  // TICKET VALIDATION
  validateTicket: (token: string, qr: string) =>
    fetch(`${API_BASE}/bookings/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qr }),
    }).then((res) => res.json()),

  // ✅ ADD EVENT (Admin Only)
  addEvent: async (token: string, eventData: CreateEventData) => {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Admin token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      // Try parsing JSON error message
      let message = `Failed to add event: ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.message) message = errJson.message;
      } catch {}
      throw new Error(message);
    }

    return res.json();
  },
};
