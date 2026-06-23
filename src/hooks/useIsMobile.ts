import { useEffect, useState } from "react";

/**
 * Detects touch / small-screen devices. On these we run a lightweight path:
 * no per-screen videos (iOS Safari crashes when several decode at once), no
 * all-six preload, and the heavy GSAP zoom/blur is skipped. Mobile is an
 * intentional stub for now (a dedicated small-screen design comes later).
 */
function detect(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const w = window.innerWidth;
  return w < 768 || (coarse && w < 1024);
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(detect);

  useEffect(() => {
    const update = () => setIsMobile(detect());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return isMobile;
}
