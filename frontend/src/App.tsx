import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { MainLayout } from "./layout/MainLayout";
import { LoginRegisterPage } from "./pages/LoginRegister.page";
import "./App.css";
import { EventList } from "./pages/EventList.page";
import { EventDetails } from "./pages/EventDetails.page";
import { ValidateTicket } from "./pages/ValidateTicket";
import AddEventPage from "./pages/AddEvent.page"; // ✅ new
import { MyTicketsPage } from "./pages/MyTicket.page";

// Generic PrivateRoute for logged-in users
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

// Admin-only route
function AdminRoute({ children }: { children: JSX.Element }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (!user?.isAdmin) return <Navigate to="/events" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Redirect root to events */}
            <Route path="/" element={<Navigate to="/events" />} />

            {/* Public routes */}
            <Route path="/login" element={<LoginRegisterPage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Protected routes */}
            <Route
              path="/validate"
              element={
                <PrivateRoute>
                  <ValidateTicket />
                </PrivateRoute>
              }
            />
            <Route
              path="/myticket"
              element={
                <PrivateRoute>
                  <MyTicketsPage />
                </PrivateRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/add-event"
              element={
                <AdminRoute>
                  <AddEventPage />
                </AdminRoute>
              }
            />

            {/* 404 Fallback (optional) */}
            <Route
              path="*"
              element={<p style={{ padding: "2rem" }}>Page not found</p>}
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
