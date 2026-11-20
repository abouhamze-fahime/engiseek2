# EngiSeek — first website version

Six main pages built with Next.js App Router, TypeScript and Tailwind CSS, plus a privacy notice. The source follows the supplied project brief: editorial serif headlines, restrained monochrome, the brand guide’s yellow CTA accent, existing product marks, and supplied bridge photography. The primary logo was extracted from page 4 of the supplied brand guide. No new brand mark was invented.

## Run locally

Use Node.js 22.13 or newer. From this directory:

```powershell
npm install
npm run dev
```

Open http://localhost:3000. Dependencies are already installed in this workspace.

```powershell
npm run build
npm start
npm run typecheck
npm test
```

`npm test` covers validation, missing configuration, database failure, saving before sending email, notification failure, duplicate retries, origin checks, spam fields and payload limits. Tests use mock services; they do not send email or create real database records.

## Connect the consultation form to Supabase

1. Open the `engiseekdb` project in the Supabase dashboard.
2. In SQL Editor, run `supabase/migrations/001_consultation_requests.sql` to create the table.
3. Create `.env.local` using `.env.example` as the template.
4. Set `SUPABASE_URL` to the Project URL from the project's Connect dialog. In Settings → API Keys, create or copy a secret key (`sb_secret_...`) and set `SUPABASE_SECRET_KEY`. Keep this key in the server environment. Existing deployments can continue using `SUPABASE_SERVICE_ROLE_KEY` for a legacy key. If both variables are set, the secret key takes precedence.
5. Restart the local server, submit a test request at `/consultation`, and confirm it appears in Table Editor → `consultation_requests`.

The table has row-level security enabled and no anonymous or authenticated browser access. Requests pass through `/api/consultation`, where input is checked before a server-side insert. No client details are saved in localStorage. Preview mode does not submit or store form entries and clearly says so.

## Connect notification email

Set `RESEND_API_KEY`, `RESEND_FROM` (a sender on a verified domain) and `CONSULTATION_NOTIFICATION_EMAIL`. Restart the server. The database insert completes before email is attempted. An email failure does not turn a saved request into an error. The table records `notification_status` as `pending`, `sent`, `failed` or `not_configured`.

There is no automatic notification retry worker in this first version. Review `failed`, `pending` and `not_configured` rows in Supabase and follow up manually. A repeated submission ID prevents duplicate records and repeated notifications.

## Vercel deployment

The supplied brief specifies Vercel. Import this directory as the project root with the Next.js preset. Set the same server environment variables in the hosting dashboard and set `NEXT_PUBLIC_SITE_URL` to your final HTTPS domain, then deploy. The URL supplies canonical links, share metadata and the sitemap. Do not upload `.env.local`.

No hosting account was connected or deployment created as part of this local first version. Supabase and Resend have not been connected or tested against live services.

## Editing the next version

- Main content, product descriptions and FAQ answers: `src/lib/content.ts`.
- Design tokens and responsive styles: `src/app/globals.css`.
- Home page: `src/app/page.tsx`.
- Form UI: `src/components/consultation-form.tsx`.
- Validation and save/email flow: `src/lib/consultation.ts` and `src/lib/consultation-handler.ts`.
- Database schema: `supabase/migrations/001_consultation_requests.sql`.
- Your website assets: `public/images/`.

The privacy notice identifies points that need company review before the public launch. Hosting region, retention, implementation timelines and product-specific data terms have deliberately not been invented. The parent consultancy’s 17 years of experience is attributed to that consultancy rather than presented as the age of EngiSeek.

For browser checks, start the site, install the Playwright Chromium browser with `npx playwright install chromium`, then run `npm run test:browser`. If browsers were installed to a custom location, set `PLAYWRIGHT_BROWSERS_PATH` to that directory. Browser checks save desktop and mobile previews in `test-results/`.

Implementation references: [Supabase Data API](https://supabase.com/docs/guides/api), [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Resend email API](https://resend.com/docs/api-reference/emails/send-email).
