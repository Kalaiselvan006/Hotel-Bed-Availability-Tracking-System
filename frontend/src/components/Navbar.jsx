import React from 'react';
import { BedDouble, LogOut, SlidersHorizontal, CalendarCheck } from 'lucide-react';

export default function Navbar({
  stats,
  currentUser,
  onLogout,
  onOpenMyBookings,
  onOpenStaffDesk,
  onScrollToRooms
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onScrollToRooms}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow">
            <BedDouble className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-bold tracking-[0.2em] text-gold-400 block leading-tight">
              THE GRAND HERITAGE
            </span>
            <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase font-sans">
              Hotel Bed Availability System
            </span>
          </div>
        </div>

        {/* Live Bed Quick Pill */}
        {stats && (
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">
              <strong className="text-emerald-400 font-semibold">{stats.availableBeds}</strong> of{' '}
              <strong className="text-gold-400 font-semibold">{stats.totalBeds}</strong> Beds Available
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">
              Occupancy: <strong className="text-gold-400">{stats.occupancyRate}%</strong>
            </span>
          </div>
        )}

        {/* Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenStaffDesk}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-200 bg-slate-900 hover:bg-slate-850 hover:text-gold-400 border border-white/10 transition"
            title="Desk Management Switcher"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Desk Control</span>
          </button>

          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-200 bg-slate-900 hover:bg-slate-850 hover:text-gold-400 border border-white/10 transition"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>My Bookings</span>
          </button>

          {currentUser && (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-medium text-gold-400 leading-none">
                  {currentUser.fullName || currentUser.email}
                </span>
                <span className="text-[10px] text-slate-400">Verified Guest</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-white/10 transition text-xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
