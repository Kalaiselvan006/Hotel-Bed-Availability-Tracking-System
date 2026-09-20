import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ShieldCheck, ArrowRight, BedDouble, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSendOtp = async () => {
    if (!formData.email.trim()) {
      setErrorMsg('Please enter your email to receive the 6-digit verification code.');
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg('');
    try {
      await api.sendOtp(formData.email.trim(), 'Account Registration');
      setOtpSent(true);
      setSuccessMsg(`Verification code sent to ${formData.email.trim()}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await api.login({
          email: formData.email.trim(),
          password: formData.password,
        });
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        onAuthSuccess(res.data);
      } else {
        // Register
        if (otpSent && !formData.otp.trim()) {
          setErrorMsg('Please enter the 6-digit OTP code received in your email.');
          setIsSubmitting(false);
          return;
        }

        const res = await api.register({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          otp: formData.otp.trim(),
        });
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        onAuthSuccess(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-forest-950 overflow-hidden font-sans">
      {/* Immersive Background with Subtle Glassmorphism Blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
          alt="Hotel Interior"
          className="w-full h-full object-cover opacity-20 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/90 via-forest-950/80 to-forest-950/95"></div>
        {/* Soft Ambient Light Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brass-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-forest-700/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Frosted Glass Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-400 to-brass-700 flex items-center justify-center text-forest-950 shadow-brass-glow mx-auto mb-3">
            <BedDouble className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-[0.2em] text-brass-400">
            THE GRAND HERITAGE
          </h2>
          <p className="text-[11px] tracking-[0.25em] text-parchment-200/60 uppercase mt-1">
            Bed Availability Tracking System
          </p>
        </div>

        {/* Glassmorphic Container */}
        <div className="rounded-2xl p-6 sm:p-8 backdrop-blur-2xl bg-[#091511]/95 border border-brass-500/35 shadow-2xl shadow-forest-950/90">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 p-1 bg-forest-950/80 border border-brass-500/20 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-brass-500 text-forest-950 shadow-brass-glow font-bold'
                  : 'text-parchment-200/60 hover:text-parchment-100'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-brass-500 text-forest-950 shadow-brass-glow font-bold'
                  : 'text-parchment-200/60 hover:text-parchment-100'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Email OTP Verification Box */}
                <div className="p-3.5 rounded-xl bg-forest-950/80 border border-brass-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brass-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Email Verification Code
                    </span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="text-[11px] text-brass-400 hover:text-brass-300 font-semibold uppercase tracking-wider underline disabled:opacity-50"
                    >
                      {isSendingOtp ? 'Sending...' : otpSent ? 'Resend Code' : 'Send Code'}
                    </button>
                  </div>
                  <input
                    type="text"
                    name="otp"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-[#0c1814] border border-brass-500/30 rounded-lg px-3 py-2 text-sm text-center font-mono tracking-[0.3em] text-brass-300 focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-semibold"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brass-500 to-brass-600 hover:from-brass-400 hover:to-brass-500 text-forest-950 font-bold text-xs tracking-widest uppercase transition-all shadow-brass-glow flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle Helper Link */}
          <div className="mt-5 text-center text-xs text-parchment-200/60">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-brass-400 hover:text-brass-300 font-semibold underline ml-1"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-brass-400 hover:text-brass-300 font-semibold underline ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
