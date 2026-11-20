import { state, STORAGE_KEYS, readJSON, writeJSON, toast } from "./state.js";
export function initSettings() {
  const settings = readJSON(STORAGE_KEYS.settings,{confirmClear:true,reduceMotion:false});
  const confirmClear = document.querySelector("#confirmClear");
  const reduceMotion = document.querySelector("#reduceMotion");
  confirmClear.checked = settings.confirmClear !== false;
  reduceMotion.checked = settings.reduceMotion === true;
  document.body.classList.toggle("reduce-motion", reduceMotion.checked);
  const save = () => { const next = {confirmClear:confirmClear.checked,reduceMotion:reduceMotion.checked}; writeJSON(STORAGE_KEYS.settings,next); document.body.classList.toggle("reduce-motion",next.reduceMotion); };
  confirmClear.addEventListener("change",save); reduceMotion.addEventListener("change",save);
  document.querySelector("#exportData").addEventListener("click", () => {
    const payload = { exportedAt:new Date().toISOString(), currentUrl:state.currentUrl, currentResults:state.results, currentNotes:state.notes, history:state.history, settings:readJSON(STORAGE_KEYS.settings,{}) };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href=url; link.download="webmotion-local-data.json"; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); toast("Local data export prepared.","success");
  });
  document.querySelector("#feedbackForm").addEventListener("submit",event => {
    event.preventDefault();
    const type = document.querySelector("#feedbackType").value;
    const message = document.querySelector("#feedbackMessage").value.trim();
    if (!message) return toast("Write a feedback message first.","error");
    const subject = encodeURIComponent("WebMotion feedback: " + type);
    const body = encodeURIComponent(message + "\n\nWebMotion version: initial build");
    window.location.href = "mailto:?subject=" + subject + "&body=" + body;
  });
}
