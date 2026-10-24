import React, { useState } from 'react';
import { PageType, User } from '../types';
import { BUSINESS_INFO } from '../data/catalogue';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Sparkles, User as UserIcon, Calendar, Check } from 'lucide-react';

interface AuthPageProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onNavigate: (page: PageType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (mode === 'signup') {
      if (!name.trim()) {
        errors.name = 'Full name is required.';
      }
      if (!phone.trim()) {
        errors.phone = 'Phone number is required for site visit scheduling.';
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const displayName =
        mode === 'signup'
          ? name.trim()
          : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      const user: User = {
        name: displayName,
        email: email.trim(),
        phone: phone.trim() || '+91 9972727446',
      };

      onLogin(user);
      setSuccessMessage(mode === 'signup' ? 'Account created successfully! Welcome to COLOUR TONE.' : 'Signed in successfully. Welcome back!');

      setTimeout(() => {
        onNavigate('home');
      }, 900);
    }, 600);
  };

  const handleDemoFill = () => {
    setName('Adish Devadiga');
    setEmail('abhikshardevadiga@gmail.com');
    setPhone('+91 9972727446');
    setPassword('colourTone2026');
    setConfirmPassword('colourTone2026');
    setFormErrors({});
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-12 px-6 sm:px-10 lg:px-16 min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* If already logged in: Account Overview */}
        {currentUser ? (
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xs p-8 sm:p-14 rounded-3xl border border-[#321B35]/15 shadow-sm space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#321B35]/10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#321B35] text-white flex items-center justify-center font-serif text-2xl shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl sm:text-3xl text-[#321B35] font-normal">
                      {currentUser.name}
                    </h1>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-[#1e1e1e]/70 mt-0.5">{currentUser.email}</p>
                  <p className="text-xs text-[#1e1e1e]/60">{currentUser.phone}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="self-start sm:self-auto px-5 py-2 rounded-full border border-[#321B35]/30 text-xs text-[#321B35] hover:bg-[#321B35]/5 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            {/* Account Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#E9EDF0]/80 rounded-2xl border border-[#321B35]/10 space-y-1">
                <span className="text-[11px] text-[#321B35]/70 uppercase tracking-wider block font-medium">
                  Region Service Base
                </span>
                <p className="text-sm font-medium text-[#1e1e1e]">Mangalore, India</p>
                <p className="text-[11px] text-[#1e1e1e]/60">Coastal Karnataka Coverage</p>
              </div>

              <div className="p-4 bg-[#E9EDF0]/80 rounded-2xl border border-[#321B35]/10 space-y-1">
                <span className="text-[11px] text-[#321B35]/70 uppercase tracking-wider block font-medium">
                  Preferred Specialty
                </span>
                <p className="text-sm font-medium text-[#1e1e1e]">Italian Venetian Plaster</p>
                <p className="text-[11px] text-[#1e1e1e]/60">Lime Plaster & Stucco</p>
              </div>

              <div className="p-4 bg-[#E9EDF0]/80 rounded-2xl border border-[#321B35]/10 space-y-1">
                <span className="text-[11px] text-[#321B35]/70 uppercase tracking-wider block font-medium">
                  Site Visit Guarantee
                </span>
                <p className="text-sm font-medium text-[#321B35]">Direct Artisan Contact</p>
                <p className="text-[11px] text-[#1e1e1e]/60">Tel: {BUSINESS_INFO.phone1}</p>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="flex-1 py-3 px-6 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs sm:text-sm font-medium transition-all shadow-sm text-center cursor-pointer"
              >
                Explore Wall Textures & Colours
              </button>
              <button
                onClick={() => onNavigate('checkout')}
                className="flex-1 py-3 px-6 rounded-full bg-[#F2B632] hover:bg-[#e0a423] text-[#321B35] text-xs sm:text-sm font-semibold transition-all shadow-sm text-center cursor-pointer"
              >
                Schedule Site Visit & Estimate
              </button>
            </div>
          </div>
        ) : (
          /* Login / Signup Two-Column Layout matching Template */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Visual Editorial Card */}
            <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-black/5 shadow-md hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="COLOUR TONE Texture & Interior Craftsmanship"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#F2B632] font-semibold">
                  20 Years of Painting Excellence
                </span>
                <h3 className="font-serif text-3xl font-normal leading-snug">
                  Transforming Mangalore Spaces Into Architectural Masterpieces
                </h3>
                <p className="text-xs text-white/80 font-light leading-relaxed">
                  Log in to book your free on-site survey, request bespoke physical finish samples, and manage your project quotations.
                </p>

                <div className="pt-2 flex items-center gap-4 text-[11px] text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#F2B632]" /> 100% Substrate Check
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#F2B632]" /> Zero VOC Mineral Plaster
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Form Card in Same Theme */}
            <div className="lg:col-span-6 bg-white/60 p-8 sm:p-12 rounded-3xl border border-[#321B35]/15 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#321B35]/70 block mb-1">
                  Client Portal
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-xs sm:text-sm text-[#1e1e1e]/70 mt-1 font-light">
                  {mode === 'login'
                    ? 'Enter your credentials to manage your painting project requests.'
                    : 'Join COLOUR TONE to explore custom textures and book site surveys.'}
                </p>
              </div>

              {/* Mode Switcher Pills */}
              <div className="flex bg-[#E9EDF0] p-1.5 rounded-full border border-[#321B35]/15">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setFormErrors({});
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#321B35] text-white shadow-xs'
                      : 'text-[#321B35]/75 hover:text-[#321B35]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setFormErrors({});
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#321B35] text-white shadow-xs'
                      : 'text-[#321B35]/75 hover:text-[#321B35]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-full flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                      Full Name (required)
                    </label>
                    {formErrors.name && (
                      <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.name}</span>
                      </div>
                    )}
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adish Devadiga"
                      className="w-full px-5 py-2.5 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                    Email Address (required)
                  </label>
                  {formErrors.email && (
                    <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-5 py-2.5 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                      Phone Number (required for site visit)
                    </label>
                    {formErrors.phone && (
                      <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.phone}</span>
                      </div>
                    )}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9972727446"
                      className="w-full px-5 py-2.5 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1 ml-4 mr-2">
                    <label className="text-xs font-medium text-[#1e1e1e]/80">
                      Password (required)
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered email.')}
                        className="text-[11px] text-[#321B35]/70 hover:text-[#321B35] underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  {formErrors.password && (
                    <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.password}</span>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-2.5 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1e1e1e]/50 hover:text-[#1e1e1e]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-4">
                      Confirm Password (required)
                    </label>
                    {formErrors.confirmPassword && (
                      <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-full inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.confirmPassword}</span>
                      </div>
                    )}
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-2.5 rounded-full bg-white border border-[#1e1e1e]/25 focus:outline-none focus:border-[#321B35] text-sm"
                    />
                  </div>
                )}

                {/* Checkboxes */}
                <div className="space-y-2 pt-1 text-xs text-[#1e1e1e]/75">
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#1e1e1e]/30 text-[#321B35] focus:ring-[#321B35]"
                    />
                    <label htmlFor="remember-me" className="cursor-pointer">
                      Keep me signed in
                    </label>
                  </div>

                  {mode === 'signup' && (
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#1e1e1e]/30 text-[#321B35] focus:ring-[#321B35]"
                      />
                      <label htmlFor="newsletter" className="cursor-pointer">
                        Receive seasonal wall texture lookbooks & paint palette guides
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit Pill Button matching template */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all shadow-md cursor-pointer flex items-center justify-center min-h-[46px]"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : mode === 'login' ? (
                      'Sign In to Account'
                    ) : (
                      'Create My Account'
                    )}
                  </button>
                </div>
              </form>

              {/* Demo Fill Helper */}
              <div className="pt-2 text-center border-t border-[#321B35]/10">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-xs text-[#321B35]/70 hover:text-[#321B35] underline cursor-pointer"
                >
                  Quick Fill Demo Credentials
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
