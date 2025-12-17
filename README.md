<<<<<<< HEAD
# GO123 Logistics (Next.js App Router + TS + Tailwind + React Query + Zod)

Static site modeled after the provided designs: Home, About, Shipping Guide (with SCAC search), Contact, and Ocean Freight.

## Tech
- Next.js (App Router, TypeScript)
- Tailwind CSS k
- TanStack React Query (used to fetch the SCAC dataset)
- Zod (form validation for Contact page)

## Local Dev
```bash
npm i
npm run dev
```

## Build for GitHub Pages
This project is configured for **static export**.

1) Decide your repository name, e.g. `go123-logistics`.
2) Build with a base path (required for GitHub Pages subpaths):

On macOS/Linux:
```bash
export NEXT_PUBLIC_BASE_PATH=/$REPO  # e.g. /go123-logistics
npm run build
```

On Windows PowerShell:
```powershell
$env:NEXT_PUBLIC_BASE_PATH="/$env:REPO"
npm run build
```

3) The static files will be in `out/`. Push them to the `gh-pages` branch or use the included workflow below.

### Optional: GitHub Actions
Create `.github/workflows/gh-pages.yml` with:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }} npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

In **Repository Settings → Pages**, choose `Deploy from a branch` and select the `gh-pages` branch.

## Notes
- Since GitHub Pages is static, the **Contact form** stores the last submission in `localStorage` and shows a success message (no server required). You can wire it to a form backend (e.g., Formspree) if desired.
- The SCAC search uses a local static dataset: `public/data/scac.json`. Update it as needed.
- If you publish to a custom domain or the root of a user/org page, you can omit `NEXT_PUBLIC_BASE_PATH`.
=======
# go123logistics
Logistics website built with Next.js (App Router), TypeScript, Tailwind, React Query, and Zod — Business Use
>>>>>>> 642f78ed779df2cc1f46ea925913b5b88517a56b
