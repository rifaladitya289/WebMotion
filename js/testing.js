import { state, toast } from "./state.js";
const toolNames = { responsive:"Responsive",animation:"Animation",interaction:"Interaction",transition:"Transition" };
function addResult(title,status,detail) { const item = { id: crypto.randomUUID?.() || String(Date.now()), title, status, detail, date: new Date().toISOString() }; state.results.unshift(item); document.dispatchEvent(new CustomEvent("webmotion:result-added",{detail:item})); }
function saveObservation(type) {
  const field = document.querySelector("#" + type + "Note");
  const note = field?.value.trim();
  if (!note) return toast("Write an observation before saving.", "error");
  const item = { id: crypto.randomUUID?.() || String(Date.now()), title: toolNames[type] + " manual observation", status:"warning", detail:note, date:new Date().toISOString() };
  state.notes.unshift(item); state.results.unshift(item); field.value = ""; toast("Observation saved to Results.", "success"); document.dispatchEvent(new CustomEvent("webmotion:result-added",{detail:item}));
}
export function initTesting() {
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
    if (input.checked) { const category = input.closest("#tool-transition") ? "Transition" : "Interaction"; addResult(category + " checklist: " + input.value, "warning", "Marked by the user as reviewed. This is a manual observation, not an automated verification."); }
  }));
}
