# Ophira Resort Residences

Bilingual Bahasa Melayu / English property website, with an animated hero, floor-plan filters, facility accordions, gallery controls and a six-step enquiry form.

- Vercel serves `dist/` at https://ophira-resort-dutamas.vercel.app.
- GitHub Pages publishes `dist/` through the existing GitHub Actions workflow.
- `api/leads.js` forwards validated submission requests to the existing Ophira Sites service. Both sites save into the same D1 `leads` table. GitHub Pages calls the Vercel endpoint using its explicitly allowed origin.
- The thank-you screen is shown only when storage confirms success. Failed requests preserve answers, and retries reuse the submission ID to prevent duplicate records.
- WhatsApp contact permission is optional and unchecked initially. Submitted personal details are not stored in browser storage or committed to this repository.
- Lead records can be viewed through the Ophira Sites settings database viewer. No public lead-reading endpoint is exposed.
- WhatsApp enquiry links use 011 7511 2280.

## Development

Run `npm ci` then `npm test`. The checked-in `dist/` files are the editable frontend. Vercel serves them without a build step and runs `api/leads.js` as a Node.js function.

The `server/worker.mjs`, `db/`, `drizzle/`, `.openai/hosting.json` and `scripts/build.mjs` files retain the Sites backend source. `npm run build` creates its Cloudflare-compatible output; it is not needed for Vercel. Do not reset or rewrite applied database migrations.

Project visuals and floor plans are illustrative. Confirm current project information with the sales representative.
