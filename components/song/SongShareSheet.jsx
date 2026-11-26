import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { copyToClipboard, openShare, shareChannels } from "@/lib/share";
import { songShareText, songShareUrl } from "@/lib/verseSongs";

/**
 * The share sheet of a verse song. It carries the title of the song, the
 * passage it is built on and the link that opens it.
 */
export default function SongShareSheet({ song, onClose }) {
  const [copied, setCopied] = useState("");

  if (!song) return null;

  const url = songShareUrl(song);
  const body = songShareText(song);

  const copyEverything = async () => {
    const ok = await copyToClipboard(body);
    setCopied(ok ? "The song was copied." : "The song could not be copied.");
  };

  const shareWith = async (channel) => {
    if (channel === "copy") {
      await copyEverything();
      return;
    }
    openShare(channel, body, url);
  };

  return (
    <Modal
      open={!!song}
      onClose={onClose}
      title={song.title}
      subtitle={[song.seriesName, song.verseRef].filter(Boolean).join(" · ")}
      width={620}
      footer={
        <>
          <button type="button" className="pr-btn pr-btn-primary pr-btn-sm" onClick={copyEverything}>
            Copy the song
          </button>
          <button type="button" className="pr-btn pr-btn-outline pr-btn-sm" onClick={onClose}>
            Close
          </button>
        </>
      }
    >
      <div className="pr-share">
        <div className="pr-share-block">
          <p className="pr-share-label">The song as it is shared</p>
          <p className="pr-share-text" style={{ whiteSpace: "pre-wrap" }}>
            {body}
          </p>
        </div>

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