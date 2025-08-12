import React from "react";

export type TicketCardProps = {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seatNumbers: number[];
  seatCategories?: ("diamond" | "premium" | "silver")[];
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

// Color codes for seat categories
const categoryColors: Record<
  "diamond" | "premium" | "silver",
  { background: string; text: string }
> = {
  diamond: { background: "#FFD700", text: "#333" }, // gold
  premium: { background: "#4FACFE", text: "#fff" }, // blue
  silver: { background: "#BDC3C7", text: "#222" }, // silver/gray
};

export const TicketCard: React.FC<TicketCardProps> = ({
  eventTitle,
  eventDate,
  eventLocation,
  seatNumbers,
  seatCategories = [],
  imageUrl,
  qrCodes = [],
  ticketNo,
}) => {
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

        /* Reusable corner cut style */
        .corner-cut {
          position: absolute;
          width: 42px;
          height: 42px;
          background: #211f1f;
          border-radius: 50%;
          box-shadow: 0 0 0 0px #fcf6e6;
          z-index: 10;
        }
        .corner-top-left {
          top: -16px;
          left: -16px;
        }
        .corner-top-right {
          top: -16px;
          right: -16px;
        }
        .corner-bottom-left {
          bottom: -16px;
          left: -16px;
        }
        .corner-bottom-right {
          bottom: -16px;
          right: -16px;
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
          /* Important fix: prevent seat list truncation */
          flex-wrap: wrap;
          word-break: break-word;
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
          /* allow seats to wrap instead of truncating */
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
          max-width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .movie-seats span {
          margin-left: 0;
          /* add some spacing */
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-block;
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
          padding: 28px 20px;
          border-radius: 0 0 0 0;
          z-index: 1;
        }

        .qr-block {
          display: flex;
          justify-content: flex-start;
          gap: 20px; /* increased gap as padding between QR and text */
          flex-wrap: wrap;
          width: 100%;
        }

        .qr-item {
          display: flex;
          align-items: center; /* vertical center */
          gap: 8px; /* spacing between QR and seat text */
          text-align: left;
        }

        .qr-item img {
          width: 80px;
          height: 80px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }

        .qr-seat {
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
          padding: 2px 12px;
          border-radius: 6px;
          background-color: #ddd; /* default bg if category missing */
          user-select: none;
          min-width: 98px;
          text-align: center;
          /* dynamically colored with JS in component */
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
          .ticket-left,
          .ticket-right {
            padding: 15px;
          }
          .ticket-right {
            margin-top: 15px;
            border-top: 2px dashed #a29b7c;
            border-left: none;
          }
          .movie-date,
          .movie-location,
          .movie-seats {
            max-width: 100%;
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
          }
          .qr-block {
            justify-content: center;
          }
          .qr-item {
            justify-content: center;
          }
            
        }
      `}</style>

      <div
        className="ticket"
        style={{
          backgroundImage: `url(${imageUrl || ""})`,
        }}
      >
        {/* Corner cuts - use single reusable class for all corners */}
        <div className="corner-cut corner-top-left"></div>
        <div className="corner-cut corner-top-right"></div>
        <div className="corner-cut corner-bottom-left"></div>
        <div className="corner-cut corner-bottom-right"></div>

        {/* Left section */}
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
              <strong>Seats:</strong>
              {seatNumbers.map((seatNum, idx) => {
                const category = seatCategories[idx] || "silver"; // fallback
                const colors = categoryColors[category];
                return (
                  <span
                    key={`${seatNum}-${idx}`}
                    style={{
                      marginLeft: 8,
                      backgroundColor: colors.background,
                      color: colors.text,
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "inline-block",
                    }}
                    title={`Seat ${seatNum} - ${category.toUpperCase()}`}
                  >
                    {seatNum} ({category.toUpperCase()})
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="ticket-right">
          <div className="qr-block">
            {qrCodes.map((qr, idx) => {
              const seatNum = seatNumbers[idx];
              const category = seatCategories[idx] || "silver"; // fallback
              const colors = categoryColors[category];
              return (
                <div key={idx} className="qr-item">
                  <img src={qr} alt={`QR seat ${seatNum}`} />
                  <div
                    className="qr-seat"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                    }}
                    title={`Seat ${seatNum} - ${category.toUpperCase()}`}
                  >
                    Seat {seatNum} ({category.toUpperCase()})
                  </div>
                </div>
              );
            })}
          </div>

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
