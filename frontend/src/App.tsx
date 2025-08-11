import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { MainLayout } from "./layout/MainLayout";
import { LoginRegisterPage } from "./pages/LoginRegisterPage";
import "./App.css";
// import { RegisterPage } from "./pages/RegisterPage";
import { EventList } from "./pages/EventList";
import { EventDetails } from "./pages/EventDetails.page";
import { ValidateTicket } from "./pages/ValidateTicket";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/events" />} />
            <Route path="/login" element={<LoginRegisterPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route
              path="/validate"
              element={
                <PrivateRoute>
                  <ValidateTicket />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
