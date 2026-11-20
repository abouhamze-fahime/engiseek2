import { createConsultationHandler, getConsultationDatabaseConfig } from '@/lib/consultation-handler';

export const runtime = 'nodejs';

export const POST = createConsultationHandler({
 ...getConsultationDatabaseConfig(),
 resendKey: process.env.RESEND_API_KEY,
 resendFrom: process.env.RESEND_FROM,
 notificationEmail: process.env.CONSULTATION_NOTIFICATION_EMAIL,
 siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
});
