import React from "react";

interface RibbonProps {
  text: string;
  bgColor?: string;
}

export const FullHouseRibbon: React.FC<RibbonProps> = ({
  text,
  bgColor = "linear-gradient(135deg, #ff4d4d, #cc0000)",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "30px",
        right: "-40px",
        transform: "rotate(45deg)",
        background: bgColor,
        color: "#fff",
        fontWeight: 700,
        fontSize: "clamp(0.6rem, 2vw, 0.8rem)", // responsive font size
        padding: "4px clamp(30px, 8vw, 40px)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        zIndex: 2,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
