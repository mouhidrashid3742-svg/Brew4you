# Brew4You

Luxury coffee website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and MongoDB.

## Features

- Premium landing page with animated hero and reviews
- Searchable menu with category filters
- Build-your-own coffee customizer with live pricing
- Blog and contact pages
- Protected admin dashboard stub
- Floating WhatsApp and call buttons
- Dark mode, sticky navbar, smooth scroll, and scroll-to-top
- PWA manifest, sitemap, robots, and SEO-ready structure
- MongoDB backend with product API routes

## Local setup

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env.local` and fill in values.
3. Run:
   ```bash
   npm install
   npm run dev
   ```

## Notes

- The current environment does not have `node` or `npm` available in PATH, so dependency installation must be done after Node.js is installed.
- The admin dashboard uses a simple cookie-based login and requires `ADMIN_SECRET` in `.env.local`.
