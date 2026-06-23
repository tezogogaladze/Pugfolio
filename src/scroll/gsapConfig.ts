import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

// Dev console: ScrollSmoother.get() / ScrollTrigger.getAll()
if (import.meta.env.DEV) {
  Object.assign(window, { gsap, ScrollTrigger, ScrollSmoother });
}

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother };

declare global {
  interface Window {
    gsap?: typeof gsap;
    ScrollTrigger?: typeof ScrollTrigger;
    ScrollSmoother?: typeof ScrollSmoother;
  }
}
