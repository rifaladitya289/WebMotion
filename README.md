# WebMotion

**Preview. Compare. Record.**

WebMotion is a focused website viewport preview and manual QA documentation workspace built with HTML, CSS, and vanilla JavaScript. It is designed for GitHub Pages and does not require an account.

## Current capabilities

- Landing page and guided workspace flow.
- URL normalization and contained website preview.
- Desktop, laptop, tablet, mobile, and custom viewport presets.
- Desktop/laptop visual pointer simulator.
- Manual responsive, animation, interaction, and transition review.
- Results report, local session save/restore, history management, and print-to-PDF.
- Settings, reduced-motion preference, local JSON export, clipboard feedback, and help/legal summaries.
- Seven-step hands-on Interactive Product Tour, offered on first visit and restartable from Overview or Help & Feedback.
- Responsive sidebar navigation and Gallagher’s Studio project attribution.

## Important limitations

- A target website may block iframe embedding using Content Security Policy `frame-ancestors` or `X-Frame-Options`.
- Browser same-origin policy and the iframe sandbox prevent reliable access to arbitrary third-party page content or trusted remote clicks, right-clicks, and scrolling.
- The virtual mouse is a visual pointer simulator. For real interaction, use the embedded page directly when it works or open the target in a separate tab.
- Responsive controls change the preview viewport; they do not certify a website on every physical device.
- Animation, interaction, and transition checks are manual observations, not automated passes.
- Authentication, cloud sync, and server-side reports are not active in this static build.

WebMotion intentionally keeps the iframe sandboxed. Do not add `allow-same-origin` or remove sandbox protections merely to imitate remote control. A true remote-browser experience is a separate backend architecture.

## Run locally

Serve the repository with a local static HTTP server. ES modules may not work when opening `index.html` directly through a `file://` URL.

## Deploy with GitHub Pages

1. Open repository **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select `main` and `/(root)`.
4. Save and wait for the deployment to finish.

## Project structure

```
WebMotion/
├── index.html
├── README.md
├── AUDIT.md
├── css/
│   ├── style.css
│   ├── landing.css
│   ├── workspace.css
│   ├── responsive.css
│   ├── polish.css
│   ├── preview-redesign.css
│   ├── testing-redesign.css
│   ├── results-redesign.css
│   ├── history-redesign.css
│   ├── settings-help-redesign.css
│   ├── studio-attribution.css\n│   └── tour.css
└── js/
    ├── app.js
    ├── state.js
    ├── navigation.js
    ├── preview.js
    ├── testing.js
    ├── results.js
    ├── history.js
    └── settings.js
```

## Project identity

WebMotion is a Gallagher’s Studio development project. The product attribution is displayed in the workspace sidebar and site footer.

## QA status

See [PRODUCT-IDENTITY-GUIDELINES.md](PRODUCT-IDENTITY-GUIDELINES.md) for the approved product identity rules. See [PRODUCT-IDENTITY-AUDIT.md](PRODUCT-IDENTITY-AUDIT.md) for the product identity and anti-AI-slop review. See [AUDIT.md](AUDIT.md) for source checks, fixes, known limitations, and current release status. Use [QA-RELEASE.md](QA-RELEASE.md) for the manual browser/device test matrix. Source checks are not a substitute for runtime testing.
