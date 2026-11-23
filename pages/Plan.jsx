import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCollection } from "@/lib/contentApi";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_DAYS } from "@/lib/planData";
import PlanRow from "@/components/plan/PlanRow";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { CalendarDaysIcon, FlameIcon } from "lucide-react";
import { fse2 } from "@/api/fse2Client";


export default function Plan() {
  const { user } = useAuth();
  const email = user?.email || null;

  const { data: planRows, isLoading: planLoading } = useQuery({
    queryKey: ["readingPlan"],
    queryFn: () => fetchPublicCollection("plan", { authenticated: !!email })
  });

  const { data: readingRows, isLoading: readingsLoading } = useQuery({
    queryKey: ["readings", email],
    queryFn: () => fse2.entities.Reading.list("-updated_date", 300),
    enabled: !!email
  });

  const plan = useMemo(() => {
    const rows = (planRows || []).slice().sort((a, b) => (a.day || 0) - (b.day || 0));
    return rows.length > 0 ? rows : PLAN_DAYS;
  }, [planRows]);

  const completedDays = useMemo(() => {
    const set = new Set();
    if (!email) return set;
    (readingRows || [])
      .filter((row) => row.owner_email === email && row.status === "completed" && row.plan_day)
      .forEach((row) => set.add(row.plan_day));
    return set;
  }, [readingRows, email]);

  const currentDay = useMemo(() => {
    const next = plan.find((item) => !completedDays.has(item.day));
    return next ? next.day : null;
  }, [plan, completedDays]);

  const progress = plan.length ? Math.round((completedDays.size / plan.length) * 100) : 0;

  if (planLoading || readingsLoading) {
    return <Spinner label="Loading the reading plan" />;
  }

  return (
    <div>
      <section className="pr-section-tight" style={{ background: "var(--pr-emerald)" }}>
        <div className="pr-container">
          <span className="pr-eyebrow pr-eyebrow-light">Reading plan</span>
          <h1 className="pr-serif" style={{ margin: "10px 0 0", color: "#fff", fontSize: "2.1rem" }}>
            Thirty days in John and the Psalms
          </h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.8)", maxWidth: "58ch" }}>
            One chapter a day. Read it slowly, write what it stirred up, and carry it into prayer.
          </p>
        </div>
      </section>

      <div className="pr-container pr-section">
        <div className="pr-card pr-card-pad" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <p style={{ margin: 0, fontWeight: 700, color: "var(--pr-heading)" }}>
              {completedDays.size} of {plan.length} days complete
            </p>
            <p style={{ margin: 0, fontWeight: 800, color: "var(--pr-gold-deep)" }}>
              <FlameIcon className="h-4 w-4" style={{ display: "inline" }} /> {progress}%
            </p>
          </div>
          <div className="pr-progress" style={{ background: "var(--pr-ivory-soft)", marginTop: 12 }}>
            <span className="pr-progress-fill" style={{ width: `${progress}%`, background: "var(--pr-emerald)" }} />
          </div>
          {currentDay ? (
            <p style={{ margin: "12px 0 0", fontSize: "0.85rem" }}>
              Today&apos;s chapter is day {currentDay}. Open it and read with your notes beside you.
            </p>
          ) : (
            <p style={{ margin: "12px 0 0", fontSize: "0.85rem" }}>
              You have finished the thirty-day journey. Start another reading whenever you are ready.
            </p>
          )}
        </div>

        {plan.length === 0 ? (
          <EmptyState
            icon={CalendarDaysIcon}
            title="The plan is not available yet"
            description="The 30 day journey through the Gospel of John and the Psalms will appear here shortly."
          />
        ) : (
          <div className="pr-grid pr-grid-2">
            {plan.map((item) => {
              const status = completedDays.has(item.day)
                ? "completed"
                : item.day === currentDay
                  ? "current"
                  : "upcoming";
              return <PlanRow key={item.id || `day-${item.day}`} item={item} status={status} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}