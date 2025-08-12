import React from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../services/ErrorBoundary";
import EventListSkeleton from "./skeleton/EventListSkeleton";
import { FullHouseRibbon } from "./FullHouseRibbon";

type Event = {
  id: string;
  name: string;
  date: string;
  location?: string;
  description: string;
  totalSeats: number;
  bookedSeats: number[];
  imageUrl?: string;
};

const placeholderImages = [
  "https://imageevents.org.uk/wp-content/uploads/2016/02/event-management-placeholder.jpg",
];

const SeatsLeftBadge = ({ seatsLeft }: { seatsLeft: number }) => (
  <div
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "rgba(0, 170, 255, 0.85)",
      color: "#fff",
      fontWeight: 600,
      fontSize: "0.75rem",
      padding: "4px 8px",
      borderRadius: "6px",
      zIndex: 3,
    }}
  >
    {seatsLeft} left
  </div>
);

export const EventCard: React.FC<{ ev?: Event; loading?: boolean }> = ({
  ev,
  loading,
}) => {
  const nav = useNavigate();

  if (loading) return <EventListSkeleton />;
  if (!ev) return null;

  const seatsLeft = ev.totalSeats - (ev.bookedSeats?.length || 0);
  const isFullHouse = seatsLeft <= 0;

  const imageUrl =
    ev.imageUrl && ev.imageUrl.trim().length > 0
      ? ev.imageUrl
      : placeholderImages[
          ev.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
            placeholderImages.length
        ];

  return (
    <>
      <style>{`
        .card {
          overflow: visible;
          width: 220px;
          height: 280px;
          perspective: 1000px;
          cursor: pointer;
        }
        .content {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 400ms;
          position: relative;
          box-shadow: 0px 0px 10px 1px #000000ee;
          border-radius: 8px;
        }
        .card:hover .content {
          transform: rotateY(180deg);
        }
        .front, .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 8px;
          overflow: hidden;
        }
        .front {
          background-color: #151515;
          color: white;
        }
        .back {
          background-color: #151515;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotateY(180deg);
          padding: 1rem;
          text-align: center;
          font-size: 0.9rem;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
          color: #f5f5f5;
          height: 100%;
        
        }
        .back .card-details {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }
        .back .fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2rem;
          background: linear-gradient(transparent, #151515);
          pointer-events: none;
        }
        .img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .front-content {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 12px;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .badge {
          font-size: 0.75rem;
          max-width: 90%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 2px 8px;
          border-radius: 10px;
          width: fit-content;
        }
        .description {
          background-color: rgba(0, 0, 0, 0.6);
          padding: 6px;
          border-radius: 5px;
          width: 85%;
        }
        .title {
          font-size: 0.95rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-footer {
          color: #ffffffcc;
          margin-top: 2px;
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      <div className="card" onClick={() => nav(`/events/${ev.id}`)}>
        <div className="content">
          {/* BACK SIDE */}
          <div className="back" aria-label={`Description of event ${ev.name}`}>
            <div className="card-details">
              {ev.description || "No additional details available."}
            </div>
            <div className="fade" />
          </div>

          {/* FRONT SIDE */}
          <div className="front">
            <img className="img" src={imageUrl} alt={ev.name} />
            {isFullHouse && <FullHouseRibbon text="FULL HOUSE" />}
            {!isFullHouse && <SeatsLeftBadge seatsLeft={seatsLeft} />}
            <div className="front-content">
              <small className="badge">{ev.location || "TBA"}</small>
              <div className="description">
                <div className="title">
                  <strong>{ev.name}</strong>
                </div>
                <p className="card-footer">
                  {new Date(ev.date).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SafeEventCard: React.FC<{ ev?: Event; loading?: boolean }> = (
  props
) => (
  <ErrorBoundary>
    <EventCard {...props} />
  </ErrorBoundary>
);
