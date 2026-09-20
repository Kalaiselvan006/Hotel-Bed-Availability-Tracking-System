import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Bed, Check, XCircle, LogIn, LogOut, Clock, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function MyBookingsModal({ currentUser, onClose, onRefreshData }) {
  const [emailQuery, setEmailQuery] = useState(currentUser?.email || '');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchBookings = async (emailToFetch) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.getBookings(emailToFetch || '');
      setBookings(res.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to retrieve reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentUser?.email || '');
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(emailQuery.trim());
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      await fetchBookings(emailQuery.trim());
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl heritage-card rounded-2xl border border-brass-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-750 bg-forest-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brass-400" />
            <h3 className="font-serif text-lg text-parchment-50">Guest Reservations & Stays</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-parchment-200/50 hover:text-parchment-100 hover:bg-forest-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Strip */}
        <div className="p-5 border-b border-forest-800/80 bg-forest-900/40 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brass-500/70 absolute left-3.5 top-3" />
              <input
                type="email"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="Search reservations by guest email..."
                className="w-full bg-forest-900 border border-forest-750 rounded-xl pl-10 pr-3 py-2 text-xs text-parchment-100 placeholder-parchment-200/30 focus:outline-none focus:border-brass-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-brass-500 hover:bg-brass-400 text-forest-950 text-xs font-bold tracking-wider uppercase transition shadow-brass-glow"
            >
              {loading ? 'Searching...' : 'Find Bookings'}
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-6 h-6 border-2 border-brass-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs text-parchment-200/50">Retrieving booking records...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-parchment-200/50 text-xs">
              <Calendar className="w-10 h-10 text-forest-700 mx-auto mb-3" />
              <p>No reservations found for this inquiry.</p>
              <p className="mt-1 text-parchment-200/30">
                Book a room from the suites grid or search with another email address.
              </p>
            </div>
          ) : (
            bookings.map((b) => {
              const isReserved = b.status === 'reserved';
              const isCheckedIn = b.status === 'checked_in';
              const isCheckedOut = b.status === 'checked_out';
              const isCancelled = b.status === 'cancelled';
              const isBusy = actionLoadingId === b.id;

              return (
                <div
                  key={b.id}
                  className="bg-forest-900/80 border border-forest-750 hover:border-brass-500/40 rounded-xl p-4 transition text-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brass-400">#BK-{b.id}</span>
                        <span className="text-parchment-200/40">•</span>
                        <span className="text-parchment-100 font-semibold">{b.guestName}</span>
                      </div>
                      <span className="text-[11px] text-parchment-200/50">{b.guestEmail}</span>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isReserved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Reserved
                        </span>
                      )}
                      {isCheckedIn && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          <Check className="w-3 h-3" /> Checked In
                        </span>
                      )}
                      {isCheckedOut && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-forest-850 text-parchment-200/60 border border-forest-750">
                          Checked Out
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/30">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room & Dates */}
                  <div className="grid grid-cols-2 gap-2 bg-forest-850 p-2.5 rounded-lg border border-forest-800 text-[11px]">
                    <div>
                      <span className="text-parchment-200/40 block">Room & Bed</span>
                      <span className="text-parchment-100 font-medium">
                        {b.room ? `Room ${b.room.roomNumber} (${b.room.roomType})` : `Room #${b.roomId}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-parchment-200/40 block">Stay Dates</span>
                      <span className="text-parchment-100 font-medium">
                        {b.checkIn} → {b.checkOut}
                      </span>
                    </div>
                  </div>

                  {/* Actions for active bookings */}
                  {(isReserved || isCheckedIn) && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-forest-800/80">
                      {isReserved && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked_in')}
                            disabled={isBusy}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 transition flex items-center gap-1"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>Check-In Guest</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            disabled={isBusy}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[11px] font-medium border border-rose-500/30 transition flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Cancel Reservation</span>
                          </button>
                        </>
                      )}

                      {isCheckedIn && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'checked_out')}
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-lg bg-brass-500 hover:bg-brass-400 text-forest-950 text-[11px] font-bold transition flex items-center gap-1 shadow-brass-glow"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Check-Out (Free Bed)</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
