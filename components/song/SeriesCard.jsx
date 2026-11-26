import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * One series on the series index. It shows the series the administrator
 * named, how many songs it holds, and opens the songs of that series.
 */
export default function SeriesCard({ series, songCount }) {
  return (
    <Link
      to={`${createPageUrl("VerseSongSeries")}?series=${encodeURIComponent(series.id)}`}
      className="pr-vs-series-card"
    >
      <img className="pr-vs-series-cover" src={series.cover} alt="" loading="lazy" />
      <div className="pr-vs-series-body">
        <h3 className="pr-vs-series-name">{series.name}</h3>
        {series.description ? (
          <p className="pr-vs-series-text">{series.description}</p>
        ) : null}
        <p className="pr-vs-series-count">
          {songCount} {songCount === 1 ? "song" : "songs"}
        </p>
        <span className="pr-vs-series-open">Open Series →</span>
      </div>
    </Link>
  );
}