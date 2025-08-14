import React, { useState, useCallback, useRef } from "react";
import { useAuth } from "../store/AuthContext";
import QrScanner from "qr-scanner";
import { toast } from "react-hot-toast";
import { useValidateTicketMutation } from "../services/api";
import { TicketCard } from "../components/TicketCard";

export const ValidateTicket = () => {
  const { token } = useAuth();
  const [qrData, setQrData] = useState("");
  const [lastUploadedBase64, setLastUploadedBase64] = useState<string | null>(
    null
  );
  const [result, setResult] = useState("");
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validateTicket, { isLoading }] = useValidateTicketMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validate = async () => {
    if (!token) {
      toast.error("Login required");
      return;
    }
    if (!qrData.trim() && !lastUploadedBase64) {
      toast.error("Enter QR text or upload an image");
      return;
    }

    const payload: any = {};
    if (qrData.trim()) payload.qrData = qrData.trim();
    if (lastUploadedBase64) payload.qrImageBase64 = lastUploadedBase64;

    try {
      const data = await validateTicket(payload).unwrap();

      setResult(data.valid ? "Ticket Valid" : data.message || "Ticket Invalid");

      if (data.valid) {
        toast.success("Ticket is valid!");
        setTicketInfo(data.ticket);
      } else {
        toast.error(data.message || "Ticket is invalid");
        setTicketInfo(null);
      }
    } catch (error: any) {
      console.error(" Validation API error:", error);
      toast.error(
        error?.data?.message || error.message || "Validation request failed"
      );
      setTicketInfo(null);
    }
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setLastUploadedBase64(base64);

      const text = await QrScanner.scanImage(file);
      if (text) {
        setQrData(text.trim());
      } else {
        toast.error("QR code could not be read");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not read QR code");
    }
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <>
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
          user-select: none;
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
          user-select: none;
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

        <input
          placeholder="Enter or scan QR code text"
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
          disabled={isLoading}
        />

        <div
          className={`drop-zone ${dragOver ? "drag-over" : ""}`}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          Drag & drop QR image or click to upload
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
        </div>

        <button onClick={validate} disabled={isLoading}>
          {isLoading ? "Validating..." : "Validate"}
        </button>

        {result && (
          <p
            className={result.startsWith("Ticket Valid") ? "success" : "error"}
          >
            {result}
          </p>
        )}
      </div>

      {ticketInfo && (
        <div
          style={{
            maxWidth: 880,
            margin: "32px auto",
            backgroundColor: "#211f1f",
            padding: 32,
            borderRadius: 20,
          }}
        >
          <TicketCard {...ticketInfo} />
        </div>
      )}
    </>
  );
};
