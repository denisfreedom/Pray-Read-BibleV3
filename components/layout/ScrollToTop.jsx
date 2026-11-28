import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Opens every new page or book/chapter selection at the top of the page.
// Changes to the verse parameter are left alone so deep links still scroll to their verse.
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const book = params.get("book") || "";
  const chapter = params.get("chapter") || "";

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, book, chapter]);

  return null;
}