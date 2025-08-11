import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { api } from "../services/api";

export const ValidateTicket = () => {
  const { token } = useAuth();
  const [qrData, setQrData] = useState("");
  const [result, setResult] = useState("");

  const validate = async () => {
    if (!token) return alert("Login required");
    const data = await api.validateTicket(token, qrData);
    setResult(data.valid ? "✅ Ticket Valid" : "❌ Ticket Invalid");
  };

  return (
    <div>
      <h3>Validate Ticket</h3>
      <input
        placeholder="QR Code Data"
        value={qrData}
        onChange={(e) => setQrData(e.target.value)}
      />
      <button onClick={validate}>Validate</button>
      {result && <p>{result}</p>}
    </div>
  );
};
