import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// One-time cleanup: clear all tasks
localStorage.removeItem('mktg_tasks');

createRoot(document.getElementById("root")!).render(<App />);
