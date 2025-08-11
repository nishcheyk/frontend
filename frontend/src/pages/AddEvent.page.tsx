import React, { useState, useEffect } from "react";
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
      <div style={{ textAlign: "center", padding: "3rem", color: "#ff4d4d" }}>
        You are not authorized to access this page.
      </div>
    );
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    totalSeats: 100,
    imageUrl: "",
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch location suggestions from Nominatim
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (locationQuery.length < 3) {
        setLocationSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setLocationSuggestions(data.map((item: any) => item.display_name));
      } catch (err) {
        console.error(err);
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce input
    return () => clearTimeout(delayDebounce);
  }, [locationQuery]);

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

    if (!form.title || !form.description || !form.date || !form.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await api.addEvent(token, form);
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
        <h2 style={{ color: "#ff784e", marginBottom: "1rem" }}>
          Add New Event
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
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

          {/* Location search field */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              style={inputStyle}
            />
            {locationSuggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#222",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  maxHeight: "150px",
                  overflowY: "auto",
                  zIndex: 5,
                }}
              >
                {locationSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setForm({ ...form, location: suggestion });
                      setLocationQuery(suggestion);
                      setLocationSuggestions([]);
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="number"
            name="totalSeats"
            placeholder="Total Seats"
            value={form.totalSeats}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
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
};

export default AddEventPage;
