import { state, toast, formatDate } from "./state.js";
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
export function renderResults() {
  const results = state.results;
  document.querySelector("#resultTotal").textContent = results.length;
  document.querySelector("#resultPassed").textContent = results.filter(x => x.status === "passed").length;
  document.querySelector("#resultWarnings").textContent = results.filter(x => x.status === "warning").length;
  document.querySelector("#resultNotTested").textContent = Math.max(0, 4 - new Set(results.map(x => x.title.split(" ")[0])).size);
  const list = document.querySelector("#resultList");
  if (!results.length) { list.innerHTML = '<div class="empty-state"><span>▤</span><strong>No results recorded</strong><p>Run a check or save an observation to build your report.</p></div>'; return; }
  list.innerHTML = results.map(item => '<article class="result-item"><div><strong>' + escapeHTML(item.title) + '</strong><p>' + escapeHTML(item.detail) + '</p><p>' + formatDate(item.date) + '</p></div><span class="status-pill ' + escapeHTML(item.status) + '">' + (item.status === "passed" ? "Passed" : "Warning / Manual") + '</span></article>').join("");
}
export function initResults() {
  document.addEventListener("webmotion:refresh-results", renderResults);
  document.addEventListener("webmotion:result-added", renderResults);
  document.querySelector("#printReport").addEventListener("click", () => { renderResults(); window.print(); });
  document.querySelector("#saveSession").addEventListener("click", () => document.dispatchEvent(new CustomEvent("webmotion:save-session")));
}
