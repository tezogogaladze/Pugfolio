import { createRoot } from "react-dom/client";
import App from "./App";
import "@/scroll/gsapConfig";
import "./styles/global.css";

// ScrollSmoother + StrictMode do not mix — double-mount kills the smoother tween.
createRoot(document.getElementById("root")!).render(<App />);
