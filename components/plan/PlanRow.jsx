import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckIcon, BookOpenIcon } from "lucide-react";
import { getBookNumber } from "@/lib/bibleBooks";

const STATUS_STYLES = {
  completed: { background: "rgba(29,64,53,0.12)", color: "var(--pr-emerald)" },
  current: { background: "rgba(233,201,129,0.28)", color: "var(--pr-gold-deep)" },
  upcoming: { background: "var(--pr-ivory-soft)", color: "var(--pr-body)" }
};

export default function PlanRow({ item, status }) {
  const number = getBookNumber(item.book);
  const target = number
    ? `${createPageUrl("Chapter")}?book=${number}&chapter=${item.chapter}`
    : createPageUrl("BibleReader");

  return (
    <div
      className="pr-card pr-card-pad"
      style={{ display: "flex", flexDirection: "column", gap: 14, borderLeft: `4px solid ${status === "completed" ? "var(--pr-emerald)" : "var(--pr-gold)"}` }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 12,
            fontWeight: 800,
            background: status === "completed" ? "var(--pr-emerald)" : "var(--pr-ivory-soft)",
            color: status === "completed" ? "#fff" : "var(--pr-body)"
          }}
        >
          {status === "completed" ? <CheckIcon className="h-5 w-5" /> : item.day}
        </span>
        <span className="pr-badge" style={STATUS_STYLES[status]}>
          {status}
        </span>
      </div>

      <div>
        <p className="pr-heading" style={{ margin: 0, fontWeight: 700 }}>{item.title}</p>
        <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--pr-gold-deep)", fontWeight: 700 }}>
          {item.scripture || `${item.book} ${item.chapter}`}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>{item.theme}</p>
        {item.focus ? (
          <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "var(--pr-body)" }}>{item.focus}</p>
        ) : null}
      </div>

      <Link to={target} className="pr-btn pr-btn-outline pr-btn-sm" style={{ alignSelf: "flex-start" }}>
        <BookOpenIcon className="h-4 w-4" />
        Open
      </Link>
    </div>
  );
}