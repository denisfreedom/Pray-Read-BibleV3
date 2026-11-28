import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpenIcon } from "lucide-react";
import { HOME_IMAGES } from "@/lib/homeImages";

export default function ExploreBible() {
  return (
    <div className="pr-explore-band" style={{ backgroundImage: `url(${HOME_IMAGES.worship})` }}>
      <div className="pr-container">
        <h2 className="pr-section-title">Explore the Bible Prayer Project</h2>
        <Link to={createPageUrl("BibleReader")} className="pr-btn pr-btn-gold" style={{ marginTop: 26 }}>
          <BookOpenIcon className="h-4 w-4" />
          Explore the Bible Prayer Project
        </Link>
      </div>
    </div>
  );
}