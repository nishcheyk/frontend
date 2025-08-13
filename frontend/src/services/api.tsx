// src/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  RegisterData,
  LoginData,
  EventType,
  CreateEventData,
  BookingData,
  GetUserBookedEventsResponse,
  AdminBooking,
} from "./api.types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// custom base query that reads the token from localStorage
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token"); // always in sync with AuthContext
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Events", "Bookings", "AdminBookings"],
  endpoints: (builder) => ({
    /** ===== Auth ===== */
    register: builder.mutation<any, RegisterData>({
      query: (body) => ({ url: "/users/register", method: "POST", body }),
    }),
    login: builder.mutation<any, LoginData>({
      query: (body) => ({ url: "/users/login", method: "POST", body }),
    }),

    /** ===== Events ===== */
    getEvents: builder.query<EventType[], void>({
      query: () => "/events",
      providesTags: ["Events"],
      transformResponse: (events: any[]) =>
        events.map((e) => ({
          id: e.id ?? e._id,
          name: e.title,
          title: e.title,
          description: e.description || "",
          date: e.date,
          location: e.location || "TBA",
          totalSeats: e.totalSeats ?? 0,
          bookedSeats: Array.isArray(e.bookedSeats) ? e.bookedSeats : [],
          imageUrl: e.imageUrl || "",
        })),
    }),
    getEvent: builder.query<EventType, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Events", id }],
    }),
    addEvent: builder.mutation<any, CreateEventData>({
      query: (body) => ({ url: "/events", method: "POST", body }),
      invalidatesTags: ["Events"],
    }),

    /** ===== Bookings ===== */
    bookEvent: builder.mutation<any, BookingData>({
      query: (body) => ({ url: "/bookings", method: "POST", body }),
      invalidatesTags: ["Bookings", "AdminBookings"],
    }),
    validateTicket: builder.mutation<any, { qrData: string }>({
      query: (body) => ({ url: "/bookings/validate", method: "POST", body }),
    }),
    getUserBookedEventsWithSeats: builder.query<
      GetUserBookedEventsResponse,
      string
    >({
      query: (userId) => `/bookings/events-with-seats/user/${userId}`,
      providesTags: ["Bookings"],
    }),

    /** ===== Admin ===== */
    getAllBookingsWithUserAndEvent: builder.query<
      { success: boolean; count: number; bookings: AdminBooking[] },
      void
    >({
      query: () => "bookings/admin/all-tickets",
      providesTags: (result) =>
        result
          ? [
              ...result.bookings.map((b) => ({
                type: "AdminBookings" as const,
                id: b.bookingId,
              })),
              { type: "AdminBookings", id: "LIST" },
            ]
          : [{ type: "AdminBookings", id: "LIST" }],
    }),
    deleteBooking: builder.mutation<any, string>({
      query: (bookingId) => ({
        url: `/admin/booking/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "AdminBookings", id },
        { type: "AdminBookings", id: "LIST" },
      ],
    }),
  }),
});

// export hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetEventsQuery,
  useGetEventQuery,
  useAddEventMutation,
  useBookEventMutation,
  useValidateTicketMutation,
  useGetUserBookedEventsWithSeatsQuery,
  useGetAllBookingsWithUserAndEventQuery,
  useDeleteBookingMutation,
} = apiSlice;
