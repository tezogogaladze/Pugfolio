import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ScrollRootProps {
  children: ReactNode;
}

/**
 * ScrollSmoother needs #smooth-wrapper as a direct child of <body>.
 * Fixed UI (loader, sound toggle) stays in #root — outside the transform.
 */
export default function ScrollRoot({ children }: ScrollRootProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>,
    document.body
  );
}
