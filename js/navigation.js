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
  document.querySelectorAll("[data-legal]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); toast(link.dataset.legal === "privacy" ? "Privacy information: guest data stays in this browser. Cloud sync is not enabled." : "Terms: use WebMotion responsibly and respect the target website's access rules."); }));
  document.querySelector("#fullscreenButton")?.addEventListener("click", async () => { try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); } catch { toast("Fullscreen is not available in this browser.", "error"); } });
  document.addEventListener("keydown", event => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName) || event.target?.isContentEditable;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !typing) { event.preventDefault(); showWorkspace("overview"); document.querySelector("#websiteUrl")?.focus(); }
    if (event.key === "Escape") { closeSidebar(); landingNav?.classList.remove("open"); mobileMenu?.setAttribute("aria-expanded", "false"); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "1" && !typing) { event.preventDefault(); showWorkspace("overview"); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "2" && !typing) { event.preventDefault(); showWorkspace("preview"); }
  });
}
export function showLanding() {
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
  document.querySelectorAll(".side-link[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  const names = { overview:"Overview",preview:"Website Preview",testing:"Testing Tools",results:"Results",history:"History",settings:"Settings",help:"Help & Feedback" };
  document.querySelector("#currentViewName").textContent = names[view];
  if (view === "results") document.dispatchEvent(new CustomEvent("webmotion:refresh-results"));
  if (view === "history") document.dispatchEvent(new CustomEvent("webmotion:refresh-history"));
  if (view === "overview") document.dispatchEvent(new CustomEvent("webmotion:refresh-recent"));
}
