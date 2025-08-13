import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useRegisterMutation, useLoginMutation } from "../services/api"; // <-- your RTK Query slice
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginRegisterPage: React.FC = () => {
  const { login: authLogin } = useAuth();
  const nav = useNavigate();

  const [loginTrigger, loginResult] = useLoginMutation();
  const [registerTrigger, registerResult] = useRegisterMutation();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function safeApiCall<T>(apiFunc: () => Promise<T>) {
    try {
      const res = await apiFunc();
      return res;
    } catch (err: any) {
      console.error("API error:", err);
      return null;
    }
  }

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      let data;

      if (isLogin) {
        data = await safeApiCall(() =>
          loginTrigger({ email, password }).unwrap()
        );
      } else {
        data = await safeApiCall(() =>
          registerTrigger({ name, email, password }).unwrap()
        );
      }

      if (!data) {
        toast.error("Server returned an invalid response. Please try again.");
        return;
      }

      if (isLogin) {
        if (data.token) {
          authLogin(data.token, data.user);
          toast.success("Logged in successfully!");
          nav("/events");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        if (data.success || data.token || data.user) {
          toast.success("Registration successful. Please login.");
          setIsLogin(true);
          setName("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (err: any) {
      console.error("Login/Register error:", err);
      if (
        typeof err?.message === "string" &&
        (err.message.includes("Unexpected token") ||
          err.message.includes("Invalid JSON"))
      ) {
        toast.error(
          "Server returned an unexpected response (not JSON). Please try again later."
        );
      } else {
        toast.error(err?.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <style>{`
        .e-card {
          margin: 60px auto;
          background: transparent;
          box-shadow: 0px 8px 28px -9px rgba(0, 0, 0, 0.45);
          position: relative;
          width: 100%;
          max-width: 380px;
          min-height: 480px;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .wave {
          position: absolute;
          width: 600px;
          height: 800px;
          opacity: 0.6;
          left: 0;
          top: 0;
          margin-left: -50%;
          margin-top: -70%;
          background: linear-gradient(744deg,#af40ff,#5b42f3 60%,#00ddeb);
          border-radius: 40%;
          animation: wave 55s infinite linear;
        }
        .wave:nth-child(2),
        .wave:nth-child(3) { top: 210px; }
        .wave:nth-child(2) { animation-duration: 50s; }
        .wave:nth-child(3) { animation-duration: 45s; }
        @keyframes wave { 0%{ transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .infotop {
          text-align: center;
          font-size: 1.6rem;
          position: absolute;
          top: 2.5em;
          left: 0;
          right: 0;
          color: #fff;
          font-weight: 600;
          z-index: 2;
        }
        .form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 300px;
          padding: 1em 1.5em 2em;
          z-index: 3;
          margin: 0 auto;
        }
        .form-container input,
        .form-container button {
          width: 100%;
          border-radius: 6px;
          border: none;
          font-size: 15px;
        }
        .form-container input {
          padding: 12px;
          margin-bottom: 12px;
        }
        .form-container button {
          padding: 12px;
          background: #007bff;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .form-container button:hover { background: #0065d1; }
        .form-toggle {
          margin-top: 10px;
          font-size: 14px;
          color: #fff;
          text-align: center;
          cursor: pointer;
        }
      `}</style>

      <motion.div
        className="e-card playing"
        initial={{ opacity: 0, scale: 0.85, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
      >
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>

        <motion.div className="infotop">
          {isLogin ? "Login" : "Register"}
        </motion.div>

        <motion.div className="form-container">
          {!isLogin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleSubmit}>
            {isLogin
              ? loginResult.isLoading
                ? "Logging in..."
                : "Login"
              : registerResult.isLoading
                ? "Registering..."
                : "Register"}
          </button>
          <div className="form-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Don't have an account? Register here"
              : "Already have an account? Login here"}
          </div>
        </motion.div>
      </motion.div>

      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </>
  );
};

export default LoginRegisterPage;
