import React from "react";

const EventListSkeleton: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .skeleton-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .skeleton-card {
          background: #1a1a1a;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease-in-out;
        }
        .skeleton-image {
          height: 160px;
          background: linear-gradient(
            90deg,
            #2a2a2a 25%,
            #3a3a3a 50%,
            #2a2a2a 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .skeleton-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .skeleton-line {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            #2a2a2a 25%,
            #3a3a3a 50%,
            #2a2a2a 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .line-lg { height: 18px; width: 80%; }
        .line-md { width: 60%; }
        .line-sm { width: 40%; }
      `}</style>

      <div className="skeleton-wrapper">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div className="skeleton-card" key={idx}>
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line line-lg"></div>
              <div className="skeleton-line line-md"></div>
              <div className="skeleton-line line-sm"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventListSkeleton;
