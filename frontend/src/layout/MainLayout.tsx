import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export const MainLayout: React.FC = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          padding: "1rem 2rem",
          background: "linear-gradient(135deg, #1e1e1e, #121212)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
          borderRadius: "0 0 12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left - Logo / Brand */}
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.4rem",
            color: "#ff784e",
            cursor: "pointer",
          }}
          onClick={() => navigate("/events")}
        >
          Bookwiz
        </div>

        {/* Middle - Links */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <NavLink
            to="/events"
            style={({ isActive }) => ({
              color: isActive ? "#ff784e" : "#fff",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s ease",
            })}
          >
            Events
          </NavLink>

          <NavLink
            to="/validate"
            style={({ isActive }) => ({
              color: isActive ? "#ff784e" : "#fff",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s ease",
            })}
          >
            Validate Ticket
          </NavLink>

          {token && (
            <NavLink
              to="/myticket"
              style={({ isActive }) => ({
                color: isActive ? "#ff784e" : "#fff",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s ease",
              })}
            >
              MyTicket
            </NavLink>
          )}

          {/* Only admins see Add Event */}
          {user?.isAdmin && (
            <NavLink
              to="/add-event"
              style={({ isActive }) => ({
                color: isActive ? "#ff784e" : "#fff",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s ease",
              })}
            >
              Add Event
            </NavLink>
          )}
        </div>

        {/* Right - Auth Buttons */}
        <div>
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                background: "#ff4d4d",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#e63e3e")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#ff4d4d")}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "6px 14px",
                background: "#00c853",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#00a844")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#00c853")}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
};
