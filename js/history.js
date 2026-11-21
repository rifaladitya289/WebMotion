import { state, STORAGE_KEYS, readJSON, writeJSON, toast, formatDate } from "./state.js";
function safe(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
export function renderHistory() {
  const target = document.querySelector("#historyList");
  const recent = document.querySelector("#recentList");
  const empty = '<div class="empty-state"><span>◷</span><strong>No saved sessions</strong><p>Save a session from Results to see it here.</p></div>';
  target.innerHTML = state.history.length ? state.history.map(item => '<article class="history-item"><div><strong>' + safe(item.url) + '</strong><small>' + formatDate(item.date) + ' · ' + safe(item.resultCount) + ' recorded items</small></div><div><button class="button button-secondary button-small" data-reopen="' + safe(item.id) + '">Reopen</button> <button class="text-button" data-delete="' + safe(item.id) + '">Delete</button></div></article>').join("") : empty;
  recent.innerHTML = state.history.slice(0,3).map(item => '<div class="recent-item"><div><strong>' + safe(item.url) + '</strong><small>' + formatDate(item.date) + '</small></div><button class="text-button" data-reopen="' + safe(item.id) + '">Open →</button></div>').join("") || '<div class="empty-state compact"><span>◷</span><strong>No sessions yet</strong><p>Your recent websites will appear here.</p></div>';
  document.querySelectorAll("[data-reopen]").forEach(button => button.addEventListener("click", () => { const item = state.history.find(x => x.id === button.dataset.reopen); if (!item) return; state.currentUrl = item.url; state.restoreResultsForUrl = item.url; state.results = Array.isArray(item.results) ? item.results.filter(result => result && typeof result === "object") : []; state.notes = state.results.filter(result => String(result.title || "").includes("manual observation")); document.querySelectorAll("#interactionChecklist input, #tool-transition .checklist input, #animationReviewChecklist input").forEach(input => { const category = input.closest("#tool-transition") ? "Transition" : input.closest("#animationReviewChecklist") ? "Animation review" : "Interaction"; const expected = category === "Animation review" ? category + ": " + input.value : category + " checklist: " + input.value; input.checked = state.results.some(result => result.title === expected); }); document.dispatchEvent(new CustomEvent("webmotion:refresh-results")); document.querySelector("#websiteUrl").value = item.url; document.querySelector("#previewUrl").value = item.url; document.querySelector("#urlForm").requestSubmit(); }));
  document.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click", () => { const previous = state.history; state.history = state.history.filter(x => x.id !== button.dataset.delete); if (!writeJSON(STORAGE_KEYS.history,state.history)) { state.history = previous; return toast("Could not update local storage.", "error"); } renderHistory(); toast("Session removed."); }));
}
export function initHistory() {
  const savedHistory = readJSON(STORAGE_KEYS.history, []);
  state.history = Array.isArray(savedHistory) ? savedHistory.filter(item => item && typeof item === "object" && typeof item.url === "string" && typeof item.id === "string") : [];
  document.addEventListener("webmotion:refresh-history", renderHistory);
  document.addEventListener("webmotion:refresh-recent", renderHistory);
  document.addEventListener("webmotion:save-session", () => {
    if (!state.currentUrl) return toast("Load a website before saving a session.", "error");
    const session = { id: crypto.randomUUID?.() || String(Date.now()), url:state.currentUrl, date:new Date().toISOString(), resultCount:state.results.length, results:state.results.map(result => ({...result})) };
    const previous = state.history;
    state.history = [session, ...state.history].slice(0,50);
    if (!writeJSON(STORAGE_KEYS.history,state.history)) { state.history = previous; return toast("Storage is full. Export your data or remove older sessions.", "error"); }
    renderHistory(); toast("Session saved on this device.", "success");
  });
  document.querySelector("#clearHistory").addEventListener("click", () => {
    const settings = readJSON(STORAGE_KEYS.settings,{confirmClear:true});
    if (settings.confirmClear !== false && !confirm("Clear all saved WebMotion sessions on this device?")) return;
    const previous = state.history; state.history = []; if (!writeJSON(STORAGE_KEYS.history,state.history)) { state.history = previous; return toast("Could not clear history because local storage is unavailable.", "error"); } renderHistory(); toast("History cleared.");
  });
}
