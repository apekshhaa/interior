import React, { useState } from 'react';
import { PageType, Product } from '../types';
import { SERVICES_LIST } from '../data/catalogue';
import { Check, AlertCircle } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageType) => void;
  onAddToCart: (product: Product) => void;
  onBookService: (serviceName: string, prefill?: Partial<import('../types').BookingDetails>) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onAddToCart,
  onBookService,
}) => {
  // Form states matching Video Frame 25
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(false);
    onBookService('Interior Painting', {
      firstName,
      lastName,
      email,
      notes: message,
    });
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] pb-24">
      {/* 1. Services Hero Photo matching Video Frame 22 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-12">
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-black/5">
          <img
            src="/assets/services-banner.png"
            alt="COLOUR TONE Decorative Textured Plaster Wall & Interior Finishes"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* 2. Headline & Introduction matching Video Frame 22 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8 border-b border-[#321B35]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.12]">
              Mastering Textures &
              <br />
              Wall Finishes
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#1e1e1e]/80 leading-relaxed font-light">
              With 20 years of experience, we bring walls to life through decorative textures, refined plaster finishes, and professional painting tailored to your space.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Services Listing Rows matching Video Frame 24 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 space-y-12">
        {SERVICES_LIST.map((srv) => (
          <div
            key={srv.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center py-6 border-b border-[#321B35]/10 group"
          >
            {/* Thumbnail */}
            <div className="md:col-span-3 aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 shadow-xs">
              <img
                src={srv.image}
                alt={srv.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title & Description */}
            <div className="md:col-span-6 space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1e1e1e] font-normal">
                {srv.title}
              </h3>
              <p className="text-sm text-[#1e1e1e]/75 font-light leading-relaxed">
                {srv.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {srv.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] bg-white/70 px-2.5 py-1 rounded-full text-[#321B35]/80 border border-[#321B35]/10"
                  >
                    <Check className="w-3 h-3 text-[#F2B632]" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Booking Action */}
            <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-3">
              <div className="md:text-right">
                <span className="text-base sm:text-lg font-light text-[#1e1e1e]">
                  Quotation on request
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onBookService(srv.title)}
                  className="px-5 py-2.5 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
                >
                  Book Service
                </button>
                <button
                  onClick={() => {
                    onAddToCart({
                      id: srv.id,
                      name: srv.title,
                      price: srv.price,
                      category: 'texture',
                      image: srv.image,
                      description: srv.description,
                      fullDescription: srv.description,
                    });
                  }}
                  className="px-4 py-2.5 rounded-full bg-white border border-[#321B35]/20 hover:border-[#321B35] text-[#321B35] text-xs font-medium transition-all cursor-pointer"
                  title="Add to quotation cart"
                >
                  + Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. "Ready to Unleash Your Sale?" Form matching Video Frame 25 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white/40 p-8 sm:p-14 rounded-3xl border border-[#321B35]/10">
          {/* Left Title */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-4xl sm:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.12]">
              Ready to
              <br />
              Transform
              <br />
              Your Walls?
            </h2>
            <p className="text-sm text-[#1e1e1e]/75 font-light leading-relaxed">
              Fill the form. Let's transform your property into an architectural masterpiece with 20 years of proven expertise.
            </p>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
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

                {/* Checkbox matching Frame 25 */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="newsletter-check"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1e1e1e]/30 text-[#321B35] focus:ring-[#321B35]"
                  />
                  <label
                    htmlFor="newsletter-check"
                    className="text-xs text-[#1e1e1e]/75 cursor-pointer"
                  >
                    Sign up for news, texture lookbooks, and updates
                  </label>
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
                    placeholder="Tell us about your project area, preferred wall texture, or painting timeline..."
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
          </div>
        </div>
      </section>
    </div>
  );
};
