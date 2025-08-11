import React from "react";
import { useAuth } from "../store/AuthContext";

export const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button onClick={logout} style={{ marginBottom: "1rem" }}>
      Logout
    </button>
  );
};
