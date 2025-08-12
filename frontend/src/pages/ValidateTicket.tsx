import React, { useState, useCallback } from "react";
import { useAuth } from "../store/AuthContext";
import { api } from "../services/api";
import QrScanner from "qr-scanner";

export const ValidateTicket = () => {
  const { token } = useAuth();
  const [qrData, setQrData] = useState("");
  const [result, setResult] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const validate = async () => {
    if (!token) return alert("Login required");
    if (!qrData.trim()) return alert("Please enter or scan a valid QR code");

    try {
      const data = await api.validateTicket(token, qrData.trim());
      setResult(data.valid ? "Ticket Valid" : data.message || "Ticket Invalid");
    } catch (error: any) {
      alert(error.message || "Validation failed");
    }
  };

  // 📌 Handle file drop
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file containing a QR code.");
      return;
    }
    try {
      const text = await QrScanner.scanImage(file);
      setQrData(text);
    } catch (err) {
      alert("Could not read a QR code from the image.");
    }
  }, []);

  // 📌 Drag and drop event handlers
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  return (
    <div className="validate-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Inter:wght@400;600&display=swap');

        .validate-container {
          font-family: 'Inter', sans-serif;
          max-width: 420px;
          margin: 40px auto;
          padding: 24px 20px;
          background: #fcf6e6;
          border: 2px dashed #a29b7c;
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          text-align: center;
          animation: fadeInUp 0.6s ease;
        }

        h3 {
          font-family: 'Merriweather', serif;
          font-size: 1.5rem;
          color: #222;
          margin-bottom: 18px;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          font-size: 1rem;
          border: 2px solid #a29b7c;
          border-radius: 10px;
          outline: none;
          background: #fff;
          transition: all 0.25s ease;
          margin-bottom: 15px;
        }

        input:focus {
          border-color: #8d8361;
          box-shadow: 0 0 0 3px rgba(162, 155, 124, 0.25);
        }

        .drop-zone {
          border: 2px dashed #a29b7c;
          border-radius: 10px;
          padding: 20px;
          background: #fff;
          color: #555;
          font-size: 0.95rem;
          margin-bottom: 15px;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .drop-zone.drag-over {
          background: rgba(162, 155, 124, 0.1);
          border-color: #8d8361;
        }

        button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: none;
          border-radius: 10px;
          background: #a29b7c;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.3s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(162, 155, 124, 0.4);
          background: #8d8361;
        }

        p {
          margin-top: 16px;
          font-size: 1rem;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 8px;
          opacity: 0;
          transform: translateY(10px);
          animation: slideFadeIn 0.4s ease forwards;
        }

        p.success {
          background-color: #e6f5ec;
          color: #1b7b3f;
        }

        p.error {
          background-color: #fdecec;
          color: #b21111;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h3>Validate Ticket</h3>

      <input
        placeholder="Enter or scan QR code"
        value={qrData}
        onChange={(e) => setQrData(e.target.value)}
      />

      {/* Drag and Drop Zone */}
      <div
        className={`drop-zone ${dragOver ? "drag-over" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        Drag & drop QR code image here or click to upload
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <button onClick={validate}>Validate</button>

      {result && (
        <p className={result.startsWith("Ticket Valid") ? "success" : "error"}>
          {result}
        </p>
      )}
    </div>
  );
};
