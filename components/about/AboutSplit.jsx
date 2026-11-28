import React from "react";

// Two-column block: a rounded photo beside text. On phones the photo sits on top.
export default function AboutSplit({ image, reverse = false, children }) {
  return (
    <div className={reverse ? "ab-split ab-split-reverse" : "ab-split"}>
      <div className="ab-split-img" style={{ backgroundImage: `url(${image})` }} />
      <div className="ab-split-text">{children}</div>
    </div>
  );
}