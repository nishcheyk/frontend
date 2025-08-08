import React, { useEffect, useRef } from "react";
import { animate } from "motion";

function Loader() {
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animate(
      waveRef.current,
      { rotate: 360 },
      {
        duration: 4,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }
    );
  }, []);

  return (
    <div>
      <style>{`
        /* Full screen center positioning */
        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        /* Fixed-size rotation container */
        .loading-wave {
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center; /* center bars vertically */
          transform-origin: center center; /* spin around its center */
          will-change: transform;
        }

        .loading-bar {
          width: 18px;
          height: 30px;
          margin: 0 2px;
          background-color: #3498db;
          border-radius: 5px;
          animation: loading-wave-animation 1s ease-in-out infinite;
        }

        /* Staggered wave delays */
        .loading-bar:nth-child(1) { animation-delay: 0s; }
        .loading-bar:nth-child(2) { animation-delay: 0.1s; }
        .loading-bar:nth-child(3) { animation-delay: 0.2s; }
        .loading-bar:nth-child(4) { animation-delay: 0.3s; }
        .loading-bar:nth-child(5) { animation-delay: 0.4s; }
        .loading-bar:nth-child(6) { animation-delay: 0.5s; }
        .loading-bar:nth-child(7) { animation-delay: 0.6s; }
        .loading-bar:nth-child(8) { animation-delay: 0.7s; }
        .loading-bar:nth-child(9) { animation-delay: 0.8s; }
        .loading-bar:nth-child(10) { animation-delay: 0.9s; }

        /* Bar growing to 100px height */
        @keyframes loading-wave-animation {
          0%   { height: 10px; }
          50%  { height: 100px; }
          100% { height: 10px; }
        }
      `}</style>

      <div className="loader-wrapper">
        <div className="loading-wave" ref={waveRef}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="loading-bar" key={i}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loader;
