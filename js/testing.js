import { state, toast } from "./state.js";
const toolNames = { responsive:"Responsive",animation:"Animation",interaction:"Interaction",transition:"Transition" };
function addResult(title,status,detail) { const existing = state.results.findIndex(item => item.title === title); const item = { id: existing >= 0 ? state.results[existing].id : (crypto.randomUUID?.() || String(Date.now())), title, status, detail, date: new Date().toISOString() }; if (existing >= 0) state.results[existing] = item; else state.results.unshift(item); document.dispatchEvent(new CustomEvent("webmotion:result-added",{detail:item})); }
function saveObservation(type) {
  const field = document.querySelector("#" + type + "Note");
  const note = field?.value.trim();
  if (!note) return toast("Write an observation before saving.", "error");
  const item = { id: crypto.randomUUID?.() || String(Date.now()), title: toolNames[type] + " manual observation", status:"warning", detail:note, date:new Date().toISOString() };
  state.notes.unshift(item); state.results.unshift(item); field.value = ""; toast("Observation saved to Results.", "success"); document.dispatchEvent(new CustomEvent("webmotion:result-added",{detail:item}));
}
export function initTesting() {
  const timerDisplay = document.querySelector("#animationTimer");
  const timerStart = document.querySelector("#animationTimerStart");
  const timerStop = document.querySelector("#animationTimerStop");
  const timerReset = document.querySelector("#animationTimerReset");
  let timerStartedAt = 0;
  let timerElapsed = 0;
  let timerInterval = null;
  const renderTimer = () => {
    const total = timerElapsed + (timerStartedAt ? performance.now() - timerStartedAt : 0);
    const tenths = Math.floor(total / 100) % 10;
    const seconds = Math.floor(total / 1000);
    timerDisplay.textContent = String(Math.floor(seconds / 60)).padStart(2,"0") + ":" + String(seconds % 60).padStart(2,"0") + "." + tenths;
  };
  timerStart.addEventListener("click", () => {
    if (timerStartedAt) return;
    timerStartedAt = performance.now();
    timerStart.disabled = true;
    timerStop.disabled = false;
    timerInterval = window.setInterval(renderTimer,100);
  });
  timerStop.addEventListener("click", () => {
    if (!timerStartedAt) return;
    timerElapsed += performance.now() - timerStartedAt;
    timerStartedAt = 0;
    timerStart.disabled = false;
    timerStop.disabled = true;
    window.clearInterval(timerInterval);
    renderTimer();
    document.querySelector("#animationOutput").textContent = "Manual review timer stopped at " + timerDisplay.textContent + ". This is a user-timed observation, not automatic animation measurement.";
  });
  timerReset.addEventListener("click", () => {
    timerStartedAt = 0;
    timerElapsed = 0;
    timerStart.disabled = false;
    timerStop.disabled = true;
    window.clearInterval(timerInterval);
    renderTimer();
  });
  document.querySelectorAll("#animationReviewChecklist input").forEach(input => input.addEventListener("change", () => {
    const title = "Animation review: " + input.value;
    if (input.checked) addResult(title,"warning","Marked reviewed manually by the user. WebMotion cannot independently verify external animation behavior.");
    else {
      state.results = state.results.filter(item => item.title !== title);
      document.dispatchEvent(new CustomEvent("webmotion:refresh-results"));
    }
  }));
  document.querySelector("#openInteractionTarget").addEventListener("click", () => {
    if (!state.currentUrl) return toast("Load a website preview first.","error");
    window.open(state.currentUrl,"_blank","noopener,noreferrer");
    toast("Website opened in a separate tab for manual interaction testing.","info");
  });
  document.querySelectorAll(".tool-tab").forEach(button => button.addEventListener("click", () => {
    state.currentTool = button.dataset.tool;
    document.querySelectorAll(".tool-tab").forEach(tab => tab.classList.toggle("active", tab === button));
    document.querySelectorAll(".tool-panel").forEach(panel => panel.classList.toggle("hidden", panel.id !== "tool-" + state.currentTool));
  }));
  document.querySelector("#inspectAnimations").addEventListener("click", () => {
    const output = document.querySelector("#animationOutput");
    output.textContent = "Inspection unavailable for this preview. The iframe is sandboxed and external websites are isolated by browser security rules, so WebMotion cannot read their animation timeline. Use the website directly and save a manual observation.";
    addResult("Animation inspection", "warning", "Not automatically inspected: browser sandbox and cross-origin restrictions prevent safe DOM/timeline access.");
    toast("Animation inspection limitation recorded.");
  });
  document.querySelectorAll("[data-save-note]").forEach(button => button.addEventListener("click", () => saveObservation(button.dataset.saveNote)));
  document.querySelectorAll("#interactionChecklist input, #tool-transition .checklist input").forEach(input => input.addEventListener("change", () => {
    const category = input.closest("#tool-transition") ? "Transition" : "Interaction"; const title = category + " checklist: " + input.value; if (input.checked) addResult(title, "warning", "Marked by the user as reviewed. This is a manual observation, not an automated verification."); else { state.results = state.results.filter(item => item.title !== title); document.dispatchEvent(new CustomEvent("webmotion:refresh-results")); }
  }));
}
