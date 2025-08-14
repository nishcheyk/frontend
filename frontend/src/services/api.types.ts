// src/services/api.types.ts

/** ===== AUTH ===== */
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
};

/** ===== EVENTS ===== */
export type EventType = {
  id: string;
  name: string; // mapped from title for compatibility
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

/** ===== BOOKINGS ===== */
export type BookingData = {
  eventId: string;
  // Multi-seat booking support
  seatNumbers: number[];
  seatCategories: ("diamond" | "premium" | "silver")[];
  phone: string;
  userId: string;
  name: string; // send from EventDetails after login
  email: string;
};

// Backwards compatibility
export type SingleBookingData = Omit<
  BookingData,
  "seatNumbers" | "seatCategories"
> & {
  seatNumber: number;
  seatCategory: "diamond" | "premium" | "silver";
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

  // Multi-seat arrays
  seatNumbers: number[];
  seatCategories: ("diamond" | "premium" | "silver")[];
  qrCodes?: string[];

  // Single-seat fallbacks
  seatNumber?: number;
  seatCategory?: "diamond" | "premium" | "silver";
  qrCode?: string;
};

export type GetUserBookedEventsResponse = {
  success: boolean;
  count: number;
  events: UserBookedEvent[];
};

/** ===== ADMIN ===== */
export type AdminBooking = {
  bookingId: string;
  ticketNumber?: string;
  status: string;

  // Multi-seat arrays
  seatNumbers: number[];
  seatCategories: ("diamond" | "premium" | "silver")[];
  qrCodes?: string[];

  // Single-seat fallbacks
  seatNumber?: number;
  seatCategory?: "diamond" | "premium" | "silver";
  qrCode?: string;

  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isAdmin?: boolean;
  } | null;

  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    totalSeats?: number;
    bookedSeats?: number[];
    imageUrl?: string;
  } | null;
};

export type GetAllBookingsWithUserAndEventResponse = {
  success: boolean;
  count: number;
  bookings: AdminBooking[];
};
