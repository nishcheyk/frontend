import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginRegisterPage: React.FC = () => {
  const { login } = useAuth();
  const nav = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Submit handler with toast notifications
  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      let data;

      if (isLogin) {
        data = await safeApiCall(() => api.login({ email, password }));
      } else {
        data = await safeApiCall(() => api.register({ name, email, password }));
      }

      if (!data) {
        toast.error("Server returned an invalid response. Please try again.");
        return;
      }

      if (isLogin) {
        if (data.token) {
          login(data.token, data.user);
          toast.success("Logged in successfully!");
          nav("/events");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        if (data.success || data.token || data.user) {
          toast.success("Registration successful. Please login.");
          setIsLogin(true); // ✅ switch form to login mode
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

  /**
   * Wrapper to safely call an API function and avoid JSON parse crashes.
   * If the API returns HTML or invalid JSON, it catches it and logs the raw output.
   */
  async function safeApiCall(apiFunc: () => Promise<any>) {
    try {
      const res = await apiFunc();
      return res;
    } catch (parseErr: any) {
      // If fetch inside api.* threw an error before returning data
      console.error("API returned an invalid or non-JSON response:", parseErr);
      return null;
    }
  }

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
        /* waves */
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
        .playing .wave { animation-duration: 3s; }
        .playing .wave:nth-child(2) { animation-duration: 4s; }
        .playing .wave:nth-child(3) { animation-duration: 5s; }
        @keyframes wave { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        /* title */
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
        .name {
          font-size: 1rem;
          font-weight: 400;
          position: relative;
          top: 0.5em;
          opacity: 0.9;
        }
        /* form */
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
          box-sizing: border-box;
          margin: 0 auto;
          overflow-y: auto;
        }
        .form-container input,
        .form-container button {
          width: 100%;
          border-radius: 6px;
          border: none;
          font-size: 15px;
          box-sizing: border-box;
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
        .form-container button:hover {
          background: #0065d1;
        }
        .form-toggle {
          margin-top: 10px;
          font-size: 14px;
          color: #fff;
          text-align: center;
          cursor: pointer;
        }
        /* responsive */
        @media (max-width: 480px) {
          .e-card { max-width: 90%; min-height: 380px; }
          .infotop { font-size: 1.3rem; top: 2em; }
          .form-container { padding: 0.8em; }
        }
      `}</style>

      <motion.div
        className="e-card playing"
        initial={{ opacity: 0, scale: 0.85, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* waves */}
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>

        {/* title */}
        <motion.div
          className="infotop"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLogin ? "Login" : "Register"}
        </motion.div>

        {/* form */}
        <motion.div
          className="form-container"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {!isLogin && (
            <motion.input
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          )}
          <motion.input
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <motion.input
            type="password"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Register"}
          </motion.button>
          <motion.div
            className="form-toggle"
            onClick={() => setIsLogin(!isLogin)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {isLogin
              ? "Don't have an account? Register here"
              : "Already have an account? Login here"}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* toast container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
};

export default LoginRegisterPage;
