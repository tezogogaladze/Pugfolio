import { useCallback, useReducer } from "react";

/**
 * Finite state machine for a CRT screen:
 *   off -> powering-on -> on -> powering-off -> off
 *
 * Intent triggers (hover, focus, scroll-force) all map to requestOn/requestOff,
 * so there is no hover-only logic. The transient `powering-*` states own the
 * GSAP animations; `animDone()` is called from the timeline onComplete to
 * settle into a steady state. Interrupts are allowed (leaving mid power-on
 * starts power-off immediately, and vice versa).
 */
export type ScreenState = "off" | "powering-on" | "on" | "powering-off";

type Event = "REQUEST_ON" | "REQUEST_OFF" | "ANIM_DONE";

function reducer(state: ScreenState, event: Event): ScreenState {
  switch (event) {
    case "REQUEST_ON":
      return state === "off" || state === "powering-off"
        ? "powering-on"
        : state;
    case "REQUEST_OFF":
      return state === "on" || state === "powering-on"
        ? "powering-off"
        : state;
    case "ANIM_DONE":
      if (state === "powering-on") return "on";
      if (state === "powering-off") return "off";
      return state;
    default:
      return state;
  }
}

export interface ScreenMachine {
  state: ScreenState;
  requestOn: () => void;
  requestOff: () => void;
  animDone: () => void;
}

export function useScreenMachine(initial: ScreenState = "off"): ScreenMachine {
  const [state, dispatch] = useReducer(reducer, initial);

  const requestOn = useCallback(() => dispatch("REQUEST_ON"), []);
  const requestOff = useCallback(() => dispatch("REQUEST_OFF"), []);
  const animDone = useCallback(() => dispatch("ANIM_DONE"), []);

  return { state, requestOn, requestOff, animDone };
}
