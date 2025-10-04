'use client';
import { z } from 'zod';
import { useState } from 'react';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(6, 'Phone is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Please enter a question or message'),
});

type Contact = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const [values, setValues] = useState<Contact>({ name: '', phone: '', email: '', subject: '', message: '' });
  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ContactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      setResult(null);
      return;
    }
    setErrors({});
    // Since GitHub Pages is static, we "simulate" a submission
    localStorage.setItem('contact:last', JSON.stringify(values));
    setResult('Thanks! We received your message and will get back to you shortly.');
    setValues({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  const field = (id: keyof Contact, props: any) => (
    <div className="flex flex-col gap-1">
      <input
        value={values[id] as string}
        onChange={e => setValues({ ...values, [id]: e.target.value })}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        {...props}
      />
      {errors[id as string] && <span className="text-sm text-rose-600">{errors[id as string]}</span>}
    </div>
  );

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <p className="max-w-2xl text-slate-600 mb-6">Whether it’s about shipping, tracking, or our services, we’re here to help. Expect a fast and reliable response.</p>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 max-w-3xl">
        {field('name', { placeholder: 'Name *' })}
        {field('phone', { placeholder: 'Phone Number *' })}
        {field('email', { placeholder: 'Email *', type: 'email' })}
        {field('subject', { placeholder: 'Subject *' })}
        <div className="md:col-span-2 flex flex-col gap-1">
          <textarea
            value={values.message}
            onChange={e => setValues({ ...values, message: e.target.value })}
            placeholder="Question *"
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.message && <span className="text-sm text-rose-600">{errors.message}</span>}
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-5 py-2 font-semibold shadow-soft hover:bg-emerald-700">Submit</button>
          {result && <p className="mt-3 text-emerald-700">{result}</p>}
        </div>
      </form>
    </section>
  );
}
