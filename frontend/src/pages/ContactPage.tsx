import React, { useState } from 'react';
import { PageType } from '../types';
import { BUSINESS_INFO } from '../data/catalogue';
import { CheckCircle2, AlertCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageType) => void;
  onBookNow: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onBookNow }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!firstName.trim()) errors.firstName = 'First Name is required.';
    if (!lastName.trim()) errors.lastName = 'Last Name is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    if (!message.trim()) errors.message = 'Message is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    }, 750);
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-12 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 2-Column Section matching Video Frame 45 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form & Direct Contact */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.12]">
                Ready to Transform
                <br />
                Your Walls?
              </h1>
              <p className="text-sm sm:text-base text-[#1e1e1e]/75 font-light mt-3">
                Fill out the form—let's bring your decorative vision to life with 20 years of artisan mastery.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-8 bg-white/80 rounded-3xl border border-emerald-300 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="text-lg">Message Delivered</span>
                </div>
                <p className="text-sm text-[#1e1e1e]/80 leading-relaxed">
                  Thank you for contacting COLOUR TONE. Our technical manager will contact you promptly at your provided email or phone.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 px-6 py-2 rounded-full border border-[#321B35] text-xs font-medium text-[#321B35]"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-2">
                    Name
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] text-[#1e1e1e]/60 mb-1 ml-4">
                        First Name (required)
                      </span>
                      {formErrors.firstName && (
                        <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.firstName}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-5 py-3 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#1e1e1e]/60 mb-1 ml-4">
                        Last Name (required)
                      </span>
                      {formErrors.lastName && (
                        <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.lastName}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-5 py-3 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                    Email (required)
                  </label>
                  {formErrors.email && (
                    <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                    Message (required)
                  </label>
                  {formErrors.message && (
                    <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.message}</span>
                    </div>
                  )}
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share details on your room size, building facade, or preferred texture styling..."
                    className="w-full px-5 py-3 rounded-3xl bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-9 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all shadow-md cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}

            {/* Direct Contact Cards */}
            <div className="pt-8 border-t border-[#321B35]/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 rounded-2xl border border-[#321B35]/10 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#321B35]/70 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3 h-3" /> Call Us Directly
                </span>
                <p className="text-sm font-serif font-medium text-[#321B35]">
                  {BUSINESS_INFO.phone1}
                </p>
                <p className="text-xs text-[#1e1e1e]/70">
                  {BUSINESS_INFO.phone2}
                </p>
              </div>

              <div className="p-4 bg-white/50 rounded-2xl border border-[#321B35]/10 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#321B35]/70 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3 h-3" /> Base Location
                </span>
                <p className="text-sm font-serif font-medium text-[#321B35]">
                  {BUSINESS_INFO.location}
                </p>
                <p className="text-xs text-[#1e1e1e]/70">
                  {BUSINESS_INFO.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Photo matching Video Frame 45 */}
          <div className="lg:col-span-6 aspect-[4/5] bg-black/5 overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              alt="COLOUR TONE Client Support & Consultation"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
