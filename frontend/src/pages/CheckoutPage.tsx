import React, { useState } from 'react';
import { CartItem, BookingDetails, User } from '../types';
import { ShieldCheck, CheckCircle2, ChevronRight, Edit3, Calendar, Clock, Home, Building2, MapPin, Phone, Mail, Sparkles, Tag } from 'lucide-react';

interface CheckoutPageProps {
  items: CartItem[];
  currentUser: User | null;
  onRemoveItem: (productId: string) => void;
  onBookingConfirmed: (details: BookingDetails, refId: string) => void;
  onBackToCart: () => void;
  defaultServiceName?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currentUser,
  onRemoveItem,
  onBookingConfirmed,
  onBackToCart,
  defaultServiceName,
}) => {
  // Current checkout stage: 'form' | 'review' | 'confirmed'
  const [stage, setStage] = useState<'form' | 'review' | 'confirmed'>('form');

  // Customer Form Data
  const [firstName, setFirstName] = useState(currentUser ? currentUser.name.split(' ')[0] : 'Adish');
  const [lastName, setLastName] = useState(currentUser ? currentUser.name.split(' ').slice(1).join(' ') || 'Devadiga' : 'Devadiga');
  const [email, setEmail] = useState(currentUser?.email || 'abhikshardevadiga@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 9972727446');
  const [propertyAddress, setPropertyAddress] = useState('Kadri Hills, Near Circuit House, Mangalore 575004');
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial'>('Residential');
  const [approxArea, setApproxArea] = useState('1,800 sq.ft (3 BHK Apartment)');
  const [selectedServices, setSelectedServices] = useState<string[]>(
    defaultServiceName ? [defaultServiceName] : ['Italian Venetian Plaster', 'Interior Emulsion']
  );
  const [preferredTextures, setPreferredTextures] = useState<string[]>([
    'Stucco Marble Polish',
    'Travertine Stone Finish',
  ]);
  const [preferredDate, setPreferredDate] = useState('2026-10-28');
  const [preferredTime, setPreferredTime] = useState('10:00 AM – 1:00 PM (Morning Slot)');
  const [notes, setNotes] = useState('Feature wall in living room & high-ceiling entrance foyer.');

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountError, setDiscountError] = useState('');

  // Confirmation state
  const [bookingRefId, setBookingRefId] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const availableServices = [
    'Italian Venetian Plaster',
    'Travertine & Rustic Stone',
    'Interior Emulsion & Priming',
    'Weather-Shield Exterior Facade',
    'Metallic Pearl & Velvet Accent',
    'Industrial Micro-Cement Concrete',
  ];

  const availableTextures = [
    'Stucco Marble Polish',
    'Travertine Stone Finish',
    'Sand & Swirl Ripple',
    'Raw Concrete Loft',
    'Gold / Bronze Pearlescent',
  ];

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = discountApplied ? Math.min(subtotal * 0.1, 200) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'COLOUR20' || discountCode.trim().toUpperCase() === 'MANGALORE') {
      setDiscountApplied(true);
      setDiscountError('');
    } else {
      setDiscountError('Invalid voucher code. Try COLOUR20');
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!firstName.trim()) errors.firstName = 'First Name is required.';
    if (!lastName.trim()) errors.lastName = 'Last Name is required.';
    if (!email.trim()) errors.email = 'Email address is required.';
    if (!phone.trim()) errors.phone = 'Phone number is required.';
    if (!propertyAddress.trim()) errors.propertyAddress = 'Property address in Mangalore is required.';
    if (!preferredDate) errors.preferredDate = 'Site visit date is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStage('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = () => {
    const ref = `CT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(ref);
    const bookingData: BookingDetails = {
      firstName,
      lastName,
      email,
      phone,
      propertyAddress,
      propertyType,
      approxArea,
      selectedServices,
      preferredTextures,
      preferredDate,
      preferredTime,
      notes,
    };
    onBookingConfirmed(bookingData, ref);
    setStage('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#fbfbfb] text-[#1e1e1e] py-10 px-4 sm:px-8 lg:px-14 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Step Indicator */}
        <div className="mb-8 flex items-center justify-between text-xs text-[#1e1e1e]/60 pb-4 border-b border-[#1e1e1e]/10">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToCart}
              className="hover:text-[#321B35] underline cursor-pointer"
            >
              Cart
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={stage === 'form' ? 'text-[#321B35] font-semibold' : ''}>
              1. Customer & Project Details
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={stage === 'review' ? 'text-[#321B35] font-semibold' : ''}>
              2. Review Request
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={stage === 'confirmed' ? 'text-emerald-700 font-semibold' : ''}>
              3. Confirmation
            </span>
          </div>

          <span className="font-serif text-sm text-[#321B35] font-medium hidden sm:inline">
            COLOUR TONE Quotation & Booking
          </span>
        </div>

        {stage === 'confirmed' ? (
          /* Confirmation Screen */
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#321B35]/15 shadow-xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Booking Request Submitted
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal mt-3">
                Thank You, {firstName}!
              </h1>
              <p className="text-sm text-[#1e1e1e]/75 mt-2">
                Your painting project quotation & site-visit request is confirmed.
              </p>
            </div>

            <div className="p-6 bg-[#E9EDF0]/60 rounded-2xl border border-[#321B35]/10 text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-[#321B35]/10">
                <span className="text-[#1e1e1e]/60 font-light">Booking Reference:</span>
                <span className="font-mono font-bold text-[#321B35] text-base">{bookingRefId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1e1e1e]/60">Property:</span>
                <span className="font-medium text-[#1e1e1e] text-right max-w-xs">{propertyAddress} ({propertyType})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1e1e1e]/60">Approx Area:</span>
                <span className="font-medium text-[#1e1e1e]">{approxArea}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1e1e1e]/60">Site Visit Scheduled:</span>
                <span className="font-medium text-[#321B35]">{preferredDate} at {preferredTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1e1e1e]/60">Contact:</span>
                <span className="font-medium text-[#1e1e1e]">{phone} • {email}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-[#1e1e1e]/80 text-left leading-relaxed">
              <p className="font-medium text-[#321B35] mb-1">
                Next Steps (Business Owner Notification):
              </p>
              Our senior texture specialist in Mangalore will inspect your preferred textures and contact you at <strong className="text-[#321B35]">{phone}</strong> prior to visiting with physical sample boards.
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBackToCart}
                className="px-8 py-3 rounded-full bg-[#321B35] text-white text-sm font-medium hover:bg-[#432347] transition-all cursor-pointer shadow-md"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Checkout Layout matching Video Frame 49 & 50 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Booking Form or Review View */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-[#e5e5e5] shadow-xs">
              {stage === 'form' ? (
                <form onSubmit={handleContinueToReview} className="space-y-8">
                  {/* Step 1: Customer Identification */}
                  <div>
                    <h2 className="text-base font-semibold text-[#1e1e1e] tracking-tight pb-3 mb-4 border-b border-[#e5e5e5]">
                      1. Contact Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          First Name (required)
                        </label>
                        {formErrors.firstName && (
                          <p className="text-[11px] text-red-600 mb-1 ml-3">{formErrors.firstName}</p>
                        )}
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Last Name (required)
                        </label>
                        {formErrors.lastName && (
                          <p className="text-[11px] text-red-600 mb-1 ml-3">{formErrors.lastName}</p>
                        )}
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Phone Number (required)
                        </label>
                        {formErrors.phone && (
                          <p className="text-[11px] text-red-600 mb-1 ml-3">{formErrors.phone}</p>
                        )}
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Email Address (required)
                        </label>
                        {formErrors.email && (
                          <p className="text-[11px] text-red-600 mb-1 ml-3">{formErrors.email}</p>
                        )}
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Property & Painting Scope */}
                  <div>
                    <h2 className="text-base font-semibold text-[#1e1e1e] tracking-tight pb-3 mb-4 border-b border-[#e5e5e5]">
                      2. Property & Project Details
                    </h2>

                    {/* Property Type Toggle */}
                    <div className="mb-4">
                      <label className="block text-xs text-[#1e1e1e]/70 mb-2 ml-1">
                        Property Type
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setPropertyType('Residential')}
                          className={`flex-1 py-2 px-4 rounded-full text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                            propertyType === 'Residential'
                              ? 'bg-[#321B35] text-white border-[#321B35]'
                              : 'bg-white text-[#1e1e1e]/70 border-[#e2e4e8] hover:border-[#321B35]'
                          }`}
                        >
                          <Home className="w-3.5 h-3.5" />
                          <span>Residential (Villa / Flat)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropertyType('Commercial')}
                          className={`flex-1 py-2 px-4 rounded-full text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                            propertyType === 'Commercial'
                              ? 'bg-[#321B35] text-white border-[#321B35]'
                              : 'bg-white text-[#1e1e1e]/70 border-[#e2e4e8] hover:border-[#321B35]'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Commercial / Office</span>
                        </button>
                      </div>
                    </div>

                    {/* Address & Area */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Property Address in Mangalore (required)
                        </label>
                        {formErrors.propertyAddress && (
                          <p className="text-[11px] text-red-600 mb-1 ml-3">{formErrors.propertyAddress}</p>
                        )}
                        <input
                          type="text"
                          value={propertyAddress}
                          onChange={(e) => setPropertyAddress(e.target.value)}
                          placeholder="Building, street, locality, Mangalore..."
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Approximate Painting Area
                        </label>
                        <input
                          type="text"
                          value={approxArea}
                          onChange={(e) => setApproxArea(e.target.value)}
                          placeholder="e.g. 1500 sq ft or 3 Rooms"
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>
                    </div>

                    {/* Service & Texture Multi-selection */}
                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-2 ml-1">
                          Select Interested Services (Multiple allowed)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableServices.map((srv) => {
                            const isSelected = selectedServices.includes(srv);
                            return (
                              <button
                                type="button"
                                key={srv}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedServices(selectedServices.filter((s) => s !== srv));
                                  } else {
                                    setSelectedServices([...selectedServices, srv]);
                                  }
                                }}
                                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#321B35] text-white border-[#321B35]'
                                    : 'bg-[#f8f9fa] text-[#1e1e1e]/70 border-[#e2e4e8] hover:border-[#321B35]'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {srv}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-2 ml-1">
                          Preferred Decorative Textures & Finishes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableTextures.map((tex) => {
                            const isSelected = preferredTextures.includes(tex);
                            return (
                              <button
                                type="button"
                                key={tex}
                                onClick={() => {
                                  if (isSelected) {
                                    setPreferredTextures(preferredTextures.filter((t) => t !== tex));
                                  } else {
                                    setPreferredTextures([...preferredTextures, tex]);
                                  }
                                }}
                                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#F2B632] text-[#321B35] font-medium border-[#F2B632]'
                                    : 'bg-[#f8f9fa] text-[#1e1e1e]/70 border-[#e2e4e8] hover:border-[#F2B632]'
                                }`}
                              >
                                {isSelected ? '★ ' : '○ '}
                                {tex}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Site Visit Appointment */}
                  <div>
                    <h2 className="text-base font-semibold text-[#1e1e1e] tracking-tight pb-3 mb-4 border-b border-[#e5e5e5]">
                      3. Preferred Site Visit Schedule
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Visit Date (required)
                        </label>
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                          Preferred Time Window
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                        >
                          <option>10:00 AM – 1:00 PM (Morning Slot)</option>
                          <option>2:00 PM – 5:00 PM (Afternoon Slot)</option>
                          <option>5:00 PM – 7:30 PM (Evening Slot)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs text-[#1e1e1e]/70 mb-1 ml-3">
                        Additional Requirements / Notes
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention any specific lighting, plaster conditions, ceiling height, or color palette..."
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-sm"
                      />
                    </div>
                  </div>

                  {/* CONTINUE Button matching Video Frame 49 & 50 */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-none sm:rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer text-center"
                    >
                      CONTINUE TO REVIEW
                    </button>
                  </div>
                </form>
              ) : (
                /* Review Request View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
                    <div>
                      <h2 className="text-xl font-serif text-[#321B35]">Review Quotation & Booking</h2>
                      <p className="text-xs text-[#1e1e1e]/60">Please review your project details before confirming.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage('form')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#321B35] border border-[#321B35]/20 hover:border-[#321B35] px-3 py-1.5 rounded-full font-medium"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Details
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e2e4e8] space-y-2">
                      <span className="font-semibold text-[#321B35] flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Client Info
                      </span>
                      <p className="text-sm font-medium">{firstName} {lastName}</p>
                      <p className="text-[#1e1e1e]/70">{phone}</p>
                      <p className="text-[#1e1e1e]/70">{email}</p>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e2e4e8] space-y-2">
                      <span className="font-semibold text-[#321B35] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Site Location
                      </span>
                      <p className="text-sm font-medium">{propertyAddress}</p>
                      <p className="text-[#1e1e1e]/70">{propertyType} • {approxArea}</p>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e2e4e8] space-y-2">
                      <span className="font-semibold text-[#321B35] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Site Visit Schedule
                      </span>
                      <p className="text-sm font-medium">{preferredDate}</p>
                      <p className="text-[#1e1e1e]/70">{preferredTime}</p>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e2e4e8] space-y-2">
                      <span className="font-semibold text-[#321B35] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#F2B632]" /> Selected Finishes
                      </span>
                      <p className="text-[#1e1e1e]/80 leading-snug">
                        {selectedServices.join(', ') || 'General Painting'}
                      </p>
                      <div className="pt-1 flex flex-wrap gap-1">
                        {preferredTextures.map((t) => (
                          <span key={t} className="bg-[#F2B632]/20 text-[#321B35] text-[10px] px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {notes && (
                    <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e2e4e8] text-xs text-[#1e1e1e]/75">
                      <strong className="text-[#321B35]">Special Notes: </strong>
                      {notes}
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setStage('form')}
                      className="py-3 px-6 rounded-full border border-[#1e1e1e]/20 text-xs font-medium hover:bg-black/5"
                    >
                      ← Back to Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="flex-1 py-3.5 rounded-full bg-[#321B35] text-white text-sm font-semibold tracking-wide hover:bg-[#432347] transition-all shadow-md cursor-pointer"
                    >
                      Confirm Painting Project Booking
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Card matching Video Frame 49 & 50 */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-6">
              <h3 className="font-sans text-xl font-medium text-[#1e1e1e]">
                Order summary
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#f0f0f0]">
                {items.length === 0 ? (
                  <div className="py-4 text-xs text-[#1e1e1e]/60">
                    No sample kits in cart. (Proceeding with site inspection booking)
                  </div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 flex items-center justify-between gap-4">
                      {/* Thumbnail with square quantity badge on bottom right matching Frame 49 */}
                      <div className="relative w-16 h-16 bg-black/5 rounded-md overflow-hidden shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-[#6b7280] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-tl-sm">
                          {quantity}
                        </span>
                      </div>

                      {/* Product Name & Remove link */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-normal text-[#1e1e1e] truncate">
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="text-xs text-[#6b7280] hover:text-[#1e1e1e] underline cursor-pointer mt-0.5 block"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Price & Per unit info matching Frame 49 */}
                      <div className="text-right">
                        <span className="text-sm font-light text-[#1e1e1e] block">
                          ₹{(product.price * quantity).toFixed(2)}
                        </span>
                        {quantity > 1 && (
                          <span className="text-[11px] text-[#6b7280] block">
                            ₹{product.price.toFixed(2)} each
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* + Discount or gift card Pill Button matching Frame 49 */}
              <div>
                {!showDiscountInput ? (
                  <button
                    type="button"
                    onClick={() => setShowDiscountInput(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#d1d5db] text-xs font-normal text-[#1e1e1e] hover:border-[#1e1e1e] transition-colors cursor-pointer bg-white"
                  >
                    <span>+ Discount or gift card</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter COLOUR20"
                      className="flex-1 px-4 py-1.5 rounded-full border border-[#d1d5db] text-xs bg-white focus:outline-none focus:border-[#321B35]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-4 py-1.5 rounded-full bg-[#1e1e1e] text-white text-xs font-medium cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {discountApplied && (
                  <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Voucher COLOUR20 applied!
                  </p>
                )}
                {discountError && (
                  <p className="text-[11px] text-red-600 mt-1.5">
                    {discountError}
                  </p>
                )}
              </div>

              {/* Price Breakdown matching Frame 49 */}
              <div className="pt-4 border-t border-[#f0f0f0] space-y-2 text-sm">
                <div className="flex justify-between text-[#1e1e1e]">
                  <span>Subtotal</span>
                  <span className="font-light">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#1e1e1e]">
                  <span>Tax</span>
                  <span className="font-light">₹0.00</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-[#f0f0f0] flex justify-between items-center text-base sm:text-lg font-medium text-[#1e1e1e]">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {/* SECURE SSL CHECKOUT matching Frame 49 & 50 */}
              <div className="pt-6 border-t border-[#f0f0f0] flex items-center justify-center gap-2 text-[11px] tracking-wider text-[#6b7280] font-semibold uppercase">
                <ShieldCheck className="w-4 h-4 text-[#1e1e1e]" />
                <span>SECURE SSL CHECKOUT</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
