export const interests = ['Asset inspection', 'Bridge inspection', 'Aerodrome compliance', 'Electrical inspection', 'AI-powered forecasts', 'Data integration', 'Lab 55000', 'Airspace Lab', 'Aerowash', 'L33T', 'EngiFlow', 'Not sure yet'] as const;
export type Consultation = { id: string; name: string; company: string; role: string; email: string; phone: string; interest: string; message: string };
export type FieldErrors = Partial<Record<keyof Consultation, string>>;
export function validateConsultation(input: unknown): { data?: Consultation; errors: FieldErrors } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { errors: { name: 'Please check your request.' } };
  const raw = input as Record<string, unknown>;
  const get = (key: string) => typeof raw[key] === 'string' ? (raw[key] as string).trim() : '';
  const data: Consultation = { id: get('id'), name: get('name'), company: get('company'), role: get('role'), email: get('email').toLowerCase(), phone: get('phone'), interest: get('interest'), message: get('message') };
  const errors: FieldErrors = {};
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id)) errors.id = 'Please refresh the page and try again.';
  for (const key of ['name', 'company', 'role'] as const) if (data[key].length < 2 || data[key].length > 120 || /[\r\n\x00-\x1f]/.test(data[key])) errors[key] = `Enter your ${key} (2–120 characters).`;
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address.';
  if (data.phone && (data.phone.length < 6 || data.phone.length > 40 || !/^[+\d\s().-]+$/.test(data.phone))) errors.phone = 'Enter a valid phone number or leave it blank.';
  if (!(interests as readonly string[]).includes(data.interest)) errors.interest = 'Choose an area of interest.';
  if (data.message.length < 10 || data.message.length > 2000) errors.message = 'Add a brief message (10–2,000 characters).';
  return Object.keys(errors).length ? { errors } : { data, errors };
}
