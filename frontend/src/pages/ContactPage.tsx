import React, { useState } from 'react';
import { PageType } from '../types';
import { CheckCircle2, Phone, MapPin } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageType) => void;
  // onBookNow is passed by App.tsx — kept in interface to avoid TS errors
  onBookNow?: () => void;
}

// Verified contact details
const PHONE_1 = '9972727446';
const PHONE_2 = '+91 89519 70259';
const PHONE_2_TEL = '+918951970259';
const LOCATION = 'Mangalore, Karnataka, India';

const SERVICE_OPTIONS = [
  'Interior Painting',
  'Exterior Painting',
  'Decorative Wall Textures',
  'Colour Consultation',
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  details: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  service?: string;
  details?: string;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  details: '',
};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// ---------------------------------------------------------------------------
// Note on form submission:
// This project has no backend API endpoint or email service configured.
// The form currently simulates submission with a client-side delay.
// To integrate a real submission, connect to a service such as Formspree,
// EmailJS, or a custom API route and replace the setTimeout below.
// ---------------------------------------------------------------------------

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      e.email = 'Email address is required.';
    } else if (!validateEmail(form.email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!form.service) e.service = 'Please select a service.';
    if (!form.details.trim()) e.details = 'Please describe your project.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitResult(null);

    // Simulated submission — replace with real API call when backend is available
    setTimeout(() => {
      setIsSubmitting(false);
      // Simulate success; change to 'error' if the API call fails
      setSubmitResult('success');
      setForm(EMPTY_FORM);
    }, 900);
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border border-[#1e1e1e]/20 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#321B35] transition-colors placeholder:text-[#1e1e1e]/40';
  const labelClass = 'block text-xs font-medium text-[#1e1e1e]/70 mb-1.5';
  const errorClass = 'mt-1.5 text-xs text-red-600';

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-16 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* ── Left column: heading, form, contact cards ── */}
          <div className="lg:col-span-6 space-y-10">

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl text-[#1e1e1e] font-normal tracking-tight leading-[1.1]">
                Let's Talk About<br />Your Space
              </h1>
              <p className="text-base text-[#1e1e1e]/70 font-light leading-relaxed max-w-md">
                Planning a fresh coat of paint or a distinctive wall texture? Tell us about your
                project, and we'll help you explore the right colours and finishes.
              </p>
            </div>

            {/* ── Success state ── */}
            {submitResult === 'success' ? (
              <div className="p-7 bg-white rounded-2xl border border-[#321B35]/15 space-y-3">
                <div className="flex items-center gap-2 text-[#321B35] font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-base font-serif">Enquiry received</span>
                </div>
                <p className="text-sm text-[#1e1e1e]/75 font-light leading-relaxed">
                  Thank you for getting in touch. We'll review your enquiry and contact you as soon
                  as possible.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitResult(null)}
                  className="mt-2 text-xs text-[#321B35] underline underline-offset-2 cursor-pointer"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (

            /* ── Enquiry form ── */
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* First name / Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={set('firstName')}
                    autoComplete="given-name"
                    className={inputClass}
                    aria-describedby={errors.firstName ? 'err-firstName' : undefined}
                  />
                  {errors.firstName && (
                    <p id="err-firstName" className={errorClass}>{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Last name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={set('lastName')}
                    autoComplete="family-name"
                    className={inputClass}
                    aria-describedby={errors.lastName ? 'err-lastName' : undefined}
                  />
                  {errors.lastName && (
                    <p id="err-lastName" className={errorClass}>{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  aria-describedby={errors.email ? 'err-email' : undefined}
                />
                {errors.email && (
                  <p id="err-email" className={errorClass}>{errors.email}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className={labelClass}>Phone number <span className="text-[#1e1e1e]/40 font-normal">(optional)</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                  placeholder="+91 00000 00000"
                  className={inputClass}
                />
              </div>

              {/* Service required */}
              <div>
                <label className={labelClass}>Service required <span className="text-red-500">*</span></label>
                <select
                  value={form.service}
                  onChange={set('service')}
                  className={`${inputClass} cursor-pointer`}
                  aria-describedby={errors.service ? 'err-service' : undefined}
                >
                  <option value="">Select a service…</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && (
                  <p id="err-service" className={errorClass}>{errors.service}</p>
                )}
              </div>

              {/* Project details */}
              <div>
                <label className={labelClass}>Project details <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  value={form.details}
                  onChange={set('details')}
                  placeholder="Tell us about your property, approximate wall area, and any preferred finish or colour ideas."
                  className={`${inputClass} rounded-xl resize-none`}
                  aria-describedby={errors.details ? 'err-details' : undefined}
                />
                {errors.details && (
                  <p id="err-details" className={errorClass}>{errors.details}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-9 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending…' : 'Send Enquiry'}
                </button>
              </div>

              {/* Error state */}
              {submitResult === 'error' && (
                <p className="text-sm text-red-600">
                  Something went wrong. Please try again or call us directly.
                </p>
              )}
            </form>
            )}

            {/* ── Contact cards ── */}
            <div className="pt-2 border-t border-[#321B35]/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white/60 rounded-2xl border border-[#321B35]/10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#321B35]/60 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3 h-3" /> Call Us
                </span>
                <a
                  href={`tel:${PHONE_1}`}
                  className="block text-sm font-medium text-[#321B35] hover:underline underline-offset-2"
                >
                  {PHONE_1}
                </a>
                <a
                  href={`tel:${PHONE_2_TEL}`}
                  className="block text-sm text-[#1e1e1e]/70 hover:underline underline-offset-2"
                >
                  {PHONE_2}
                </a>
              </div>

              <div className="p-5 bg-white/60 rounded-2xl border border-[#321B35]/10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#321B35]/60 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3 h-3" /> Location
                </span>
                <p className="text-sm font-medium text-[#321B35]">{LOCATION}</p>
              </div>
            </div>
          </div>

          {/* ── Right column: photograph ── */}
          <div className="lg:col-span-6">
            <div className="w-full aspect-[4/5] overflow-hidden bg-[#d8d4ce]">
              <img
                src="/assets/contact-craftsman.jpg"
                alt="COLOUR TONE craftsman applying a decorative plaster finish to a wall"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
