import React, { useState } from "react";

// Tooltip 컴포넌트
const Tooltip = ({ children, label, details }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const { clientX, clientY } = e;
    setPosition({ x: clientX + 10, y: clientY + 10 });
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", position: "relative" }}
    >
      {children}
      {visible && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: `${position.y}px`,
            left: `${position.x}px`,
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <strong>{label}</strong>
          <p>{details}</p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
