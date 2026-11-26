import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { copyToClipboard, openShare, shareChannels } from "@/lib/share";

// The networks that take a link and not a text. The passage is copied for
// them, so the reader can paste it into the post.
const LINK_ONLY = ["facebook", "linkedin", "instagram"];

/**
 * The share sheet of a verse.
 *
 * It carries everything the reader wants to pass on: the verse in the
 * language they are reading, the verse in the other language, the prayer
 * passage and the cross references. When the whole passage is written as one
 * text, that text is shown as it will be shared.
 */
export default function ShareSheet({ open, title, subtitle, sections = [], text = "", url, onClose }) {
  const [copied, setCopied] = useState("");

  if (!open) return null;

  const sectionBody = sections
    .filter((section) => section && section.text)
    .map((section) => `${section.label}\n${section.text}`)
    .join("\n\n");
  const body = text || (sectionBody ? `${sectionBody}\n\n${url}` : url);

  const copyEverything = async () => {
    const ok = await copyToClipboard(body);
    setCopied(ok ? "The whole passage was copied." : "The passage could not be copied.");
  };

  const shareWith = async (channel) => {
    if (channel === "copy") {
      await copyEverything();
      return;
    }
    if (LINK_ONLY.includes(channel)) {
      const ok = await copyToClipboard(body);
      setCopied(
        ok
          ? "The passage was copied  -  paste it into your post."
          : "The passage could not be copied."
      );
      openShare(channel, body, url);
      return;
    }
    openShare(channel, body, url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={620}
      footer={
        <>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={copyEverything}>
            Copy the whole passage
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={onClose}>
            Close
          </button>
        </>
      }
    >
      <div className="pr-share">
        {text ? (
          <section className="pr-share-block">
            <p className="pr-share-label">The passage as it is shared</p>
            <p className="pr-share-text" style={{ whiteSpace: "pre-wrap" }}>
              {text}
            </p>
          </section>
        ) : (
          sections
            .filter((section) => section && section.text)
            .map((section) => (
              <section key={section.label} className="pr-share-block">
                <p className="pr-share-label">{section.label}</p>
                <p className="pr-share-text">{section.text}</p>
              </section>
            ))
        )}

        <div className="pr-share-channels">
          {shareChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className="pr-btn pr-btn-outline pr-btn-sm"
              onClick={() => shareWith(channel.id)}
            >
              {channel.label}
            </button>
          ))}
        </div>

        {copied ? <p className="pr-share-copied">{copied}</p> : null}
        <p className="pr-share-link">
          <span>Link:</span> {url}
        </p>
      </div>
    </Modal>
  );
}