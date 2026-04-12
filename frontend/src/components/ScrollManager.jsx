// src/components/ScrollManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_KEY = "scroll-position";

const ScrollManager = () => {
  const { pathname } = useLocation();

  // Save scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(
        `${SCROLL_KEY}-${pathname}`,
        window.scrollY.toString(),
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Restore AFTER content loads
  useEffect(() => {
    const saved = sessionStorage.getItem(`${SCROLL_KEY}-${pathname}`);

    // small delay to wait for DOM + API content
    const restoreScroll = () => {
      if (!saved) {
        window.scrollTo(0, 0);
        return;
      }

      const savedY = parseInt(saved, 10);

      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const isNearBottom = savedY + viewportHeight >= scrollHeight - 100;

      if (isNearBottom) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, savedY);
      }
    };

    const timeout = setTimeout(restoreScroll, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollManager;
