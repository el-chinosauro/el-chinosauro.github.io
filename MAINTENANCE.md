# Updating Lorenzo’s website

The site still uses Jekyll, Markdown, YAML and BibTeX. The academic pages use the `editorial` layouts; the older template and historical project URLs remain available. No database or hosted editor is needed.

## Preview locally

From this repository in Terminal:

```sh
bash bin/preview
```

Open **http://127.0.0.1:4000/**. Keep Terminal open while reviewing. Changes to content and styles rebuild automatically; changes to `_config.yml` require restarting the server. Stop with Control-C. A server already using port 4000 must be stopped before reopening it.

The Mac setup uses Ruby 3.2.2 under `~/.rbenv/versions/3.2.2/`, Bundler 2.5.7, ImageMagick and the existing Jupyter installation. Those match the existing deployment workflow. Dependencies are now installed. On a fresh computer, install Ruby 3.2.2, ImageMagick and Jupyter, then run `bundle install` with that Ruby on `PATH`.

For this Mac’s old `ffi` gem, the local, ignored Bundler configuration points to the installed macOS SDK. If reinstalling here, use:

```sh
export PATH="$HOME/.rbenv/versions/3.2.2/bin:/opt/homebrew/bin:/opt/anaconda3/bin:$PATH"
bundle config set --local build.ffi '--enable-system-libffi --with-ffi-include=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/ffi'
bundle install
```

To check the same production build used on GitHub:

```sh
export PATH="$HOME/.rbenv/versions/3.2.2/bin:/opt/homebrew/bin:/opt/anaconda3/bin:$PATH"
JEKYLL_ENV=production bundle exec jekyll build
```

The output is `_site/`, which is ignored by Git. The academic pages load local styles, scripts, icons, images and the CV. Historical template examples can fetch their external embeds during a first build.

## Biography and appointment

Edit `_pages/about.md` for the two biography paragraphs and their links. The homepage layout is `_layouts/editorial-home.liquid`; its name, portrait and short appointment block are there. Current and previous CV positions are in `_data/cv.yml`.

Professional links and the homepage’s icon row are in `_data/profile_links.yml`. Their original icon glyphs are in `_includes/editorial/icons/`. Main navigation is `_data/navigation.yml`; active links become bold automatically.

## Papers and figures

Published papers are in `_bibliography/papers.bib`; working papers are in `_bibliography/working.bib`. Keep existing paper keys stable. A typical entry is:

```bibtex
@article{surname_2027,
  title = {My new paper},
  author = {Surname, Firstname and Sileci, Lorenzo},
  journal = {Journal name},
  year = {2027},
  abstract = {The complete abstract.},
  doi = {10.example/example},
  html = {https://publisher.example/article},
  pdf = {/assets/pdf/my-paper.pdf}
}
```

For a working paper, add `status = {Under review}` or the actual R&R status. Use only public manuscript URLs. Keep private drafts as request links in their project files. To move a working paper to publications, move its BibTeX entry between the two files and remove its working-paper status. Keep its key and image metadata.

Add figure metadata under the same key in `_data/research.yml`:

```yaml
surname_2027:
  figure: /assets/img/research/surname_2027.webp
  thumbnail: /assets/img/research/surname_2027-thumb.webp
  caption: My figure caption
  coverage:
    - outlet: Outlet name
      url: https://outlet.example/article
```

The full figure opens when the thumbnail is clicked. The caption also supplies the image’s alternative text and enlargement title. Preserve scientific colours, axes, labels and legends. Use a complete figure with a proportionally reduced thumbnail; avoid cropping panels. The supplied research exports are lossless WebP. A PNG or JPEG also works when its filename is used in the metadata.

Coverage appears as small link buttons below Abstract and BibTeX. An informational prize badge uses an `award:` string. Do not add award announcements to the abstract.

`_plugins/editorial-research.rb` reads BibTeX and project metadata automatically during the build. Routine updates do not require editing the plugin or HTML. The reusable row is `_includes/editorial/paper.liquid`.

To remove a paper from the lists, remove its BibTeX entry and any matching featured key. Remove its metadata only if no project uses it. To change homepage selections or order, edit the four keys in `_data/featured_research.yml`.

Outreach entries, including their outlet, date, logo and article URL, are in `_data/outreach.yml`.

## Work in progress and private drafts

Edit the relevant Markdown file under `_projects/`. The current entries have an `editorial_key` matching `_data/research.yml` and a `research_group` of `wip` or `working`. WIP order follows `importance`, lowest first. Existing project URLs are retained.

```yaml
layout: editorial-project
title: My working title
description: (with Firstname Surname)
editorial_key: my_project
research_group: wip
importance: 4
draft_request: true
abstract_from_content: true
```

When `abstract_from_content` is true, the Markdown body is the abstract. `draft_request: true` adds an email link with the paper title in the subject. Projects without a public draft do not generate a fictional year or BibTeX citation.

## CV, teaching and talks

- Replace **`assets/pdf/lorenzo_cv.pdf`** with the latest PDF, keeping that stable filename. Both CV download controls use it. Update `_data/cv.yml` separately for the HTML CV; the PDF is not automatically parsed.
- `_data/cv.yml` contains Current Employment, Education, Prior Experience and Awards and Grants. Each entry has dates, title, institution, optional department and optional notes. Institutions align beneath positions automatically.
- The supplied `assets/pdf/lorenzo_cv_nov26.pdf` is a local reference copy, excluded from generated pages. It need not be included in a commit; the stable PDF already contains that version.
- Edit `_pages/teaching.md` for courses, topics, evaluations and links to materials. Put downloadable teaching files in `assets/` and use site-relative links.
- Edit `_pages/talks.md` for talks under each year. Omit dates within bullets. An invited badge is `<span class="talk-invited">invited</span>`; it is an informational label, not a link.

The original humorous subtitles are the `description` fields in the page files. The footer’s exact phrase is `footer_text` in `_config.yml`; the year updates automatically. Do not rewrite these during routine maintenance.

## Appearance

The academic stylesheet is **`assets/css/editorial.css`**. Its colour variables are at the top. Font, body size, content width and homepage name size have named variables near the end under “Production accessibility and route layouts”. Responsive rules preserve the approved tablet and phone layouts. JavaScript for the menu, theme, figure enlargement and back-to-top control is in `assets/js/editorial.js`.

The geological background is a static, unlabelled map from Regione Toscana; it does not require a live map service. Desktop and phone versions are under `assets/img/identity/`. Its attribution lives in `_includes/editorial/footer.liquid`. Research image sources and coverage verification are recorded in `_data/asset_provenance.yml`.

## Publish with GitHub Desktop

The redesign is on the local **`redesign-2026`** branch. Nothing has been pushed or published by this work.

The final local production build and the deployment’s PurgeCSS step passed on 11 November 2026. Browser checks covered all main pages at 320, 390, 768, 1024 and 1440 px, the preserved working-papers and project URLs, mobile navigation, dark-mode persistence, all ten figure enlargements and keyboard focus, the November CV download, and footer alignment. No horizontal overflow or JavaScript exceptions were found. The custom-domain file matches the existing published `www.lorenzosileci.com` value. GitHub Actions will run its own build when you publish.

1. Open this repository in GitHub Desktop and review the changed files. Keep the new layouts, includes, plugin, data and image directories selected along with the edited pages and stable CV. The dated CV reference may remain uncommitted.
2. Commit the redesign on `redesign-2026`. Publish/push that branch when ready. A push to this branch alone does not publish the site.
3. Switch to `master` and fetch/pull any newer commits. Click **Current Branch → Choose a branch to merge into master**, select `redesign-2026`, and confirm the merge. The equivalent menu command is **Branch → Merge into current branch**.
4. Push `master`. The existing **Deploy site** GitHub Action builds Jekyll, purges unused CSS and publishes `_site` to GitHub Pages.
5. Wait for that Action to succeed, then check **https://www.lorenzosileci.com/**.

For extra review before merging, open a pull request from the redesign branch. The existing pull-request workflow builds the site but skips publication. No hosting, DNS, CNAME or deployment-branch change is required.

The AJAE entry uses the final journal citation: **2026, volume 108(1), pages 254–284**, DOI **10.1111/ajae.12530**, verified against [Wiley’s publication record](https://onlinelibrary.wiley.com/doi/10.1111/ajae.12530). Its first online publication date was 9 February 2025. The internal key `palmer_2024` is intentionally unchanged so existing figure metadata and homepage selections continue to work. Both homepage and publications display the corrected year and DOI link.

You can return to the same Codex conversation for later edits. Reopen this repository as the workspace and describe what should change; this guide records the content locations and preview/publication commands if you start a new conversation instead.
