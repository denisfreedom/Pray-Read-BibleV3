import { fse2 } from "@/api/fse2Client";
import { offline } from "@/lib/offlineDb";

// The annotations the reader makes in the sidebar: highlights and underlines
// on the book introduction, the outline headings, the book prayer and the
// verses opened from the sidebar.
//
// Every annotation is written twice: to the StudyAnnotation table for signed
// in readers, and to the offline store so the marks are still there for a
// guest or when the reader is offline.

export const annotationKey = (annotation) =>
  [
    annotation.book_number,
    annotation.section,
    annotation.block_id,
    annotation.kind,
    annotation.start_offset,
    annotation.end_offset
  ].join(":");

export const mergeAnnotations = (serverRows, localRows) => {
  const map = new Map();
  (serverRows || []).forEach((row) => {
    const key = annotationKey(row);
    map.set(key, { ...row, local_id: key });
  });
  (localRows || []).forEach((row) => {
    const key = annotationKey(row);
    if (!map.has(key)) map.set(key, { ...row, local_id: key });
  });
  return Array.from(map.values());
};

export const loadLocalAnnotations = async (bookNumber) => {
  try {
    const rows = await offline.getAll("annotations");
    return (rows || []).filter((row) => Number(row.book_number) === Number(bookNumber));
  } catch {
    return [];
  }
};

export const saveAnnotation = async (annotation) => {
  const key = annotationKey(annotation);
  let saved = null;
  if (annotation.owner_email) {
    try {
      saved = await fse2.entities.StudyAnnotation.create(annotation);
    } catch {
      saved = null;
    }
  }
  try {
    await offline.put("annotations", key, { ...annotation, local_id: key });
  } catch {
    // the annotation still lives on the server when the reader is signed in
  }
  return { ...annotation, ...(saved || {}), id: (saved && saved.id) || null, local_id: key };
};

export const removeAnnotation = async (annotation) => {
  const key = annotation.local_id || annotationKey(annotation);
  if (annotation.id) {
    try {
      await fse2.entities.StudyAnnotation.delete(annotation.id);
    } catch {
      // the offline copy is removed below either way
    }
  }
  try {
    await offline.remove("annotations", key);
  } catch {
    // nothing else to clean up
  }
};