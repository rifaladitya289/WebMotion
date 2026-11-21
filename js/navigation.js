import { state, toast } from "./state.js";
export function initNavigation() {
  const landingNav = document.querySelector("#landingNav");
  const mobileMenu = document.querySelector("#mobileMenuButton");
  const sidebar = document.querySelector("#sidebar");
  const overlay = document.querySelector("#mobileOverlay");
  const closeSidebar = () => { sidebar?.classList.remove("open"); overlay?.classList.add("hidden"); document.querySelector("#workspaceMenuButton")?.setAttribute("aria-expanded", "false"); };
  mobileMenu?.addEventListener("click", () => { const open = landingNav.classList.toggle("open"); mobileMenu.setAttribute("aria-expanded", String(open)); });
  document.querySelector("#workspaceMenuButton")?.addEventListener("click", event => { sidebar.classList.add("open"); overlay.classList.remove("hidden"); event.currentTarget.setAttribute("aria-expanded", "true"); });
  document.querySelector("#backToLanding")?.addEventListener("click", () => { closeSidebar(); showLanding(); });
  document.querySelector("#sidebarClose")?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
  document.querySelectorAll("[data-action='get-started']").forEach(button => button.addEventListener("click", () => showWorkspace("overview")));
  document.querySelectorAll("[data-action='go-home']").forEach(button => button.addEventListener("click", () => { closeSidebar(); showLanding(); }));
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => { showView(button.dataset.view); closeSidebar(); }));
  document.querySelectorAll(".landing-nav a").forEach(link => link.addEventListener("click", () => { landingNav.classList.remove("open"); mobileMenu?.setAttribute("aria-expanded", "false"); }));
  const legalDialog = document.querySelector("#legalDialog");
  const legalTitle = document.querySelector("#legalTitle");
  const legalBody = document.querySelector("#legalBody");
  document.querySelectorAll("[data-legal]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    const privacy = link.dataset.legal === "privacy";
    legalTitle.textContent = privacy ? "Privacy Summary" : "Use Guidelines";
    legalBody.textContent = privacy
      ? "WebMotion currently stores saved sessions and preferences in this browser using local storage. There is no WebMotion account, cloud sync, or server-side history in this build. When you load a website, your browser requests that website directly. Export local data from Settings or clear saved sessions from History."
      : "Use WebMotion only with websites you are allowed to access and review. Some websites block embedded previews; WebMotion does not bypass those protections. The current build records manual observations and browser limitations; it does not provide formal security, accessibility, or automated QA certification.";
    if (legalDialog?.showModal) legalDialog.showModal(); else toast(legalBody.textContent);
  }));
  document.querySelector("#closeLegalDialog")?.addEventListener("click", () => legalDialog?.close());
  legalDialog?.addEventListener("click", event => { if (event.target === legalDialog) legalDialog.close(); });
  const fullscreenButton = document.querySelector("#fullscreenButton");
  fullscreenButton?.addEventListener("click", async () => { try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); } catch { toast("Fullscreen is not available in this browser.", "error"); } });
  document.addEventListener("fullscreenchange", () => { if (fullscreenButton) fullscreenButton.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen"; });
  document.addEventListener("keydown", event => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName) || event.target?.isContentEditable;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !typing) { event.preventDefault(); showWorkspace("overview"); document.querySelector("#websiteUrl")?.focus(); }
    if (event.key === "Escape") { closeSidebar(); landingNav?.classList.remove("open"); mobileMenu?.setAttribute("aria-expanded", "false"); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "1" && !typing) { event.preventDefault(); showWorkspace("overview"); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "2" && !typing) { event.preventDefault(); showWorkspace("preview"); }
  });
}
export function showLanding() {
  document.querySelector("#landingNav")?.classList.remove("open");
  document.querySelector("#landingPage")?.classList.remove("hidden");
  document.querySelector("#siteHeader")?.classList.remove("hidden");
  document.querySelector("#siteFooter")?.classList.remove("hidden");
  document.querySelector("#workspacePage")?.classList.add("hidden");
  document.querySelector("#sidebar")?.classList.remove("open");
  document.querySelector("#mobileOverlay")?.classList.add("hidden");
  document.querySelector("#workspaceMenuButton")?.setAttribute("aria-expanded", "false");
  document.querySelector("#mobileMenuButton")?.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
export function showWorkspace(view = "overview") {
  document.querySelector("#landingNav")?.classList.remove("open");
  document.querySelector("#mobileMenuButton")?.setAttribute("aria-expanded", "false");
  document.querySelector("#sidebar")?.classList.remove("open");
  document.querySelector("#mobileOverlay")?.classList.add("hidden");
  document.querySelector("#workspaceMenuButton")?.setAttribute("aria-expanded", "false");
  document.querySelector("#landingPage")?.classList.add("hidden");
  document.querySelector("#siteHeader")?.classList.add("hidden");
  document.querySelector("#siteFooter")?.classList.add("hidden");
  document.querySelector("#workspacePage")?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "auto" });
  showView(view);
}
export function showView(view) {
  const valid = ["overview","preview","testing","results","history","settings","help"];
  if (!valid.includes(view)) return;
  state.currentView = view;
  document.querySelectorAll(".workspace-view").forEach(section => section.classList.toggle("hidden", section.id !== "view-" + view));
  document.querySelectorAll(".side-link[data-view]").forEach(button => { const active = button.dataset.view === view; button.classList.toggle("active", active); if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current"); });
  const names = { overview:"Dashboard",preview:"Website Preview",testing:"Testing Tools",results:"Results",history:"History",settings:"Settings",help:"Help & Feedback" };
  document.querySelector("#currentViewName").textContent = names[view];
  if (view === "results") document.dispatchEvent(new CustomEvent("webmotion:refresh-results"));
  if (view === "history") document.dispatchEvent(new CustomEvent("webmotion:refresh-history"));
  if (view === "overview") document.dispatchEvent(new CustomEvent("webmotion:refresh-recent"));
}
