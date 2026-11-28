import React from "react";
import { Link } from "react-router-dom";

// A card with a photograph behind it, a dark scrim for legibility, and its
// content on top. Renders as a link when `to` is given.
export default function ImageCard({ image, to, className = "", children }) {
  const content = (
    <>
      <div className="pr-imgcard-bg" style={{ backgroundImage: `url(${image})` }} />
      <div className="pr-imgcard-scrim" />
      <div className="pr-imgcard-body">{children}</div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`pr-imgcard ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`pr-imgcard ${className}`}>{content}</div>;
}