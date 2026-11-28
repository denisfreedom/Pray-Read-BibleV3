import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { DEVOTIONALS, VERSE_OF_THE_DAY } from "@/lib/seedContent";

import { toISODate, shiftISODate } from "@/lib/reading";
import {
  mergeWithBundledText,
  pickDailyDevotional,
  sortDevotionals
} from "@/lib/devotionals";
import { HOME_IMAGES } from "@/lib/homeImages";

import HomeHero from "@/components/home/HomeHero";
import HomeIntro from "@/components/home/HomeIntro";
import JourneySteps from "@/components/home/JourneySteps";
import VerseOfDayCard from "@/components/home/VerseOfDayCard";
import DailyDevotionalCard from "@/components/home/DailyDevotionalCard";
import VisionCards from "@/components/home/VisionCards";
import ExperiencePoints from "@/components/home/ExperiencePoints";
import SixWaysGrid from "@/components/home/SixWaysGrid";
import ExploreBible from "@/components/home/ExploreBible";
import ClosingInvite from "@/components/home/ClosingInvite";

import { HOME_CSS } from "@/lib/homeCss";

const DAY_MS = 86400000;

// The verse and devotional section sits on navy-light with a faint photograph.
const NOURISH_BACKGROUND = {
  backgroundImage: `linear-gradient(180deg, rgba(27, 41, 66, 0.93), rgba(17, 27, 48, 0.97)), url(${HOME_IMAGES.worship})`,
  backgroundSize: "cover",
  backgroundPosition: "center"
};

// Select one Scripture for the entire day.
function pickVerse(rows, today) {
  if (!rows?.length) return VERSE_OF_THE_DAY[0];

  const exact = rows.find(
    (row) => row.verse_date === today
  );

  if (exact) return exact;

  const dayNumber = Math.floor(
    Date.parse(today) / DAY_MS
  );

  return rows[
    ((dayNumber % rows.length) + rows.length) % rows.length
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  // Daily Scripture collection
  const { data: verseRows } = useQuery({
    queryKey: ["verseOfDay"],
    queryFn: () =>
      fetchPublicCollection("verseOfDay", {
        authenticated: isAuthenticated
      }),
    staleTime: 5 * 60 * 1000
  });

  // Daily devotional collection
  const { data: devotionalRows } = useQuery({
    queryKey: ["devotionals"],
    queryFn: () =>
      fetchPublicCollection("devotionals", {
        authenticated: isAuthenticated
      }),
    staleTime: 5 * 60 * 1000
  });

  const today = toISODate();

  const verse = useMemo(() => {
    const rows =
      verseRows?.length ? verseRows : VERSE_OF_THE_DAY;

    return pickVerse(rows, today);
  }, [verseRows, today]);

  const daily = useMemo(() => {
    const rows =
      devotionalRows?.length
        ? devotionalRows
        : DEVOTIONALS;

    return pickDailyDevotional(
      sortDevotionals(mergeWithBundledText(rows)),
      today,
      shiftISODate(today, -1)
    );
  }, [devotionalRows, today]);

  return (
    <main className="pr-home">
      <style>{HOME_CSS}</style>

      {/* 01. Hero */}
      <section className="pr-home-hero">
        <HomeHero />
      </section>

      {/* 02. Live Verse of the Day + Today's Devotional, side by side */}
      <section className="pr-section pr-scripture-section" style={NOURISH_BACKGROUND}>
        <div className="pr-container">
          <div className="pr-duo-grid">
            <VerseOfDayCard verse={verse} />
            <DailyDevotionalCard devotional={daily} today={today} />
          </div>
        </div>
      </section>

      {/* 03. What is Pray-Read Bible? */}
      <section className="pr-section pr-home-intro">
        <HomeIntro />
      </section>

      {/* 04. The Pray-Read Journey */}
      <section className="pr-section pr-journey-section">
        <JourneySteps />
      </section>

      {/* 05. Our Vision, Our Mission, Our Purpose */}
      <section className="pr-section pr-vision-section">
        <VisionCards />
      </section>

      {/* 06. What You Will Experience */}
      <section className="pr-section pr-experience-section">
        <ExperiencePoints />
      </section>

      {/* 07. Everything in one place */}
      <section className="pr-section pr-ways-section">
        <SixWaysGrid />
      </section>

      {/* 08. Explore the Bible Prayer Project */}
      <section className="pr-explore-section">
        <ExploreBible />
      </section>

      {/* 09. Begin Your Pray-Read Journey */}
      <section className="pr-closing-section">
        <ClosingInvite />
      </section>
    </main>
  );
}