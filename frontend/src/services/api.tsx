// src/services/api.ts
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Better types for user and booking
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

  // EVENT LIST
  getEvents: () => fetch(`${API_BASE}/events`).then((res) => res.json()),

  // SINGLE EVENT DETAILS
  getEvent: (id: string) =>
    fetch(`${API_BASE}/events/${id}`).then((res) => res.json()),

  // BOOK EVENT (now takes a nice typed bookingData object)
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
};
