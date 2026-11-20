import { initNavigation } from "./navigation.js";
import { initPreview } from "./preview.js";
import { initTesting } from "./testing.js";
import { initResults } from "./results.js";
import { initHistory } from "./history.js";
import { initSettings } from "./settings.js";
import { toast } from "./state.js";
function initializeApp() {
  document.querySelector("#copyrightYear").textContent = new Date().getFullYear();
  initNavigation();
  initPreview();
  initTesting();
  initResults();
  initHistory();
  initSettings();
  document.addEventListener("error", event => { if (event.target?.id === "websiteFrame") toast("The preview could not be loaded. The website may block embedding or the network may be unavailable.","error"); }, true);
  if (!("localStorage" in window)) toast("Local storage is unavailable. History may not persist.","error");
  console.info("WebMotion initialized.");
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",initializeApp,{once:true}); else initializeApp();
