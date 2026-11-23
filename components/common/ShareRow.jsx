import React, { useState } from "react";
import { CheckIcon, Share2Icon } from "lucide-react";
import { openShare, shareChannels } from "@/lib/share";

export default function ShareRow({ text, url, label = "Share" }) {
  const [copied, setCopied] = useState(false);

  const handle = async (channel) => {
    const done = await openShare(channel, text, url);
    if (done) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--pr-gold-deep)"
        }}
      >
        <Share2Icon className="h-4 w-4" />
        {label}
      </span>
      {shareChannels.map((channel) => (
        <button
          key={channel.id}
          type="button"
          className="pr-chip"
          onClick={() => handle(channel.id)}
          style={{ cursor: "pointer" }}
        >
          {channel.id === "copy" && copied ? <CheckIcon className="h-4 w-4" /> : null}
          {channel.id === "copy" && copied ? "Copied" : channel.label}
        </button>
      ))}
    </div>
  );
}