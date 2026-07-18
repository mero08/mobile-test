import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadHeroModel } from "@/lib/model3d";

preloadHeroModel();

createRoot(document.getElementById("root")!).render(<App />);
