import React, { useState } from "react";
import { CheckIcon, CopyIcon, Link2Icon, Share2Icon } from "lucide-react";
import Modal from "@/components/common/Modal";
import {
  WhatsappIcon,
  FacebookIcon,
  TwitterXIcon,
  TelegramIcon,
  EmailIcon
} from "@/components/common/BrandIcons";
import { canNativeShare, copyToClipboard, openShare, shareChannels } from "@/lib/share";

// The networks that take a link and not a text. The passage is copied for
// them, so the reader can paste it into the post.
const LINK_ONLY = ["facebook", "linkedin", "instagram"];

// The mark of every network the share sheet offers.
const ICONS = {
  whatsapp: WhatsappIcon,
  facebook: FacebookIcon,
  x: TwitterXIcon,
  telegram: TelegramIcon,
  email: EmailIcon,
  link: Link2Icon,
  text: CopyIcon,
  native: Share2Icon,
  copy: Link2Icon
};

/**
 * The share sheet of a verse, a chapter or a devotional.
 *
 * It carries everything the reader wants to pass on: the passage in the
 * language they are reading, the passage in the other language, the prayer
 * passage and the cross references. When the whole passage is written as one
 * text, that text is shown as it will be shared.
 */
export default function ShareSheet({
  open,
  title,
  subtitle,
  sections = [],
  text = "",
  url,
  preview = null,
  channels = null,
  subject = "",
  onClose
}) {
  const [copied, setCopied] = useState("");
  const [done, setDone] = useState("");

  if (!open) return null;

  const list = channels || shareChannels;
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
    if (channel === "copyLink") {
      const ok = await copyToClipboard(url);
      setCopied(ok ? "Link copied ✓" : "The link could not be copied.");
      return;
    }
    if (channel === "copyText") {
      const ok = await copyToClipboard(body);
      setCopied(ok ? "Text copied ✓" : "The text could not be copied.");
      return;
    }
    if (channel === "copy") {
      await copyEverything();
      return;
    }
    if (channel === "native") {
      if (!canNativeShare()) {
        const ok = await copyToClipboard(body);
        setCopied(ok ? "The passage was copied  -  paste it anywhere." : "The passage could not be copied.");
        return;
      }
      const shared = await openShare(channel, body, url, { subject });
      if (shared) setDone("Shared  -  thank you for spreading the Word.");
      return;
    }
    if (channel === "email") {
      await openShare(channel, body, url, { subject });
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
    setDone("Shared  -  thank you for spreading the Word.");
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
        {preview ? (
          <section className="pr-share-preview">
            {preview.image ? (
              <img className="pr-share-preview-image" src={preview.image} alt={preview.title || ""} />
            ) : null}
            <div className="pr-share-preview-text">
              {preview.title ? <p className="pr-share-preview-title">{preview.title}</p> : null}
              {preview.line ? <p className="pr-share-preview-line">{preview.line}</p> : null}
              {preview.link ? <p className="pr-share-preview-link">{preview.link}</p> : null}
            </div>
          </section>
        ) : null}

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
          {list.map((channel) => {
            if (channel.phoneOnly && !canNativeShare()) return null;
            const Icon = ICONS[channel.icon] || null;
            return (
              <button
                key={channel.id}
                type="button"
                className="pr-btn pr-btn-outline pr-btn-sm pr-share-channel"
                onClick={() => shareWith(channel.id)}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {channel.label}
              </button>
            );
          })}
        </div>

        {copied ? (
          <p className="pr-share-copied">
            <CheckIcon className="h-4 w-4" style={{ display: "inline" }} /> {copied}
          </p>
        ) : null}
        {done ? <p className="pr-share-copied">{done}</p> : null}
        <p className="pr-share-link">
          <span>Link:</span> {url}
        </p>
      </div>
    </Modal>
  );
}