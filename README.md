# XonLabs website

Static HTML, CSS, and browser JavaScript for `xonlabs.xyz`. The build generates real HTML routes for GitHub Pages; no application server or frontend secrets are needed.

## Local development

Use Node.js 24. Run `npm ci`, `npm run build`, `npm test`, then `npm run preview`. Open http://127.0.0.1:4173. Edit files under `src/`, `data/`, and `content/`, then rebuild to preview changes.

## Deployment

1. Merge the redesign into `main`.
2. In GitHub repository Settings → Pages, select **GitHub Actions** as the build source.
3. The Pages workflow builds, tests, and deploys `dist/`. Keep the custom domain `xonlabs.xyz` configured in Pages and retain the existing Cloudflare DNS records. `CNAME` is copied unchanged into the output.
4. Confirm the workflow succeeds and open `/projects/`, `/wiki/announc/`, `/issues/announc/`, `/discord/`, and an unknown URL directly.

The original analytics page remains available at `/statistics/`. The root `index.html` is the preserved original source; the deployment workflow publishes the generated `dist/index.html`.

## Configuration

`data/site.json` contains the domain, organization, and confirmed Discord invite `https://discord.gg/tzB3pJt6Zg`. The official uploaded `Xonlabs.png` is reused for the header, hero, footer, redirect, favicon, and sharing metadata.

`data/projects.json` is the only project registry. Only `published: true` projects are built or included in the public config. Set `featured`, `documentationEnabled`, and `issuesEnabled` independently. Optional `repository` must use `owner/repo`; optional `modrinthId` uses a verified ID. Announc+ uses `3ZoQg4i7`, verified against the original site's Modrinth project.

**Remaining configuration:** Announc+ currently has no publicly listed source or issues repository. Its `repository` is null and `issuesEnabled` is false. Supply its correct repository and enable issues when it is public and GitHub Issues is enabled. No unrelated repository is used as its tracker. Version fallbacks are intentionally null; verified stable versions are fetched at runtime.

For a new project, add a registry entry including `id`, `slug`, `name`, `description`, `category`, `categories`, `logo`, `repository`, `modrinthId`, `versionFallback`, `platforms`, `status`, `featured`, `published`, `documentationEnabled`, `issuesEnabled`, `minecraft`, and `docs`. Store Markdown in `content/<slug>/`. Each docs entry has `slug`, `title`, and `file`; the first article is at `/wiki/<slug>/`, subsequent articles at `/wiki/<slug>/<article>/`.

Announc+ documentation is a local snapshot of its published Modrinth description, with provenance in the Markdown header. It retains the source's platform caveats. Keep this snapshot updated when releasing. Add fenced code blocks with a language (for example `yaml` or `js`) for syntax highlighting. Browser code-copy controls, article navigation, full-text article search, and a heading table of contents are generated automatically.

## Data and issue reporting

Public GitHub and Modrinth APIs are fetched with timeouts and five-minute session caching. Errors and rate limits show unavailable states; downloads cover configured Modrinth projects, while organization metrics count public GitHub repositories and GitHub releases. Release totals are only displayed after all repository release pages have loaded. Pull requests are excluded from issue counts and lists. No GitHub token is stored or used by the browser.

Issue reports open the correct repository's GitHub issue creation page with an encoded title and Markdown body. The visitor reviews and submits on GitHub. Optional `issueTemplates` maps `Bug report`, `Feature request`, and `Enhancement` to template filenames that actually exist in that project repository. Long reports must be shortened or link to logs; nothing is silently submitted or dropped.

GitHub Pages cannot pre-render future issue numbers. Its custom `404.html` recognizes `/issues/<published-slug>/<number>/` and loads that issue at the original URL, including on refresh. Unknown routes retain the normal 404 screen. **These dynamic issue URLs initially return HTTP 404**, a GitHub Pages limitation, but render the requested issue in the browser. Static project, wiki, directory, and Discord routes return ordinary static pages. JavaScript is required for API data and dynamic issue details.

Remote Markdown is sanitized, unsafe URL schemes are rejected, raw API text is escaped, and syntax highlighting runs on sanitized code. The site supports keyboard navigation, narrow screens, and reduced motion. The generated deployment contains no private project entries.
