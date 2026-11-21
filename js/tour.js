import { showWorkspace } from "./navigation.js";

const STORAGE_KEY = "webmotion_product_tour_v1";
const steps = [
  {
    view: "overview",
    target: "#urlForm",
    title: "Start with a website URL",
    description: "WebMotion begins with a website address. Enter a public URL you are allowed to review, then load it into your workspace.",
    instruction: "Try entering a URL and submit the form. A site may still block iframe embedding; that is a browser restriction, not a tutorial failure.",
    complete: "webmotion:url-loaded"
  },
  {
    view: "preview",
    target: '#view-preview .device-button[data-device="mobile"]',
    title: "Explore device previews",
    description: "Switch the preview between desktop, laptop, tablet, and mobile viewport sizes.",
    instruction: "Select the Mobile device button to see how the preview viewport changes.",
    selector: '#view-preview .device-button[data-device="mobile"]'
  },
  {
    view: "testing",
    target: '#tool-responsive [data-preset="mobile"]',
    title: "Try a responsive preset",
    description: "Testing Tools gives you quick viewport presets and manual review tools for responsive layouts, animation, interaction, and transitions.",
    instruction: "Choose the Mobile preset. WebMotion applies the viewport but does not claim that the target website passed a responsive test.",
    selector: '#tool-responsive [data-preset="mobile"]'
  },
  {
    view: "results",
    target: "#saveSession",
    title: "Save your testing session",
    description: "Results collects recorded checks and manual observations. Saving creates a local session on this device.",
    instruction: "Select Save session. This creates a history entry that you can reopen later.",
    complete: "webmotion:session-saved"
  },
  {
    view: "history",
    target: '#view-history [data-reopen]',
    title: "Find your saved session",
    description: "History stores recent sessions in this browser. It is local to this device and does not sync to an account.",
    instruction: "You have arrived at History. Find the session you just saved; you can reopen it whenever you need.",
    selector: '[data-view="history"]'
  },
  {
    view: "settings",
    target: "#reduceMotion",
    title: "Personalize your workspace",
    description: "Settings includes confirmation before clearing history, reduced motion, and local data export.",
    instruction: "Try switching Reduce motion on or off. Your choice is saved locally and remains yours after the tour.",
    change: "#reduceMotion"
  },
  {
    view: "help",
    title: "Help is always available",
    description: "Help & Feedback explains browser preview limitations and lets you prepare feedback. You can restart this tour here at any time.",
    instruction: "You are at Help & Feedback. Select Finish tour when you are ready.",
    finishStep: true
  }
];

let layer;
let panel;
let currentIndex = 0;
let active = false;
let offerShown = false;

function readProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; }
  catch { return {}; }
}
function saveProgress(patch) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readProgress(), ...patch })); }
  catch { /* The tour remains usable for this visit if storage is unavailable. */ }
}
function clearSpotlight() {
  document.querySelectorAll(".tour-spotlight").forEach(node => node.classList.remove("tour-spotlight"));
}
function ensureLayer() {
  if (layer) return;
  layer = document.createElement("div");
  layer.className = "tour-layer";
  layer.innerHTML = '<div class="tour-scrim" aria-hidden="true"></div><section class="tour-panel" role="dialog" aria-modal="true" aria-labelledby="tourTitle" aria-describedby="tourDescription"></section>';
  document.body.append(layer);
  panel = layer.querySelector(".tour-panel");
  layer.addEventListener("click", event => {
    if (event.target.classList.contains("tour-scrim")) {
      if (active) skipTour();
      else closeOffer();
    }
  });
}
function closeLayer() {
  clearSpotlight();
  layer?.remove();
  layer = null;
  panel = null;
}
function closeOffer() {
  closeLayer();
  saveProgress({ offered: true });
}
function renderOffer() {
  ensureLayer();
  panel.innerHTML = '<span class="tour-kicker">WELCOME TO WEBMOTION</span><h2 id="tourTitle">Want a guided first look?</h2><p id="tourDescription">Take a short, interactive tour. You will try the main workflow yourself, one step at a time.</p><div class="tour-offer-actions"><button type="button" class="tour-button tour-button-primary" data-tour-start>Start interactive tour</button><button type="button" class="tour-button tour-button-quiet" data-tour-dismiss>Maybe later</button></div><p class="tour-footnote">You can restart the tour anytime from Help &amp; Feedback.</p>';
  panel.querySelector("[data-tour-start]").addEventListener("click", startTour);
  panel.querySelector("[data-tour-dismiss]").addEventListener("click", closeOffer);
  panel.querySelector("[data-tour-start]").focus();
}
function renderStep(step) {
  ensureLayer();
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100);
  panel.innerHTML = '<div class="tour-panel-top"><span class="tour-kicker">INTERACTIVE PRODUCT TOUR</span><button class="tour-close" type="button" aria-label="Skip tutorial">×</button></div><div class="tour-progress-meta"><span>STEP ' + String(currentIndex + 1).padStart(2,"0") + ' / ' + String(steps.length).padStart(2,"0") + '</span><span>' + progress + '%</span></div><div class="tour-progress"><span style="width:' + progress + '%"></span></div><h2 id="tourTitle"></h2><p id="tourDescription"></p><div class="tour-instruction"><strong>Your task</strong><p></p></div><div class="tour-panel-actions"><button type="button" class="tour-button tour-button-quiet" data-tour-back ' + (currentIndex === 0 ? "disabled" : "") + '>Back</button><button type="button" class="tour-button tour-button-primary" data-tour-skip>Skip tour</button>' + (step.finishStep ? '<button type="button" class="tour-button tour-button-primary" data-tour-finish-step>Finish tour</button>' : '') + '</div><p class="tour-footnote">' + (step.finishStep ? 'You can replay this tour anytime from this page.' : 'Complete the highlighted action to continue automatically.') + '</p>';
  panel.querySelector("#tourTitle").textContent = step.title;
  panel.querySelector("#tourDescription").textContent = step.description;
  panel.querySelector(".tour-instruction p").textContent = step.instruction;
  panel.querySelector(".tour-close").addEventListener("click", skipTour);
  panel.querySelector("[data-tour-skip]").addEventListener("click", skipTour);
  panel.querySelector("[data-tour-back]").addEventListener("click", goBack);
  panel.querySelector("[data-tour-finish-step]")?.addEventListener("click", finishTour);
  clearSpotlight();
  const target = document.querySelector(step.target);
  if (target) {
    target.classList.add("tour-spotlight");
    target.scrollIntoView({ block: "center", behavior: document.body.classList.contains("reduce-motion") ? "auto" : "smooth" });
  }
}
function showCurrentStep() {
  const step = steps[currentIndex];
  showWorkspace(step.view);
  renderStep(step);
}
function startTour() {
  closeLayer();
  active = true;
  currentIndex = 0;
  saveProgress({ offered: true, completed: false, skipped: false });
  showCurrentStep();
}
function skipTour() {
  active = false;
  saveProgress({ offered: true, skipped: true });
  closeLayer();
}
function finishTour() {
  active = false;
  saveProgress({ offered: true, completed: true, skipped: false, completedAt: new Date().toISOString() });
  ensureLayer();
  clearSpotlight();
  panel.innerHTML = '<span class="tour-kicker">TOUR COMPLETED</span><h2 id="tourTitle">You are ready to explore.</h2><p id="tourDescription">You have completed the WebMotion introduction. Your sessions and preferences remain stored locally on this device.</p><button type="button" class="tour-button tour-button-primary" data-tour-finish>Back to workspace</button><p class="tour-footnote">You can replay the interactive tour from Help &amp; Feedback.</p>';
  panel.querySelector("[data-tour-finish]").addEventListener("click", closeLayer);
  panel.querySelector("[data-tour-finish]").focus();
}
function goBack() {
  if (!active || currentIndex === 0) return;
  currentIndex -= 1;
  showCurrentStep();
}
function completeStep() {
  if (!active) return;
  if (steps[currentIndex].finishStep) finishTour();
  else if (currentIndex < steps.length - 1) {
    currentIndex += 1;
    showCurrentStep();
  } else finishTour();
}
function matchesClick(event, selector) {
  const target = event.target instanceof Element ? event.target.closest(selector) : null;
  return Boolean(target);
}
function handleClick(event) {
  if (!active) return;
  const step = steps[currentIndex];
  if (!step.selector || !matchesClick(event, step.selector)) return;
  window.setTimeout(completeStep, 0);
}
function handleCustomEvent(event) {
  if (!active) return;
  const step = steps[currentIndex];
  if (step.complete === event.type) completeStep();
}
function handleChange(event) {
  if (!active) return;
  const step = steps[currentIndex];
  if (step.change && event.target?.matches(step.change)) completeStep();
}
export function initTour() {
  document.addEventListener("click", handleClick, true);
  document.addEventListener("change", handleChange, true);
  document.addEventListener("webmotion:url-loaded", handleCustomEvent);
  document.addEventListener("webmotion:session-saved", handleCustomEvent);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && layer) { if (active) skipTour(); else closeOffer(); } });
  document.querySelectorAll("#startTourButton, #startTourOverview").forEach(button => button.addEventListener("click", startTour));
  const progress = readProgress();
  if (!progress.offered && !progress.completed) {
    window.setTimeout(() => {
      if (!active && !offerShown) {
        offerShown = true;
        renderOffer();
      }
    }, 900);
  }
}
