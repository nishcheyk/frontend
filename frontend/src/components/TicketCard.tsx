import React from "react";

export type TicketCardProps = {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seatNumbers: number[];
  imageUrl?: string;
  qrCodes?: string[];
  ticketNo: string;
};

const friendlyMessages = [
  "Thank you for joining us! Enjoy the event 🎉",
  "🎫 Why don’t tickets ever get lost? Because they always show up on time!",
  "Have fun, but don't forget your seat number! 😄",
  "A ticket to remember — have a great time!",
  "Keep this ticket safe, it’s your golden pass!",
  "Pro tip: Smile, you're at an awesome event!",
  "Enjoy every moment and make memories!",
  "Great events start with great tickets!",
  "This ticket is your VIP backstage pass to fun!",
  "Did you bring your dancing shoes? 💃🕺",
];

export const TicketCard: React.FC<TicketCardProps> = ({
  eventTitle,
  eventDate,
  eventLocation,
  seatNumbers,
  imageUrl,
  qrCodes = [],
  ticketNo,
}) => {
  // Pick one random message per render
  const randomMessage =
    friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)];
  const downloadQRCodes = () => {
    if (!qrCodes.length) return;
    qrCodes.forEach((qr, idx) => {
      const link = document.createElement("a");
      link.href = qr;
      link.download = `ticket-${ticketNo}-seat-${seatNumbers[idx]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
      <style>{`
        .ticket {
          position: relative;
          display: flex;
          width: 100%;
          max-width: 750px;
          color: #fcf6e6;
          font-family: 'Georgia', 'Times New Roman', serif;
          margin: 40px auto;
          overflow: visible;
          z-index: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Dark overlay */
        .ticket::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: -1;
          border-radius: 0;
        }

        /* Top-left corner cut */
        .ticket::after {
          content: "";
          position: absolute;
          top: -16px;
          left: -16px;
          width: 42px;
          height: 42px;
          background: #211f1f;
          border-radius: 50%;
          box-shadow: 0 0 0 0px #fcf6e6;
          z-index: 10;
        }

        /* Top-right corner cut */
        .corner-top-right {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 42px;
          height: 42px;
          background: #211f1f;
          border-radius: 50%;
          box-shadow: 0 0 0 0px #fcf6e6;
          z-index: 10;
        }

        /* Bottom-left corner cut */
        .corner-bottom-left {
          position: absolute;
          bottom: -16px;
          left: -16px;
          width: 42px;
          height: 42px;
          background: #211f1f;
          border-radius: 50%;
          box-shadow: 0 0 0 0px #fcf6e6;
          z-index: 10;
        }

        /* Bottom-right corner cut */
        .corner-bottom-right {
          position: absolute;
          bottom: -16px;
          right: -16px;
          width: 42px;
          height: 42px;
          background: #211f1f;
          border-radius: 50%;
          box-shadow: 0 0 0 0px #fcf6e6;
          z-index: 10;
        }

        /* Left Panel */
        .ticket-left {
          flex: 3;
          padding: 20px;
          display: flex;
          align-items: center;
          background: rgba(252, 246, 230, 0.65);
          color: #222;
          z-index: 1;
          border-radius: 0;
        }

        .poster {
          width: 120px;
          height: auto;
          border-radius: 6px;
          margin-right: 15px;
          border: 1px solid #ddd;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .ticket-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .movie-title {
          font-size: 1.8rem;
          font-weight: bold;
          color: #111;
          margin: 0;
        }

        .movie-date,
        .movie-location,
        .movie-seats {
          margin-top: 6px;
          font-size: 1rem;
          color: #444;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
        }

        /* Right Panel */
        .ticket-right {
          flex: 1.5;
          background: rgba(252, 246, 230, 0.80);
          border-left: 2px dashed #a29b7c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 18px 15px;
          border-radius: 0 0 0 0;
          z-index: 1;
        }

        .qr-block {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
          gap: 12px;
          width: 100%;
          justify-items: center;
        }

        .qr-item {
          text-align: center;
        }

        .qr-item img {
          width: 80px;
          height: 80px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
.download-btn {
  margin-top: 18px;
  padding: 8px 16px;
  font-size: 0.9rem;
  background: #a29b7c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.download-btn:hover {
  background-color: #8d8361;
}

        .qr-seat {
          font-size: 0.85rem;
          margin-top: 4px;
          color: #333;
          font-weight: 600;
        }

        /* Friendly message style */
        .friendly-message {
          margin-top: 16px;
          font-size: 0.9rem;
          color: #444;
          font-style: italic;
          text-align: center;
          padding: 8px;
          border-top: 1px solid #ccc;
          width: 100%;
        }

        /* Ticket number */
        .ticket-number {
          font-family: monospace;
          font-size: 0.9rem;
          margin-top: 20px;
          padding-top: 8px;
          border-top: 1px solid #ccc;
          width: 100%;
          text-align: center;
          color: #000;
          font-weight: 700;
        }

        /* Responsive tweaks */
        @media (max-width: 600px) {
          .ticket {
            flex-direction: column;
            max-width: 90%;
          }
          .ticket-left, .ticket-right {
            padding: 15px;
          }
          .ticket-right {
            margin-top: 15px;
            border-top: 2px dashed #a29b7c;
            border-left: none;
          }
          .movie-date, .movie-location, .movie-seats {
            max-width: 100%;
            white-space: normal;
          }
        }
      `}</style>

      <div
        className="ticket"
        style={{
          backgroundImage: `url(${imageUrl || ""})`,
        }}
      >
        {/* Corner cuts */}
        <div className="corner-top-right"></div>
        <div className="corner-bottom-left"></div>
        <div className="corner-bottom-right"></div>

        {/* Left Side */}
        <div className="ticket-left">
          {imageUrl && (
            <img src={imageUrl} alt={eventTitle} className="poster" />
          )}
          <div className="ticket-info">
            <h2 className="movie-title">{eventTitle}</h2>
            <div className="movie-date">
              {new Date(eventDate).toDateString()}
            </div>
            <div className="movie-location">{eventLocation}</div>
            <div className="movie-seats">
              <strong>Seats:</strong> {seatNumbers.join(", ")}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="ticket-right">
          <div
            className="qr-block"
            style={{
              display: "flex",
              justifyContent: qrCodes.length > 0 ? "center" : "start",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {qrCodes.map((qr, idx) => (
              <div key={idx} className="qr-item">
                <img src={qr} alt={`QR seat ${seatNumbers[idx]}`} />
                <div className="qr-seat">Seat {seatNumbers[idx]}</div>
              </div>
            ))}
          </div>

          {/* Random friendly message */}
          <div className="friendly-message">{randomMessage}</div>

          <div className="ticket-number">
            Ticket No: <span>{ticketNo}</span>
          </div>
          <button className="download-btn" onClick={downloadQRCodes}>
            Download QR Codes
          </button>
        </div>
      </div>
    </>
  );
};
