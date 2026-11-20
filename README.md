# WebMotion

**Preview. Test. Perfect.**

WebMotion is a static website preview and testing workspace built with HTML, CSS, and vanilla JavaScript. It is designed to run on GitHub Pages and work without a required account.

## Current build

- Landing page with Features, How It Works, About, and footer navigation.
- Guest workspace with URL-based preview flow.
- Desktop, tablet, mobile, and custom viewport controls.
- Manual animation, interaction, and transition review panels (automatic timeline/DOM inspection is not active).
- Results report with honest status labels, saved session restoration, and print-to-PDF support.
- Local session history, reopen/delete, and JSON data export.
- Settings, local data export, clipboard-based feedback, privacy/terms summaries, fullscreen, and keyboard shortcuts.
- Responsive sidebar/drawer behavior for mobile.

## Important browser limitations

WebMotion does not bypass website security policies. A target website may block iframe embedding with Content Security Policy `frame-ancestors` or `X-Frame-Options`. Browser same-origin rules also prevent WebMotion from reading most external page content. In those cases, use **Open in new tab** and the manual review checklists.

Responsive viewport controls change the size of the preview frame. They do not certify that the target site is fully responsive. Manual checklist entries are recorded as observations, not automatic passes. Animation DOM inspection is not available in this sandboxed build.

## Run locally

Open `index.html` using a local static server. ES modules may not work when opening the file directly with a `file://` URL.

## Deploy to GitHub Pages

1. Open repository **Settings → Pages**.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Save and wait for the deployment URL to appear.

## Project structure

```
WebMotion/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── landing.css
│   ├── workspace.css
│   └── responsive.css
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

## Audit and current limitations

See [AUDIT.md](AUDIT.md) for the latest source-level audit, fixes applied, structural checks, and items that still require real-device/browser testing. The current build has not been certified through a full cross-browser QA run.

## Planned, not yet active

Supabase authentication, cloud sync, account management, advanced test automation, and server-backed reports are not connected in this version. No API keys or credentials are required by this static build.
