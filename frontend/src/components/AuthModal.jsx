import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ onClose, onAuthSuccess }) {
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
      setErrorMsg('Please enter your email to receive an OTP code.');
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg('');
    try {
      await api.sendOtp(formData.email.trim(), 'Account Registration');
      setOtpSent(true);
      setSuccessMsg('6-digit security code sent to ' + formData.email.trim());
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
        onClose();
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
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md luxury-card rounded-2xl border border-gold-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-noir-700/80 bg-noir-900/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold-400"></div>
            <h3 className="font-serif text-lg text-alabaster-50">
              {mode === 'login' ? 'Guest Portal Sign In' : 'Create Guest Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-alabaster-200/50 hover:text-alabaster-100 hover:bg-noir-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-noir-900/90 border-b border-noir-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'login'
                ? 'bg-noir-800 text-gold-400 border border-gold-500/20 shadow-sm'
                : 'text-alabaster-200/50 hover:text-alabaster-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'register'
                ? 'bg-noir-800 text-gold-400 border border-gold-500/20 shadow-sm'
                : 'text-alabaster-200/50 hover:text-alabaster-200'
            }`}
          >
            Register with OTP
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-alabaster-200/70 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gold-500/70 absolute left-3 top-3" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Lorde Harrington"
                  className="w-full bg-noir-900 border border-noir-700 rounded-xl pl-9 pr-3 py-2 text-xs text-alabaster-100 placeholder-alabaster-200/30 focus:outline-none focus:border-gold-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-alabaster-200/70 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-500/70 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="guest@domain.com"
                className="w-full bg-noir-900 border border-noir-700 rounded-xl pl-9 pr-3 py-2 text-xs text-alabaster-100 placeholder-alabaster-200/30 focus:outline-none focus:border-gold-500 transition"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-alabaster-200/70 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold-500/70 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-noir-900 border border-noir-700 rounded-xl pl-9 pr-3 py-2 text-xs text-alabaster-100 placeholder-alabaster-200/30 focus:outline-none focus:border-gold-500 transition"
                  />
                </div>
              </div>

              {/* OTP Dispatch and Input for Register */}
              <div className="p-3 rounded-xl bg-noir-900 border border-gold-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gold-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Email Verification Code
                  </span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold uppercase tracking-wider underline disabled:opacity-50"
                  >
                    {isSendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send Code'}
                  </button>
                </div>
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code received by email"
                  className="w-full bg-noir-950 border border-noir-700 rounded-lg px-3 py-1.5 text-xs text-center font-mono tracking-widest text-gold-300 focus:outline-none focus:border-gold-500 transition"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-alabaster-200/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold-500/70 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-noir-900 border border-noir-700 rounded-xl pl-9 pr-3 py-2 text-xs text-alabaster-100 placeholder-alabaster-200/30 focus:outline-none focus:border-gold-500 transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-noir-950 font-semibold text-xs tracking-wider uppercase transition shadow-gold-glow flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-noir-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
