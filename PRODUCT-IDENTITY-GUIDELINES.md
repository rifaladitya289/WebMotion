# WebMotion — Product Identity Guidelines

**Version:** 1.0  
**Status:** Working standard for the current product  
**Owner:** Gallagher’s Studio  
**Applies to:** Landing page, workspace, reports, onboarding, help content, future WebMotion surfaces

These guidelines define how WebMotion should look, sound, and behave. They are intended to prevent generic SaaS styling, inconsistent copy, and feature claims that exceed the software's actual capabilities.

## 1. Product definition

**Product name:** WebMotion  
**Brand relationship:** WebMotion is a product by Gallagher’s Studio.  
**Product category:** Website viewport preview and manual QA documentation workspace.

**Approved product promise**

> Preview websites across viewports, review them manually, and keep findings organized in one workspace.

WebMotion helps a person:
1. Load a website URL when the target allows embedding.
2. Compare a set of viewport dimensions.
3. Open the target website directly when embedded preview is blocked.
4. Complete manual review checklists and write observations.
5. Review a report that distinguishes manual observations from browser limitations.
6. Save and reopen a local session on the same browser/device.

**Current capability boundary**
- WebMotion does not automatically test arbitrary external websites.
- It does not certify responsive quality, accessibility, security, animation behavior, or interaction correctness.
- The virtual pointer is a visual simulator. It cannot send trusted remote click or scroll input into arbitrary cross-origin websites.
- Sessions and preferences are local to the current browser/device. There is no account sync or cloud history in this build.
- Browser preview restrictions must never be bypassed or described as bypassed.

## 2. Brand architecture

Use the relationship consistently:
- Product: **WebMotion**
- Endorsement: **A product by Gallagher’s Studio**

Use the endorsement in the sidebar About/credit area and landing-page footer. Do not append the Studio name to every page heading, button, or feature label.

Do not rename the product to Gallagher’s Studio. The Studio is the maker; WebMotion is the product.

## 3. Visual identity

### Core visual character

**Neon Purple, disciplined and technical.** The interface should feel focused, calm, precise, and tool-like—not like a neon gaming dashboard or a generic AI-generated SaaS template.

The existing dark purple identity is retained. New design work should improve hierarchy and restraint rather than introduce a new color direction.

### Shared design tokens

The source of truth is `css/tokens.css`. Do not redefine shared `:root` tokens in page-specific stylesheets.

| Token | Value | Intended use |
|---|---|---|
| `--bg` | `#0d0a16` | Main application background |
| `--surface` | `#171222` | Primary surface |
| `--surface-2` | `#1d172b` | Secondary panels |
| `--surface-raised` | `#241b35` | Raised/interactive surfaces |
| `--primary` | `#9a78f5` | Primary action and active state |
| `--primary-hover` | `#a98aff` | Hover state for primary action |
| `--accent` | `#c5a5ff` | Secondary emphasis |
| `--muted` | `#aaa1ba` | Supporting text |
| `--border` | `rgba(205,184,255,.13)` | Subtle boundaries |
| `--success` | `#75d6ae` | Verified success only |
| `--warning` | `#f2c879` | Caution and browser limitations |
| `--danger` | `#f28c9a` | Destructive/error state |
| `--focus` | `#c4a5ff` | Keyboard focus outline |

### Typography

- Headings: Space Grotesk.
- Body and controls: Inter.
- Use headings to establish hierarchy, not to decorate every panel.
- Keep body copy readable and concise; avoid tiny helper text for essential limitations.
- Use tabular numerals for dimensions, counts, timers, and report values.

### Shape, spacing, and elevation

- Use the shared radius and spacing tokens before introducing page-specific values.
- Prefer clear boundaries and consistent spacing over nested card-on-card layouts.
- Use elevation sparingly. Most workspace surfaces should rely on background contrast and a subtle border.
- Avoid ornamental rings, glow, gradient, blur, or hover lift unless they communicate hierarchy, state, or interaction.
- A control should have one consistent default, hover, focus, active, disabled, and error treatment.

### Signature visual motif

Use viewport frames, dimension labels, inspection boundaries, and alignment guides as the product-specific motif. These details should clarify the preview/review workflow. Do not use random circuit lines, generic AI sparkles, or unrelated decorative graphics as substitutes for product identity.

### Iconography

The current UI contains Unicode symbols and geometric glyphs. Treat these as transitional. New icons must come from one consistent icon family or a deliberately designed WebMotion glyph set. Do not mix emoji, arbitrary Unicode, and multiple icon styles within the same navigation group.

## 4. Copywriting and product voice

### Voice attributes

- Precise
- Calm
- Transparent
- Practical
- Respectful of the user's expertise

Use concrete verbs: **Preview, Compare, Review, Record, Save, Reopen, Export**.

Avoid vague claims: **Perfect, Revolutionary, Powerful, Everything, Fully automated, AI-powered** unless a real capability justifies them.

### Approved vocabulary

| Use | Meaning |
|---|---|
| Preview | Display a target site in a viewport frame |
| Viewport | The dimensions applied to the preview frame |
| Manual review | A person checks the target website directly |
| Observation | A note or checklist selection made by the user |
| Browser limitation | A restriction WebMotion cannot bypass |
| Session | A locally saved URL and its report entries |
| Verified check | A result produced by a real WebMotion verification capability with traceable provenance |

### Vocabulary to avoid or qualify

- Do not call a viewport change a responsive test result.
- Do not call a checklist selection “Passed”.
- Do not call the visual pointer a remote or real virtual mouse.
- Do not call a manual review an automated test.
- Do not describe a blocked iframe as a WebMotion failure when the target site or browser policy prevents embedding.
- Do not use “Live workspace” when the page is a local preview tool.

### Approved page-level language

- Landing hero: **Preview. Compare. Record.**
- Landing description: **A focused workspace to compare website viewports, review experiences manually, and keep your findings in one place.**
- Preview page: **Preview the target website at different viewport sizes.**
- Review Tools: **Apply viewport sizes and record what you observe. External sites are not automatically tested.**
- Results: **Review manual observations and browser limitations recorded during this session.**
- Report disclaimer: **This build does not run automated checks on external websites. Checklist selections and notes are user-recorded observations, not automated verification or certification.**

## 5. Page responsibilities

| Page | Primary responsibility | Must not become |
|---|---|---|
| Landing | Explain the product promise and start a review | A feature-claim billboard |
| Dashboard | Collect URL and point to the next workflow action | A wall of generic metrics |
| Website Preview | Load and compare viewport frames; explain embedding limits | A remote browser claim |
| Review Tools | Help the user perform manual review and record findings | An automated QA suite |
| Results | Show traceable observations and limitations | A fabricated pass/fail dashboard |
| History | Reopen/delete local sessions | Cloud sync or account history |
| Settings | Explain and change real local preferences | A list of inactive settings |
| Help & Feedback | Explain capabilities and prepare feedback for the user to send | A support channel that silently transmits data |

Each page must have one dominant task. Secondary actions should remain visually subordinate.

## 6. Report data integrity

Every report item must carry explicit provenance:
- `kind: "manual_observation"` for user-recorded checklist selections, notes, and timed reviews.
- `kind: "capability_limit"` for browser or product limitations.
- `kind: "verified_check"` only when a real WebMotion verification routine ran and records `source: "webmotion_automated"`.

A manual checkbox is not a pass. A viewport resize is not a result. A browser limitation is not a user error.

Summary counts must be derived from report data. Never hard-code counts that imply available test coverage. Old local entries without provenance must not be upgraded to verified checks.

## 7. Interaction standards

- Every visible control must perform the action its label promises.
- If an action is unavailable, explain why before or at the point of interaction.
- Disabled controls must look and behave disabled.
- Loading, empty, success, warning, and error states must describe real application state.
- Destructive local-data actions must confirm when the user's setting requests confirmation.
- Copy-feedback actions must say that content is copied for the user to send; never imply that feedback was submitted.
- The product tour remains hands-on and skippable. It must not block the user's primary workflow.
- Keyboard focus must remain visible. Dialogs and overlays require a usable focus path and dismissal behavior.

## 8. Responsive standards

Test the complete application at these CSS viewport widths:
- 320 px
- 360 px
- 390 px
- 768 px
- 1024 px
- 1440 px

Also test portrait and landscape on supported mobile/tablet devices.

Required checks:
- No page-level horizontal overflow.
- No clipped preview frame or hidden primary action.
- Device controls remain readable and tappable.
- Virtual pointer panel is shown only for Desktop/Laptop and does not claim remote input.
- Tour panel, sidebar, legal dialog, and toast region remain within the viewport.
- Keyboard focus is visible and does not get hidden behind overlays.
- Reduced-motion preference is respected.

A CSS media query is not proof that a layout works. Record actual browser/device evidence in `QA-RELEASE.md`.

## 9. Component and CSS ownership

- `css/tokens.css` owns shared design tokens.
- Base styles own global typography, controls, and shared primitives.
- `landing.css` owns landing-page structure.
- `workspace.css` owns shared workspace structure and primitives.
- Page-specific stylesheets may own only their page-specific components and states.
- `responsive.css` owns cross-page responsive layout corrections.
- `tour.css` owns the product tour.
- Do not add another broad “polish” override layer.
- When a component changes, update its canonical owner and remove obsolete declarations after checking all usages.
- Keep CSS imports explicit and ordered in `index.html`.

The current stylesheet stack is still transitional. Consolidation should be incremental and protected by browser screenshots and the QA matrix; do not perform a risky all-at-once CSS rewrite.

## 10. Anti-AI-slop review checklist

Before accepting a new page, component, or feature, ask:

1. Does it solve a real user task in the WebMotion workflow?
2. Is its purpose obvious without a decorative heading?
3. Does its label accurately describe what the software does?
4. Is its visual treatment consistent with the existing token and component system?
5. Does it add a new useful capability rather than duplicate another control?
6. Does it show a real state or data point rather than a fabricated metric?
7. Does it work with keyboard, touch, reduced motion, and narrow viewports?
8. Can the product explain its limitations honestly?
9. Does it reinforce the viewport/review identity rather than generic SaaS decoration?
10. Would removing it make the product clearer? If yes, simplify or remove it.

## 11. Change-control rule

Do not add new features until:
1. P0 report-integrity and capability-claim issues are resolved.
2. Existing copy and page responsibilities follow this document.
3. The current visual system uses the canonical tokens.
4. All current controls have been audited.
5. The browser/device QA matrix has been completed and recorded.

These guidelines are the product standard for WebMotion. Any intentional exception should be documented with its reason.
