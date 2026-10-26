import React, { useState, useMemo } from 'react';
import { PageType, User, CartItem } from '../types';
import { COLOUR_PALETTE } from '../data/colours';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Edit3,
  Check,
} from 'lucide-react';

interface AuthPageProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onNavigate: (page: PageType) => void;
  cartItems?: CartItem[];
  onUpdateUser?: (user: User) => void;
  onAuthenticate: (input: {
    mode: 'login' | 'signup';
    name?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
    rememberMe?: boolean;
  }) => Promise<User>;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
  cartItems = [],
  onUpdateUser,
  onAuthenticate,
}) => {
  // Login / Signup state (when not logged in)
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Edit Profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || 'Mangalore, India');

  // Customer initials avatar helper
  const getInitials = (userName?: string) => {
    if (!userName) return 'U';
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  // Saved textures from live cart state
  const savedTextures = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return [];
    const seen = new Set<string>();
    return cartItems
      .map((it) => it.product)
      .filter((p) => {
        if (!p || seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
  }, [cartItems]);

  // Saved colours from persistent store or default selection
  const savedColours = useMemo(() => {
    try {
      const saved = localStorage.getItem('colourtone_selected_colours');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const matched = COLOUR_PALETTE.filter((c) => ids.includes(c.id));
        if (matched.length > 0) {
          const legacyDefaults = ['col-01', 'col-10', 'col-26'];
          if (ids.length === legacyDefaults.length && legacyDefaults.every((id) => ids.includes(id))) return [];
          return matched;
        }
      }
    } catch {
      // ignore
    }
    return [];
  }, []);

  const totalSavedCount = savedTextures.length + savedColours.length;

  // Genuine submitted enquiry record from localStorage
  const lastEnquiry = useMemo(() => {
    try {
      const raw = localStorage.getItem('colourtone_last_enquiry');
      if (raw) {
        return JSON.parse(raw) as { date: string; address?: string; services?: string[] };
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const handleOpenEdit = () => {
    setEditName(currentUser?.name || '');
    setEditEmail(currentUser?.email || '');
    setEditPhone(currentUser?.phone || '');
    setEditLocation(currentUser?.location || 'Mangalore, India');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updatedUser: User = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      location: editLocation.trim(),
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    setIsEditing(false);
  };

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
    onAuthenticate({
      mode,
      name: mode === 'signup' ? name.trim() : undefined,
      email: email.trim(),
      phone: mode === 'signup' ? phone.trim() : undefined,
      password,
      confirmPassword: mode === 'signup' ? confirmPassword : undefined,
      rememberMe,
    })
      .then((user) => {
      onLogin(user);
      setSuccessMessage(
        mode === 'signup'
          ? 'Account created successfully! Welcome to COLOUR TONE.'
          : 'Signed in successfully. Welcome back!'
      );

      setTimeout(() => onNavigate('home'), 900);
    })
      .catch((error: unknown) => {
        setFormErrors({ form: error instanceof Error ? error.message : 'Unable to authenticate.' });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-12 px-4 sm:px-8 lg:px-14 min-h-[85vh] flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* ======================================================== */}
        {/* LOGGED IN: Clean, Premium Customer Profile Dashboard    */}
        {/* ======================================================== */}
        {currentUser ? (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-[#321B35]/15 shadow-2xs space-y-7">
            {/* 1. Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-[#1e1e1e]/10">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Circular Avatar with Customer Initials */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#321B35] text-white flex items-center justify-center font-serif text-lg sm:text-xl shrink-0 shadow-2xs select-none"
                  aria-label={`Avatar for ${currentUser.name}`}
                >
                  {getInitials(currentUser.name)}
                </div>

                {/* Customer Details */}
                <div className="space-y-0.5">
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#321B35] font-normal tracking-tight">
                    {currentUser.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#1e1e1e]/70 font-light">
                    {currentUser.email}
                  </p>
                  {currentUser.phone && (
                    <p className="text-xs text-[#1e1e1e]/60 font-light">
                      {currentUser.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions: Edit Profile & Sign Out */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="px-4 py-2 rounded-full border border-[#321B35]/25 hover:border-[#321B35] text-xs font-medium text-[#321B35] hover:bg-[#321B35]/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 rounded-full border border-[#1e1e1e]/20 hover:border-red-400 text-xs font-medium text-[#1e1e1e]/70 hover:text-red-700 hover:bg-red-50/40 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* 2. My Account Information Row (Restrained Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Card 1: Saved Selections */}
              <div className="p-4 bg-[#E9EDF0]/50 rounded-xl border border-[#1e1e1e]/10 space-y-1">
                <span className="text-[11px] text-[#321B35]/70 uppercase tracking-wider block font-medium">
                  Saved Selections
                </span>
                <p className="text-sm font-medium text-[#1e1e1e]">
                  {totalSavedCount > 0
                    ? `${totalSavedCount} ${totalSavedCount === 1 ? 'item' : 'items'} saved`
                    : 'No saved items'}
                </p>
                <p className="text-[11px] text-[#1e1e1e]/60 font-light">
                  {savedTextures.length} {savedTextures.length === 1 ? 'texture' : 'textures'}, {savedColours.length} {savedColours.length === 1 ? 'colour' : 'colours'}
                </p>
              </div>

              {/* Card 2: My Enquiries */}
              <div className="p-4 bg-[#E9EDF0]/50 rounded-xl border border-[#1e1e1e]/10 space-y-1">
                <span className="text-[11px] text-[#321B35]/70 uppercase tracking-wider block font-medium">
                  My Enquiries
                </span>
                <p className="text-sm font-medium text-[#1e1e1e]">
                  {lastEnquiry ? '1 active enquiry' : 'No active enquiries'}
                </p>
                <p className="text-[11px] text-[#1e1e1e]/60 font-light">
                  {lastEnquiry ? `Submitted on ${lastEnquiry.date}` : 'Ready to request an estimate'}
                </p>
              </div>

              {/* Card 3: Preferred Location */}
              <div className="p-4 bg-[#E9EDF0]/50 rounded-xl border border-[#1e1e1e]/10 space-y-1">
                <span className="text-[11px] text-[#321B35]/70 uppercase tracking-wider block font-medium">
                  Preferred Location
                </span>
                <p className="text-sm font-medium text-[#1e1e1e]">
                  {currentUser.location || 'Mangalore, India'}
                </p>
                <p className="text-[11px] text-[#1e1e1e]/60 font-light">
                  Coastal Karnataka Coverage
                </p>
              </div>
            </div>

            {/* 3. Project Selection Summary */}
            <div className="p-5 bg-[#E9EDF0]/40 rounded-xl border border-[#321B35]/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#321B35]">
                    Current Project Selections
                  </h2>
                  <p className="text-xs text-[#1e1e1e]/60 font-light mt-0.5">
                    Wall textures and colours chosen for your space.
                  </p>
                </div>

                {totalSavedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onNavigate('cart')}
                    className="text-xs text-[#321B35] hover:underline underline-offset-2 font-medium cursor-pointer"
                  >
                    Review & Modify
                  </button>
                )}
              </div>

              {totalSavedCount === 0 ? (
                <div className="py-4 text-center space-y-2">
                  <p className="text-xs text-[#1e1e1e]/60 font-light">
                    You have not saved any finishes or colours yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('shop')}
                    className="text-xs text-[#321B35] font-medium hover:underline underline-offset-2 cursor-pointer"
                  >
                    Explore Catalogue →
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1 text-xs">
                  {/* Selected Textures */}
                  {savedTextures.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-[#1e1e1e]/70 uppercase tracking-wider block">
                        Textures ({savedTextures.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {savedTextures.map((tex) => (
                          <span
                            key={tex.id}
                            className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#1e1e1e]/15 text-xs text-[#1e1e1e] font-medium"
                          >
                            {tex.image && (
                              <img
                                src={tex.image}
                                alt={tex.name}
                                className="w-4 h-4 rounded-xs object-cover"
                              />
                            )}
                            <span>{tex.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Colours */}
                  {savedColours.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-[#1e1e1e]/70 uppercase tracking-wider block">
                        Colours ({savedColours.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {savedColours.map((col) => (
                          <span
                            key={col.id}
                            className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-[#1e1e1e]/15 text-xs text-[#1e1e1e]"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/15 shrink-0 inline-block"
                              style={{ backgroundColor: col.hex }}
                              aria-hidden="true"
                            />
                            <span className="font-medium">{col.name}</span>
                            <span className="text-[10px] font-mono text-[#1e1e1e]/50 uppercase">
                              {col.hex}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Primary Actions (Harmonious Button Pair, No Garish Yellow) */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="flex-1 py-3 px-6 rounded-full border border-[#321B35]/25 hover:border-[#321B35] text-[#321B35] bg-white hover:bg-[#321B35]/5 text-xs sm:text-sm font-medium transition-colors text-center cursor-pointer"
              >
                Explore Textures & Colours
              </button>

              <button
                type="button"
                onClick={() => onNavigate('checkout')}
                className="flex-1 py-3 px-6 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs sm:text-sm font-medium transition-colors text-center cursor-pointer shadow-xs"
              >
                Request a Site Visit
              </button>
            </div>

            {/* 5. Edit Profile Modal Dialog */}
            {isEditing && (
              <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-profile-title"
              >
                <div className="bg-white rounded-2xl border border-[#321B35]/15 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]/10">
                    <h3 id="edit-profile-title" className="font-serif text-xl text-[#321B35]">
                      Edit Profile
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="p-1 text-[#1e1e1e]/60 hover:text-[#1e1e1e] cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block text-xs font-medium text-[#1e1e1e]/70 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#1e1e1e]/20 text-sm focus:outline-none focus:border-[#321B35]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1e1e1e]/70 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#1e1e1e]/20 text-sm focus:outline-none focus:border-[#321B35]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1e1e1e]/70 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+91 99727 27446"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#1e1e1e]/20 text-sm focus:outline-none focus:border-[#321B35]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1e1e1e]/70 mb-1">
                        Preferred Project Location
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="e.g. Mangalore, Karnataka"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#1e1e1e]/20 text-sm focus:outline-none focus:border-[#321B35]"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-full border border-[#1e1e1e]/20 text-xs font-medium text-[#1e1e1e]/70 hover:bg-black/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#321B35] hover:bg-[#432347] text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* LOGGED OUT: Sign In / Create Account Layout             */
          /* ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Visual Editorial Card */}
            <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-black/5 shadow-md hidden md:block rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="COLOUR TONE Texture & Interior Craftsmanship"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-white/80 font-medium block">
                  COLOUR TONE CUSTOMER PORTAL
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-snug">
                  Your Space, Your Style.
                </h3>
                <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed">
                  Sign in to manage your saved textures and colours, review your selections, and enquire about painting services.
                </p>
              </div>
            </div>

            {/* Right Column: Form Card */}
            <div className="lg:col-span-6 bg-white/80 p-6 sm:p-9 rounded-2xl border border-[#321B35]/15 shadow-2xs space-y-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#321B35]/70 block mb-1">
                  Customer Portal
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#321B35] font-normal tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-xs text-[#1e1e1e]/70 mt-1 font-light">
                  {mode === 'login'
                    ? 'Enter your credentials to access your saved finishes and project enquiries.'
                    : 'Join COLOUR TONE to explore custom textures and request site consultations.'}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-[#E9EDF0] p-1.5 rounded-full border border-[#321B35]/15">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setFormErrors({});
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#321B35] text-white shadow-2xs'
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
                      ? 'bg-[#321B35] text-white shadow-2xs'
                      : 'text-[#321B35]/75 hover:text-[#321B35]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
              {formErrors.form && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl">
                  {formErrors.form}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1">
                      Full Name (required)
                    </label>
                    {formErrors.name && (
                      <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-lg inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.name}</span>
                      </div>
                    )}
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Adish Devadiga"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1e1e1e]/20 focus:outline-none focus:border-[#321B35] text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1">
                    Email Address (required)
                  </label>
                  {formErrors.email && (
                    <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-lg inline-flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1e1e1e]/20 focus:outline-none focus:border-[#321B35] text-sm"
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1">
                      Phone Number (required for site visits)
                    </label>
                    {formErrors.phone && (
                      <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-lg inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.phone}</span>
                      </div>
                    )}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99727 27446"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1e1e1e]/20 focus:outline-none focus:border-[#321B35] text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1">
                    Password (required)
                  </label>
                  {formErrors.password && (
                    <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-lg inline-flex items-center gap-1.5">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1e1e1e]/20 focus:outline-none focus:border-[#321B35] text-sm pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1e1e1e]/50 hover:text-[#1e1e1e] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1">
                      Confirm Password (required)
                    </label>
                    {formErrors.confirmPassword && (
                      <div className="mb-1.5 px-3 py-1 bg-red-600 text-white text-[11px] rounded-lg inline-flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.confirmPassword}</span>
                      </div>
                    )}
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1e1e1e]/20 focus:outline-none focus:border-[#321B35] text-sm"
                    />
                  </div>
                )}

                {/* Checkboxes */}
                <div className="space-y-2 pt-0.5 text-xs text-[#1e1e1e]/75">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#1e1e1e]/30 text-[#321B35] focus:ring-[#321B35]"
                    />
                    <label htmlFor="remember-me" className="cursor-pointer select-none">
                      Keep me signed in
                    </label>
                  </div>

                  {mode === 'signup' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#1e1e1e]/30 text-[#321B35] focus:ring-[#321B35]"
                      />
                      <label htmlFor="newsletter" className="cursor-pointer select-none">
                        Receive seasonal wall texture lookbooks & paint palette guides
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer flex items-center justify-center min-h-[44px]"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
