# WebMotion — Product Identity & Anti-AI-Slop Audit

**Date:** 21 November 2026  
**Branch:** `qa/stabilization-2026-11`  
**Scope:** Landing page, all seven workspace views, copywriting, visual components, feature integrity, interactions, onboarding, responsive source, and Gallagher’s Studio brand consistency.  
**Method:** Source-level inspection of HTML, CSS, and JavaScript. No interactive browser session, screen-reader session, or physical-device test was performed.

## Executive assessment

WebMotion has a credible product foundation, but it is not yet fully differentiated as a Gallagher’s Studio software product.

The strongest part is its product workflow: a user brings a website URL, previews it at selected viewport sizes, records manual QA observations, reviews a report, and saves a local session. The application also documents important browser-security limitations instead of pretending to offer unrestricted remote control.

The main anti-AI-slop risk is **generic presentation around a specific product idea**. The neon-purple palette and dark workspace are coherent, but they are not distinctive by themselves. Several landing-page statements could describe almost any SaaS tool; the Studio credit is present but not yet expressed as a broader product-design signature; and the CSS cascade has accumulated multiple refinement layers rather than one clearly governed design system.

**Verdict:** promising and purpose-specific, with medium-to-high differentiation risk in its current presentation. This is a source-based product assessment, not a visual score or runtime certification.

## What already feels intentional

- A clear core workflow exists: URL → Preview → Testing → Results → History.
- The interface distinguishes manual observations from automated verification in several important places.
- The virtual mouse is described as a visual pointer simulator, not as working remote control.
- Browser embedding and cross-origin restrictions are explained in the UI and project documentation.
- The product has a consistent base palette: dark plum surfaces, purple primary actions, lavender accents, and readable neutral text.
- The workspace is organized into seven named destinations: Overview, Website Preview, Testing Tools, Results, Session History, Settings, and Help & Feedback.
- Gallagher’s Studio is credited in the workspace sidebar and landing-page footer.
- The interactive tour asks users to perform real actions rather than merely showing a sequence of static feature slides.

These are valuable foundations. They should be refined, not discarded.

## Findings by area

### 1. Product positioning and landing page

**Severity: High — differentiation**

The hero communicates the general category, but not a memorable reason to choose WebMotion.

Current examples:
- “Preview. Test. Perfect.”
- “A focused workspace to preview websites, explore responsive layouts, and review what needs attention.”
- “Everything in one workspace.”
- “Built for Better Web Experiences.”
- “designed to help everyone explore, inspect, and improve their website experience.”

The wording is polished enough to understand, but broad enough to fit many unrelated products. “Perfect” can also imply a stronger quality guarantee than the current manual-review tool can provide.

**Direction**
- Position WebMotion around its actual strength: a structured website preview and manual QA workspace.
- Explain the difference between viewport simulation, manual review, and automated verification in plain language.
- Replace broad benefit claims with concrete outcomes: compare viewports, record issues, keep review notes, and revisit sessions.
- Avoid claims such as “automated testing”, “fully inspect”, or “perfect” unless the implementation can substantiate them.

### 2. Gallagher’s Studio product identity

**Severity: High — brand differentiation**

The phrase “DEVELOPED BY Gallagher’s Studio” is present in the sidebar and footer. That establishes authorship, but does not yet make the product feel designed within a recognizable Studio product family.

The current product identity is mostly its wordmark and purple theme. The source does not establish a distinct visual motif, product voice, or repeatable Studio signature beyond the attribution.

**Direction**
- Keep WebMotion as the product brand; do not replace it with the Studio name.
- Define the relationship consistently: “WebMotion — a Gallagher’s Studio product” or a similarly concise approved phrase.
- Create a restrained Studio signature that can be reused across future Studio software: a small identity lockup, consistent attribution placement, and a recognizable interaction/detail language.
- Give WebMotion its own product-specific visual motif related to viewport frames, layout boundaries, or inspection—not generic decorative glow.
- Do not add Studio branding to every button or heading. Brand presence should be deliberate, not repetitive.

### 3. Visual system and component consistency

**Severity: High — maintainability / Medium — visual differentiation**

The palette is reasonably coherent, but several generic SaaS conventions appear together: dark gradient backgrounds, glowing purple primary buttons, rounded panels, decorative metric rings, repeated bordered cards, and hover lift effects.

None is inherently wrong. The risk comes from using them without a product-specific hierarchy or a clear reason.

The stylesheet structure also shows accumulated layers:
- Base files such as `style.css`, `landing.css`, and `workspace.css`.
- A broad `polish.css` override.
- Page-specific redesign stylesheets for Preview, Testing, Results, History, and Settings/Help.
- Separate Studio attribution and tour styles.

This makes the final style dependent on import order and override specificity. It is harder to know which file owns a component’s final design.

The README’s project tree also omits the currently linked `css/tour.css` and imported `js/tour.js`, so documentation has drifted from the actual source.

**Direction**
- Preserve the selected Neon Purple identity.
- Establish one source of truth for design tokens: color, spacing, radius, typography, elevation, borders, and motion.
- Give each component one canonical owner. Remove obsolete declarations only after confirming they are no longer needed.
- Use gradients and glow for hierarchy or state, not as a default decoration.
- Use one consistent icon system. The current UI mixes Unicode symbols, geometric glyphs, and text icons; replace them gradually with a consistent icon set or a deliberate custom glyph family.
- Keep cards where they group related information; use simpler rows, dividers, and typography elsewhere.
- Update the README tree whenever the actual structure changes.

### 4. Landing-page copy and feature claims

**Severity: High — trust**

The landing page describes “Animation Testing” and “Interaction Testing”, while the implementation primarily provides manual checklists, timers, and observations. The detailed tool pages explain this honestly, but the landing-page labels can still create an inflated first impression.

**Direction**
- Rename or qualify these capabilities as “Manual animation review” and “Manual interaction review”.
- State clearly that the current build does not automatically inspect arbitrary external website DOM or animation timelines.
- Replace “Everything in one workspace” with a specific description of the workflow.
- Make the landing page describe what exists today, not what might be added in a later backend phase.

### 5. Overview / Dashboard

**Severity: Medium — hierarchy**

The dashboard has a strong primary action: enter a URL. The three-step workflow guide reinforces the product flow. Recent testing is a useful secondary area.

Potential friction:
- The page repeats some of the landing-page workflow explanation.
- “Recent testing” is actually recent saved local sessions, not necessarily recent tests.
- “Run your checks” may suggest automated checks even though many are manual.

**Direction**
- Keep URL entry as the dominant action.
- Rename “Recent testing” to “Recent sessions” if it continues to show saved sessions.
- Use language such as “Review manually” rather than implying automatic test execution.
- Keep the interactive tour secondary to the primary task.

### 6. Website Preview

**Severity: High — expectation management / Runtime verification outstanding**

The preview page provides Desktop, Laptop, Tablet, Mobile, custom dimensions, rotation, and a contained iframe. The virtual mouse is restricted to Desktop/Laptop and is explicitly described as visual-only.

This honesty is a strength. However:
- “LIVE WORKSPACE” is vague and may imply a live remote-control session.
- The virtual mouse still has left/right click controls even though these cannot send trusted input to the embedded site. The helper text explains the limitation, but the controls may still look like functional mouse buttons at first glance.
- Scroll gestures are detected only to report the browser limitation; they do not scroll the target page.
- The current source uses CSS transforms and a scaled wrapper. Static inspection cannot establish that all device frames remain fully visible at narrow and wide sizes.

**Direction**
- Consider the more precise section label “PREVIEW WORKSPACE”.
- Keep the visual pointer simulator only if it provides useful visual feedback. If retained, visually distinguish pointer positioning from unavailable remote input.
- Do not label the controls as a real virtual mouse without a remote-browser backend.
- Test the preview at the complete viewport matrix and with both embeddable and iframe-blocking websites.
- Keep the iframe sandbox protections.

### 7. Testing Tools

**Severity: High — product clarity**

Responsive, Animation, Interaction, and Transition are grouped in one tool area. The implementation includes presets, custom dimensions, manual checklists, a timer, notes, and inspection-limit explanations.

The main conceptual problem is that the page title “Testing Tools” and some action labels can make the product sound more automated than it is.

**Direction**
- Separate actions into clear categories: “Apply viewport”, “Review manually”, and “Save observation”.
- Keep manual checklists visibly identified as user-recorded review items.
- Ensure every checkbox’s meaning is clear: checking it should mean the user reviewed that criterion, not that WebMotion verified it.
- Do not add a green Passed state for a manual checkbox.
- Consider whether the Transition category adds a distinct review task or duplicates Interaction. Keep both only if their checklists and report outcomes are meaningfully different.

### 8. Results

**Severity: Critical — data integrity / High — copy consistency**

The Results heading says “Only verified checks and saved observations appear here.” The report disclaimer also says Passed is reserved for checks WebMotion can verify. Those are good principles.

However, `js/results.js` assigns the “Not automated” count as a fixed value of `4`. It is not derived from the actual current test capabilities or report contents. A static number can become inaccurate when tools change.

The metric label “Passed” is also potentially misleading if no automated verification is currently available for arbitrary external sites. The source should be reviewed to ensure a manual observation cannot be interpreted as a pass.

**Direction**
- Remove hard-coded report counts.
- Model each report item with explicit provenance: automated verification, manual observation, or not tested.
- Derive all summary figures from the same report data used to render the list.
- If there are no automated checks in the current build, show “Automated checks: 0” or omit the metric rather than implying a verification capability.
- Make the report title and export accurately describe a manual QA report when that is what it contains.
- Verify print-to-PDF output and empty-report behavior in a browser.

### 9. Session History

**Severity: Medium — terminology / Runtime verification outstanding**

History correctly describes sessions as local to the device and provides Reopen, Delete, and Clear history actions.

**Direction**
- Keep “local” visible in the page copy.
- Make the distinction between a saved session and a saved report clear.
- Verify that reopening restores the exact URL, observations, and checklist state, and that clearing history cannot silently lose data.
- Test storage-full and storage-disabled behavior.

### 10. Settings

**Severity: Medium — product maturity**

Settings contains confirmation before clearing history, reduced motion, a fixed Neon Purple theme label, local data export, and an About section. This is appropriately small for a static local application.

Potential issue:
- The Appearance section contains a non-interactive theme value. It looks like a setting, but currently offers no choice.
- The About copy mentions future account sync and cloud storage. This can create expectations about features that are not available.

**Direction**
- Present the theme as product information, not as a control, unless theme selection is implemented.
- Keep future roadmap language out of operational settings, or label it explicitly as “Not available in this build”.
- Explain export contents and local-storage boundaries before download.

### 11. Help & Feedback

**Severity: Medium — clarity / Legal review outstanding**

Help provides useful explanations of iframe restrictions, same-origin limitations, a tour restart, and feedback copying. This is valuable product trust content.

**Direction**
- Add a concise “What WebMotion can and cannot do” capability summary.
- Explain that feedback is copied to the clipboard and is not automatically sent to Gallagher’s Studio.
- Treat Privacy Policy and Terms of Service as product summaries unless complete, reviewed legal documents are actually provided. Do not imply legal compliance from placeholder summaries.
- Test clipboard permission denial and fallback behavior.

### 12. Interactive Product Tour

**Severity: High — onboarding runtime/accessibility verification outstanding**

The tour has seven hands-on steps, first-visit offer, Maybe later, Skip, Back, Escape dismissal, and restart entry points. Its design is more purposeful than a generic slide-based walkthrough.

However, source inspection cannot confirm:
- Whether the overlay and highlighted target layer correctly on every view.
- Whether focus order and keyboard navigation remain usable while the tour is open.
- Whether the panel and spotlight fit at 320–390 px widths.
- Whether all event-driven steps progress correctly in a real browser.
- Whether the automatic offer appears at the right moment without interrupting a first-time user.

The tour uses a dialog role with `aria-modal="false"`; focus management and screen-reader behavior need deliberate verification.

**Direction**
- Keep the hands-on approach selected for WebMotion.
- Preserve “Maybe later” and Skip.
- Avoid adding more tour steps.
- Test first-visit behavior, restart, persistence, Escape, focus handling, and mobile positioning before release.
- Consider delaying the first-visit prompt until the user has reached the workspace or shown intent, rather than allowing an immediate overlay to compete with the landing experience.

### 13. Responsive and accessibility consistency

**Severity: High — runtime verification outstanding**

The source includes responsive breakpoints, focus-visible styles, reduced-motion support, and mobile navigation controls. The project’s QA checklist already defines widths from 320 to 1440 px.

Source-level CSS cannot prove the layouts are correct on real devices. The preview area, device toolbar, custom dimensions, sidebar, tour, and result metrics are especially important to verify.

**Direction**
- Complete the existing QA matrix at 320, 360, 390, 768, 1024, and 1440 px.
- Test portrait and landscape on an actual Android phone and tablet where available.
- Test keyboard-only navigation, visible focus, 200% zoom, contrast, dialog focus, and screen-reader announcements.
- Do not close responsive issues based on source inspection alone.

## Cross-product consistency issues

| Area | Current concern | Required standard |
|---|---|---|
| Naming | “Testing”, “inspection”, “review”, and “checks” can blur together | Use one consistent vocabulary for automated vs manual work |
| Status | “Passed” and “Not automated” metrics need strict data definitions | Every status must be traceable to a real check or user action |
| Branding | Studio credit exists, but product identity is mostly generic SaaS styling | Product-specific visual signature with restrained Studio endorsement |
| Visuals | Unicode symbols and multiple decorative styles coexist | One governed icon and component language |
| CSS ownership | Multiple cascading redesign files | One source of truth per component and token |
| Documentation | README project tree omits the tour files | Documentation must match the current repository |
| Onboarding | Tour is feature-complete in source but unverified at runtime | Tour must be tested as a real workflow |
| Device support | Responsive CSS exists but is not device-certified | Browser/device evidence before release |

## Prioritized remediation backlog

### P0 — Trust and product integrity (before release)
1. Replace the hard-coded “Not automated” result count with data-derived reporting.
2. Define report item provenance and status semantics.
3. Align landing-page feature claims with manual capabilities actually shipped.
4. Ensure no UI implies that the visual pointer can remotely click or scroll external websites.
5. Update README structure to include the tour files and match the actual source.

### P1 — Product identity (before adding features)
1. Rewrite landing-page positioning around the concrete WebMotion workflow.
2. Define the “WebMotion — a Gallagher’s Studio product” relationship consistently.
3. Define a compact design system and component ownership rules.
4. Standardize iconography and reduce decorative effects that do not communicate state or hierarchy.
5. Rename ambiguous labels such as “Recent testing” and “LIVE WORKSPACE” where appropriate.

### P2 — UX maturity and validation
1. Validate the seven-step tour on real viewport sizes and with keyboard/screen-reader use.
2. Review dashboard hierarchy and remove repeated workflow copy.
3. Clarify static theme information and future roadmap wording in Settings.
4. Clarify that feedback is copied locally, not transmitted.
5. Complete the full browser/device QA matrix and record evidence.

## Recommended product identity direction

**Product promise:** A focused workspace for previewing websites across viewports and documenting manual QA findings.

**Brand relationship:** WebMotion is the product. Gallagher’s Studio is the developer and product studio behind it.

**Visual direction:** Keep Neon Purple, but make it more disciplined and recognizable:
- Deep plum/near-black surfaces as the foundation.
- Purple for primary actions and active navigation.
- Lavender for supporting emphasis.
- Neutral borders and restrained elevation.
- A signature viewport/inspection motif used sparingly.
- Consistent typography, spacing, radius, iconography, and motion.

**Product voice:** Precise, calm, transparent, and useful. Prefer concrete verbs—Preview, Compare, Review, Record, Reopen—over generic claims such as Perfect, Powerful, or Everything.

**Design principle:** Every visual element should establish hierarchy, explain state, support an action, or reinforce product identity. If it does none of those, remove or simplify it.

## Audit boundaries and next gate

This audit is based on the source code on `qa/stabilization-2026-11`. It does not certify visual rendering, browser interactions, accessibility, performance, or physical-device behavior.

No new feature should be added until:
1. P0 trust issues are resolved.
2. P1 identity decisions are approved and applied.
3. The current workflow passes browser/device QA.
4. The audit report and README accurately describe the shipped build.

**Current decision:** Keep this branch and the existing PR in draft. Do not merge to `main` yet.


## Remediation progress — 21 November 2026

The following source-level changes were applied after the initial audit:
- Results no longer display a hard-coded “Not automated” count or a misleading Passed metric. The summary now distinguishes recorded items, manual observations, browser limitations, and provenance-backed verified checks.
- Legacy locally saved items without provenance are never upgraded to verified status; legacy “passed” items are labeled as unverified.
- Applying a viewport no longer creates a QA finding. It is a workspace action, not evidence that the target website passed a test.
- Landing-page and workspace copy now describe viewport preview and manual review rather than implying automated website testing.
- A canonical `css/tokens.css` file now owns the shared color, type, spacing, radius, motion, and focus tokens. Duplicate root token declarations were removed from the base and polish stylesheets.
- Footer/sidebar attribution and legal-information labels were clarified.

These changes have not yet received interactive browser or physical-device QA. See [PRODUCT-IDENTITY-GUIDELINES.md](PRODUCT-IDENTITY-GUIDELINES.md) for the product standards and [QA-RELEASE.md](QA-RELEASE.md) for the remaining validation gate.
