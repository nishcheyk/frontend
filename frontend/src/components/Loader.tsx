import React, { useEffect, useRef } from "react";
import { animate } from "motion";

interface LoaderProps {
  height?: string; // inline skeleton height (overrides bar height)
  width?: string; // inline skeleton width
  barColor?: string; // color of bars
  barCount?: number; // how many bars
  fullscreen?: boolean; // center full screen
  size?: string; // wave container size e.g. '200px'
  style?: React.CSSProperties; // extra styles
}

const Loader: React.FC<LoaderProps> = ({
  height,
  width,
  barColor = "#3498db",
  barCount = 10,
  fullscreen = false,
  size = "200px",
  style,
}) => {
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waveRef.current) return;
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
    <div
      className={fullscreen ? "loader-wrapper" : ""}
      style={{ ...(fullscreen ? {} : style) }}
    >
      <style>{`
        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .loading-wave {
          width: ${size};
          height: ${size};
          display: flex;
          justify-content: center;
          align-items: center;
          transform-origin: center center;
          will-change: transform;
        }
        .loading-bar {
          width: 18px;
          height: ${height || "30px"};
          margin: 0 2px;
          background-color: ${barColor};
          border-radius: 5px;
          animation: loading-wave-animation 1s ease-in-out infinite;
        }
        ${Array.from({ length: barCount })
          .map(
            (_, i) =>
              `.loading-bar:nth-child(${i + 1}) { animation-delay: ${i * 0.1}s; }`
          )
          .join("\n")}
        @keyframes loading-wave-animation {
          0%   { height: 10px; }
          50%  { height: ${height || "100px"}; }
          100% { height: 10px; }
        }
      `}</style>

      <div
        className="loading-wave"
        ref={waveRef}
        style={{
          width: width || size,
          height: size,
        }}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <div className="loading-bar" key={i}></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
