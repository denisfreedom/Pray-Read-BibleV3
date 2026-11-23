import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { copyToClipboard, openShare, shareChannels } from "@/lib/share";

/**
 * The share sheet of a verse.
 *
 * It carries everything the reader wants to pass on: the verse in the
 * language they are reading, the verse in the other language, the prayer
 * passage and the cross references.
 */
export default function ShareSheet({ open, title, subtitle, sections = [], url, onClose }) {
  const [copied, setCopied] = useState("");

  if (!open) return null;

  const body = sections
    .filter((section) => section && section.text)
    .map((section) => `${section.label}\n${section.text}`)
    .join("\n\n");
  const full = body ? `${body}\n\n${url}` : url;

  const copyEverything = async () => {
    const ok = await copyToClipboard(full);
    setCopied(ok ? "The whole passage was copied." : "The passage could not be copied.");
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
        {sections
          .filter((section) => section && section.text)
          .map((section) => (
            <section key={section.label} className="pr-share-block">
              <p className="pr-share-label">{section.label}</p>
              <p className="pr-share-text">{section.text}</p>
            </section>
          ))}

        <div className="pr-share-channels">
          {shareChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className="pr-btn pr-btn-outline pr-btn-sm"
              onClick={() => openShare(channel.id, body, url)}
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