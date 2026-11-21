import { state, toast, formatDate } from "./state.js";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function itemKind(item) {
  if (["manual_observation", "capability_limit", "verified_check"].includes(item.kind)) {
    if (item.kind === "verified_check" && item.source !== "webmotion_automated") return "legacy_unverified";
    return item.kind;
  }
  // Older locally saved entries have no provenance. Never reinterpret them as verified.
  return item.status === "passed" ? "legacy_unverified" : "manual_observation";
}

export function renderResults() {
  const results = Array.isArray(state.results) ? state.results : [];
  const kinds = results.map(itemKind);
  document.querySelector("#resultTotal").textContent = results.length;
  document.querySelector("#resultManual").textContent = kinds.filter(kind => kind === "manual_observation").length;
  document.querySelector("#resultLimits").textContent = kinds.filter(kind => kind === "capability_limit").length;
  document.querySelector("#resultVerified").textContent = kinds.filter(kind => kind === "verified_check").length;

  const list = document.querySelector("#resultList");
  if (!results.length) {
    list.innerHTML = '<div class="empty-state"><span>▤</span><strong>No report entries yet</strong><p>Save a manual observation or record a browser limitation to build your session report.</p></div>';
    return;
  }

  list.innerHTML = results.map((item, index) => {
    const kind = kinds[index];
    const label = kind === "capability_limit" ? "Browser limitation"
      : kind === "verified_check" ? "Verified check"
      : kind === "legacy_unverified" ? "Unverified legacy item"
      : "Manual observation";
    return '<article class="result-item"><div><strong>' + escapeHTML(item.title) + '</strong><p>' + escapeHTML(item.detail) + '</p><p>' + formatDate(item.date) + '</p></div><span class="status-pill ' + kind + '">' + label + '</span></article>';
  }).join("");
}

export function initResults() {
  document.addEventListener("webmotion:refresh-results", renderResults);
  document.addEventListener("webmotion:result-added", renderResults);
  document.querySelector("#printReport").addEventListener("click", () => { renderResults(); window.print(); });
  document.querySelector("#saveSession").addEventListener("click", () => document.dispatchEvent(new CustomEvent("webmotion:save-session")));
}
