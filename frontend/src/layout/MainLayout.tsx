import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";
import { useAuth } from "../store/AuthContext";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  return (
    <div>
      <nav style={{ padding: "1rem", background: "#ddd" }}>
        <Link to="/events" style={{ marginRight: "1rem" }}>
          Events
        </Link>
        <Link to="/validate" style={{ marginRight: "1rem" }}>
          Validate Ticket
        </Link>
        {token && <LogoutButton />}
      </nav>
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
};
