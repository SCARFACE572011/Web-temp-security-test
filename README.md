# Stratton Security Group — Website

Marketing site for Stratton Security Group (Los Angeles, CA), built on top of the **baosh** HTML/PHP template and compiled to static HTML for deployment on Vercel.

## Stack

- **Source pages**: `*.php` files in the project root, with shared layout fragments in `parts/`. PHP `require_once` is used purely as a templating mechanism — no runtime PHP is needed.
- **Build**: a small Node script (`build.js`) inlines the includes, evaluates a couple of simple `$head_title` / `$page_title` placeholders, rewrites `.php` links to `.html`, and writes the output to `public/`.
- **Static assets**: `assets/` (copied verbatim into `public/assets/` at build time).
- **Brand overrides**: `assets/css/stratton.css` (loaded after the baosh styles).

## Local development

```bash
# Render the static site into public/ and serve it
npm run start

# Or just build
npm run build
```

`public/` is generated and gitignored.

## Deployment (Vercel)

`vercel.json` is preconfigured:

- `buildCommand`: `node build.js`
- `outputDirectory`: `public`
- `cleanUrls: true` (so `/about` serves `about.html`)

Push the repo to GitHub, import it in the Vercel dashboard, and it deploys with no extra configuration.

## Pages

| Source             | URL          | Notes                               |
| ------------------ | ------------ | ----------------------------------- |
| `index.php`        | `/`          | Hero, about, services, counters, CTA |
| `about.php`        | `/about`     | Mission, core values, why-Stratton  |
| `services.php`     | `/services`  | Six service categories              |
| `contact.php`      | `/contact`   | Contact details + Formspree form    |
| `404.php`          | `/404`       | Not found                           |

## TODO before launch

- Replace the Formspree placeholder in `contact.php` (`your-form-id`) with a real Formspree (or other) endpoint.
- Drop in real photography for the hero (`assets/images/slides/slider-v1-bg.jpg`) and any other place-holder imagery.
- Add a Google Analytics / Plausible snippet to `parts/layout/top-layout.php` if desired.
- Verify phone number and address against the live site.

## Credit

Underlying HTML/CSS based on the **baosh** multipurpose template. All marketing copy and brand styling are Stratton Security Group's.
