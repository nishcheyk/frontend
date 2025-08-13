import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { MainLayout } from "./layout/MainLayout";
import { LoginRegisterPage } from "./pages/LoginRegister.page";
import "./App.css";
import { EventList } from "./pages/EventList.page";
import { EventDetails } from "./pages/EventDetails.page";
import { ValidateTicket } from "./pages/ValidateTicket";
import AddEventPage from "./pages/AddEvent.page";
import { MyTicketsPage } from "./pages/MyTicket.page";
import AdminTicketsPage from "./pages/AdminTicket.page";

/** ===== Route Guards ===== **/
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/events" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route without layout */}
          <Route path="/login" element={<LoginRegisterPage />} />

          {/* Routes with layout */}
          <Route element={<MainLayout />}>
            {/* redirect root */}
            <Route index element={<Navigate to="events" replace />} />

            {/* Public */}
            <Route path="events" element={<EventList />} />
            <Route path="events/:id" element={<EventDetails />} />

            {/* Private */}
            <Route
              path="validate"
              element={
                <PrivateRoute>
                  <ValidateTicket />
                </PrivateRoute>
              }
            />
            <Route
              path="myticket"
              element={
                <PrivateRoute>
                  <MyTicketsPage />
                </PrivateRoute>
              }
            />

            {/* Admin */}
            <Route
              path="add-event"
              element={
                <AdminRoute>
                  <AddEventPage />
                </AdminRoute>
              }
            />
            <Route
              path="tickets"
              element={
                <AdminRoute>
                  <AdminTicketsPage />
                </AdminRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={<p style={{ padding: "2rem" }}>Page not found</p>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
