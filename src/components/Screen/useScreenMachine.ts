import { useCallback, useReducer } from "react";

/** CRT screen power — instant on/off (no powering-* animation states). */
export type ScreenState = "off" | "on";

type Event = "REQUEST_ON" | "REQUEST_OFF";

function reducer(state: ScreenState, event: Event): ScreenState {
  switch (event) {
    case "REQUEST_ON":
      return state === "off" ? "on" : state;
    case "REQUEST_OFF":
      return state === "on" ? "off" : state;
    default:
      return state;
  }
}

export interface ScreenMachine {
  state: ScreenState;
  requestOn: () => void;
  requestOff: () => void;
}

export function useScreenMachine(initial: ScreenState = "off"): ScreenMachine {
  const [state, dispatch] = useReducer(reducer, initial);

  const requestOn = useCallback(() => dispatch("REQUEST_ON"), []);
  const requestOff = useCallback(() => dispatch("REQUEST_OFF"), []);

  return { state, requestOn, requestOff };
}
