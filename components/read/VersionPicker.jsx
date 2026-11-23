import React, { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, DownloadIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import {
  DEFAULT_INSTALLED_IDS,
  getVersionOrDefault,
  installVersion,
  listInstalledVersions,
  setActiveVersionId,
  uninstallVersion,
  VERSIONS
} from "@/lib/versions";

/**
 * The version switch of the reader.
 *
 * The reader moves between the versions installed on the device and can add
 * another one: the King James Version and the Luganda Bible come with the
 * app, and the other versions are installed when the reader asks for them.
 */
export default function VersionPicker({ versionId, onChange, busy = false }) {
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(() => listInstalledVersions());
  const containerRef = useRef(null);

  useEffect(() => {
    setInstalled(listInstalledVersions());
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      const target = event.target;
      const menu = document.querySelector(".pr-version-menu");
      if (containerRef.current && containerRef.current.contains(target)) return;
      if (menu && menu.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  const active = getVersionOrDefault(versionId);
  const others = VERSIONS.filter(
    (version) => !installed.some((item) => item.id === version.id)
  );

  const choose = (id) => {
    setActiveVersionId(id);
    setInstalled(listInstalledVersions());
    if (onChange) onChange(id);
    setOpen(false);
  };

  const remove = (id) => {
    const next = uninstallVersion(id);
    setInstalled(next);
    if (!next.some((version) => version.id === versionId)) {
      const fallback = next[0];
      if (fallback) {
        setActiveVersionId(fallback.id);
        if (onChange) onChange(fallback.id);
      }
    }
  };

  return (
    <div className="pr-version" ref={containerRef}>
      <button
        type="button"
        className="pr-chip pr-version-btn"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={`Reading in ${active.name}`}
      >
        {busy ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        <span translate="no">{active.short}</span>
        <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {open ? (
        <div className="pr-version-menu" role="menu">
          <p className="pr-version-menu-title">Installed versions</p>
          <p className="pr-version-menu-note">
            The King James Version and the Luganda Bible come with the app.
          </p>
          {installed.map((version) => (
            <div key={version.id} className="pr-version-row">
              <button
                type="button"
                className={`pr-version-option ${version.id === versionId ? "is-active" : ""}`}
                onClick={() => choose(version.id)}
                role="menuitemradio"
                aria-checked={version.id === versionId}
              >
                <span className="pr-version-short" translate="no">
                  {version.short}
                </span>
                <span className="pr-version-text">
                  <strong>{version.name}</strong>
                  <em>{version.note}</em>
                </span>
                {version.id === versionId ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
              {!DEFAULT_INSTALLED_IDS.includes(version.id) ? (
                <button
                  type="button"
                  className="pr-version-remove"
                  onClick={() => remove(version.id)}
                  aria-label={`Remove ${version.name}`}
                >
                  <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ))}

          {others.length ? (
            <>
              <p className="pr-version-menu-title">Install another version</p>
              {others.map((version) => (
                <button
                  key={version.id}
                  type="button"
                  className="pr-version-option"
                  onClick={() => setInstalled(installVersion(version.id))}
                  role="menuitem"
                >
                  <span className="pr-version-short" translate="no">
                    {version.short}
                  </span>
                  <span className="pr-version-text">
                    <strong>{version.name}</strong>
                    <em>{version.note}</em>
                  </span>
                  <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}