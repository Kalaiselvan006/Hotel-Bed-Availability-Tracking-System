import React, { useState, useRef, useEffect } from 'react';
import { X, Bed, Calendar, Mail, User, Phone, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../api';
import { getRoomPrice } from './RoomGrid';

const ROOM_THUMBNAILS = {
  Single: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80',
  Double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
  Deluxe: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  Executive: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80',
  Suite: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80',
  Penthouse: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=400&q=80',
};

function getThumbnail(roomType) {
  const typeLower = (roomType || '').toLowerCase();
  if (typeLower.includes('penthouse')) return ROOM_THUMBNAILS.Penthouse;
  if (typeLower.includes('suite')) return ROOM_THUMBNAILS.Suite;
  if (typeLower.includes('executive')) return ROOM_THUMBNAILS.Executive;
  if (typeLower.includes('deluxe')) return ROOM_THUMBNAILS.Deluxe;
  if (typeLower.includes('double')) return ROOM_THUMBNAILS.Double;
  return ROOM_THUMBNAILS.Single;
}

export default function BookingModal({ room, currentUser, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification, 3: Confirmed
  const [formData, setFormData] = useState({
    guestName: currentUser?.fullName || '',
    guestEmail: currentUser?.email || '',
    guestPhone: currentUser?.phone || '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const otpInputs = useRef([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMsg('');

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Send OTP
  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.guestName.trim() || !formData.guestEmail.trim()) {
      setErrorMsg('Please enter your full name and email.');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setErrorMsg('Check-out date must be after check-in date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.sendOtp(formData.guestEmail.trim(), 'Hotel Room Reservation');
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setErrorMsg('');
    try {
      await api.sendOtp(formData.guestEmail.trim(), 'Hotel Room Reservation');
      setResendTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code.');
    }
  };

  // Confirm Booking with OTP
  const handleConfirmBooking = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        roomId: room.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        otp: fullOtp,
      };

      const res = await api.createBooking(payload);
      setConfirmedBooking(res.data);
      setStep(3);
      if (onBookingSuccess) onBookingSuccess(res.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to confirm reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-950/85 backdrop-blur-md animate-fadeIn">
      {/* Outer Card with Glassmorphism and Brass Border */}
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden backdrop-blur-2xl bg-[#091511]/95 border border-brass-500/35 shadow-2xl shadow-forest-950/90">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-forest-750/80 bg-forest-900/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-brass-400"></span>
            <h3 className="font-serif text-lg sm:text-xl font-medium text-parchment-50 tracking-tight">
              {step === 3 ? 'Reservation Confirmed' : `Reserve Suite ${room.roomNumber}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-parchment-200/60 hover:text-parchment-50 hover:bg-forest-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Info Strip with Preview Thumbnail */}
        {step !== 3 && (
          <div className="px-6 py-3.5 bg-forest-950/80 border-b border-forest-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={getThumbnail(room.roomType)}
                alt={room.roomType}
                className="w-12 h-10 rounded-lg object-cover border border-brass-500/30"
              />
              <div>
                <span className="font-serif text-sm font-semibold text-parchment-50 block leading-tight">
                  {room.roomType}
                </span>
                <span className="text-[11px] text-parchment-200/60 font-sans">
                  Suite #{room.roomNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brass-400 font-serif mr-1">
                {getRoomPrice(room.roomType)} <span className="text-[10px] text-parchment-200/50 font-sans">/ night</span>
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-forest-900 border border-brass-500/25 text-xs text-brass-400 font-medium">
                <Bed className="w-3.5 h-3.5" />
                <span>{room.bedCount} {room.bedCount === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ready
              </span>
            </div>
          </div>
        )}

        {/* Body Container */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Guest Information & Dates */}
          {step === 1 && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                  Guest Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="guestName"
                    required
                    value={formData.guestName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="guestEmail"
                      required
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                      placeholder="guest@domain.com"
                      className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] placeholder-[#A0988A] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Check-in & Check-out Dates */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      name="checkIn"
                      required
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brass-400/90 mb-1.5">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      name="checkOut"
                      required
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c1814] border border-brass-500/30 rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#F4EFE6] focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition font-sans font-medium cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brass-500 to-brass-600 hover:from-brass-400 hover:to-brass-500 text-forest-950 font-bold text-xs tracking-widest uppercase transition-all shadow-brass-glow flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Email & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Email OTP Verification */}
          {step === 2 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-brass-500/10 border border-brass-500/30 flex items-center justify-center mx-auto text-brass-400 shadow-brass-glow">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-serif text-lg sm:text-xl text-parchment-50 mb-1">Enter Verification Code</h4>
                <p className="text-xs text-parchment-200/70 max-w-sm mx-auto">
                  A 6-digit code has been sent to{' '}
                  <strong className="text-brass-400">{formData.guestEmail}</strong>.
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#0c1814] border border-brass-500/40 rounded-xl text-brass-300 focus:outline-none focus:border-brass-400 focus:ring-1 focus:ring-brass-400 transition"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs px-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-parchment-200/60 hover:text-parchment-100 transition"
                >
                  Edit details
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`flex items-center gap-1.5 transition ${
                    resendTimer > 0
                      ? 'text-parchment-200/40 cursor-not-allowed'
                      : 'text-brass-400 hover:text-brass-300 font-semibold'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? '' : 'hover:rotate-180 transition'}`} />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brass-500 to-brass-600 hover:from-brass-400 hover:to-brass-500 text-forest-950 font-bold text-xs tracking-widest uppercase transition-all shadow-brass-glow flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Lock Reservation</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: Booking Confirmed */}
          {step === 3 && confirmedBooking && (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-serif text-xl text-parchment-50 mb-1">Reservation Confirmed</h4>
                <p className="text-xs text-parchment-200/60">
                  Your bed in Suite {room.roomNumber} is reserved.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#0c1814] border border-brass-500/30 rounded-xl p-4 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-parchment-200/50">Reservation ID:</span>
                  <span className="font-mono text-brass-400 font-bold">#BK-{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment-200/50">Guest:</span>
                  <span className="text-parchment-100 font-semibold">{confirmedBooking.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment-200/50">Suite & Beds:</span>
                  <span className="text-parchment-100 font-semibold">
                    Room {room.roomNumber} ({room.bedCount} Beds)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment-200/50">Duration:</span>
                  <span className="text-parchment-100 font-semibold">
                    {confirmedBooking.checkIn} to {confirmedBooking.checkOut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment-200/50">Rate / Night:</span>
                  <span className="text-brass-400 font-semibold font-serif">
                    {getRoomPrice(room.roomType)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-forest-800">
                  <span className="text-parchment-200/50">Status:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
                    Reserved
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-forest-850 hover:bg-forest-800 text-parchment-100 text-xs font-semibold tracking-wider uppercase border border-forest-750 transition"
              >
                Close & View Availability
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
