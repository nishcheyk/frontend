// src/services/api.types.ts

// ===== AUTH =====
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

// ===== EVENTS =====
export type EventType = {
  id: string;
  name: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  totalSeats: number;
  bookedSeats: number[];
  imageUrl?: string;
};

export type CreateEventData = {
  title: string;
  description: string;
  date: string | Date;
  totalSeats: number;
  imageUrl?: string;
  location: string;
};

// ===== BOOKINGS =====
export type BookingData = {
  eventId: string;
  seatNumber: number;
  seatCategory: "diamond" | "premium" | "silver";
  phone: string;
  userId: string;
  email: string;
};

export type UserBookedEvent = {
  _id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  bookedSeats: number[];
  location: string;
  imageUrl?: string;
  seatNumbers: number[];
  seatCategories: ("diamond" | "premium" | "silver")[];
  qrCodes?: string[];
};

export type GetUserBookedEventsResponse = {
  success: boolean;
  count: number;
  events: UserBookedEvent[];
};

// ===== ADMIN =====
export type AdminBooking = {
  bookingId: string;
  status: string;
  seatNumber: number;
  seatCategory: "diamond" | "premium" | "silver";
  qrCode?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string;
  } | null;
};
