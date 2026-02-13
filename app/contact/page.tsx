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

// Puerto Rico WhatsApp Business number (digits only, include country code 1, no +, spaces, dashes)
const WHATSAPP_NUMBER = '17758701999';

// Your Formspree endpoint (confirmed)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojnenep';

function isLikelyMobile() {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua);
}

// Avoid wa.me (you saw DNS issues). Use api.whatsapp.com on mobile, web.whatsapp.com on desktop.
function buildWhatsAppUrl() {
  const text = encodeURIComponent('Hi GO123 Logistics — I have a question.');
  if (typeof window === 'undefined') {
    return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${text}&type=phone_number&app_absent=0`;
  }
  return isLikelyMobile()
    ? `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${text}&type=phone_number&app_absent=0`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

export default function ContactPage() {
  const [values, setValues] = useState<Contact>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  // Honeypot anti-spam field (hidden)
  const [company, setCompany] = useState('');

  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(), []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    // If bot filled honeypot, silently succeed
    if (company.trim().length > 0) {
      setResult('Thanks! Your message was received.');
      setValues({ name: '', phone: '', email: '', subject: '', message: '' });
      return;
    }

    const parsed = ContactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as string;
        errs[key] = i.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        page_url: typeof window !== 'undefined' ? window.location.href : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to submit');
      }

      setResult('Thanks! Your message was sent. We’ll get back to you soon.');
      setValues({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setResult(
        'Something went wrong while sending your message. Please try again or message us on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (
    id: keyof Contact,
    props: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div className="flex flex-col gap-1">
      <input
        value={values[id] as string}
        onChange={(e) => setValues({ ...values, [id]: e.target.value })}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            Send us a message and we’ll respond as soon as possible.
          </p>
        </div>

        {/* WhatsApp icon only */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
          className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
        >
          <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M19.11 17.3c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44s1.02 2.83 1.16 3.02c.15.19 2.01 3.07 4.88 4.31.68.29 1.22.46 1.63.59.69.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z" />
            <path d="M16 3C8.83 3 3 8.6 3 15.5c0 2.45.74 4.73 2.01 6.65L3.8 28.5l6.62-1.99c1.83.96 3.92 1.49 6.16 1.49 7.17 0 13-5.6 13-12.5S23.17 3 16 3zm0 22.42c-2.11 0-4.06-.58-5.73-1.57l-.41-.24-3.93 1.18.79-3.73-.27-.39c-1.2-1.73-1.9-3.81-1.9-6.06C4.55 9.95 9.76 5 16 5s11.45 4.95 11.45 10.5S22.24 25.42 16 25.42z" />
          </svg>
        </a>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 max-w-3xl">
        {/* Honeypot (hidden) */}
        <div className="hidden" aria-hidden="true">
          <label>
            Company
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </label>
        </div>

        {field('name', { placeholder: 'Name *', autoComplete: 'name' })}
        {field('phone', {
          placeholder: 'Phone Number *',
          type: 'tel',
          inputMode: 'tel',
          autoComplete: 'tel',
        })}
        {field('email', { placeholder: 'Email *', type: 'email', autoComplete: 'email' })}
        {field('subject', { placeholder: 'Subject *' })}

        <div className="md:col-span-2 flex flex-col gap-1">
          <textarea
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            placeholder="Message *"
            rows={6}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

          <span className="text-sm text-slate-600">Prefer chat? Use the WhatsApp icon.</span>
        </div>

        {result && <p className="md:col-span-2 mt-1 text-emerald-700">{result}</p>}
      </form>
    </section>
  );
}
