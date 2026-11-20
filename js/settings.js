import { state, STORAGE_KEYS, readJSON, writeJSON, toast } from "./state.js";
export function initSettings() {
  const settings = readJSON(STORAGE_KEYS.settings,{confirmClear:true,reduceMotion:false});
  const confirmClear = document.querySelector("#confirmClear");
  const reduceMotion = document.querySelector("#reduceMotion");
  confirmClear.checked = settings.confirmClear !== false;
  reduceMotion.checked = settings.reduceMotion === true;
  document.body.classList.toggle("reduce-motion", reduceMotion.checked);
  const save = () => { const next = {confirmClear:confirmClear.checked,reduceMotion:reduceMotion.checked}; if (!writeJSON(STORAGE_KEYS.settings,next)) toast("Settings could not be saved in this browser.", "error"); document.body.classList.toggle("reduce-motion",next.reduceMotion); };
  confirmClear.addEventListener("change",save); reduceMotion.addEventListener("change",save);
  document.querySelector("#exportData").addEventListener("click", () => {
    const payload = { exportedAt:new Date().toISOString(), currentUrl:state.currentUrl, currentResults:state.results, currentNotes:state.notes, history:state.history, settings:readJSON(STORAGE_KEYS.settings,{}) };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href=url; link.download="webmotion-local-data.json"; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); toast("Local data export prepared.","success");
  });
  document.querySelector("#feedbackForm").addEventListener("submit",async event => {
    event.preventDefault();
    const type = document.querySelector("#feedbackType").value;
    const message = document.querySelector("#feedbackMessage").value.trim();
    if (!message) return toast("Write a feedback message first.","error");
    const feedback = "WebMotion feedback: " + type + "\n\n" + message + "\n\nWebMotion version: current build";
    try {
      await navigator.clipboard.writeText(feedback);
      toast("Feedback copied. You can paste it into your preferred message app.", "success");
    } catch {
      const helper = document.createElement("textarea"); helper.value = feedback; helper.setAttribute("readonly", ""); helper.style.position = "fixed"; helper.style.opacity = "0"; document.body.append(helper); helper.select();
      const copied = document.execCommand("copy"); helper.remove();
      toast(copied ? "Feedback copied. You can paste it into your preferred message app." : "Clipboard access is unavailable in this browser.", copied ? "success" : "error");
    }
  });
}
