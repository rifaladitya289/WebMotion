# WebMotion — Functional & Release Audit

**Audit date:** 21 November 2026  
**Branch:** `qa/stabilization-2026-11`  
**Repository:** `rifaladitya289/WebMotion`  
**Audit type:** Source-level review and static consistency checks

## Executive status

The source-level review and targeted fixes in this branch are complete for this pass. The project is **not yet release-certified** because an interactive browser session, physical-device matrix, and deployment verification could not be completed in this environment.

Do not interpret static checks as proof that every button works at runtime or that the layout is correct on every device.

## Functional inventory reviewed

| Area | Current implementation | Important boundary |
|---|---|---|
| Landing and navigation | Landing anchors, Start Testing, workspace navigation, mobile drawers, legal dialogs, fullscreen, keyboard shortcuts | Requires runtime click and keyboard verification |
| URL entry and preview | URL normalization, HTTPS default, credential rejection, preview loading status, timeout hint, external-tab action | A target may block iframe embedding |
| Device sizing | Desktop, Laptop, Tablet, Mobile, custom width/height, rotate, responsive QA shortcuts | CSS viewport simulation is not physical-device certification |
| Virtual Mouse | Desktop/Laptop visual pointer, drag/hover movement, keyboard movement, coordinate readout, left/right feedback | Does not send trusted clicks, right-clicks, or scroll input into arbitrary third-party frames |
| Testing Tools | Responsive presets, animation timer, manual animation/interaction/transition checklists, notes | These are manual observations, not automated website tests |
| Results | Counts, warning/manual records, print dialog, session save | PDF is produced through the browser print dialog |
| History | Local save, reopen, delete, clear, and recent sessions | Stored on the current browser/device only |
| Settings | Clear-history confirmation, reduce-motion preference, JSON export | No cloud sync |
| Help and feedback | Browser limitation explanations, clipboard feedback, privacy and terms summaries | Clipboard behavior depends on browser permission/support |
| Studio attribution | Gallagher’s Studio credit in workspace sidebar and footer | Attribution is a product label, not an account or backend integration |

## Fixes applied in this stabilization branch

1. External website actions now create a temporary link with `target="_blank"` and `rel="noopener noreferrer"`, rather than using a `window.open(..., "noopener")` return value as proof that a new tab opened.
2. Both Preview and Interaction review now show honest guidance that browser pop-up settings may prevent the new tab from appearing.
3. The Settings “Reduce motion” option now applies reduced animation, transition, and smooth-scroll behavior across the interface.
4. History clearing continues to require confirmation unless the saved setting is explicitly `false`; incomplete settings data no longer silently disables confirmation.
5. Invalid stored dates display as “Unknown date” instead of producing an invalid timestamp in reports/history.
6. Landing and workspace menu buttons now declare their controlled navigation regions and initial expanded state.
7. README project structure and documented limitations were refreshed to match the current repository.

## Static checks performed

The current branch was fetched again after the changes. Checks returned:

- **92** HTML IDs; no duplicate IDs.
- **69** distinct literal JavaScript ID selectors; no missing target IDs.
- All checked relative JavaScript module imports resolve to tracked files.
- All **11** linked local CSS files exist.
- CSS brace balance is zero for all 11 linked stylesheets.
- All seven workspace destinations exist: Overview, Preview, Testing, Results, History, Settings, and Help.
- The iframe retains the sandbox tokens `allow-forms allow-scripts allow-popups`; it does not grant `allow-same-origin`.
- The new-tab link protections, reduce-motion rule, invalid-date guard, and history-confirmation guard are present in source.

These checks do not execute JavaScript or render CSS in a browser.

## Virtual Mouse decision

**Decision for this release:** keep the Virtual Mouse explicitly labeled as a visual pointer simulator.

The current project is a static GitHub Pages application. The iframe is sandboxed and external sites are normally cross-origin. Browser same-origin policy prevents the parent app from inspecting or controlling arbitrary external page DOM. Synthetic events are not equivalent to trusted physical input.

Do not add `allow-same-origin`, remove iframe sandboxing, or claim remote click/scroll support as a workaround. That would weaken isolation without making universal remote control reliable.

**Future architecture if true remote control is required:** build a separate remote-browser service with isolated browser sessions, authenticated session ownership, streamed viewport output, a validated input channel, session timeouts, resource limits, and server-side abuse protections. The static GitHub Pages frontend would become a client for that service. This backend is not implemented in this branch.

## Security and accessibility review

- Keep the iframe sandbox and the current referrer policy.
- External links opened by WebMotion use `noopener noreferrer` and `no-referrer`.
- URL normalization allows HTTP/HTTPS only and rejects embedded URL credentials.
- User-supplied result text is escaped before being inserted into report/history markup.
- Local data stays in browser storage; users can export it from Settings.
- Keyboard focus styles and navigation state are present in the interface.
- The reduced-motion setting now affects the complete interface.

Still requiring runtime verification: keyboard-only navigation, screen-reader announcements, focus order, dialog focus handling, contrast on real displays, clipboard permission behavior, and browser-specific fullscreen behavior.

## Performance review

Source review did not reveal a build pipeline or large client framework; the app uses static HTML, CSS, and vanilla JavaScript modules. This is not a measured performance result. Network timing, Core Web Vitals, memory use, CPU use, iframe-heavy pages, and low-end Android performance still require browser measurement.

## Runtime and cross-device verification — outstanding

No real browser automation or physical device testing was performed during this pass. The live GitHub Pages page could not be retrieved through the available web inspection route, so deployment rendering is also unverified.

Use [QA-RELEASE.md](QA-RELEASE.md) for the manual test matrix and release gates. At minimum, test 320, 360, 390, 768, 1024, and 1440 CSS-pixel widths, then repeat on real Android phone, tablet, laptop, and desktop browsers.

## Release decision

**Status: source stabilization in progress; not production-certified.**

The next release gate is the manual browser/device test matrix in `QA-RELEASE.md`. Record each result as Pass, Fail, or Not Tested. Fix failures and repeat the affected regression checks before merging this branch into `main`.
