# Delivery quality checks

## Final content-editability audit — 19 November 2026

Audited the complete `content` object, its rendering bindings, static HTML, project previews, chart, API configuration and beginner guides. **82 distinct editable leaf-property paths** now have exact entries in `PLACEHOLDERS.md`. Portfolio content can be changed through `js/content.js` without editing application logic. Native interface labels, accessibility announcements, decorative shapes and required educational/demo disclosures remain in their appropriate files.

### Problems found and exact files changed

| File | Change and reason |
| --- | --- |
| `js/content.js` | Added `experienceNote`, `educationNote`, `certificationsHeading`, `skillsNote` and `projectsIntro`, previously static portfolio copy. Expanded work-history, education and certification objects across lines to make complete records easier to copy/delete. Added short editing comments. All original fictional values remain unchanged. |
| `index.html` | Bound those five fields through the existing `data-content` mechanism. Kept identical default text, the project introduction's line break, static fallback values, accessibility attributes and reference/demo notices. |
| `js/main.js` | Made the supplied SVG favicon reuse `brand`, so branding changes no longer require editing encoded SVG. The existing artwork is parsed and its text replaced with `textContent`; custom image-file favicons are left alone. |
| `README.md` | Expanded Quick Start with VS Code/Live Server, an exact name edit, branding, project copying and preview steps. Added a complete project object, array removal/empty-list guidance, matching categories/filters and chart-tag examples. Clarified name duplication and static fallbacks. Fixed the empty-repository tutorial's order: choose README/ignore/license options before Create repository. Added publishing/authentication references and `.nojekyll` guidance. |
| `PLACEHOLDERS.md` | Added a task-to-field map and the five new property paths; corrected favicon, fallback and static-interface locations. Explained separate name values, category filters, chart tags, empty lists and complete-record edits. |
| `qa/browser-check.mjs` | Added an optional `--editability` hook before the existing suites. The original 37 checks remain present. |
| `qa/content-edit-check.mjs` | Added optional source-edit exercises with an original-byte backup, restoration in `finally`, browser assertions and screenshot evidence. This module is never loaded by the portfolio. |
| `QA.md` | Recorded this audit, actual editing exercises, unchanged-appearance evidence, privacy scan scope and remaining limitations. |

No stylesheet, project-filter logic, form behavior, API behavior, chart calculation, dependencies, backend or publishing configuration changed in this pass.

### Executed editing exercises and regression results

Ran `node qa/browser-check.mjs --editability --accessibility` in Chrome 157.0.8103.79 / Node 22.15.1. The optional editing exercises made **real temporary edits to `js/content.js`**, saved and reloaded the page through HTTP, and restored the original file bytes before the accessibility and existing browser checks. The five requested screenshots below were opened and visually inspected, alongside the browser assertions; these are source-edit and browser reviews, not a beginner user study.

| Temporary edit | Observed result / ignored local evidence |
| --- | --- |
| Change name/branding | Jordan Example and `je` appeared in the hero/page logos; the tab title, About name and SVG icon text also updated after editing their documented fields. `editing-name-brand.png`. |
| Add a sample project | Four records rendered with one featured study and editable miniature text. Inserting Practice notes first intentionally featured it; its nested reading entry rendered. `editing-added-project.png`. |
| Change a project category | Changed Weatherly to Practice studies and added that exact filter. It selected only Weatherly, retained the active button state/focus and reported one match. `editing-category-filter.png`. |
| Change chart data through tags | After the extra CSS-tagged project and adding JavaScript/API tags to Still, chart and table both recomputed **3, 4, 3, 2**. No chart logic or hardcoded counts were edited. `editing-chart-tags.png`. |
| Remove an experience entry | Deleting the first complete object left the other two entries in order, starting with Web Development Intern. `editing-removed-experience.png`. |

The remaining editing checks exercised hero/About/skill/contact text and all five new bindings; adding education/certification records and removing those collections; and empty experience/skill/project arrays. Empty project data showed the existing empty state and four zero chart counts. **All eight editing checks passed.**

Restoration was verified by SHA-256 against the original `content.js` bytes. The restored page showed Alex Morgan, the original three projects and three work entries, and chart counts **3, 3, 2, 1**. A separate comparison verified that every pre-existing content value matches the pre-audit snapshot. No test project, category, identity or modified tag remains in the supplied content.

After restoration, **all 37 existing browser checks and all 12 accessibility checks passed**. The **10 axe-core 4.14.1 scans reported zero violations**; the existing contrast review flags and real-screen-reader limitations described below still apply. All six responsive widths and GitHub Pages style subdirectory paths passed, including the demo form's zero sending, keyboard behavior, filters, API states and chart fallback. All six production modules and all three QA modules passed syntax checks.

**Approved appearance preserved:** full-page 1440px and 375px baseline captures were saved before implementation. Their corresponding final captures are **byte-identical**, verified by buffer comparison and SHA-256. There are no intentional changes to appearance or default copy. Evidence: `qa/artifacts/editability-before/viewport-{1440,375}.png`, final `viewport-{1440,375}.png`, and `editability-visual-check.json`.

### Documentation, privacy and limitations

- Checked the publishing workflow against the official [GitHub Pages source configuration](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [site creation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [Git authentication](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#command-line), [VS Code source control](https://code.visualstudio.com/docs/sourcecontrol/overview) and [Live Server instructions](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). Local preview was exercised with the QA HTTP server, not by installing/running the Live Server extension or performing account sign-in/publishing.
- Reviewed 19 delivered source, documentation and vendor files, excluding ignored local QA artifacts and editor/Git metadata. Credential/private-key/token/credential-URL and private Windows user-path patterns found no matches. All email references use `example.com`; the identity, employers, education and contact material remain fictional. No real client personal information or credentials were found in this scope. Public GitHub links and third-party license credits remain intentional. This is a source review plus pattern scan, not a guarantee or a Git-history audit.
- Name, `pageTitle` and the name within `about.lead` are intentionally independent plain-text values; the guide explains editing each. Static metadata/fallback HTML still needs synchronization for a permanent identity replacement, especially before JavaScript runs or for crawlers. The normal rendered favicon follows `brand`; a custom image-file favicon remains an HTML setting.
- Empty collections retain their section headings. Filters use exact category/tag matches; chart labels count tags rather than Skills entries. Longer names, extra records and different text lengths still need responsive/readability review. Replacing a miniature with an actual screenshot or translating interface messages is outside routine content editing and can require HTML/renderer changes.
- There is no visual CMS, build step, live email service or backend. The form remains demo-only, and contact email remains plain text; the shared URL helper accepts HTTP/HTTPS only. No new dependencies, commits, pushes or deployment were performed. Existing screen-reader, other-browser, physical-device and deployed-site checks remain outstanding below.

Optional reproduction: use the axe download instructions in the accessibility section, then run `node qa/browser-check.mjs --editability --accessibility`. Do not edit `content.js` yourself while these temporary exercises run. `qa/artifacts/content-before-editability.txt` is the recovery copy if the process is forcibly terminated; normal completion or a caught test failure restores automatically. Other ignored evidence includes `content-editability.json`, `content-source-review.json` and the five `editing-*.png` captures. None are required production assets.

## Focused accessibility audit — 19 November 2026

Technical reference: [WCAG 2.2, Levels A and AA](https://www.w3.org/WAI/WCAG22/quickref/), with the WAI [disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) as supporting guidance. This is a targeted audit of the local reference, **not a full WCAG conformance claim**. Testing used Chrome 157.0.8103.79 on Windows, Node 22.15.1 and the free, development-only axe-core 4.14.1. No production dependency, backend, message sending, commit, push or deployment was added.

### Findings and corrections

| Finding | Correction and evidence | Relevant WCAG criteria |
| --- | --- | --- |
| Both brand links replaced visible `am.` with an unrelated accessible name. Baseline axe reported one rule violation affecting both links at 1440px and 375px. | Retained the native visible link text and added a visually hidden destination suffix. Browser accessibility names now include `am.` and the destination, including when the editable brand changes. | 2.5.3 Label in Name |
| The API refresh button lost focus when loading disabled it. | Used `aria-disabled` on the native button to preserve focus; the existing `busy` guard prevents repeated activation. Enter and Space during a delayed request produced no duplicate request. Focus stayed on Refresh. | 2.1.1 Keyboard; 2.4.3 Focus Order; 4.1.2 Name, Role, Value |
| The last navigation link was partly clipped in the short viewport at 400% browser zoom. Closing the menu by an outside click could also leave focus on a hidden link. | Constrained the open navigation to the available viewport height with native scrolling. All seven links were reached by Tab and were visible at 200% and 400%; Escape worked. Closing with focus inside returns it to the toggle, and mobile link activation still focuses its destination. | 1.4.10 Reflow; 2.1.1 Keyboard; 2.4.7 Focus Visible |
| Scroll-reveal containers could wait for an entrance animation after a child received keyboard focus. | Focus immediately clears the pending reveal, with a CSS `:focus-within` safeguard. Added scroll margins for the sticky header and a contrasting skip-link outline. | 2.4.7 Focus Visible; 2.4.11 Focus Not Obscured |
| Form-field borders had only **2.79:1** contrast against their fill. | Adjusted the border to **4.55:1** against the fill and **4.89:1** against the page. Error and focus colors remain distinct. | 1.4.11 Non-text Contrast |
| The empty form status was removed from layout before its first message; blur errors had no status announcement. | Keep the empty status available, announce a blur error through that existing polite region, retain associated inline errors and `aria-invalid`, focus the first invalid field on submit, and preserve explicit no-send success text. | 3.3.1 Error Identification; 3.3.3 Error Suggestion; 4.1.3 Status Messages |
| A generic API container had `aria-labelledby`; status elements duplicated their implicit live-region settings. | Removed the generic container label and redundant `aria-live`/`aria-atomic`. Retained native headings and `role="status"`, whose polite/atomic semantics are exposed in Chrome's accessibility tree. | 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value |

Semantic review found one H1, sequential heading levels, one main/banner/contentinfo landmark, labeled navigation, real section anchors, associated native input labels and no positive tabindex. The skip link transferred keyboard focus to main. The decorative hero SVG remains `aria-hidden="true"`, `focusable="false"` and ignored in the accessibility tree. Project miniatures retain image descriptions with their decorative internal text hidden. Ordinary functional text uses relative font sizing; miniature illustration captions remain deliberately smaller and are represented by their preview descriptions.

### Actual test results

- **All 37 existing browser checks passed after the final corrections**, including all six widths (320, 375, 768, 1024, 1440, 1920), filters/empty results, API cache and failures, chart-library failure, reduced motion, demo validation and zero form network requests.
- **12 additional accessibility checks passed.** Forward Tab traversal covered 27 stops at desktop and 21 with the mobile menu closed, from skip link to footer. The open menu was exercised separately with Enter, Space, Tab, Shift+Tab and Escape. Focus outlines were visible, no focused element was fully obscured by the header, and no focused reveal remained pending.
- **10 axe scans reported zero violations:** 1440px and 375px default, open mobile menu, one filtered project, form errors, demo success, expanded chart table, API fallback, and actual 200%/400% browser zoom. The enabled rule tags were `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`.
- **axe incomplete findings were retained and reviewed separately.** Its color-contrast rule requests review for the decorative footer arrow and some text overlapped by the sticky header at the scan's scroll position. Source color pairs checked numerically were: arrow 10.96:1, contact introduction 8.97:1, chart heading 14.66:1, chart description 10.58:1, project heading 15.94:1 and repository description 8.50:1. Relevant section, focus and zoom screenshots were opened for visual inspection. These are not reported as automatic passes or silently removed from the raw report.
- **Actual Chrome browser zoom was tested**, using the settings API in the fresh QA profile, rather than pinch magnification. At 200%, the 1440px outer window produced a 712 × 452 CSS-pixel layout viewport; at 400%, the 1280px outer window produced 316 × 226 CSS pixels. Page widths were 704 and 312 respectively: no horizontal page scrolling. Every open-menu link was reached and remained visible. Hero, Contact and open-menu screenshots were captured; zoom was restored to 100% afterward.
- **Text-spacing overrides** at 375px applied line height 1.5, paragraph spacing 2em, letter spacing .12em and word spacing .16em. There was no horizontal page overflow; Contact text, labels and form composition were visually reviewed. This sampling does not establish that every possible replacement text fits.
- **Accessibility-tree checks** verified form names, invalid state and error descriptions; polite filter/API/form statuses; the named chart table; and ignored decorative SVG. The keyboard-operated disclosure exposes all four computed rows (3, 3, 2, 1), with native table caption and row/column headers. Chart failure still opens the complete table. Mouse-only chart tooltips are supplemental to that table.
- **Reduced motion** disabled smooth scrolling, reveal transitions and chart animation; switching the preference while loaded made pending content visible and stopped chart animation.
- All six production modules and both QA modules passed Node syntax checks. A separate source inspection checked unique IDs, local references and documentation links. The public GitHub request succeeded separately after the mocks were removed; that network result is time-specific.

### Reproduce and inspect evidence

From the project root, with Node 22+ and Chrome installed, download the pinned development audit script once, then run:

```powershell
New-Item -ItemType Directory -Force qa/artifacts | Out-Null
Invoke-WebRequest -Uri 'https://unpkg.com/axe-core@4.14.1/axe.min.js' -OutFile 'qa/artifacts/axe-4.14.1.min.js'
node qa/browser-check.mjs --accessibility
```

`node qa/browser-check.mjs` still runs the original suite without requiring axe. Both modes serve only a temporary local preview under `/portfolio-reference/` and close their owned browser/server. axe is never imported by the portfolio or published as a required asset.

Ignored local evidence: `qa/artifacts/accessibility-baseline.json`, `accessibility-final.json` (raw violations/incomplete rules, accessibility-tree snapshot, focus traversal, zoom metrics and checks), `results.json`, and `a11y-*.png`. The original visual comparison remains in its `before/` and `after/` directories. Browser profiles are temporary development artifacts, not website files.

### Outstanding manual accessibility checks

- **Real screen-reader listening has not been performed.** NVDA/Jaws were not found in the checked installed locations. Windows Narrator is installed, but this headless tool session cannot verify its spoken output or browse-mode interaction. Accessibility-tree assertions do not replace this. With NVDA + Chrome/Firefox or Narrator + Edge, test heading/landmark navigation, menu state/focus, filter announcements, blur/submit errors and success, delayed API loading/fallback, and chart-table reading including library failure. Check for missing or duplicate speech and useful announcement timing.
- Test VoiceOver/Safari on macOS/iOS, other desktop browsers, real touch devices, Windows forced-colors/high-contrast mode, larger default fonts and longer personalized content. Text-spacing and contrast checks here are sampled, not a complete low-vision user evaluation.
- At high zoom, scrolling the page and the expanded navigation is intentional. Verify comfort and orientation with an actual low-vision user; recheck focus and the on-screen keyboard on a real mobile device.
- Recheck the actual GitHub Pages deployment only after the owner publishes it. This audit exercised local subdirectory paths, not a hosted deployment.

## Previous visual refinement checks

Checked after the architectural hero, Skills contrast and featured-project refinement on **19 November 2026**, using an installed **headless Chrome 157.0.8103.79 on Windows** and Node 22.15.1. These results describe the refined reference, not future edits or a deployed site. The full existing 37-check suite passed before and after this implementation.

This pass changes `index.html`, `css/style.css`, README, PLACEHOLDERS and this QA report. It replaces the faint hero lighting with a substantial decorative SVG arch study, gives Skills a full-width petrol background with a contrasting editorial data panel, and frames the featured project in a broad teal composition. Existing wording, content fields, section order and JavaScript are preserved. Documentation explains the SVG and presentation styles. Physical-device, other-browser and screen-reader checks remain manual below.

## Before/after visual verification

The unchanged site was captured first, then the implementation was captured using the same browser suite at **1440px desktop and 375px mobile**. Hero, Skills and project views were opened and compared visually for both widths, separately from functional assertions.

- Hero: the former empty space beside the desktop name now contains a visible mint/teal architectural arch. On mobile, that artwork occupies its own row below the name and leaves the statement and controls unobscured.
- Skills: the former navy area now has an unmistakable edge-to-edge petrol field; the chart and its explanation share a dark panel with a mint spine and a serif inventory heading.
- Work: the featured study now has a large colored frame and shared backing behind its preview and description; supporting studies retain the lighter framing. This distinction is visible on mobile as well as desktop.

Local evidence is preserved in `qa/artifacts/before/` and `qa/artifacts/after/`, with `hero-375.png`, `hero-1440.png`, `skills-375.png`, `skills-1440.png`, `work-375.png` and `work-1440.png` in each directory. `qa/artifacts/comparison.html` places the matching views side by side. These review files are ignored by Git and are not production pages. At least the hero and Skills are clearly different at ordinary screenshot scale; the featured-project framing supplies a third visible change.

## Executed browser checks

`node qa/browser-check.mjs` completed with **37 checks passed**. The script served the files under `/portfolio-reference/` on a temporary loopback HTTP server, exercising GitHub Pages style subdirectory paths. The server and the browser started by the completed run were closed afterward.

| Area | Executed checks and observed result |
| --- | --- |
| Responsive layouts | At 320, 375, 768, 1024, 1440 and 1920 CSS pixels, document width did not exceed viewport width, and the project cards did not overlap. Screenshots were saved at all six widths. |
| Local assets and modules | HTML, CSS, local Chart.js and all ES modules loaded below the project subdirectory. Baseline local asset requests reported no errors. The expected three experience entries and page title rendered. |
| Safe API rendering | HTML/script-shaped repository names and descriptions appeared as literal text. No injected image/script executed. JavaScript-protocol links and links to another host were not rendered. |
| Chart and text alternative | Chart.js created a chart. The table contained HTML 3, CSS 3, JavaScript 2 and API 1. Reduced-motion chart animation was disabled. Blocking the library hid the canvas, opened the table and displayed the fallback explanation. |
| Project filters | API showed one matching project; All restored all three; active `aria-pressed` changed. A deliberately unmatched filter produced the visible empty state and no cards. |
| Editorial project layouts | At each of the six requested widths, All (3), JavaScript (2), API (1) and an unmatched filter (0) had the correct count and no horizontal page overflow or overlapping studies. A single match occupied the full grid width. Preview headings, captions, labels and index containers stayed within their miniature, without horizontal clipping. |
| Adding and personalizing studies | Five temporary records rendered with exactly one featured study. HTML-shaped miniature text remained plain text; no image was inserted. The test restored the original collection afterward. |
| Demo form | Empty submission produced three inline errors and focused Name. Invalid email/short message were rejected. Valid fictional values displayed the explicit no-send success message. Overlength values were rejected by the validation function. Submission caused no network requests and did not add a query string to the URL. |
| Keyboard navigation | Enter opened the mobile menu; Tab reached its first link; Escape closed it and returned focus to the menu button. Keyboard interaction produced a visible outline. Choosing About closed the menu and focused that destination. |
| GitHub API states | Deterministic mocked responses exercised loading, empty, HTTP 429, HTTP 403, HTTP 500, network failure, malformed JSON structure and timeout. Failures displayed the explicitly invented demo fallback. Offline refresh made no GitHub request. |
| Cache resilience | A successful response was reused on reload without another request. Refresh bypassed cache. A malformed timestamp was ignored. Throwing storage access errors did not break the live-data path. |
| Reduced motion and reveals | Reduced-motion mode kept content visible and used instant CSS anchor navigation. In normal-motion mode, scrolling revealed the Skills heading and updated its active navigation indicator. |
| Basic accessibility structure | No duplicate IDs or unlabeled form controls were found in the rendered DOM. The static reference check also validated ARIA references and native label/anchor targets. |
| Contrast | The default primary text, muted text on page/section backgrounds, accent, error text and primary-button text/background combinations exceeded 4.5:1. This check covers these key color pairs, not every pixel or a full accessibility audit. |
| JavaScript unavailable | Navigation remained visible and the demo submit button remained disabled. A no-JavaScript explanation is present. |
| Runtime errors | No uncaught JavaScript exceptions occurred during the tested scenarios. Intentional blocked-library and failed-API scenarios can produce expected browser network diagnostics. |

The six viewport runs and the six editorial-layout runs each count as separate checks; the eight API state runs count as eight. Related assertions are grouped in the table for readability. The exact 37 test names and browser version are in the generated report.

## Real public API request

After disabling the API mocks, a separate browser request to GitHub succeeded. The displayed result was:

> Live public GitHub data from github · 3 repositories · Not portfolio work.

This confirms the public endpoint worked in the test environment at that time. Network availability, public repository contents and GitHub's request limits can change; the local fallback remains available.

Mocked adversarial API data may appear in the responsive test screenshots. Those records are QA inputs used to check safe text rendering, not the supplied fallback content or actual GitHub results.

## Executed source checks

- All six production JavaScript modules and the optional QA module passed `node --check` syntax checks.
- A Python standard-library HTML inspection found **48 unique IDs**, all seven original sections in order, and valid local anchor, label, `aria-labelledby`, `aria-describedby` and `aria-controls` references.
- Referenced local HTML assets and relative JavaScript imports resolved to existing files.
- Production JavaScript was checked for `innerHTML`, `outerHTML` and `insertAdjacentHTML`; none were present.
- Local documentation links were checked against the delivered files.
- The new Skills text/surface pairs and featured-study muted text were also checked numerically: the tested pairs ranged from 7.16:1 to 11.30:1, above 4.5:1.
- Hero and project-section screenshots were visually reviewed at **320, 375, 768, 1024, 1440 and 1920 CSS pixels**. A full desktop capture and representative mobile/tablet CV, skills and contact captures were also reviewed for reading order, legibility and spacing. The simpler opening, compact education layout, featured study and supporting studies remained readable.
- The single-project layout was visually checked on mobile and tablet. Desktop/mobile API fallback and the open chart table fallback were captured and reviewed. Their disclosures and data remained readable without a successful network/library load.

## What changed visually

- `index.html` and `css/style.css`: replaced the floating browser illustration with a typographic opening and working-method list; varied section proportions and headings; made Education a compact CV section; reduced excessive panel styling and spacing; integrated chart, API and form with the same restrained navy/teal system.
- `js/content.js`, `js/main.js` and `js/projects.js`: added editable working notes, direct fictional copy and centralized miniature labels; retained project records, tags, links and filtering; made the first original record the featured study and one filtered result fill the row.
- `README.md` and `PLACEHOLDERS.md`: added a short Quick Start and documented all new fields, miniature editing, featured-project ordering and additional-project behavior.

The public API implementation, cache/security defenses, chart count calculation and demo form validation were preserved. No production dependency or build step was added.

These are targeted static checks, not a W3C validator run, a formal penetration test or a complete WCAG conformance audit.

## Where to find optional local evidence

The ignored `qa/artifacts/` directory contains:

- `results.json`: timestamp, browser information and successful test names.
- `live-api-result.txt`: the separate real request's displayed result.
- `viewport-320.png`, `viewport-375.png`, `viewport-768.png`, `viewport-1024.png`, `viewport-1440.png`, `viewport-1920.png`: responsive page captures.
- `hero-375.png` and `hero-1440.png`: normal-motion top-of-page captures.
- `review-{hero,education,skills,work,contact}-{width}.png`: section views at each of the six requested widths.
- `projects-1-{width}.png` and `projects-0-{width}.png`: single-match and empty-state views at each width. The temporary **No matches** filter appears only in these QA inputs.
- `api-fallback-375.png`, `api-fallback-1440.png`, `chart-table-fallback.png`: explicit failure-state views.

These are local development artifacts and are excluded by `.gitignore`. Rerunning the QA script regenerates them. No package installation is required, but Node 22+ and an existing Chrome installation are necessary. The script uses Windows browser paths by default.

## Manual checks still recommended

- [ ] Test on an actual phone/tablet with touch input, portrait/landscape rotation and the on-screen keyboard. Automated viewport sizing is not physical-device testing.
- [ ] Test current Safari, Firefox and Edge independently. Only Chrome was exercised for this delivery.
- [ ] Review announcements and reading order with a screen reader such as NVDA or VoiceOver. ARIA/keyboard checks do not replace assistive-technology testing.
- [ ] Repeat the verified Chrome 200%/400% zoom checks in other browsers, and try larger default text and your own longer replacement content.
- [ ] Follow each external link and any project destinations you later add.
- [ ] After manually publishing, verify the actual GitHub Pages URL, deployed files and browser Console/Network. No repository, commit, push or deployment was performed here.
- [ ] Retest after editing content, labels, colors, IDs or layout.

The form is intentionally demo-only. Project concepts have no invented live destinations. The portfolio is a separate educational reference with fictional identity, work history and qualifications; it is not an assessed university submission.
