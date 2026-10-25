import React, { useState, useMemo, useRef } from 'react';
import { CartItem, BookingDetails, User } from '../types';
import { COLOUR_PALETTE, ColourSwatch } from '../data/colours';
import { ArrowLeft, Check, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { buildSmsUrl, buildWhatsAppUrl } from '../lib/whatsapp';

interface CheckoutPageProps {
  items: CartItem[];
  currentUser: User | null;
  onRemoveItem: (productId: string) => void;
  onBookingConfirmed: (details: BookingDetails, refId: string) => void;
  onBackToCart: () => void;
  defaultServiceName?: string;
  initialDetails?: Partial<BookingDetails>;
  onCreateBooking: (details: BookingDetails) => Promise<{ booking: { reference: string } }>;
}

const AVAILABLE_SERVICES = [
  'Interior Painting',
  'Exterior Painting',
  'Decorative Wall Textures',
  'Colour Consultation',
];

const TIME_WINDOWS = [
  'Morning (9:00 AM – 1:00 PM)',
  'Afternoon (1:00 PM – 5:00 PM)',
  'Evening (5:00 PM – 7:30 PM)',
  'Flexible / Any Time',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currentUser,
  onRemoveItem,
  onBookingConfirmed,
  onBackToCart,
  defaultServiceName,
  initialDetails = {},
  onCreateBooking,
}) => {
  // Navigation stage: 'form' | 'review' | 'submitted'
  const [stage, setStage] = useState<'form' | 'review' | 'submitted'>('form');

  // Section 1: Contact Details (no hardcoded fake customer data)
  const [fullName, setFullName] = useState(
    initialDetails.firstName || initialDetails.lastName
      ? [initialDetails.firstName, initialDetails.lastName].filter(Boolean).join(' ')
      : currentUser?.name || '',
  );
  const [phone, setPhone] = useState(initialDetails.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(initialDetails.email || currentUser?.email || '');

  // Section 2: Project Details
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial'>('Residential');
  const [propertyAddress, setPropertyAddress] = useState(initialDetails.propertyAddress || '');
  const [approxArea, setApproxArea] = useState(initialDetails.approxArea || '');
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    if (initialDetails.selectedServices && initialDetails.selectedServices.length > 0) {
      return initialDetails.selectedServices;
    }
    if (!defaultServiceName) return ['Interior Painting'];
    const lower = defaultServiceName.toLowerCase();
    if (lower.includes('exterior')) return ['Exterior Painting'];
    if (lower.includes('consultation')) return ['Colour Consultation'];
    if (lower.includes('texture') || lower.includes('plaster') || lower.includes('stucco') || lower.includes('concrete')) {
      return ['Decorative Wall Textures'];
    }
    return ['Interior Painting'];
  });
  const [requirements, setRequirements] = useState(initialDetails.notes || '');

  // Section 3: Preferred Consultation
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [preferredDate, setPreferredDate] = useState(initialDetails.preferredDate || '');
  const [preferredTime, setPreferredTime] = useState(initialDetails.preferredTime || TIME_WINDOWS[0]);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const propertyAddressRef = useRef<HTMLInputElement>(null);

  // Right-side Selected Colours state
  const [selectedColours, setSelectedColours] = useState<ColourSwatch[]>(() => {
    try {
      const saved = localStorage.getItem('colourtone_selected_colours');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const matched = COLOUR_PALETTE.filter((c) => ids.includes(c.id));
        if (Array.isArray(ids)) return matched;
      }
    } catch {
      // Fallback
    }
    // Initial sensible palette selection
    return COLOUR_PALETTE.filter((c) => ['col-01', 'col-10', 'col-26'].includes(c.id));
  });

  const handleRemoveColour = (id: string) => {
    setSelectedColours((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('colourtone_selected_colours', JSON.stringify(next.map((c) => c.id)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Deduplicate textures safely to avoid accidental repeated rows
  const uniqueTextures = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((it) => {
      const key = it.product.id || it.product.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [items]);

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone Number is required.';
    } else if (phone.trim().length < 8) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!propertyAddress.trim()) {
      errs.propertyAddress = 'Property Address is required.';
    }
    setErrors(errs);
    const firstInvalidField = Object.keys(errs)[0];
    if (firstInvalidField === 'fullName') fullNameRef.current?.focus();
    if (firstInvalidField === 'phone') phoneRef.current?.focus();
    if (firstInvalidField === 'email') emailRef.current?.focus();
    if (firstInvalidField === 'propertyAddress') propertyAddressRef.current?.focus();
    return Object.keys(errs).length === 0;
  };

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStage('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitEnquiry = async () => {
    if (isSubmitting) return;
    if (!currentUser) {
      setSubmitError('Please sign in before submitting a booking request.');
      return;
    }
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || fullName.trim();
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const bookingData: BookingDetails = {
      firstName,
      lastName,
      email: email.trim(),
      phone: phone.trim(),
      propertyAddress: propertyAddress.trim(),
      propertyType,
      approxArea: approxArea.trim(),
      selectedServices,
      preferredTextures: uniqueTextures.map((t) => t.product.name),
      selectedColours: selectedColours.map((colour) => `${colour.name} (${colour.hex})`),
      preferredDate,
      preferredTime,
      notes: requirements.trim(),
    };

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const { booking } = await onCreateBooking(bookingData);
      try {
        localStorage.setItem(
          'colourtone_last_enquiry',
          JSON.stringify({
            date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            address: propertyAddress.trim(),
            services: selectedServices,
          }),
        );
      } catch {
        // Local history is optional; the server record is authoritative.
      }
      setBookingReference(booking.reference);
      onBookingConfirmed(bookingData, booking.reference);
      setStage('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border border-[#1e1e1e]/20 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#321B35] transition-colors placeholder:text-[#1e1e1e]/40';
  const labelClass = 'block text-xs font-medium text-[#1e1e1e]/80 mb-1.5';
  const errorClass = 'mt-1 text-xs text-red-600 flex items-center gap-1';

  // Construct WhatsApp enquiry message
  const whatsappMessage = useMemo(() => {
    const parts = [
      `Hello COLOUR TONE, I would like to enquire about a painting project.`,
      `Name: ${fullName}`,
      bookingReference ? `Booking Reference: ${bookingReference}` : '',
      `Property Type: ${propertyType}`,
      selectedServices.length > 0 ? `Services Required: ${selectedServices.join(', ')}` : '',
      preferredDate ? `Preferred Consultation Date: ${preferredDate} (${preferredTime})` : '',
      uniqueTextures.length > 0
        ? `Selected Textures: ${uniqueTextures.map((t) => t.product.name).join(', ')}`
        : '',
      selectedColours.length > 0
        ? `Selected Colours: ${selectedColours.map((c) => `${c.name} (${c.hex})`).join(', ')}`
        : '',
      `Please help me arrange a consultation. I will review this message and press Send in WhatsApp.`,
    ]
      .filter(Boolean)
      .join('\n');
    return parts;
  }, [
    fullName,
    propertyType,
    selectedServices,
    preferredDate,
    preferredTime,
    uniqueTextures,
    selectedColours,
    bookingReference,
  ]);
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);
  const smsMessage = useMemo(() => [
    `COLOUR TONE enquiry`,
    `Name: ${fullName}`,
    bookingReference ? `Ref: ${bookingReference}` : '',
    selectedServices.length > 0 ? `Service: ${selectedServices.join(', ')}` : '',
    selectedColours.length > 0 ? `Colours: ${selectedColours.map((c) => c.name).join(', ')}` : '',
    preferredDate ? `Consultation: ${preferredDate} (${preferredTime})` : '',
  ].filter(Boolean).join('\n'), [
    fullName,
    bookingReference,
    selectedServices,
    selectedColours,
    preferredDate,
    preferredTime,
  ]);
  const smsUrl = buildSmsUrl(smsMessage);

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-10 sm:py-14 px-4 sm:px-8 lg:px-14 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#1e1e1e]/60">
          <button
            type="button"
            onClick={onBackToCart}
            className="hover:text-[#321B35] cursor-pointer inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue & Finishes</span>
          </button>
          <span>/</span>
          <span className="text-[#321B35] font-medium">Project Selection</span>
        </div>

        {/* Page Heading & Description */}
        <header className="mb-8 pb-6 border-b border-[#321B35]/15 space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal tracking-tight">
            Your Project Selection
          </h1>
          <p className="text-sm sm:text-base text-[#1e1e1e]/75 font-light leading-relaxed max-w-3xl">
            Review your preferred finishes and colours, then share a few details so we can discuss your project.
          </p>
        </header>

        {stage === 'submitted' ? (
          /* Honest Enquiry Submitted View (No fake booking confirmation or simulated calendar lock) */
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-[#321B35]/15 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wider text-[#321B35] bg-[#321B35]/10 px-3 py-1 rounded-full">
                Enquiry Prepared
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#321B35] pt-2">
                Thank you{fullName ? `, ${fullName}` : ''}
              </h2>
              <p className="text-sm text-[#1e1e1e]/75 font-light leading-relaxed">
                Your project details and selections have been prepared. As site visits and consultations require direct schedule coordination, appointment dates and times are finalized directly with our team.
              </p>
            </div>

            {/* Project Summary Box */}
            <div className="p-5 bg-[#E9EDF0]/50 rounded-xl border border-[#1e1e1e]/10 space-y-2.5 text-xs sm:text-sm">
              {bookingReference && (
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#1e1e1e]/60 font-light shrink-0">Booking Reference:</span>
                  <span className="font-medium text-[#321B35]">{bookingReference}</span>
                </div>
              )}
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#1e1e1e]/60 font-light shrink-0">Property Address:</span>
                <span className="font-medium text-right text-[#1e1e1e]">{propertyAddress}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#1e1e1e]/60 font-light shrink-0">Property Type:</span>
                <span className="font-medium text-[#1e1e1e]">{propertyType}</span>
              </div>
              {approxArea && (
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#1e1e1e]/60 font-light shrink-0">Approximate Area:</span>
                  <span className="font-medium text-[#1e1e1e]">{approxArea} sq. ft.</span>
                </div>
              )}
              {selectedServices.length > 0 && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#1e1e1e]/60 font-light shrink-0">Services:</span>
                  <span className="font-medium text-right text-[#1e1e1e]">
                    {selectedServices.join(', ')}
                  </span>
                </div>
              )}
              {preferredDate && (
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#1e1e1e]/60 font-light shrink-0">Preferred Window:</span>
                  <span className="font-medium text-[#321B35]">
                    {preferredDate} • {preferredTime}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center gap-4 pt-1 border-t border-[#1e1e1e]/10">
                <span className="text-[#1e1e1e]/60 font-light shrink-0">Contact Phone:</span>
                <span className="font-medium text-[#1e1e1e]">{phone}</span>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-3 pt-2">
              <p className="text-xs text-[#1e1e1e]/70 leading-relaxed font-light">
                Our texture specialist in Mangalore will contact you to discuss your project and arrange physical finish samples. To reach us immediately, choose an option below:
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp</span>
                </a>
                )}
                {smsUrl && (
                  <a
                    href={smsUrl}
                    className="flex-1 py-3 px-5 rounded-full bg-[#321B35] hover:bg-[#4a274d] text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open SMS</span>
                  </a>
                )}

                <a
                  href="tel:9972727446"
                  className="flex-1 py-3 px-5 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 9972727446</span>
                </a>
              </div>
              {whatsappUrl && (
                <p className="text-[11px] text-[#1e1e1e]/60">
                  WhatsApp will open with a prefilled message. Review it and press Send yourself.
                </p>
              )}
              {smsUrl && (
                <p className="text-[11px] text-[#1e1e1e]/60">
                  SMS opens with a prepared message on mobile. Review it and press Send yourself; your carrier may charge for the text.
                </p>
              )}
              {!whatsappUrl && !smsUrl && (
                <p className="text-[11px] text-[#1e1e1e]/60">
                  Direct messaging is not configured for this environment.
                </p>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToCart}
                className="text-xs text-[#321B35] hover:underline underline-offset-2 cursor-pointer font-medium"
              >
                Return to Catalogue
              </button>
            </div>
          </div>
        ) : (
          /* Two-Column Layout: Form on Left (~65%), Selections on Right (~35%) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Form or Review */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-9 rounded-2xl border border-[#321B35]/15 shadow-2xs">
              {stage === 'form' ? (
                <form onSubmit={handleContinueToReview} noValidate className="space-y-8">
                  {/* Section 1: Contact Details */}
                  <div className="space-y-4">
                    <div className="border-b border-[#1e1e1e]/10 pb-2">
                      <h2 className="text-base font-semibold text-[#1e1e1e] tracking-tight">
                        Contact Details
                      </h2>
                      <p className="text-xs text-[#1e1e1e]/60 font-light mt-0.5">
                        Please provide your contact details so we can reach you.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name (required) */}
                      <div className="sm:col-span-2">
                        <label className={labelClass}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={fullNameRef}
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                          }}
                          placeholder="Your full name"
                          className={inputClass}
                        />
                        {errors.fullName && (
                          <p className={errorClass}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.fullName}</span>
                          </p>
                        )}
                      </div>

                      {/* Phone Number (required) */}
                      <div>
                        <label className={labelClass}>
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={phoneRef}
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                          }}
                          placeholder="Contact phone number"
                          className={inputClass}
                        />
                        {errors.phone && (
                          <p className={errorClass}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>

                      {/* Email Address (optional) */}
                      <div>
                        <label className={labelClass}>
                          Email Address <span className="text-[#1e1e1e]/40 font-normal">(optional)</span>
                        </label>
                        <input
                          ref={emailRef}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          className={inputClass}
                        />
                        {errors.email && (
                          <p className={errorClass}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Project Details */}
                  <div className="space-y-4 pt-2">
                    <div className="border-b border-[#1e1e1e]/10 pb-2">
                      <h2 className="text-base font-semibold text-[#1e1e1e] tracking-tight">
                        Project Details
                      </h2>
                      <p className="text-xs text-[#1e1e1e]/60 font-light mt-0.5">
                        Tell us about the property and painting scope.
                      </p>
                    </div>

                    {/* Property Type: Residential / Commercial */}
                    <div>
                      <label className={labelClass}>Property Type</label>
                      <div className="grid grid-cols-2 gap-3 max-w-sm">
                        <button
                          type="button"
                          onClick={() => setPropertyType('Residential')}
                          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border text-center transition-colors cursor-pointer ${
                            propertyType === 'Residential'
                              ? 'bg-[#321B35] text-white border-[#321B35]'
                              : 'bg-white text-[#1e1e1e]/80 border-[#1e1e1e]/20 hover:border-[#321B35]'
                          }`}
                        >
                          Residential
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropertyType('Commercial')}
                          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border text-center transition-colors cursor-pointer ${
                            propertyType === 'Commercial'
                              ? 'bg-[#321B35] text-white border-[#321B35]'
                              : 'bg-white text-[#1e1e1e]/80 border-[#1e1e1e]/20 hover:border-[#321B35]'
                          }`}
                        >
                          Commercial
                        </button>
                      </div>
                    </div>

                    {/* Property Address (required) */}
                    <div>
                      <label className={labelClass}>
                        Property Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={propertyAddressRef}
                        type="text"
                        value={propertyAddress}
                        onChange={(e) => {
                          setPropertyAddress(e.target.value);
                          if (errors.propertyAddress) {
                            setErrors((prev) => ({ ...prev, propertyAddress: '' }));
                          }
                        }}
                        placeholder="Locality, building, or street address in Mangalore..."
                        className={inputClass}
                      />
                      {errors.propertyAddress && (
                        <p className={errorClass}>
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.propertyAddress}</span>
                        </p>
                      )}
                    </div>

                    {/* Approximate Area in sq. ft. (optional numeric field) */}
                    <div>
                      <label className={labelClass}>
                        Approximate Area in sq. ft. <span className="text-[#1e1e1e]/40 font-normal">(optional)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={approxArea}
                        onChange={(e) => setApproxArea(e.target.value)}
                        placeholder="e.g. 1500"
                        className={inputClass}
                      />
                    </div>

                    {/* Service Required: 4 Verified Services */}
                    <div>
                      <label className={labelClass}>
                        Service Required <span className="text-[#1e1e1e]/40 font-normal">(select all that apply)</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {AVAILABLE_SERVICES.map((srv) => {
                          const checked = selectedServices.includes(srv);
                          return (
                            <label
                              key={srv}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors select-none ${
                                checked
                                  ? 'bg-[#321B35]/5 border-[#321B35] text-[#321B35] font-medium'
                                  : 'bg-white border-[#1e1e1e]/20 text-[#1e1e1e]/80 hover:border-[#1e1e1e]/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleService(srv)}
                                className="w-4 h-4 rounded text-[#321B35] focus:ring-[#321B35] accent-[#321B35]"
                              />
                              <span>{srv}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Additional Requirements (optional textarea) */}
                    <div>
                      <label className={labelClass}>
                        Additional Requirements <span className="text-[#1e1e1e]/40 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Mention specific walls, ceiling height, timeline, or special requirements..."
                        className="w-full px-4 py-3 bg-white border border-[#1e1e1e]/20 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#321B35] transition-colors placeholder:text-[#1e1e1e]/40 resize-none"
                      />
                    </div>
                  </div>

                  {/* Section 3: Preferred Consultation */}
                  <div className="space-y-4 pt-2">
                    <div className="border-b border-[#1e1e1e]/10 pb-2">
                      <h2 className="text-base font-semibold text-[#1e1e1e] tracking-tight">
                        Preferred Consultation
                      </h2>
                      <p className="text-xs text-[#1e1e1e]/60 font-light mt-0.5">
                        Choosing a preferred date is an appointment request and will be confirmed by our team.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Preferred Date */}
                      <div>
                        <label className={labelClass}>
                          Preferred Date <span className="text-[#1e1e1e]/40 font-normal">(optional)</span>
                        </label>
                        <input
                          type="date"
                          min={todayString}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      {/* Preferred Time Window */}
                      <div>
                        <label className={labelClass}>Preferred Time Window</label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className={inputClass}
                        >
                          {TIME_WINDOWS.map((win) => (
                            <option key={win} value={win}>
                              {win}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium tracking-wide transition-colors cursor-pointer shadow-sm text-center"
                    >
                      Review Enquiry
                    </button>
                  </div>
                </form>
              ) : (
                /* Review Screen */
                <div className="space-y-6">
                  <div className="border-b border-[#1e1e1e]/10 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-[#321B35]">
                        Review Your Project Enquiry
                      </h2>
                      <p className="text-xs text-[#1e1e1e]/60 font-light mt-0.5">
                        Please verify your details before submitting your enquiry.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStage('form')}
                      className="text-xs text-[#321B35] hover:underline underline-offset-2 cursor-pointer font-medium"
                    >
                      Edit details
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Contact Details */}
                    <div className="p-4 bg-[#E9EDF0]/40 rounded-xl border border-[#1e1e1e]/10 space-y-1.5">
                      <span className="font-semibold text-[#321B35] block text-[11px] uppercase tracking-wider">
                        Contact Details
                      </span>
                      <p className="text-sm font-medium text-[#1e1e1e]">{fullName}</p>
                      <p className="text-[#1e1e1e]/75">{phone}</p>
                      {email && <p className="text-[#1e1e1e]/75">{email}</p>}
                    </div>

                    {/* Site Details */}
                    <div className="p-4 bg-[#E9EDF0]/40 rounded-xl border border-[#1e1e1e]/10 space-y-1.5">
                      <span className="font-semibold text-[#321B35] block text-[11px] uppercase tracking-wider">
                        Property & Area
                      </span>
                      <p className="text-sm font-medium text-[#1e1e1e]">{propertyAddress}</p>
                      <p className="text-[#1e1e1e]/75">
                        {propertyType}
                        {approxArea ? ` • ~${approxArea} sq. ft.` : ''}
                      </p>
                    </div>

                    {/* Services */}
                    <div className="p-4 bg-[#E9EDF0]/40 rounded-xl border border-[#1e1e1e]/10 space-y-1.5">
                      <span className="font-semibold text-[#321B35] block text-[11px] uppercase tracking-wider">
                        Services Requested
                      </span>
                      <p className="text-sm text-[#1e1e1e]/85">
                        {selectedServices.length > 0
                          ? selectedServices.join(', ')
                          : 'General Painting Consultation'}
                      </p>
                    </div>

                    {/* Consultation Window */}
                    <div className="p-4 bg-[#E9EDF0]/40 rounded-xl border border-[#1e1e1e]/10 space-y-1.5">
                      <span className="font-semibold text-[#321B35] block text-[11px] uppercase tracking-wider">
                        Preferred Schedule
                      </span>
                      <p className="text-sm font-medium text-[#1e1e1e]">
                        {preferredDate || 'Flexible / To be discussed'}
                      </p>
                      <p className="text-[#1e1e1e]/75">{preferredTime}</p>
                    </div>
                  </div>

                  {requirements && (
                    <div className="p-4 bg-[#E9EDF0]/40 rounded-xl border border-[#1e1e1e]/10 text-xs">
                      <span className="font-semibold text-[#321B35] block text-[11px] uppercase tracking-wider mb-1">
                        Additional Requirements
                      </span>
                      <p className="text-[#1e1e1e]/80 leading-relaxed">{requirements}</p>
                    </div>
                  )}

                  {/* Selections Recap */}
                  <div className="p-4 bg-[#E9EDF0]/40 rounded-xl border border-[#1e1e1e]/10 space-y-2 text-xs">
                    <span className="font-semibold text-[#321B35] block text-[11px] uppercase tracking-wider">
                      Selected Finishes & Colours
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {uniqueTextures.map((t) => (
                        <span
                          key={t.product.id}
                          className="bg-white border border-[#1e1e1e]/15 px-2.5 py-1 rounded-md text-[11px] text-[#1e1e1e]"
                        >
                          {t.product.name}
                        </span>
                      ))}
                      {selectedColours.map((c) => (
                        <span
                          key={c.id}
                          className="bg-white border border-[#1e1e1e]/15 px-2.5 py-1 rounded-md text-[11px] text-[#1e1e1e] flex items-center gap-1.5"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </span>
                      ))}
                      {uniqueTextures.length === 0 && selectedColours.length === 0 && (
                        <span className="text-[#1e1e1e]/50 italic">None selected</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {submitError && (
                    <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                      {submitError}
                    </div>
                  )}
                  <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setStage('form')}
                      className="py-3.5 px-6 rounded-full border border-[#1e1e1e]/20 text-[#1e1e1e] hover:bg-black/5 text-xs sm:text-sm font-medium transition-colors text-center cursor-pointer"
                    >
                      Back to Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitEnquiry}
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 px-8 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs sm:text-sm font-medium tracking-wide transition-colors cursor-pointer shadow-sm text-center"
                    >
                      {isSubmitting ? 'Submitting…' : 'Submit Enquiry'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Simplified Selection Summary (~35%) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#321B35]/15 shadow-2xs space-y-6 lg:sticky lg:top-24">
              <div className="border-b border-[#1e1e1e]/10 pb-3">
                <h3 className="font-serif text-xl text-[#321B35] font-normal">
                  Your Selections
                </h3>
                <p className="text-xs text-[#1e1e1e]/60 font-light mt-0.5">
                  Finishes and colours selected for your project discussion.
                </p>
              </div>

              {/* Group 1: Selected Textures */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#1e1e1e]/70 uppercase tracking-wider">
                  Selected Textures ({uniqueTextures.length})
                </h4>

                {uniqueTextures.length === 0 ? (
                  <p className="text-xs text-[#1e1e1e]/50 italic py-1">
                    No textures selected from catalogue.
                  </p>
                ) : (
                  <div className="divide-y divide-[#1e1e1e]/5">
                    {uniqueTextures.map(({ product }) => (
                      <div
                        key={product.id}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#1e1e1e]/5 border border-[#1e1e1e]/10">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs sm:text-sm font-medium text-[#1e1e1e] truncate">
                            {product.name}
                          </h5>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="text-xs text-[#1e1e1e]/50 hover:text-red-600 transition-colors cursor-pointer shrink-0 ml-1"
                          aria-label={`Remove ${product.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Group 2: Selected Colours */}
              <div className="space-y-3 pt-2 border-t border-[#1e1e1e]/10">
                <h4 className="text-xs font-semibold text-[#1e1e1e]/70 uppercase tracking-wider">
                  Selected Colours ({selectedColours.length})
                </h4>

                {selectedColours.length === 0 ? (
                  <p className="text-xs text-[#1e1e1e]/50 italic py-1">
                    No colours selected.
                  </p>
                ) : (
                  <div className="divide-y divide-[#1e1e1e]/5">
                    {selectedColours.map((colour) => (
                      <div
                        key={colour.id}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div
                          className="w-7 h-7 rounded-full shrink-0 border border-black/15 shadow-2xs"
                          style={{ backgroundColor: colour.hex }}
                          aria-hidden="true"
                        />

                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs sm:text-sm font-medium text-[#1e1e1e] truncate">
                            {colour.name}
                          </h5>
                          <span className="text-[11px] font-mono text-[#1e1e1e]/50 uppercase">
                            {colour.hex}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveColour(colour.id)}
                          className="text-xs text-[#1e1e1e]/50 hover:text-red-600 transition-colors cursor-pointer shrink-0 ml-1"
                          aria-label={`Remove ${colour.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Clarification */}
              <div className="pt-4 border-t border-[#1e1e1e]/10">
                <p className="text-xs text-[#1e1e1e]/70 leading-relaxed font-light">
                  Pricing will be discussed based on your project requirements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
