import React from "react";

export default function PageHeader({ eyebrow, title, lead, actions, image, overlay = true, children }) {
  const style = image ? { backgroundImage: `url(${image})` } : undefined;

  if (image) {
    return (
      <section className="pr-hero">
        <div className="pr-hero-bg" style={style} />
        {overlay ? <div className="pr-hero-overlay" /> : null}
        <div className="pr-container pr-hero-inner">
          {eyebrow ? <span className="pr-eyebrow pr-eyebrow-light">{eyebrow}</span> : null}
          <h1 className="pr-hero-title">{title}</h1>
          {lead ? <p className="pr-hero-text">{lead}</p> : null}
          {actions ? <div className="pr-hero-actions">{actions}</div> : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="pr-section-tight" style={{ background: "var(--pr-ivory-soft)" }}>
      <div className="pr-container">
        {eyebrow ? <span className="pr-eyebrow">{eyebrow}</span> : null}
        <h1 className="pr-section-title">{title}</h1>
        {lead ? <p className="pr-section-lead">{lead}</p> : null}
        {actions ? <div className="pr-hero-actions">{actions}</div> : null}
        {children}
      </div>
    </section>
  );
}