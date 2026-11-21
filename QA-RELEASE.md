# WebMotion — Manual QA & Release Checklist

Use this checklist on the deployed GitHub Pages site or a local HTTP server. Record each item as **Pass**, **Fail**, or **Not Tested**, with the browser/device and a short note. Do not mark a test as passed from source inspection alone.

## 1. Device and viewport matrix

| Target | CSS viewport width | Check |
|---|---:|---|
| Narrow phone | 320 px | No horizontal page overflow; controls remain usable |
| Phone | 360 px | Preview, URL form, sidebar drawer, and cards fit |
| Phone | 390 px | Mouse panel appears only for desktop/laptop preview presets |
| Tablet portrait | 768 px | Workspace, preview toolbar, and controls do not collide |
| Tablet / small laptop | 1024 px | Sidebar and workspace content remain readable |
| Desktop | 1440 px | Preview and mouse workspace align without clipping |

Also test actual phone portrait/landscape, tablet, laptop, and desktop displays. The CSS viewport presets alone do not replace this check.

## 2. Functional flow

- [ ] Landing navigation anchors scroll to the correct sections.
- [ ] Mobile landing menu opens, closes, and updates `aria-expanded`.
- [ ] Start Testing opens the workspace once; no duplicate CTA behavior.
- [ ] Dashboard URL accepts a full HTTPS URL and a bare domain.
- [ ] Invalid URL and non-HTTP(S) schemes show a useful error.
- [ ] Loading a new URL clears previous findings and checklist selections.
- [ ] Preview URL form loads the requested address.
- [ ] Device buttons select Desktop, Laptop, Tablet, and Mobile.
- [ ] Custom width/height and Rotate apply the expected dimensions.
- [ ] Open in new tab opens the target or clearly explains that a pop-up may have been blocked.
- [ ] Sidebar navigation opens all seven workspace views.
- [ ] Mobile workspace drawer opens and closes with its button, close control, overlay, and Escape.
- [ ] Fullscreen enters and exits; button label stays synchronized.
- [ ] Keyboard shortcuts work without intercepting text typed into form controls.
- [ ] Privacy and Terms dialogs open and close.

## 3. Testing Tools and Results

- [ ] Responsive presets apply the selected viewport and record a warning, not an automatic pass.
- [ ] Responsive notes save to Results.
- [ ] Animation timer starts, stops, and resets correctly.
- [ ] Animation checklist selections appear once in Results and disappear when unchecked.
- [ ] Interaction and Transition checklist selections update Results correctly.
- [ ] Manual observations save and display safely, including text containing HTML-like characters.
- [ ] Results totals match the displayed items.
- [ ] Print opens the browser print dialog; verify Save as PDF manually.
- [ ] Save session stores the current URL and findings.
- [ ] Reopen restores the saved URL and checklist states.
- [ ] Delete removes one session.
- [ ] Clear history asks for confirmation by default and honors the disabled-confirmation setting.
- [ ] Reload the page and verify saved history remains available on the same browser/device.

## 4. Virtual Mouse expectations

- [ ] Virtual Mouse appears for Desktop and Laptop only.
- [ ] Virtual Mouse is hidden for Tablet and Mobile.
- [ ] Pointer follows mouse hover/drag and touch drag without scrolling the parent page.
- [ ] Arrow keys move the pointer when the pad is focused.
- [ ] Coordinate readout updates and remains within the preview viewport.
- [ ] Left/right controls explain that external iframe clicks are blocked.
- [ ] Scroll attempts explain the iframe limitation; no false success message appears.

**Expected behavior:** this build is a visual pointer simulator. Real external-page click, right-click, and scroll forwarding are not supported.

## 5. Settings, storage, and feedback

- [ ] Confirm-before-clear preference saves and persists after reload.
- [ ] Reduce motion visibly reduces transitions and animations.
- [ ] Export local data downloads valid JSON.
- [ ] Feedback form validates the message and copies it when clipboard access is available.
- [ ] Clipboard fallback gives an accurate success/error message.
- [ ] Storage-disabled or storage-full conditions show a useful error.

## 6. Preview compatibility and security

- [ ] Test a site that allows iframe embedding.
- [ ] Test a site that blocks iframe embedding; verify the limitation is explained.
- [ ] Confirm WebMotion does not attempt to bypass CSP or X-Frame-Options.
- [ ] Confirm iframe remains sandboxed and does not gain `allow-same-origin`.
- [ ] Check browser console for uncaught errors and failed local assets.
- [ ] Check that user-provided notes and history strings render as text, not executable markup.
- [ ] Verify external tabs do not receive an opener reference.

## 7. Accessibility and performance

- [ ] Complete primary navigation using keyboard only.
- [ ] Confirm focus indicators are visible and focus order is logical.
- [ ] Confirm menu buttons announce expanded/collapsed state.
- [ ] Confirm preview status and toast messages are announced appropriately.
- [ ] Confirm dialogs can be closed with Escape and focus returns sensibly.
- [ ] Check text contrast and zoom at 200%.
- [ ] Measure load performance on a normal connection and a slower mobile connection.
- [ ] Check responsiveness and interaction on a lower-powered Android device.

## 8. Release gates

Do not merge to `main` until:

1. All critical navigation, URL, history, and settings flows pass.
2. No blocking layout issue remains at the tested widths.
3. No uncaught runtime error appears during the checklist.
4. Security and iframe limitations are clearly communicated.
5. The Virtual Mouse is not advertised as real remote input.
6. Known failures are fixed and their regression tests pass.
7. README and AUDIT.md reflect the shipped behavior.
