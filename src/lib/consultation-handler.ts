import { validateConsultation } from './consultation.ts';
export type FormConfig = { supabaseUrl?: string; supabaseKey?: string; resendKey?: string; resendFrom?: string; notificationEmail?: string; siteUrl?: string };

export function getConsultationDatabaseConfig() {
 return {
  supabaseUrl: process.env.SUPABASE_URL?.trim(),
  supabaseKey: process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
 };
}

type Fetcher = typeof fetch;
function json(body: unknown, status = 200) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } }); }
export function createConsultationHandler(config: FormConfig, fetcher: Fetcher = fetch) {
 return async function handle(request: Request): Promise<Response> {
  const origin = request.headers.get('origin');
  // Require a browser request from the same origin or the configured canonical origin.
  const allowed = [new URL(request.url).origin];
  const host = request.headers.get('host');
  if (host && /^[a-z0-9.\-\[\]:]+$/i.test(host)) allowed.push(`${new URL(request.url).protocol}//${host}`);
  if (config.siteUrl) { try { allowed.push(new URL(config.siteUrl).origin); } catch { /* Invalid optional origin is not trusted. */ } }
  if (!origin || !allowed.includes(origin)) return json({ message: 'Please submit your request from the website.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ message: 'Please submit the consultation form.' }, 415);
  if (Number(request.headers.get('content-length')) > 16_384) return json({ message: 'Your request is too long.' }, 413);
  let input: unknown;
  try { const text = await request.text(); if (new TextEncoder().encode(text).length > 16_384) return json({ message: 'Your request is too long.' }, 413); input = JSON.parse(text); }
  catch { return json({ message: 'Please check your request and try again.' }, 400); }
  if (input && typeof input === 'object' && 'website' in input && (input as { website: unknown }).website) return json({ message: 'Unable to accept this request.' }, 400);
  const validation = validateConsultation(input);
  if (!validation.data) return json({ message: 'Please check the highlighted fields.', errors: validation.errors }, 400);
  if (!config.supabaseUrl || !config.supabaseKey) return json({ message: 'This form is in preview. Your request has not been submitted. Please email admin@engiseek.com.' }, 503);
  const data = validation.data;
  const endpoint = `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/consultation_requests`;
  const dbHeaders: Record<string, string> = { apikey: config.supabaseKey, 'Content-Type': 'application/json' };
  if (!config.supabaseKey.startsWith('sb_secret_')) {
   dbHeaders.Authorization = `Bearer ${config.supabaseKey}`;
  }
  let inserted = false;
  try {
   const response = await fetcher(`${endpoint}?on_conflict=id&select=id`, { method: 'POST', headers: { ...dbHeaders, 'Prefer': 'resolution=ignore-duplicates,return=representation' }, body: JSON.stringify({ ...data, phone: data.phone || null }), signal: AbortSignal.timeout(10_000), cache: 'no-store' });
   if (!response.ok) throw new Error(`database_status_${response.status}`);
   const rows: unknown = await response.json();
   if (!Array.isArray(rows)) throw new Error('database_response_invalid');
   inserted = rows.some(row => row?.id === data.id);
   if (rows.length && !inserted) throw new Error('database_response_invalid');
  } catch {
   // Never log the submitted client details or service credentials.
   console.error('Consultation database write was not confirmed.');
   return json({ message: 'Your request could not be confirmed. Please try again or email admin@engiseek.com. Your entries are still here.' }, 503);
  }
  // A repeated request ID is already durably stored. Do not send another email.
  if (!inserted) return json({ saved: true, message: 'Your request is with us. The team will contact you to arrange a conversation.' });
  let notificationStatus: 'sent' | 'failed' | 'not_configured' = 'not_configured';
  if (config.resendKey && config.resendFrom && config.notificationEmail) {
   try {
    const response = await fetcher('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': `Bearer ${config.resendKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `consultation-${data.id}` }, body: JSON.stringify({ from: config.resendFrom, to: [config.notificationEmail], reply_to: data.email, subject: `EngiSeek consultation — ${data.interest}`, text: `New consultation request\n\nName: ${data.name}\nCompany: ${data.company}\nRole: ${data.role}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nInterest: ${data.interest}\n\n${data.message}\n\nRequest ID: ${data.id}` }), signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error('email_failed');
    notificationStatus = 'sent';
   } catch { notificationStatus = 'failed'; console.error(`Consultation notification failed; saved request ${data.id} remains in the database.`); }
  }
  try {
   const update = await fetcher(`${endpoint}?id=eq.${data.id}`, { method: 'PATCH', headers: dbHeaders, body: JSON.stringify({ notification_status: notificationStatus }), signal: AbortSignal.timeout(4_000), cache: 'no-store' });
   if (!update.ok) console.error('Consultation notification status update failed.');
  } catch { console.error('Consultation notification status update failed.'); }
  return json({ saved: true, message: 'Your request is with us. The team will contact you to arrange a conversation.' });
 };
}
