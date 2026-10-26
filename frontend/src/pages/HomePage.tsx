import React, { useState } from 'react';
import { PageType, Product } from '../types';
import { FEATURED_HOME_SERVICES } from '../data/catalogue';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onBookService: (serviceName: string, prefill?: Partial<import('../types').BookingDetails>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onAddToCart,
  onSelectProduct,
  onBookService,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceRequired, setServiceRequired] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Button spinner states for 3 featured cards (matching Frame 7)
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleFeaturedAddToCart = (product: Product) => {
    setAddingId(product.id);
    setTimeout(() => {
      onAddToCart(product);
      setAddingId(null);
    }, 450);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      errors.firstName = 'First Name is required.';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last Name is required.';
    }

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // Indian Phone validation (10 digits, optional +91 or 0 prefix)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^(\+91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    // Service required validation
    if (!serviceRequired) {
      errors.serviceRequired = 'Please select a service.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(false);
    onBookService(serviceRequired, {
      firstName,
      lastName,
      phone,
      email,
      notes: projectDetails,
    });
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] overflow-hidden">
      {/* 1. Hero Section matching Video Frame 1 & 2 */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        {/* Background Image with dark architectural overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80')`,
          }}
        >
          {/* Subtle gradient overlay to match video moody atmosphere */}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto pt-24 pb-16 flex flex-col items-center">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white font-normal tracking-tight leading-[1.08] mb-6">
            Walls That Make
            <br />
            a Statement.
          </h1>
          <p className="text-white/90 text-base sm:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Discover exquisite wall textures, beautiful colours, and professional interior and exterior painting, crafted to transform your space.
          </p>

          {/* Center Pill Button matching Video Frame 1 */}
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 rounded-full bg-[#E9EDF0] text-[#321B35] font-medium text-sm sm:text-base hover:bg-white transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            Explore Our Services
          </button>
        </div>
      </section>

      {/* 2. Three-Card Showcase Section matching Video Frame 5 & 10 */}
      <section className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
          {FEATURED_HOME_SERVICES.map((item) => {
            const isTall = item.tallAspect;
            const isAdding = addingId === item.id;

            return (
              <div
                key={item.id}
                className={`flex flex-col group ${isTall ? 'md:-translate-y-6' : ''}`}
              >
                {/* Image Container with precise aspect ratio from video */}
                <div
                  onClick={() => onSelectProduct(item)}
                  className={`w-full overflow-hidden bg-black/5 rounded-none cursor-pointer mb-5 relative ${
                    isTall ? 'aspect-[3/4.6]' : 'aspect-[4/4.8]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                  />
                </div>

                {/* Card Meta */}
                <h3
                  onClick={() => onSelectProduct(item)}
                  className="font-sans text-lg sm:text-xl font-normal text-[#1e1e1e] cursor-pointer hover:text-[#321B35] transition-colors mb-1"
                >
                  {item.name}
                </h3>
                <p className="text-base text-[#1e1e1e]/90 font-light mb-4">
                  Quotation on request
                </p>

                {/* Select Finish Pill Button with spinner matching Frame 7 */}
                <button
                  onClick={() => handleFeaturedAddToCart(item)}
                  disabled={isAdding}
                  className="w-full py-3 px-6 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {isAdding ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Select Finish'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Editorial Section matching Video Frame 10 */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-t border-[#321B35]/10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Title in prominent Serif */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-4xl sm:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.12]">
              Decorative Textures,
              <br />
              Redefined
            </h2>
          </div>

          {/* Right Two Columns */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm sm:text-base text-[#1e1e1e]/80 leading-relaxed font-light">
            <div>
              <p>
                Discover distinctive wall textures and refined plaster finishes, thoughtfully chosen to bring character and depth to your interiors.
              </p>
            </div>
            <div>
              <p className="mb-2">
                With 20 years of industry experience, we focus on careful surface preparation, skilled craftsmanship, and quality finishes that transform your space.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="text-[#321B35] font-medium underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer inline-flex items-center gap-1"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Full Bleed Photo matching Video Frame 12 */}
      <section className="w-full px-6 sm:px-10 lg:px-16 pb-24 max-w-7xl mx-auto">
        <div className="w-full aspect-[16/9] sm:aspect-[21/10] overflow-hidden">
          <img
            src="/assets/colour-tone-craftsman.png"
            alt="COLOUR TONE Texture Consultation & Interior Styling"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* 5. Start Your Painting Project Journey Form matching Video Frame 15, 17, 18 */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto border-t border-[#321B35]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Heading */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="font-serif text-4xl sm:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.15]">
              Start Your Painting
              <br />
              Project Journey
            </h2>
            <p className="text-base text-[#1e1e1e]/75 font-light">
              Tell us your goals and let's craft your custom quotation.
            </p>
          </div>

          {/* Right Form Fields */}
          <div className="lg:col-span-7">
            <form onSubmit={handleInquirySubmit} className="space-y-5">
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
                        <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] font-medium rounded-full inline-flex items-center gap-1.5 shadow-xs">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.firstName}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (formErrors.firstName) {
                            setFormErrors({ ...formErrors, firstName: '' });
                          }
                        }}
                        placeholder="First name"
                        className="w-full px-5 py-3 rounded-full bg-white/70 border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] focus:bg-white text-sm"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] text-[#1e1e1e]/60 mb-1 ml-4">
                        Last Name (required)
                      </span>
                      {formErrors.lastName && (
                        <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] font-medium rounded-full inline-flex items-center gap-1.5 shadow-xs">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.lastName}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (formErrors.lastName) {
                            setFormErrors({ ...formErrors, lastName: '' });
                          }
                        }}
                        placeholder="Last name"
                        className="w-full px-5 py-3 rounded-full bg-white/70 border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] focus:bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                      Phone (required)
                    </label>
                    {formErrors.phone && (
                      <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] font-medium rounded-full inline-flex items-center gap-1.5 shadow-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.phone}</span>
                      </div>
                    )}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) {
                          setFormErrors({ ...formErrors, phone: '' });
                        }
                      }}
                      placeholder="e.g. 9000000000"
                      className="w-full px-5 py-3 rounded-full bg-white/70 border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] focus:bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                      Email (required)
                    </label>
                    {formErrors.email && (
                      <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] font-medium rounded-full inline-flex items-center gap-1.5 shadow-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.email}</span>
                      </div>
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) {
                          setFormErrors({ ...formErrors, email: '' });
                        }
                      }}
                      placeholder="you@example.com"
                      className="w-full px-5 py-3 rounded-full bg-white/70 border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] focus:bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Service Required Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                    Service Required (required)
                  </label>
                  {formErrors.serviceRequired && (
                    <div className="mb-2 px-3 py-1 bg-red-600 text-white text-[11px] font-medium rounded-full inline-flex items-center gap-1.5 shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.serviceRequired}</span>
                    </div>
                  )}
                  <select
                    value={serviceRequired}
                    onChange={(e) => {
                      setServiceRequired(e.target.value);
                      if (formErrors.serviceRequired) {
                        setFormErrors({ ...formErrors, serviceRequired: '' });
                      }
                    }}
                    className="w-full px-5 py-3 rounded-full bg-white/70 border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] focus:bg-white text-sm cursor-pointer"
                  >
                    <option value="">Select a service...</option>
                    <option value="Interior Painting">Interior Painting</option>
                    <option value="Exterior Painting">Exterior Painting</option>
                    <option value="Wall Textures">Wall Textures</option>
                    <option value="Colour Consultation">Colour Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Project Details Multiline Text Area */}
                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="Describe your property, approx. wall area, preferred colours, or timeline..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/70 border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] focus:bg-white text-sm resize-none"
                  />
                </div>

                {/* Send Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all shadow-md cursor-pointer flex items-center justify-center min-w-[120px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send'}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
