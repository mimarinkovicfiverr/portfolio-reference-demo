# A portfolio to learn from

## Quick Start

1. In VS Code, choose **File → Open Folder** and select this folder (the one containing `index.html`).
2. In **Extensions**, install [Live Server by Ritwick Dey](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). Right-click `index.html` → **Open with Live Server**.
3. Open `js/content.js`. Change `name: 'Alex Morgan'` to your chosen example name and save with **Ctrl+S**. The hero updates; for a complete name change, also edit `pageTitle` and the name in `about.lead`. Change `brand: 'am'` for both logos and the tab icon.
4. Find `projects`. Edit a record's `name`/`description`, or copy a **whole project object**, give it a unique `id`, and paste it before the list's closing `],` above `chart`. Section 3 below has a complete example. Edit its `previewContent` and `previewLabel` too.
5. Return to the browser; Live Server reloads saved changes, or use **Refresh**. Try the project filters and the chart's **View the data as a table**. Keep the fictional/reference disclosures and demo-only form.

Routine content edits stay in `js/content.js`. Use [PLACEHOLDERS.md](./PLACEHOLDERS.md) as the complete field map; CSS and application logic do not need editing for these steps.

A complete, fictional one-page developer portfolio built with semantic HTML, CSS and vanilla JavaScript modules. It is a **separate educational reference**, not a university submission. Alex Morgan, the biography, employers, qualifications, certifications, projects and contact details are invented examples.

The site includes responsive navigation, a timeline, project filters, a demo validation form, a read-only public GitHub request and an accessible Chart.js visualization. There is no framework, package manager, build process, backend, authentication or email service.

Accessibility features include native landmarks and headings, a keyboard skip link, visible focus outlines, labeled fields with associated errors, polite status updates, and a keyboard-operated chart data table. The mobile menu supports Escape and short viewports at high zoom; GitHub refresh keeps keyboard focus while loading. Reduced-motion preferences are respected, focused content appears immediately, and decorative artwork is hidden from screen readers. The focused audit uses WCAG 2.2 AA as a reference; it does **not** establish full conformance. See [QA.md](./QA.md) for measured results and outstanding screen-reader tests.

## 1. Open and preview the project

1. Install [Visual Studio Code](https://code.visualstudio.com/) if necessary.
2. In VS Code, choose **File → Open Folder** and select the folder containing `index.html`, `css`, `js` and this README. Open the project folder, not only an individual file.
3. Open **Extensions** in the left sidebar. Search for **Live Server** by Ritwick Dey and install it. This is an editor extension, not a website dependency.
4. Open `index.html`, right-click in the editor and choose **Open with Live Server**. Alternatively, use **Go Live** in the status bar.
5. Your browser should open an address like `http://127.0.0.1:5500/`. Your port or path may differ.
6. Change a sentence in `js/content.js`, save the file and watch the preview update. If necessary, refresh the browser.
7. Use **Go Live** / the port indicator to stop Live Server when finished.

**Why not double-click the HTML file?** This site uses ES modules: JavaScript files import code from other files. Browsers apply security restrictions to module loading through `file://`. A local HTTP server gives those files a consistent origin and correct JavaScript content type. A browser URL starting with `http://localhost` or `http://127.0.0.1` is the right approach.

**Alternative if Python is already installed:** in VS Code choose **Terminal → New Terminal**, check that the terminal is inside this project folder, and run:

```sh
python -m http.server 5500 --bind 127.0.0.1
```

Visit `http://127.0.0.1:5500/`. Stop the server with **Ctrl+C**. This command is only a preview tool; the published site does not need Python. Wamp or another existing static HTTP server also works.

## 2. Find your way around the files

```text
index.html                         Semantic page, section anchors, form, static UI labels
css/style.css                      Theme, layouts, CSS artwork, responsive and motion rules
js/content.js                      Editable structured sample content and demo settings
js/main.js                         Content rendering, menu, form, reveals, active section
js/projects.js                     Project cards, previews and filtering
js/api.js                          GitHub request, validation, cache and fallback states
js/chart.js                        Project technology counts, table and Chart.js setup
js/dom.js                          Shared safe text and web-link helpers
assets/vendor/chart.umd.min.js     Local Chart.js 4.5.1 distribution; do not edit
assets/vendor/chart.umd.min.js.map Matching source map for browser developer tools
assets/vendor/Chart-LICENSE.md     Chart.js MIT license; keep with the distribution
README.md                          Setup, editing, features, Git and publishing guide
PLACEHOLDERS.md                    Complete content replacement checklist
QA.md                              Actual checks, results and manual review checklist
qa/browser-check.mjs               Optional package-free local Chrome QA script
qa/accessibility-check.mjs         Optional axe, keyboard, zoom and accessibility-tree checks
qa/content-edit-check.mjs          Optional temporary source-edit exercises with restoration
.gitignore                         Excludes local editor files, secrets and test artifacts
.nojekyll                          Empty marker for plain static GitHub Pages hosting
```

The additions to the proposed JavaScript structure are `dom.js`, which avoids duplicating safe rendering helpers, and the optional QA scripts. Chart.js is stored locally so no runtime CDN is needed. Project previews are miniature HTML/CSS layouts, so `assets/images/` is unnecessary. Create that folder only if you add your own images. There are no personal photos, external fonts or image downloads.

## 3. Make your first content changes

Open `js/content.js`. Its exported `content` object is the main content desk. A property is a named setting such as `name`; an array is a list written between square brackets, such as `projects`.

```js
name: 'Your chosen public display name',
hero: {
  eyebrow: 'Your short introduction',
  title: 'What you build.',
  role: 'Your professional title',
  intro: 'One or two sentences describing your interests.',
  primaryCta: 'Explore my work',
  secondaryCta: 'Get in touch',
},
```

Keep quotes around text and commas between properties. Inside single-quoted strings, escape an apostrophe (`'I\'m learning'`) or use double quotes (`"I'm learning"`). Write plain text, not HTML. The renderer treats `<strong>` or `<script>` as text, not markup.

Change `brand`, `name`, `pageTitle`, `pageDescription`, `hero`, `about`, `experience`, `education`, `certifications`, `skills`, `projects`, `chart`, `contact` and `footer` as needed. The section headings, `experienceNote`, `educationNote`, `skillsNote`, `certificationsHeading` and `projectsIntro` also live there. **[PLACEHOLDERS.md](./PLACEHOLDERS.md) lists every property**, including filter values, chart labels, demo settings and the few static HTML duplicates.

For a full identity replacement, review `name`, `brand`, `pageTitle`, `about.lead` and any name you have written inside other paragraphs. These are separate plain-text values; changing `name` does not rewrite your biography automatically. A short brand of 1–3 letters fits the existing logo/tab-icon treatment best.

To add a project, copy one complete object inside `projects`, paste it before the array's closing bracket, give it a unique `id`, and edit the fields. There must be a comma between neighboring objects. `tags` controls both filtering and technology counts. The project order is its array order. **The first record is the featured study**; move another record to the beginning to feature it. The other records flow into two columns on wider screens and one on mobile. There is no hard-coded three-project limit.

For example, paste this whole object after the last project's `},` and before the `],` immediately above `chart:`. The final comma is intentional:

```js
    {
      id: 'practice-notes',
      name: 'Practice notes',
      category: 'Learning experiments',
      description: 'A fictional study of an accessible reading index.',
      tags: ['HTML', 'CSS'],
      preview: 'portfolio',
      previewLabel: 'Illustrative Practice notes index with one reading entry.',
      previewContent: {
        brand: 'notes.',
        eyebrow: 'FICTIONAL PRACTICE',
        title: 'Notes from practice.',
        caption: 'A small learning exercise.',
        detail: 'Reading index',
        items: [{ label: 'First experiment', value: 'Layout' }],
      },
      link: '',
      linkLabel: 'View practice notes',
    },
```

Update `projectsIntro` if its sentence still says “Three approaches”; count-neutral wording also works. To filter by the new category, add `'Learning experiments'` to `projectFilters`. Category/tag spelling and capitalization must match exactly. **All** is always available, even if you leave it out of the list. A category edit does not automatically create a filter button.

To remove a record, delete its entire `{ ... },` block, including nested `previewContent` or `highlights`. The same copy/edit/delete pattern works for `experience`, `education`, `certifications` and `skills`. For plain-text lists such as `about.paragraphs`, `skills[].items` and project `tags`, add/remove complete quoted strings and their separating commas. Keep the property and use `[]` if you want an empty list. Empty collections leave their section headings visible; sections are not automatically removed.

The chart updates on reload from `projects[].tags`. For example, adding `'API'` to another project's tags increases the API count by one. For a new technology, also add its exact name to `chart.technologies` and a readable color at the same position in `chart.colors`. Counts cover **all projects**, even while a project filter is active. Editing the Skills list does not change the chart.

Each project's `previewContent` holds the miniature's brand, small label, title, caption, detail and index rows. For example, change `projects[0].previewContent.brand` to rename the reading-page miniature, or change `projects[1].previewContent.detail` to replace the illustrative temperature. Update `previewLabel` to describe the new artwork. These are static illustrations, not live applications. You do not need to edit the rendering function to personalize their text.

All project links start empty (`link: ''`). This deliberately renders **Fictional concept · Preview only** instead of an invented live link. Add an actual full `https://…` link only when the destination exists and you can describe it truthfully. External links open in the current tab. HTTP/HTTPS are the only supported link protocols; the fictional email remains plain text. Adding real email sending is outside this reference's scope.

JavaScript updates the visible content, page title, description and the supplied SVG favicon from `content.js`. If you permanently replace the reference identity, also synchronize the initial `<title>`, `<meta name="description">` and matching `data-content` fallback text in `index.html` for the first render, search engines and visitors without JavaScript. The static icon still contains the fallback `am`; ordinary JavaScript previews use `brand` automatically. A custom image-file favicon can instead be supplied with a relative path in `index.html` and will be left unchanged by the renderer.

## 4. Adjust the design

At the beginning of `css/style.css`, `:root` defines colors, typefaces and page width. For example, `--accent` controls the restrained teal accent and `--bg` the navy page background. `--font` is the body/display sans-serif stack, `--serif` the editorial statement typeface and `--mono` the small reference labels. All are local/system fonts. Change these tokens before individual component rules. Recheck contrast after changing colors.

Layouts use Grid for larger compositions and Flexbox for navigation, tags and buttons. Breakpoints at 1600, 1100, 900, 700 and 360 CSS pixels adapt the layout. A narrow screen uses a menu button and single-column sections. Text uses local system fonts, so loading the page does not send a font request.

The opening uses a large name, a serif statement and a short list of working methods instead of a browser-window illustration. Edit its text in `hero`, including `hero.notesHeading` and `hero.notes[].label` / `.detail`. The profile uses a narrow title column, Experience keeps its timeline, and Education uses a compact CV layout. Skills and contact are open layouts separated by rules; only selected areas use a muted surface.

The hero includes an architectural arch study: an inline SVG with decorative paths in `index.html` (`.hero-architecture`). It has no editable text and is hidden from assistive technology. Its dedicated grid column keeps it clear of the name; mobile places a smaller version below the name. Edit path colors/shapes in the SVG and its sizing in `css/style.css`.

The **Architectural opening and contrasting editorial spreads** block in `css/style.css` controls the full-width petrol Skills background, dark editorial chart panel and broad teal frame around the featured study. The first project keeps this presentation when filtered; secondary studies keep their simpler previews. These visual treatments add no dependencies or content fields. The earlier **Quiet surface details** block retains the small Profile/Contact geometry and API framing, with its supporting geometry hidden on mobile.

Project miniatures are generated in `js/projects.js` and styled in CSS. Their text comes from `projects[].previewContent` in `content.js`; `previewLabel` provides an accessible description. The `focus` variant is a reading page, `weather` is a simple outlook, and `portfolio` is an editorial work index. CSS controls their visual layout only. The featured study uses a larger preview beside its explanation on desktop. One filtered result fills the available row, even if it is a supporting study; two or more results retain the appropriate hierarchy. All layouts stack on smaller screens.

## 5. Understand the JavaScript features

### Mobile navigation and reading flow

`main.js` opens and closes the mobile navigation using a normal button. `aria-expanded` communicates its state. Tab moves naturally from the button through the links; this navigation is not a modal dialog and does not trap focus. Escape closes the menu and returns focus to the button. Choosing a link closes it and moves focus to the destination section on mobile. Clicking or moving focus outside the header also closes it. A breakpoint change resets its state.

Anchor links target real section IDs, so section navigation remains native. Intersection Observer marks the section currently crossing a reading band with `aria-current="location"`. It also reveals content as it enters the viewport. If Observer is unavailable, content remains visible. `prefers-reduced-motion` removes smooth scrolling, reveal motion, hover movement and chart animation. A skip link becomes visible when focused.

### Project filtering

`projects.js` creates project studies from `content.projects`. Filter buttons come from `content.projectFilters`; **All** is always included. A project matches an exact category or an exact tag (case matters). The active button has `aria-pressed="true"`. A polite status announces the number of matching projects, and an unmatched filter shows a useful empty state. The renderer sets `data-count` on the grid so CSS can give a single result the full row. Featured status stays attached to the first original content record, rather than moving to whichever result happens to appear first. Filtering does not change the chart: that chart always describes the complete sample collection.

### Demo form validation

`main.js` checks the trimmed values:

| Field | Rule |
| --- | --- |
| Name | 2–80 characters; names are not restricted to English letters |
| Email | A simple `name@example.com` format, at most 254 characters |
| Message | 20–2000 characters |

Errors appear after leaving a field and when submitting. Each error is linked to its input with `aria-describedby`, and invalid fields use `aria-invalid`. A persistent `role="status"` region reports blur errors and validation results politely; the first invalid field receives focus after a submission attempt. Editing a checked field updates its error and clears any previous success message.

The submit handler calls `preventDefault()`. **No message is sent or saved.** The submit button stays disabled until this handler is attached, preventing default form navigation when JavaScript is unavailable. Success means only that the example values passed these browser checks. The code does not verify that an email address exists. Do not enter sensitive information. Form values do not enter the API cache, logs or URLs.

### Read-only GitHub demonstration

`api.js` sends one unauthenticated GET request to:

```text
https://api.github.com/orgs/github/repos?type=public&sort=updated&per_page=3
```

The organization, requested count, cache period and timeout are editable in `content.demo`. The example uses the public `github` **organization** endpoint; a personal account requires a different `/users/…/repos` endpoint and a corresponding code change. No token or authorization header is needed for public resources. **Do not add secrets to this static website.**

The response provides repository names, descriptions, languages, star counts and validated GitHub links. These repositories belong to their public owners, not the fictional portfolio author. Network strings are length-limited and rendered with `textContent`; network links must use HTTP/HTTPS on `github.com`. URLs with credentials and other protocols are rejected.

There are separate loading, live, cached, empty, offline, timeout, rate/permission-limit and general failure states. An empty successful response stays empty instead of inventing live results. Failures show stable **invented demo data** from `demo.fallbackRepositories`, clearly identified as such, including its illustrative star counts. A 403/429 message asks the visitor to try later. No repeated polling occurs.

While loading, Refresh uses `aria-disabled="true"` to preserve keyboard focus. The JavaScript `busy` guard prevents additional requests from mouse, Enter or Space activation. The results use `aria-busy`, and the adjacent status reports loading and the outcome.

Successful raw records may be stored in `sessionStorage` for five minutes by default. They are validated again when read. Storage is scoped to the current tab/origin, contains public repository metadata only, and is not required: disabled or full storage does not break the feature. **Refresh repositories** bypasses this cache. A visitor using the live demonstration connects directly to GitHub, which receives an ordinary network request. Offline mode uses local demo data; it does not pretend to have live data.

### Chart.js and its accessible alternative

`chart.js` counts how many sample projects include each `chart.technologies` name in their `tags`. The starting values are HTML **3**, CSS **3**, JavaScript **2**, API **1**. A project may contribute to several bars. These are **illustrative project counts**, not skill percentages, time spent, live GitHub statistics or claims about professional ability.

The chart is a responsive horizontal bar chart. The **View the data as a table** disclosure contains the exact same counts with proper row/column headings. The table is built before the library loads. If Chart.js is missing or fails, the canvas is hidden, an explanatory message appears and the table opens automatically. The library is a pinned local distribution with its MIT license, loaded separately so a failure does not block the rest of the page.

## 6. Keep an honest development history

Git records snapshots on your computer. GitHub hosts a copy online. A commit should describe a real change you have reviewed and understand.

These are optional publishing steps for later. Editing and previewing the reference needs no GitHub account, repository or Git commands. The workflow follows [VS Code's source-control guide](https://code.visualstudio.com/docs/sourcecontrol/overview).

You must do the following steps yourself. This reference was delivered without creating a repository, making commits, pushing or deploying anything. You do not need to share your GitHub password or give anyone access to your account.

1. Install [Git](https://git-scm.com/) if VS Code says it cannot find Git, then restart VS Code. Configure your chosen commit name and email using Git's setup instructions. If privacy matters, use the GitHub-provided no-reply address shown in your GitHub email settings.
2. Sign in to your own GitHub account in your own browser.
3. On GitHub, choose **New repository**, choose a name such as `portfolio-reference`, add an honest description and choose **Public**. Remember that both the files and their history will be public.
4. Before selecting **Create repository**, leave **Add a README**, `.gitignore` template and license options unselected: the local folder already includes documentation and ignore rules. This creates an empty remote for the first push. Choose a license later based on your rights to the material; keep the included Chart.js license.
5. In VS Code open **Source Control**. If this folder is not already in a repository, choose **Initialize Repository**. **If VS Code already shows an enclosing repository, stop and check the repository root** before initializing or publishing; avoid accidentally including unrelated files.
6. Open each changed file from Source Control. Review the diff. Confirm that no private information, tokens, `.env` files or `qa/artifacts` appear.
7. Use the **+** beside intended files to stage them. Staging means selecting the changes for the next snapshot. Review **Staged Changes** again.
8. Enter a factual message such as `Add educational portfolio reference and setup guide`, then choose **Commit**. This creates a local snapshot only.
9. Ensure the branch is named `main`. In VS Code, use the branch indicator in the bottom-left corner or the Command Palette's **Git: Rename Branch** if needed.
10. Open the Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**), choose **Git: Add Remote**, enter `origin` as the remote name and paste the HTTPS clone URL from the repository you created, for example `https://github.com/YOUR-USERNAME/portfolio-reference.git`. If `origin` already exists, inspect it before changing anything.
11. In Source Control's **…** menu choose **Push** (or **Publish Branch** for the first push) and select `origin` if prompted. Sign in through the normal GitHub/VS Code browser flow. GitHub account passwords are not accepted for command-line Git authentication; see [GitHub authentication guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#command-line) if sign-in fails. Never paste credentials into a source file or remote URL. Check the remote URL if VS Code instead offers to create another repository. You already created the target repository.
12. Open GitHub and confirm that the correct files are on `main`, with `index.html` at the repository root. Never force-push just to resolve an unfamiliar error. If a remote already has changes, fetch and review them before integrating them.

Later, repeat **edit → preview → review diff → stage → commit → push** for real increments. Useful messages include `Improve keyboard focus in mobile navigation` or `Add a project filter empty state`, only when you actually make those changes. Do not fabricate older dates, split a completed project into a false history, invent work sessions or claim someone else's reference work as your own.

## 7. Publish manually with GitHub Pages

For this static site, use GitHub's **Deploy from a branch** option. [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) describe the current interface.

1. Push your reviewed work to the `main` branch of your public repository.
2. In that repository choose **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, select **main** and **/(root)**, then choose **Save**. The root must contain `index.html` with that exact lowercase name.
5. Wait for GitHub to finish publishing. Look at the Pages settings for the public URL, and check the repository's **Actions** tab if publishing reports an error. GitHub may run its own Pages deployment workflow even though you have no custom build step.
6. Choose **Visit site** when available. A project repository normally uses `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`. A repository named `YOUR-USERNAME.github.io` uses the domain root instead. Copy the URL GitHub actually shows; do not guess from the repository page URL.
7. Open the public URL in a private browser window. Refresh, visit each anchor, change a project filter and test the form with fictional values. Check DevTools **Console** and **Network** for failures. Confirm that your latest changes appear.

All production asset paths are relative (`./css/style.css`, `./js/main.js` and module-relative imports). The Chart.js URL is resolved relative to `js/chart.js` using `import.meta.url`. This lets the same source work beneath a project subdirectory. Do not change these paths to `/css/…` or `/js/…`, which would point at the domain root.

Keep the existing empty `.nojekyll` file at that root for plain static publishing. No build command or server-side program is needed. GitHub Pages is publicly accessible on the free public-repository route used here; upload only material intended for the public. The [official site-creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) explains availability and publishing delays.

## 8. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Published page returns 404 | Confirm Pages is enabled for `main` + `/(root)`, the deployment finished, and lowercase `index.html` is at that root. Copy the URL from Pages settings, including the repository name. |
| CSS or JavaScript is missing | Open DevTools → Network and reload. Look for 404 requests. Keep relative paths and matching filename capitalization: Windows may hide a case error that GitHub exposes. |
| Hero appears but sections are empty | Use an HTTP server, not `file://`. Check Console for a syntax/import error and correct the first reported file and line. Verify quotes, commas and closing brackets in `content.js`. |
| Module MIME-type error | The server may be returning an HTML 404 page for a `.js` URL. Check the URL and file path first; ensure the server serves `.js` as JavaScript. |
| GitHub shows demo fallback | This is expected offline or when requests fail, time out or are limited. Confirm the organization is public and is an organization, check Network, and try Refresh later. Never add a private token to fix a public demo. |
| No repositories after a request | A successful empty response is shown honestly. Check the organization setting and use Refresh. |
| Chart shows a table only | Check that `assets/vendor/chart.umd.min.js` exists, loads successfully and has not been edited. The table remains the full alternative. |
| Filter gives no matches | Names are case-sensitive. Match `projectFilters` with a project `tags` entry or `category`, or choose All. |
| Form does not send email | Correct behavior: it validates only. Read the notice above the fields. |
| Changes do not appear | Save the file, check the active local server, hard-refresh (**Ctrl+Shift+R**), and confirm you pushed the change if viewing GitHub Pages. API cache affects only public repositories; Refresh bypasses it. |
| Push is rejected | Check `origin`, authentication and whether the remote has commits you do not have. Fetch and review remote changes. Do not overwrite unfamiliar history. |

To open developer tools, use **F12** or **Ctrl+Shift+I** in most desktop browsers, or the browser menu → Developer tools. Read the first red Console error, click its filename and line, fix it and reload. Simulated API/chart failure tests can intentionally produce network error messages; normal operation should not produce uncaught JavaScript errors.

## 9. Test the result yourself

Use the DevTools device toolbar to set widths to **320, 375, 768, 1024, 1440 and 1920 CSS pixels**, then try ordinary window resizing as well. Confirm there is no horizontal page scrolling, clipped text, overlapping content or hidden form controls. Test portrait and landscape on a real phone when available, and try 200% zoom with a desktop browser.

Use only the keyboard: Tab to the skip link, header, menu, filter buttons, table disclosure and form. You should see a clear focus outline. Use Enter or Space on buttons, Escape in an open mobile menu, and Tab to move onward. Submit an empty form, an invalid email, a short message and then valid fictional values. Check that the first error receives focus and success says nothing was sent.

Test the API once online and once using DevTools' offline mode (then click Refresh). In Network, blocking `*chart.umd.min.js*` and reloading tests the chart alternative. Turn request blocking off afterward. Change `projectFilters` temporarily to include a tag that no project uses to test its empty state, then restore it. Turn on your operating system's reduced-motion setting and check that navigation and content still work.

See [QA.md](./QA.md) for the checks actually performed for this delivery and remaining manual checks. If you already have Node 22+ and Chrome installed on Windows, `node qa/browser-check.mjs` runs the included deterministic browser checks. Node and Chrome are **optional development tools**, not website dependencies. The script uses a temporary local server, a fresh headless browser profile and mocked API responses; it finishes with a separate real API attempt and closes its owned server/browser. Artifacts in `qa/artifacts/` are ignored by Git. Review the script before running it on another system; browser paths are Windows defaults.

## 10. Internet and offline behavior

With the files available through an already-running local HTTP server, layout, illustrations, navigation, filtering, form validation, the local Chart.js chart and table work **without internet**. The real GitHub request needs internet; it falls back to labeled local demo records when unavailable. Following external links also needs internet.

An initial visit to GitHub Pages needs internet to download the site. There is **no service worker or guaranteed offline-install support**, so a downloaded or previously visited public page is not guaranteed to reload offline. Do not confuse offline local preview with an offline-capable hosted app.

## 11. Use the reference responsibly

Use this code to study structure, behavior and documentation. You must independently design, develop, commit, publish and submit your **own assessed university project** in line with your institution's rules. Keep the reference separate from that work, acknowledge sources where required and be able to explain every choice you submit. This delivery does not supply an assessed submission or promise a grade.

No account access, fabricated Git history, automatic commits, automatic deployment, paid service, backend or real message processing is included.

## Technical references

- [GitHub REST: list organization repositories](https://docs.github.com/en/rest/repos/repos#list-organization-repositories)
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Chart.js installation](https://www.chartjs.org/docs/latest/getting-started/installation.html)
- [Chart.js accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html)
- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

Chart.js 4.5.1 is distributed under its included MIT license. The portfolio's illustrations are code-generated examples, and its font stack uses fonts already on the visitor's device.
#   p o r t f o l i o - r e f e r e n c e - d e m o  
 