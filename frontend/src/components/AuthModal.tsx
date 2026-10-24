import React, { useState } from 'react';
import { User } from '../types';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    const userName = mode === 'signup' ? name : email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const user: User = {
      name: formattedName,
      email,
      phone: phone || '+91 9972727446',
    };

    onLogin(user);
    setSuccessMsg(mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#E9EDF0] text-[#321B35] rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-[#321B35]/15">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-[#321B35]/10 text-[#321B35] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-[#321B35] text-white rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium text-[#321B35]">
                {currentUser.name}
              </h3>
              <p className="text-sm text-[#1e1e1e]/70">{currentUser.email}</p>
              {currentUser.phone && (
                <p className="text-xs text-[#1e1e1e]/60">{currentUser.phone}</p>
              )}
            </div>

            <div className="p-4 bg-white/70 rounded-2xl border border-[#321B35]/10 text-xs text-[#1e1e1e]/80 flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-[#F2B632]" />
              <span>COLOUR TONE Client Account Verified</span>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-full border border-[#321B35] text-[#321B35] text-sm hover:bg-[#321B35]/5 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="font-serif text-3xl font-medium text-[#321B35]">
                {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-[#1e1e1e]/70 mt-1">
                {mode === 'login'
                  ? 'Access your painting project estimates and bookings'
                  : 'Join COLOUR TONE to manage your texture selections'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-white/80 p-1 rounded-full border border-[#321B35]/15 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#321B35] text-white shadow-xs'
                    : 'text-[#321B35]/70 hover:text-[#321B35]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#321B35] text-white shadow-xs'
                    : 'text-[#321B35]/70 hover:text-[#321B35]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-100 border border-red-300 text-red-800 text-xs rounded-full flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 px-4 py-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-full flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adish Devadiga"
                    className="w-full px-5 py-2.5 rounded-full bg-white border border-[#321B35]/20 focus:outline-none focus:border-[#321B35] text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-5 py-2.5 rounded-full bg-white border border-[#321B35]/20 focus:outline-none focus:border-[#321B35] text-sm"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-3">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9972727446"
                    className="w-full px-5 py-2.5 rounded-full bg-white border border-[#321B35]/20 focus:outline-none focus:border-[#321B35] text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#1e1e1e]/80 mb-1 ml-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-2.5 rounded-full bg-white border border-[#321B35]/20 focus:outline-none focus:border-[#321B35] text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-full bg-[#321B35] text-white text-sm font-medium hover:bg-[#432347] transition-all shadow-md cursor-pointer"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  // demo quick fill for testing
                  setEmail('abhikshardevadiga@gmail.com');
                  setPassword('password123');
                  setName('Abhikshar Devadiga');
                }}
                className="text-[11px] text-[#321B35]/60 hover:text-[#321B35] underline"
              >
                Quick demo autofill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
