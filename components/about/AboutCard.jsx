import React from "react";
import { Link } from "react-router-dom";

// An image-backed card with a dark scrim, used across the About page.
export default function AboutCard({
  image,
  label,
  icon: Icon,
  title,
  paragraphs = [],
  link,
  linkLabel,
  wide = false,
  className = ""
}) {
  const classes = ["ab-card", wide ? "ab-card-wide" : "", className].filter(Boolean).join(" ");

  return (
    <article className={classes}>
      <div className="ab-card-bg" style={{ backgroundImage: `url(${image})` }} />
      <div className="ab-card-scrim" />
      <div className="ab-card-body">
        {Icon && <Icon className="ab-icon" />}
        {label && <span className="ab-num">{label}</span>}
        {title && <h3 className="ab-card-title">{title}</h3>}
        {paragraphs.map((text) => (
          <p key={text} className="ab-card-text">{text}</p>
        ))}
        {link && (
          <Link to={link} className="ab-card-link">
            {linkLabel} →
          </Link>
        )}
      </div>
    </article>
  );
}