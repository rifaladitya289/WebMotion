import { state, normalizeUrl, toast } from "./state.js";
import { showView } from "./navigation.js";
const presets = { desktop:[1440,900], tablet:[768,1024], mobile:[390,844] };
function setDimensions(width,height) {
  state.width = Math.max(240, Math.min(2560, Number(width) || 1440));
  state.height = Math.max(320, Math.min(3000, Number(height) || 900));
  document.querySelector("#viewportWidth").value = state.width;
  document.querySelector("#viewportHeight").value = state.height;
  document.querySelector("#testWidth").value = state.width;
  document.querySelector("#testHeight").value = state.height;
  const frame = document.querySelector("#iframeFrame");
  frame.style.width = state.width + "px";
  frame.style.height = Math.min(state.height, 1100) + "px";
  document.querySelectorAll(".device-button").forEach(button => button.classList.toggle("active", presets[button.dataset.device]?.[0] === state.width && presets[button.dataset.device]?.[1] === state.height));
}
function loadUrl(raw) {
  try {
    const url = normalizeUrl(raw);
    state.currentUrl = url;
    document.querySelector("#websiteUrl").value = url;
    document.querySelector("#previewUrl").value = url;
    document.querySelector("#frameAddress").textContent = new URL(url).hostname;
    document.querySelector("#previewEmpty").classList.add("hidden");
    document.querySelector("#iframeFrame").classList.remove("hidden");
    const frame = document.querySelector("#websiteFrame");
    frame.src = "about:blank";
    requestAnimationFrame(() => { frame.src = url; });
    showView("preview");
    toast("Preview requested. The website may block embedding.", "info");
    document.dispatchEvent(new CustomEvent("webmotion:url-loaded", { detail: { url } }));
  } catch (error) { toast(error.message, "error"); }
}
export function initPreview() {
  document.querySelector("#urlForm").addEventListener("submit", event => { event.preventDefault(); loadUrl(document.querySelector("#websiteUrl").value); });
  document.querySelector("#previewUrlForm").addEventListener("submit", event => { event.preventDefault(); loadUrl(document.querySelector("#previewUrl").value); });
  document.querySelectorAll("[data-device]").forEach(button => button.addEventListener("click", () => { const [w,h] = presets[button.dataset.device]; setDimensions(w,h); }));
  document.querySelector("#applyViewport").addEventListener("click", () => { setDimensions(document.querySelector("#viewportWidth").value, document.querySelector("#viewportHeight").value); toast("Preview viewport updated."); });
  document.querySelector("#orientationButton").addEventListener("click", () => { const w = state.width; setDimensions(state.height,w); state.orientation = state.width > state.height ? "landscape" : "portrait"; });
  document.querySelector("#runResponsive").addEventListener("click", () => { setDimensions(document.querySelector("#testWidth").value, document.querySelector("#testHeight").value); showView("preview"); toast("Viewport applied. Full responsive quality still needs review."); document.dispatchEvent(new CustomEvent("webmotion:result-added", { detail: { title:"Responsive viewport applied", status:"warning", detail: state.width + " × " + state.height + " preview viewport applied. This confirms the frame size only, not the target site's responsive quality." } })); });
  document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () => { const [w,h] = presets[button.dataset.preset]; setDimensions(w,h); }));
  document.querySelector("#openExternalButton").addEventListener("click", () => { if (!state.currentUrl) return toast("Load a website first.", "error"); window.open(state.currentUrl, "_blank", "noopener,noreferrer"); });
  document.querySelector("#websiteFrame").addEventListener("load", () => { if (state.currentUrl) document.querySelector("#previewNotice").classList.add("visible"); });
  setDimensions(1440,900);
}
