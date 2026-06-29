import "./SoundToggle.css";

interface SoundToggleProps {
  on: boolean;
  onToggle: () => void;
}

function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 9v6h4l5 5V4L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"
      />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 9v6h4l5 5V4L8 9H4zm15.66 3 2.17-2.17-1.41-1.41L18.24 10.6 16.07 8.4 14.66 9.8 16.83 12l-2.17 2.17 1.41 1.41 2.17-2.17 2.17 2.17 1.41-1.41L19.66 12z"
      />
    </svg>
  );
}

/**
 * Global sound on/off control. Default is off (videos muted).
 */
export default function SoundToggle({ on, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="ctrlBtn soundToggle"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      data-on={on}
    >
      {on ? <SpeakerOn /> : <SpeakerOff />}
    </button>
  );
}
