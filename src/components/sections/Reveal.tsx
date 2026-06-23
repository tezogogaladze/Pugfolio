import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  reveal?: "fade" | "rise" | "none";
  children: ReactNode;
}

/** Adds an IntersectionObserver-driven reveal once the block scrolls in. */
export default function Reveal({ reveal = "rise", children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}`}
      data-reveal={reveal}
    >
      {children}
    </div>
  );
}
