import { state, normalizeUrl, toast } from "./state.js";
import { showView } from "./navigation.js";
const presets = { desktop:[1440,900], laptop:[1366,768], tablet:[768,1024], mobile:[390,844] };
const mouseDevices = new Set(["desktop","laptop"]);
let previewRequestId = 0;
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
  document.querySelector("#virtualCursor")?.classList.toggle("hidden", !mouseDevices.has(device));
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
  const stageInnerWidth = Math.max(120, stage.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight));
  const mouseHeight = mouse && !mouse.classList.contains("hidden") ? mouse.getBoundingClientRect().height + 14 : 0;
  const verticalBudget = Math.max(180, Math.min(window.innerHeight * 0.68, 720) - mouseHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom) - 24);
  const scale = Math.min(1, stageInnerWidth / (state.width + 14), verticalBudget / (state.height + 41));
  frame.style.transform = `scale(${scale})`;
  wrap.style.width = `${(state.width + 14) * scale}px`;
  wrap.style.height = `${(state.height + 41) * scale}px`;
  window.dispatchEvent(new Event("webmotion:preview-resized"));
}
function initVirtualMouse() {
  const pad = document.querySelector("#virtualMousePad");
  const column = document.querySelector("#devicePreviewColumn");
  const wrap = document.querySelector("#iframeScaleWrap");
  const iframe = document.querySelector("#websiteFrame");
  const cursor = document.querySelector("#virtualCursor");
  const readout = document.querySelector("#virtualMouseReadout");
  const leftButton = document.querySelector("#virtualLeftClick");
  const rightButton = document.querySelector("#virtualRightClick");
  let point = { x: 0.5, y: 0.5 };
  let active = false;
  let paintQueued = false;
  let twoFingerY = null;

  const say = message => { if (readout) readout.textContent = message; };
  const placeCursor = () => {
    if (!pad || !column || !wrap || wrap.classList.contains("hidden") || !mouseDevices.has(currentDevice()) || !active) {
      cursor?.classList.add("hidden");
      return;
    }
    const columnRect = column.getBoundingClientRect();
    const frameRect = iframe.getBoundingClientRect();
    if (!frameRect.width || !frameRect.height) return;
    cursor.style.left = (frameRect.left - columnRect.left + point.x * frameRect.width) + "px";
    cursor.style.top = (frameRect.top - columnRect.top + point.y * frameRect.height) + "px";
    cursor.classList.remove("hidden");
    say("Pointer · " + Math.round(point.x * state.width) + ", " + Math.round(point.y * state.height));
  };
  const scheduleCursor = () => {
    if (paintQueued) return;
    paintQueued = true;
    requestAnimationFrame(() => { paintQueued = false; placeCursor(); });
  };
  const move = event => {
    const rect = pad.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    point.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    point.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    scheduleCursor();
  };
  const showClickLimit = button => {
    cursor?.classList.remove("click-pulse");
    if (cursor) {
      void cursor.offsetWidth;
      cursor.classList.add("click-pulse");
    }
    say(button + " click unavailable · iframe browser security blocks remote input. Use Open in new tab.");
  };
  const reportScrollLimit = () => {
    say("Remote scroll is blocked for this isolated iframe. Scroll directly inside the website preview.");
  };

  pad.addEventListener("pointerdown", event => {
    event.preventDefault();
    active = true;
    pad.focus({ preventScroll:true });
    pad.setPointerCapture?.(event.pointerId);
    move(event);
  });
  pad.addEventListener("pointermove", event => {
    if (!active) return;
    event.preventDefault();
    move(event);
  }, { passive:false });
  pad.addEventListener("pointerup", event => {
    active = false;
    cursor?.classList.add("hidden");
    if (pad.hasPointerCapture?.(event.pointerId)) pad.releasePointerCapture(event.pointerId);
    say("Pointer idle · " + Math.round(point.x * state.width) + ", " + Math.round(point.y * state.height));
  });
  pad.addEventListener("pointercancel", () => { active = false; cursor?.classList.add("hidden"); });
  pad.addEventListener("wheel", event => {
    event.preventDefault();
    reportScrollLimit();
  }, { passive:false });
  pad.addEventListener("touchstart", event => {
    if (event.touches.length === 2) {
      twoFingerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      say("Two-finger scroll detected · target page is isolated");
    }
  }, { passive:false });
  pad.addEventListener("touchmove", event => {
    if (event.touches.length === 2) {
      event.preventDefault();
      twoFingerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      reportScrollLimit();
    }
  }, { passive:false });
  pad.addEventListener("touchend", event => { if (event.touches.length < 2) twoFingerY = null; });
  pad.addEventListener("keydown", event => {
    const step = event.shiftKey ? 0.1 : 0.025;
    if (event.key === "ArrowLeft") point.x -= step;
    else if (event.key === "ArrowRight") point.x += step;
    else if (event.key === "ArrowUp") point.y -= step;
    else if (event.key === "ArrowDown") point.y += step;
    else if (event.key === "PageDown" || event.key === "PageUp") {
      event.preventDefault();
      reportScrollLimit();
      return;
    } else return;
    event.preventDefault();
    point.x = Math.max(0, Math.min(1, point.x));
    point.y = Math.max(0, Math.min(1, point.y));
    active = true;
    scheduleCursor();
  });
  leftButton?.addEventListener("click", () => showClickLimit("Left"));
  rightButton?.addEventListener("click", () => showClickLimit("Right"));
  window.addEventListener("resize", scheduleCursor);
  window.addEventListener("webmotion:preview-resized", scheduleCursor);
  window.addEventListener("webmotion:url-loaded", () => {
    active = false;
    cursor?.classList.add("hidden");
    say("Pointer idle · 0, 0");
  });
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
    const requestId = ++previewRequestId;
    const status = document.querySelector("#previewStatus");
    status.textContent = "Loading preview request… This does not guarantee the website permits iframe embedding.";
    state.currentUrl = url;
    document.querySelector("#websiteUrl").value = url;
    document.querySelector("#previewUrl").value = url;
    document.querySelector("#frameAddress").textContent = new URL(url).hostname;
    document.querySelector("#previewEmpty").classList.add("hidden");
    document.querySelector("#iframeScaleWrap").classList.remove("hidden");
    document.querySelector("#iframeFrame").classList.remove("hidden");
    const frame = document.querySelector("#websiteFrame");
    requestAnimationFrame(() => { frame.src = url; });
    window.setTimeout(() => {
      if (requestId === previewRequestId && status.textContent.startsWith("Loading preview")) {
        status.textContent = "No completion signal received yet. Check your connection, or open the website in a new tab. Some blocked frames do not expose a reliable error to the parent page.";
      }
    }, 12000);
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
  document.querySelectorAll("[data-qa-width]").forEach(button => button.addEventListener("click", () => {
    const width = Number(button.dataset.qaWidth);
    const height = Number(button.dataset.qaHeight);
    document.querySelector("#testWidth").value = width;
    document.querySelector("#testHeight").value = height;
    setDimensions(width,height);
    showView("preview");
    toast("Viewport set to " + width + " × " + height + ". Review the page visually, then record findings.");
  }));
  document.querySelector("#runResponsive").addEventListener("click", () => { setDimensions(document.querySelector("#testWidth").value, document.querySelector("#testHeight").value); showView("preview"); requestAnimationFrame(updatePreviewScale); toast("Viewport applied. Full responsive quality still needs review."); document.dispatchEvent(new CustomEvent("webmotion:result-added", { detail: { title:"Responsive viewport applied", status:"warning", detail: state.width + " × " + state.height + " preview viewport applied. This confirms the frame size only, not the target site's responsive quality." } })); });
  document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () => { const [w,h] = presets[button.dataset.preset]; setDimensions(w,h); }));
  document.querySelector("#openExternalButton").addEventListener("click", () => { if (!state.currentUrl) return toast("Load a website first.", "error"); window.open(state.currentUrl, "_blank", "noopener,noreferrer"); });
  document.querySelector("#websiteFrame").addEventListener("load", event => {
    const frame = event.currentTarget;
    if (!state.currentUrl || frame.src === "about:blank" || new URL(frame.src, window.location.href).href !== state.currentUrl) return;
    document.querySelector("#previewNotice").classList.add("visible");
    document.querySelector("#previewStatus").textContent = "The browser completed iframe navigation. This is not proof that the page rendered: CSP / X-Frame-Options blocks may still show an error page. If the preview is blank or blocked, use Open in new tab.";
  });
  initVirtualMouse();
  setDimensions(1440,900);
  requestAnimationFrame(updatePreviewScale);
  const stage = document.querySelector("#previewStage");
  if ("ResizeObserver" in window) new ResizeObserver(updatePreviewScale).observe(stage);
  else window.addEventListener("resize", updatePreviewScale);
}
