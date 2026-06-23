/**
 * Isolated, OPTIONAL WebGL enhancement layer (not a dependency).
 *
 * The shipped baseline uses pure CSS 2.5D for the center-screen zoom and CRT
 * treatment. If/when a true-depth refraction upgrade is wanted, install
 * @react-three/fiber + three and implement the center-screen shader here, then
 * flip ENABLE_WEBGL. Nothing else in the app imports three, so the bundle stays
 * lean until this is turned on.
 */
export const ENABLE_WEBGL = false;

export default function CenterScreenGL() {
  return null;
}
