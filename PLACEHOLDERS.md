# Editable content checklist

All identity, employment, education, certification, project and contact examples are fictional. This file is the complete replacement map. You can personalize the reference privately on your own computer; you do not need to send anyone private details. Before publishing, consider everything in the repository and its history public.

The main source is the exported `content` object in **`js/content.js`**. `[]` below means “each item in this array.” Keep property names unchanged; edit their values. Plain text is rendered safely rather than interpreted as HTML. Lists can be extended by copying an item, preserving commas and editing the copy.

## Where to start

All paths in this table are properties inside `js/content.js`; they are not additional files. You can do these routine edits without changing rendering, filtering or validation logic.

| Goal | Properties to edit |
| --- | --- |
| Replace the identity | `name`, `brand`, `pageTitle`, the name in `about.lead`, then review other written paragraphs |
| Edit the introduction | `hero.eyebrow`, `hero.title`, `hero.role`, `hero.intro`, `hero.notes` |
| Edit the biography | `about.heading`, `about.lead`, `about.paragraphs`, `about.facts` |
| Add/remove work history | Complete objects in `experience`; `experienceHeading`, `experienceNote` |
| Add/remove education or certificates | Complete objects in `education` / `certifications`; their headings and `educationNote` |
| Edit skills | `skillsHeading`, `skillsNote`, complete `skills` groups and their `items` |
| Add/remove/filter work | Complete `projects` objects, `projectFilters`, `projectsHeading`, `projectsIntro` |
| Edit miniature previews | Each project's `previewContent`, `preview`, `previewLabel` |
| Change contact details | `contact.heading`, `contact.intro`, complete `contact.details` objects |
| Change chart values | Project `tags`; `chart.technologies` and `chart.colors` when adding a technology |

Copy a complete `{ ... },` record to add one; delete that complete block to remove it. Keep the array property and use `[]` for an empty list. Empty collections leave their section headings in place. Do not delete an array's closing bracket or the top-level `export const content` wrapper. Save, then refresh the HTTP preview. The [README Quick Start and project example](./README.md) show the workflow.

## Identity, browser tab and introductory section

- [ ] `brand`: the short text mark in the header/footer and the supplied SVG tab icon (`am`). Use 1–3 letters for the existing layout. The mint period next to the page logos is a separate decorative element in HTML.
- [ ] `name`: the display name in the hero (`Alex Morgan`).
- [ ] `pageTitle`: the browser tab title, applied by JavaScript. This is independent text: replacing `name` does not automatically replace the name in this title or `about.lead`.
- [ ] `pageDescription`: the meta description, applied by JavaScript.
- [ ] `referenceNote`: the educational/fictional note in the opening masthead. Keep a clear reference disclosure while using the supplied fictional material.
- [ ] `hero.eyebrow`: the small introduction above the display name.
- [ ] `hero.title`: the serif statement below the main name heading.
- [ ] `hero.role`: the professional title.
- [ ] `hero.intro`: the introductory paragraph.
- [ ] `hero.primaryCta` and `hero.secondaryCta`: button text. Their targets live in `index.html` (`#projects` / `#contact`).
- [ ] `hero.notesHeading`: the label introducing the working-method list.
- [ ] `hero.notes[].label`: each working-method label (Structure, Layout, Interaction).
- [ ] `hero.notes[].detail`: the corresponding description (Semantic HTML, Responsive CSS, Accessible JavaScript). Add or remove complete note objects as needed.
- [ ] `footer`: the footer sentence.

For a permanent identity replacement, also synchronize these initial/static values in **`index.html`**. Routine JavaScript-enabled previews use `content.js`; these mirrors matter before JavaScript runs, to some search engines and with JavaScript unavailable:

- [ ] `<title>` and `<meta name="description">`: keep them in sync with `pageTitle` / `pageDescription`, including the fictional name.
- [ ] The `data-content` elements contain initial fallback text for identity, hero, section headings and footer. JavaScript replaces this text, but keeping it consistent improves the initial HTML and no-JavaScript experience.
- [ ] The icon `<link rel="icon">` contains an inline encoded SVG with the fallback text `am`. With JavaScript, `js/main.js` safely replaces its text from `brand`; normal rebranding needs no SVG edits. To change the no-JavaScript fallback too, replace `am` immediately before `%3C/text%3E`, provide your own relative icon file, or remove the icon link. The renderer leaves an image-file favicon unchanged. Icon background/accent colors remain encoded in `index.html`.

The decorative `.hero-architecture` SVG in `index.html` contains only geometric paths, with no name, brand or other text to personalize. Its mint/teal path colors and geometry can be adjusted there; responsive sizing lives in `css/style.css`. Keep `aria-hidden="true"` and `focusable="false"` because it is decorative. The display name, statement and working notes still use the content properties above.

## About

- [ ] `about.heading`: section heading.
- [ ] `about.lead`: lead paragraph including the sample name.
- [ ] `about.paragraphs[]`: biography, background, interests and story; add/remove plain-text strings as needed.
- [ ] `about.facts[].label`: fact label, such as Focus, Approach or Based in.
- [ ] `about.facts[].value`: fact value, including the fictional city.

## Experience

- [ ] `experienceHeading`: section heading.
- [ ] `experienceNote`: the short description beside that heading.
- [ ] `experience[].period`: human-readable date range.
- [ ] `experience[].role`: position title.
- [ ] `experience[].organization`: employer or other context. Replace the full value, including the fictional label only when you have truthful replacement material.
- [ ] `experience[].type`: sample-position/learning label.
- [ ] `experience[].description`: position summary.
- [ ] `experience[].highlights[]`: each achievement or responsibility.

Do not convert sample achievements into claims about your own work. Replace them with things you have actually done when creating your independent portfolio.

## Education and certifications

- [ ] `educationHeading`: section heading.
- [ ] `educationNote`: the short description beside that heading.
- [ ] `education[].period`: dates.
- [ ] `education[].qualification`: degree or course.
- [ ] `education[].institution`: institution name.
- [ ] `education[].description`: background, subjects and explicit fictional note.
- [ ] `certificationsHeading`: the heading above the certification list.
- [ ] `certifications[].name`: course or certification name.
- [ ] `certifications[].issuer`: issuing organization.
- [ ] `certifications[].year`: year as a text value.
- [ ] `certifications[].note`: fictional/sample disclosure.

There are no fabricated certificate links or grades. If you add verification links yourself, use a real public destination and clear link text.

## Skills and chart

- [ ] `skillsHeading`: section heading.
- [ ] `skillsNote`: the short description beside that heading.
- [ ] `skills[].title`: each group heading.
- [ ] `skills[].description`: the group explanation.
- [ ] `skills[].items[]`: individual skill labels; add/remove strings.
- [ ] `chart.heading`: heading beside the visualization.
- [ ] `chart.description`: explanation of the illustrative project inventory; keep it accurate if you change what the chart describes.
- [ ] `chart.technologies[]`: the technologies to count, matching `projects[].tags` exactly, including capitalization.
- [ ] `chart.colors[]`: corresponding bar colors, in the same order as the technologies. Provide a readable color for each label.

Counts are calculated automatically in `js/chart.js`; do not edit the numbers in the generated table. Skill labels and chart labels are separate: the chart counts project tags, not skill-list membership. Keep the chart's illustrative-data explanation accurate.

## Sample projects, filters and illustrations

- [ ] `projectsHeading`: section heading.
- [ ] `projectsIntro`: the sentence beside the heading. The default says “Three approaches”; update it after changing the number of projects, or use count-neutral wording. The separate educational preview disclosure stays in `index.html`.
- [ ] `featuredProjectLabel`: the small label beside the first project's explanation (`Featured study`). The first record in `projects` is featured; reorder the array to feature another record.
- [ ] `projectFilters[]`: displayed filters. **All** is always added by the code. Other values must match a project category/tag exactly to produce results. An unmatched value deliberately shows an empty state.
- [ ] `projects[].id`: a unique, stable identifier for each content record.
- [ ] `projects[].name`: title.
- [ ] `projects[].category`: category text; can also match a filter.
- [ ] `projects[].description`: project summary.
- [ ] `projects[].tags[]`: technology names for filters, tags and chart counts.
- [ ] `projects[].preview`: choose `focus`, `weather` or `portfolio`. Unknown values use the portfolio artwork.
- [ ] `projects[].previewLabel`: useful alternative description of the selected preview.
- [ ] `projects[].previewContent.brand`: brand text inside the miniature (`still.`, `weatherly`, `FORM / FUNCTION`).
- [ ] `projects[].previewContent.eyebrow`: small contextual label inside the miniature.
- [ ] `projects[].previewContent.title`: main miniature heading or sample location.
- [ ] `projects[].previewContent.caption`: supporting sentence inside the miniature.
- [ ] `projects[].previewContent.detail`: the reading/index label, or the fictional temperature for the weather variant.
- [ ] `projects[].previewContent.items[].label`: each chapter, forecast day or project-index entry.
- [ ] `projects[].previewContent.items[].value`: each reading time, forecast temperature range or category.
- [ ] `projects[].link`: leave `''` for a concept with no destination, or enter a real full HTTP/HTTPS URL.
- [ ] `projects[].linkLabel`: descriptive link text when a valid link is provided.

**All miniature copy is now in `js/content.js`.** Edit the `previewContent` fields above and update `previewLabel` at the same time. The reading list, weather/location values and work index are illustrative, not live data or application screenshots. Preview colors, type sizes and layout live under the project-study rules in `css/style.css`; `createPreview()` in `js/projects.js` only creates the HTML. Missing `previewContent` uses the project name/category and omits optional details. Copying a complete record is the easiest way to add a study.

For example, after changing a project's category to `'Learning experiments'`, add that exact string to `projectFilters` if you want a matching button. Category edits do not generate new buttons automatically. **All** is the reserved reset label and remains available. Changing tags to include `'API'` adds this record to that filter and increases its chart count after reloading; editing a category alone does not change the technology counts. Adding a technology to the chart also requires its name in `chart.technologies` and a color at the same index in `chart.colors`.

The first record uses a larger featured layout. Supporting records flow below it. Filters preserve that designation, a single match fills the row and zero matches show the existing empty state. Adding a fourth or fifth record needs no CSS change. The chart still counts every original record's technology tags, independently of filtering.

No image files are supplied or required. If you add your own project screenshot, create `assets/images/`, use a relative path such as `./assets/images/my-project.webp`, change `createPreview()` to use an `<img>`, and assign meaningful `alt` text. Include only images you have permission to publish. Do not add private personal photos or a remote image tracker.

## GitHub demonstration and fallback records

- [ ] `demo.githubOrganization`: public GitHub organization login (`github` initially); **not a profile URL or personal-user login**. The UI inserts this name automatically.
- [ ] `demo.repositoryLimit`: requested/rendered count, clamped to 1–6. No pagination is performed.
- [ ] `demo.cacheMinutes`: successful public-response lifetime in the tab's `sessionStorage`; `0` disables reuse/writes. It is not a contact-data store.
- [ ] `demo.timeoutMs`: request timeout in milliseconds, clamped to 1000–30000.
- [ ] `demo.fallbackRepositories[].name`: invented demo repository title.
- [ ] `demo.fallbackRepositories[].description`: demo description, keeping explicit demo labeling.
- [ ] `demo.fallbackRepositories[].language`: illustrative language label.
- [ ] `demo.fallbackRepositories[].stars`: illustrative nonnegative number, not a live statistic.
- [ ] `demo.fallbackRepositories[].url`: normally `''` for invented records. A link must be a full HTTP/HTTPS GitHub URL; unsafe/other-host destinations are not rendered.

Fallback records are separate from `projects`, so they do not affect portfolio filters or chart counts. Keep enough fallback records for the configured display count if you want the same number of entries offline. Never insert a token, password or other secret into these settings.

## Contact

- [ ] `contact.heading`: section heading.
- [ ] `contact.intro`: invitation/explanation.
- [ ] `contact.details[].label`: Email, Location, Elsewhere, or another descriptive label.
- [ ] `contact.details[].value`: displayed fictional contact text (`hello@example.com`, example city/country, GitHub organization label).
- [ ] `contact.details[].url`: `''` for plain text or a full HTTP/HTTPS URL for a public web destination. The starter GitHub link points to the public organization, not a personal profile. `mailto:` is intentionally not supported by the shared web-link helper.

The form has **no delivery destination**. There is no hidden recipient or service to replace. Keep its demo disclosure and truthful validation-success message. Do not enter real visitor messages while testing.

## Static interface text and anchors

These are UI labels rather than personal content. Edit them only if you want to change the wording/language or structure:

| File | What is editable there |
| --- | --- |
| `index.html` | `lang="en"`, skip link, header/footer accessible destination suffixes, navigation labels and anchors, screen-reader heading prefix `The portfolio of`, `Read the profile` link, section labels, chart/table labels and illustrative explanation, API heading/initial description/button/disclaimer, contact/form disclosures, field labels, button label, footer reference note, no-JavaScript notice. Personal headings/section notes are `data-content` fallback mirrors; their normal editing fields are listed above. |
| `js/main.js` | Menu open/close labels, validation rules and inline error/status wording, period/organization separators used by generated content. Also synchronizes text in the supplied SVG favicon from `brand`; no separate personal content lives in that logic. Keep the explicit statement that nothing is sent or saved. |
| `js/projects.js` | Tag-list accessible name; `Fictional concept · Preview only` fallback link text; project count announcements. Miniature labels are in `content.js`, not this renderer. The empty-state paragraph itself is in `index.html`. |
| `js/api.js` | Loading/live/cached/empty/error/offline/rate-limit/fallback wording, repository metadata labels, fallback text for missing descriptions/languages and API request structure. Preserve ownership and fallback disclosures. |
| `js/chart.js` | Tooltip wording, chart axis/tick styling, chart success/failure status and exact count calculation. Table headings/canvas accessible description live in `index.html`. |
| `css/style.css` | `:root` colors, fonts and page width; breakpoint layouts; all artwork styles. CSS adds no personal content. |

If you rename a section ID in `index.html`, update **every link to that anchor**, including hero buttons, navigation, footer and the skip link if you change `main`. `aria-labelledby`, `aria-controls`, label `for` and `aria-describedby` values must still point to their matching IDs. Keep IDs unique. The JS also selects named IDs for interactive features; changing those requires matching code changes.

## Final review before any manual publishing

- [ ] Search the folder for `Alex`, `Morgan`, `am.`, `still`, `weatherly`, `Example`, `Fictional`, `Sample`, `Northline`, `Fieldwork`, `2022`, `2023`, `2024`, `2025` and `hello@example.com`. Decide which values are intentionally retained as reference examples.
- [ ] Review every external URL. `https://github.com/github` and the REST endpoint are real public demonstrations; they must not imply personal authorship.
- [ ] Check static `index.html` fallback text and favicon as well as the content module.
- [ ] Read the biography, dates, achievements, credentials and chart explanation for accuracy.
- [ ] Keep the reference/demo disclosures while the content is fictional.
- [ ] Confirm no credentials, private addresses, personal photos or private files appear in the files or Git history.
- [ ] Preview all sections and interactive states again after editing.
- [ ] Keep documentation honest: revise this guide and README when your changes alter behavior.
- [ ] Independently create and submit your own assessed university project according to your institution's rules; do not relabel this reference as that submission.
