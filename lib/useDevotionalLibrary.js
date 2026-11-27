import { useCallback, useEffect, useState } from "react";
import { fse2 } from "@/api/fse2Client";
import { useAuth } from "@/lib/AuthContext";
import {
  devotionalKey,
  readReadDevotionals,
  readSavedDevotionals,
  writeReadDevotionals,
  writeSavedDevotionals
} from "@/lib/devotionals";
import { toISODate } from "@/lib/reading";

/**
 * The reader's own devotional library.
 *
 * The devotionals the reader saved and the ones they marked as read are
 * kept in this browser, so the library works without an account. When the
 * reader is signed in the same marks are written to the app as well, so
 * they follow the reader to another device.
 */
export default function useDevotionalLibrary() {
  const { user, isAuthenticated } = useAuth();
  const [saved, setSaved] = useState([]);
  const [read, setRead] = useState([]);

  useEffect(() => {
    setSaved(readSavedDevotionals());
    setRead(readReadDevotionals());
  }, []);

  const isSaved = useCallback((row) => saved.includes(devotionalKey(row)), [saved]);
  const isRead = useCallback((row) => read.includes(devotionalKey(row)), [read]);

  const toggleSave = useCallback(
    async (row) => {
      const key = devotionalKey(row);
      const wasSaved = saved.includes(key);
      const next = wasSaved ? saved.filter((item) => item !== key) : [...saved, key];
      setSaved(next);
      writeSavedDevotionals(next);

      if (isAuthenticated && user && user.email) {
        try {
          const rows = await fse2.entities.DevotionalSaved.list("-updated_date", 300);
          const existing = (rows || []).find(
            (item) => item.owner_email === user.email && item.devotional_code === key
          );
          if (wasSaved) {
            if (existing) await fse2.entities.DevotionalSaved.delete(existing.id);
          } else if (!existing) {
            await fse2.entities.DevotionalSaved.create({
              owner_email: user.email,
              devotional_code: key,
              saved_date: toISODate()
            });
          }
        } catch {
          // The copy in this browser is already saved.
        }
      }
      return !wasSaved;
    },
    [saved, isAuthenticated, user]
  );

  const markRead = useCallback(
    async (row) => {
      const key = devotionalKey(row);
      const wasRead = read.includes(key);
      const next = wasRead ? read.filter((item) => item !== key) : [...read, key];
      setRead(next);
      writeReadDevotionals(next);

      if (isAuthenticated && user && user.email) {
        try {
          const rows = await fse2.entities.DevotionalProgress.list("-updated_date", 300);
          const existing = (rows || []).find(
            (item) => item.owner_email === user.email && item.devotional_code === key
          );
          if (wasRead) {
            if (existing) await fse2.entities.DevotionalProgress.delete(existing.id);
          } else if (!existing) {
            await fse2.entities.DevotionalProgress.create({
              owner_email: user.email,
              devotional_code: key,
              completed_date: toISODate()
            });
          }
        } catch {
          // The copy in this browser is already marked.
        }
      }
      return !wasRead;
    },
    [read, isAuthenticated, user]
  );

  return { saved, read, isSaved, isRead, toggleSave, markRead };
}