'use client';
import { z } from 'zod';
import { useMemo, useState } from 'react';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(6, 'Phone is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Please enter a question or message'),
});

type Contact = z.infer<typeof ContactSchema>;

const WHATSAPP_NUMBER = 'PHONE_NUMBER'; // e.g. "15551234567" (no +, no spaces)
// Your Supabase Edge Function endpoint (you’ll create this)
const CONTACT_FUNCTION_URL = "https://YOUR_PROJECT_REF.functions.supabase.co/contact-submit";

export default function ContactPage() {
  const [values, setValues] = useState<Contact>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappUrl = useMemo(() => {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    const text = encodeURIComponent(
      `Hi Go123 Logistics — I’d like help with:\n\n` +
        `Name: ${values.name || '-'}\n` +
        `Phone: ${values.phone || '-'}\n` +
        `Email: ${values.email || '-'}\n` +
        `Subject: ${values.subject || '-'}\n\n` +
        `Message:\n${values.message || '-'}`
    );
    return `${base}?text=${text}`;
  }, [values]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const parsed = ContactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch(CONTACT_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          page_url: typeof window !== 'undefined' ? window.location.href : null,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to submit');
      }

      setResult('Thanks! Your message was received. You can also chat with us on WhatsApp.');
      setValues({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setResult('Something went wrong while sending your message. Please try WhatsApp instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (id: keyof Contact, props: any) => (
    <div className="flex flex-col gap-1">
      <input
        value={values[id] as string}
        onChange={(e) => setValues({ ...values, [id]: e.target.value })}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        {...props}
      />
      {errors[id as string] && (
        <span className="text-sm text-rose-600">{errors[id as string]}</span>
      )}
    </div>
  );

  return (
    <section className="container py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
          <p className="max-w-2xl text-slate-600 mb-6">
            Send us a message and we’ll respond as soon as possible. If you prefer instant help, chat with us on WhatsApp.
          </p>
        </div>

        {/* WhatsApp icon button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
          className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
        >
          {/* Simple WhatsApp icon (inline SVG) */}
          <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M19.11 17.3c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44s1.02 2.83 1.16 3.02c.15.19 2.01 3.07 4.88 4.31.68.29 1.22.46 1.63.59.69.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z" />
            <path d="M16 3C8.83 3 3 8.6 3 15.5c0 2.45.74 4.73 2.01 6.65L3.8 28.5l6.62-1.99c1.83.96 3.92 1.49 6.16 1.49 7.17 0 13-5.6 13-12.5S23.17 3 16 3zm0 22.42c-2.11 0-4.06-.58-5.73-1.57l-.41-.24-3.93 1.18.79-3.73-.27-.39c-1.2-1.73-1.9-3.81-1.9-6.06C4.55 9.95 9.76 5 16 5s11.45 4.95 11.45 10.5S22.24 25.42 16 25.42z" />
          </svg>
        </a>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 max-w-3xl">
        {field('name', { placeholder: 'Name *' })}
        {field('phone', { placeholder: 'Phone Number *' })}
        {field('email', { placeholder: 'Email *', type: 'email' })}
        {field('subject', { placeholder: 'Subject *' })}

        <div className="md:col-span-2 flex flex-col gap-1">
          <textarea
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            placeholder="Question *"
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.message && <span className="text-sm text-rose-600">{errors.message}</span>}
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-5 py-2 font-semibold shadow-soft hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Sending…' : 'Submit'}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            Prefer chat? Open WhatsApp
          </a>
        </div>

        {result && <p className="md:col-span-2 mt-1 text-emerald-700">{result}</p>}
      </form>
    </section>
  );
}
