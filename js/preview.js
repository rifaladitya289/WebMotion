import { state, normalizeUrl, toast } from "./state.js";
import { showView } from "./navigation.js";
const presets = { desktop:[1440,900], laptop:[1366,768], tablet:[768,1024], mobile:[390,844] };
const mouseDevices = new Set(["desktop","laptop"]);
function currentDevice() {
  return Object.keys(presets).find(name => presets[name][0] === state.width && presets[name][1] === state.height) || (state.width >= 1000 ? "desktop" : state.width >= 600 ? "tablet" : "mobile");
}
function syncDeviceLayout() {
  const stage = document.querySelector("#previewStage");
  const mouse = document.querySelector("#virtualMousePanel");
  const device = currentDevice();
  stage.dataset.device = device;
  mouse?.classList.toggle("hidden", !mouseDevices.has(device));
  document.querySelector("#iframeFrame")?.classList.toggle("device-laptop", device === "laptop");
  document.querySelector("#iframeFrame")?.classList.toggle("device-desktop", device === "desktop");
  document.querySelectorAll(".device-button").forEach(button => button.classList.toggle("active", button.dataset.device === device));
}
function updatePreviewScale() {
  const stage = document.querySelector("#previewStage");
  const wrap = document.querySelector("#iframeScaleWrap");
  const frame = document.querySelector("#iframeFrame");
  if (!stage || !wrap || !frame) return;
  const styles = getComputedStyle(stage);
  const mouse = document.querySelector("#virtualMousePanel");
  const stageInnerWidth = stage.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  const mouseWidth = mouse && !mouse.classList.contains("hidden") ? mouse.getBoundingClientRect().width + 18 : 0;
  const available = Math.max(120, stageInnerWidth - mouseWidth);
  const availableHeight = Math.max(180, stage.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom) - 24);
  const scale = Math.min(1, available / state.width, availableHeight / (state.height + 35));
  frame.style.transform = `scale(${scale})`;
  wrap.style.width = `${state.width * scale}px`;
  wrap.style.height = `${(state.height + 35) * scale}px`;
  syncDeviceLayout();
}
function setDimensions(width,height) {
  const parsedWidth = width === "" ? 1440 : Number(width);
  const parsedHeight = height === "" ? 900 : Number(height);
  state.width = Math.max(240, Math.min(2560, Number.isFinite(parsedWidth) ? parsedWidth : 1440));
  state.height = Math.max(320, Math.min(3000, Number.isFinite(parsedHeight) ? parsedHeight : 900));
  document.querySelector("#viewportWidth").value = state.width;
  document.querySelector("#viewportHeight").value = state.height;
  document.querySelector("#testWidth").value = state.width;
  document.querySelector("#testHeight").value = state.height;
  const frame = document.querySelector("#iframeFrame");
  frame.style.width = state.width + "px";
  frame.style.height = (state.height + 27) + "px";
  updatePreviewScale();
  syncDeviceLayout();
}
function loadUrl(raw) {
  try {
    const url = normalizeUrl(raw);
    if (state.restoreResultsForUrl === url) {
      state.restoreResultsForUrl = "";
    } else {
      state.results = [];
      state.notes = [];
      document.querySelectorAll("#interactionChecklist input, #tool-transition .checklist input").forEach(input => { input.checked = false; });
      document.querySelector("#animationOutput").textContent = "No inspection has been run.";
      document.dispatchEvent(new CustomEvent("webmotion:refresh-results"));
    }
    state.currentUrl = url;
    document.querySelector("#websiteUrl").value = url;
    document.querySelector("#previewUrl").value = url;
    document.querySelector("#frameAddress").textContent = new URL(url).hostname;
    document.querySelector("#previewEmpty").classList.add("hidden");
    document.querySelector("#iframeScaleWrap").classList.remove("hidden");
    document.querySelector("#iframeFrame").classList.remove("hidden");
    const frame = document.querySelector("#websiteFrame");
    frame.src = "about:blank";
    requestAnimationFrame(() => { frame.src = url; });
    showView("preview");
    requestAnimationFrame(updatePreviewScale);
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
  document.querySelector("#runResponsive").addEventListener("click", () => { setDimensions(document.querySelector("#testWidth").value, document.querySelector("#testHeight").value); showView("preview"); requestAnimationFrame(updatePreviewScale); toast("Viewport applied. Full responsive quality still needs review."); document.dispatchEvent(new CustomEvent("webmotion:result-added", { detail: { title:"Responsive viewport applied", status:"warning", detail: state.width + " × " + state.height + " preview viewport applied. This confirms the frame size only, not the target site's responsive quality." } })); });
  document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () => { const [w,h] = presets[button.dataset.preset]; setDimensions(w,h); }));
  document.querySelector("#openExternalButton").addEventListener("click", () => { if (!state.currentUrl) return toast("Load a website first.", "error"); window.open(state.currentUrl, "_blank", "noopener,noreferrer"); });
  document.querySelector("#websiteFrame").addEventListener("load", () => { if (state.currentUrl) document.querySelector("#previewNotice").classList.add("visible"); });
  setDimensions(1440,900);
  requestAnimationFrame(updatePreviewScale);
  const stage = document.querySelector("#previewStage");
  if ("ResizeObserver" in window) new ResizeObserver(updatePreviewScale).observe(stage);
  else window.addEventListener("resize", updatePreviewScale);
}
