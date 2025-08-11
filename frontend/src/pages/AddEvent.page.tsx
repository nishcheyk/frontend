// pages/AddEvent.page.tsx
import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { motion } from "framer-motion";

const AddEventPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) {
    return (
      <div
        style={{ textAlign: "center", padding: "3rem", color: "#ff4d4d" }}
      ></div>
    );
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    totalSeats: 100,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create an event.");
      return;
    }

    try {
      setLoading(true);
      await api.addEvent(token, form); // ✅ send token first
      toast.success("🎉 Event created successfully!");
      navigate("/events");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0d0d0d, #1a1a1a)",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "rgba(30,30,30,0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          boxShadow:
            "0 0 5px rgba(255,120,78,0.4), 0 0 15px rgba(255,120,78,0.2)",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "0.5rem",
          }}
        >
          <h2 style={{ margin: 0, color: "#ff784e" }}>Add New Event</h2>
          <span
            style={{
              background: "linear-gradient(135deg, #ff4d4d, #cc0000)",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            ADMIN
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          />
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="totalSeats"
            placeholder="Total Seats"
            value={form.totalSeats}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            disabled={loading}
            type="submit"
            style={{
              padding: "10px 16px",
              background: loading
                ? "linear-gradient(135deg, #555, #444)"
                : "linear-gradient(135deg, #ff784e, #ff4d4d)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "0.5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
            }}
          >
            {loading ? "Creating..." : "Create Event"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s ease, background 0.2s ease",
};

export default AddEventPage;
