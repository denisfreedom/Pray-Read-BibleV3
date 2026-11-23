// Helper used by the reader sidebar: a click should not fire when the reader
// was actually selecting text to highlight or underline it.

/**
 * True when the current text selection sits inside the given element. A tap
 * on a heading that the reader has just highlighted should not also open the
 * passage, while a tap somewhere else still works.
 */
export const selectionInside = (node) => {
  if (!node || typeof window === "undefined" || !window.getSelection) return false;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return false;
  const anchor = selection.anchorNode;
  const focus = selection.focusNode;
  return Boolean((anchor && node.contains(anchor)) || (focus && node.contains(focus)));
};