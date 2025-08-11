import React, { createContext, useContext, useState } from "react";

type UserType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
};

type AuthType = {
  token: string | null;
  user: UserType | null;
  login: (token: string, user: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthType | undefined>(undefined);

// Safe JSON parser for localStorage values
const parseJSON = <T,>(value: string | null): T | null => {
  if (!value || value === "undefined" || value === "null") return null;
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn("Failed to parse JSON from localStorage:", err);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize from localStorage on app startup
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<UserType | null>(() =>
    parseJSON<UserType>(localStorage.getItem("user"))
  );

  // Store both token and user when logging in
  const login = (tok: string, userData: UserType) => {
    setToken(tok);
    setUser(userData);
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Clear everything on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
