import { initNavigation } from "./navigation.js";
import { initPreview } from "./preview.js";
import { initTesting } from "./testing.js";
import { initResults } from "./results.js";
import { initHistory } from "./history.js";
import { initSettings } from "./settings.js";
import { initTour } from "./tour.js";
import { toast } from "./state.js";
function initializeApp() {
  document.querySelector("#copyrightYear").textContent = new Date().getFullYear();
  initNavigation();
  initPreview();
  initTesting();
  initResults();
  initHistory();
  initSettings();
  initTour();
  document.addEventListener("error", event => { if (event.target?.id === "websiteFrame") toast("The preview could not be loaded. The website may block embedding or the network may be unavailable.","error"); }, true);
  try { const testKey = "__webmotion_storage_test__"; window.localStorage.setItem(testKey, "1"); window.localStorage.removeItem(testKey); }
  catch { toast("Local storage is blocked. History and settings may not persist.", "error"); }
  console.info("WebMotion initialized.");
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",initializeApp,{once:true}); else initializeApp();
