import React, { useState, useCallback, useRef } from "react";
import { useAuth } from "../store/AuthContext";
import QrScanner from "qr-scanner";
import { toast } from "react-hot-toast";
import { useValidateTicketMutation } from "../services/api"; // RTK Query mutation hook

export const ValidateTicket = () => {
  const { token } = useAuth();
  const [qrData, setQrData] = useState("");
  const [result, setResult] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [validateTicket, { isLoading }] = useValidateTicketMutation();

  // Ref for hidden file input to trigger on click
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = async () => {
    if (!token) {
      toast.error("Login required");
      return;
    }
    if (!qrData.trim()) {
      toast.error("Please enter or scan a valid QR code");
      return;
    }
    try {
      const data = await validateTicket({ qrData: qrData.trim() }).unwrap();
      setResult(data.valid ? "Ticket Valid" : data.message || "Ticket Invalid");
      if (data.valid) {
        toast.success("Ticket is valid!");
      } else {
        toast.error(data.message || "Ticket is invalid");
      }
    } catch (error: any) {
      toast.error(error.message || "Validation failed");
    }
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file containing a QR code.");
      return;
    }
    try {
      const text = await QrScanner.scanImage(file);
      setQrData(text);
      setResult(""); // Clear previous validation result if any
    } catch {
      toast.error("Could not read a QR code from the image.");
    }
  }, []);

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

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onClickDropZone = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="validate-container">
      <style>{`
        /* ... your existing styles ... */
      `}</style>

      <h3>Validate Ticket</h3>

      <input
        placeholder="Enter or scan QR code"
        value={qrData}
        onChange={(e) => setQrData(e.target.value)}
        disabled={isLoading}
      />

      <div
        className={`drop-zone ${dragOver ? "drag-over" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClickDropZone}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") onClickDropZone();
        }}
      >
        Drag & drop QR code image here or click to upload
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={isLoading}
        />
      </div>

      <button onClick={validate} disabled={isLoading}>
        {isLoading ? "Validating..." : "Validate"}
      </button>

      {result && (
        <p className={result.startsWith("Ticket Valid") ? "success" : "error"}>
          {result}
        </p>
      )}
    </div>
  );
};
