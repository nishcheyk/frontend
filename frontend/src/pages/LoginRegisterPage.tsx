import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export const LoginRegisterPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();

  // Toggle state: true = login, false = register
  const [isLogin, setIsLogin] = useState(true);

  // form state
  const [name, setName] = useState(""); // only for registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // style object
  const containerStyle: React.CSSProperties = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #aaa",
    fontSize: "14px",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const toggleTextStyle: React.CSSProperties = {
    textAlign: "center",
    marginTop: "15px",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "14px",
  };

  // handle login or register
  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill all required fields");
      return;
    }

    if (isLogin) {
      // LOGIN
      const data = await api.login({ email, password });
      if (data.token) {
        login(data.token, data.user);
        nav("/events");
      } else {
        alert(data.message || "Login failed");
      }
    } else {
      // REGISTER
      const data = await api.register({ name, email, password });
      if (data.success) {
        alert("Registration successful. Please login.");
        setIsLogin(true);
      } else {
        alert(data.message || "Registration failed");
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{isLogin ? "Login" : "Register"}</h2>

      {/* Name field only if registering */}
      {!isLogin && (
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
      )}

      <input
        style={inputStyle}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        style={inputStyle}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button style={buttonStyle} onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p style={toggleTextStyle} onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Register here"
          : "Already have an account? Login here"}
      </p>
    </div>
  );
};

export default LoginRegisterPage;
