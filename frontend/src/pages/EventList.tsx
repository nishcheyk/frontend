import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

type Event = { id: string; name: string; date: string; location: string };

export const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    api.getEvents().then(setEvents);
  }, []);

  return (
    <div>
      <h2>Events</h2>
      {events.map((ev) => (
        <div
          key={ev.id}
          style={{ border: "1px solid #ccc", padding: 8, margin: 8 }}
        >
          {" "}
          <strong>{ev.id}</strong>
          <strong>{ev.name}</strong> – {ev.date} – {ev.location}
          <button onClick={() => nav(`/events/${ev.id}`)}>View</button>
        </div>
      ))}
    </div>
  );
};
