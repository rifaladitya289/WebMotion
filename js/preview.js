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
  syncDeviceLayout();
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
  const scale = Math.min(1, available / (state.width + 14), availableHeight / (state.height + 41));
  frame.style.transform = `scale(${scale})`;
  wrap.style.width = `${(state.width + 14) * scale}px`;
  wrap.style.height = `${(state.height + 41) * scale}px`;
}
function initVirtualMouse() {
  const pad = document.querySelector("#virtualMousePad");
  const column = document.querySelector("#devicePreviewColumn");
  const wrap = document.querySelector("#iframeScaleWrap");
  const cursor = document.querySelector("#virtualCursor");
  const readout = document.querySelector("#virtualMouseReadout");
  let point = { x: 0.5, y: 0.5 };
  let active = false;
  const placeCursor = () => {
    if (!pad || !column || !wrap || wrap.classList.contains("hidden")) return;
    const columnRect = column.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    cursor.style.left = (wrapRect.left - columnRect.left + point.x * wrapRect.width) + "px";
    cursor.style.top = (wrapRect.top - columnRect.top + point.y * wrapRect.height) + "px";
    cursor.classList.remove("hidden");
    readout.textContent = "Pointer · " + Math.round(point.x * state.width) + ", " + Math.round(point.y * state.height);
  };
  const move = event => {
    if (!active && event.type !== "pointermove") return;
    const rect = pad.getBoundingClientRect();
    point.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    point.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    placeCursor();
  };
  pad.addEventListener("pointerdown", event => {
    active = true;
    pad.setPointerCapture?.(event.pointerId);
    move(event);
  });
  pad.addEventListener("pointermove", move);
  pad.addEventListener("pointerup", () => { active = false; });
  pad.addEventListener("pointercancel", () => { active = false; });
  pad.addEventListener("keydown", event => {
    const step = event.shiftKey ? 0.1 : 0.025;
    if (event.key === "ArrowLeft") point.x -= step;
    else if (event.key === "ArrowRight") point.x += step;
    else if (event.key === "ArrowUp") point.y -= step;
    else if (event.key === "ArrowDown") point.y += step;
    else return;
    event.preventDefault();
    point.x = Math.max(0, Math.min(1, point.x));
    point.y = Math.max(0, Math.min(1, point.y));
    placeCursor();
  });
  const visualClick = button => {
    placeCursor();
    cursor.classList.remove("click-pulse");
    void cursor.offsetWidth;
    cursor.classList.add("click-pulse");
    readout.textContent = button + " click · visual simulation only";
  };
  document.querySelector("#virtualLeftClick").addEventListener("click", () => visualClick("Left"));
  document.querySelector("#virtualRightClick").addEventListener("click", () => visualClick("Right"));
  window.addEventListener("resize", placeCursor);
  window.addEventListener("webmotion:preview-resized", placeCursor);
  window.addEventListener("webmotion:url-loaded", () => { cursor.classList.add("hidden"); readout.textContent = "Pointer idle · 0, 0"; });
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
  frame.style.width = (state.width + 14) + "px";
  frame.style.height = (state.height + 41) + "px";
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
  document.querySelectorAll(".device-button[data-device]").forEach(button => button.addEventListener("click", () => { const preset = presets[button.dataset.device]; if (preset) setDimensions(preset[0], preset[1]); }));
  document.querySelector("#applyViewport").addEventListener("click", () => { setDimensions(document.querySelector("#viewportWidth").value, document.querySelector("#viewportHeight").value); toast("Preview viewport updated."); });
  document.querySelector("#orientationButton").addEventListener("click", () => { const w = state.width; setDimensions(state.height,w); state.orientation = state.width > state.height ? "landscape" : "portrait"; });
  document.querySelector("#runResponsive").addEventListener("click", () => { setDimensions(document.querySelector("#testWidth").value, document.querySelector("#testHeight").value); showView("preview"); requestAnimationFrame(updatePreviewScale); toast("Viewport applied. Full responsive quality still needs review."); document.dispatchEvent(new CustomEvent("webmotion:result-added", { detail: { title:"Responsive viewport applied", status:"warning", detail: state.width + " × " + state.height + " preview viewport applied. This confirms the frame size only, not the target site's responsive quality." } })); });
  document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () => { const [w,h] = presets[button.dataset.preset]; setDimensions(w,h); }));
  document.querySelector("#openExternalButton").addEventListener("click", () => { if (!state.currentUrl) return toast("Load a website first.", "error"); window.open(state.currentUrl, "_blank", "noopener,noreferrer"); });
  document.querySelector("#websiteFrame").addEventListener("load", () => { if (state.currentUrl) document.querySelector("#previewNotice").classList.add("visible"); });
  initVirtualMouse();
  setDimensions(1440,900);
  requestAnimationFrame(updatePreviewScale);
  const stage = document.querySelector("#previewStage");
  if ("ResizeObserver" in window) new ResizeObserver(updatePreviewScale).observe(stage);
  else window.addEventListener("resize", updatePreviewScale);
}
