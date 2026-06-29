import SectionMenu from "./SectionMenu";
import SoundToggle from "./SoundToggle";
import "./SiteControls.css";

interface SiteControlsProps {
  soundOn: boolean;
  onSoundToggle: () => void;
}

/** Fixed top-right controls — outside ScrollSmoother so position:fixed is stable. */
export default function SiteControls({
  soundOn,
  onSoundToggle,
}: SiteControlsProps) {
  return (
    <div className="siteControls">
      <SoundToggle on={soundOn} onToggle={onSoundToggle} />
      <SectionMenu />
    </div>
  );
}
