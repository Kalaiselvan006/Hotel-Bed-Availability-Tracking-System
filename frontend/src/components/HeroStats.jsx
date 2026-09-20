import React from 'react';
import { Bed, BedDouble, CheckCircle2, AlertCircle, Clock, Percent, Filter, Layers } from 'lucide-react';

export default function HeroStats({
  stats,
  filterStatus,
  setFilterStatus,
  filterBeds,
  setFilterBeds,
  filterType,
  setFilterType,
  selectedFloor,
  setSelectedFloor
}) {
  return (
    <section className="relative pt-6 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Real-time KPI Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {/* Total Suites */}
            <div className="glass-card p-4 sm:p-5 rounded-xl border border-white/10 shadow-glass-card">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Total Suites</span>
                <BedDouble className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-semibold text-white">
                {stats.totalRooms}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {stats.totalBeds} Total Beds
              </div>
            </div>

            {/* Available Beds */}
            <div className="glass-card p-4 sm:p-5 rounded-xl border border-white/10 shadow-glass-card relative overflow-hidden">
              <div className="flex items-center justify-between text-emerald-400/90 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Available Beds</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-semibold text-emerald-400">
                {stats.availableBeds}
              </div>
              <div className="text-xs text-emerald-300/80 mt-1 flex items-center gap-1.5 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ready for Check-In
              </div>
            </div>

            {/* Occupied Beds */}
            <div className="glass-card p-4 sm:p-5 rounded-xl border border-white/10 shadow-glass-card">
              <div className="flex items-center justify-between text-rose-400/90 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Occupied Beds</span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-semibold text-rose-300">
                {stats.occupiedBeds}
              </div>
              <div className="text-xs text-rose-300/80 mt-1 font-medium">
                {stats.occupiedRooms} Active In-House
              </div>
            </div>

            {/* Reserved Beds */}
            <div className="glass-card p-4 sm:p-5 rounded-xl border border-white/10 shadow-glass-card">
              <div className="flex items-center justify-between text-amber-400/90 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Reserved Beds</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-semibold text-amber-300">
                {stats.reservedBeds}
              </div>
              <div className="text-xs text-amber-300/80 mt-1 font-medium">
                {stats.reservedRooms} Pending Arrival
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="col-span-2 lg:col-span-1 glass-card p-4 sm:p-5 rounded-xl border border-white/10 shadow-glass-card">
              <div className="flex items-center justify-between text-gold-400 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Occupancy Rate</span>
                <Percent className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-semibold text-gold-400">
                {stats.occupancyRate}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-white/5">
                <div
                  className="bg-gold-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(stats.occupancyRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Live Filter Bar */}
        <div className="glass-card border border-white/10 p-4 sm:p-5 rounded-2xl shadow-glass-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-gold-400" /> Status:
              </span>
              {[
                { label: 'All Rooms', val: 'ALL' },
                { label: 'Available', val: 'available', dot: 'bg-emerald-400' },
                { label: 'Reserved', val: 'reserved', dot: 'bg-amber-400' },
                { label: 'Occupied', val: 'occupied', dot: 'bg-rose-400' }
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => setFilterStatus(item.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    filterStatus === item.val
                      ? 'bg-gold-500 text-slate-950 font-bold shadow-gold-glow'
                      : 'bg-slate-900/80 text-slate-200 hover:bg-slate-850 border border-white/5'
                  }`}
                >
                  {item.dot && <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`}></span>}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Floor, Bed Count and Type Selectors */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Floor Filter */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5">
                <Layers className="w-3.5 h-3.5 text-gold-400" />
                <select
                  value={selectedFloor || 'ALL'}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900 text-white">All Floors</option>
                  <option value="1" className="bg-slate-900 text-white">Floor 1 (Suites 101–106)</option>
                  <option value="2" className="bg-slate-900 text-white">Floor 2 (Suites 201–205)</option>
                </select>
              </div>

              {/* Bed Count */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5">
                <Bed className="w-3.5 h-3.5 text-gold-400" />
                <select
                  value={filterBeds}
                  onChange={(e) => setFilterBeds(Number(e.target.value))}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={0} className="bg-slate-900 text-white">All Bed Capacities</option>
                  <option value={1} className="bg-slate-900 text-white">1 Bed</option>
                  <option value={2} className="bg-slate-900 text-white">2 Beds</option>
                  <option value={3} className="bg-slate-900 text-white">3 Beds</option>
                </select>
              </div>

              {/* Room Type */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5">
                <BedDouble className="w-3.5 h-3.5 text-gold-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900 text-white">All Suite Types</option>
                  <option value="Single" className="bg-slate-900 text-white">Single</option>
                  <option value="Double" className="bg-slate-900 text-white">Double</option>
                  <option value="Deluxe" className="bg-slate-900 text-white">Deluxe</option>
                  <option value="Suite" className="bg-slate-900 text-white">Suite</option>
                  <option value="Penthouse" className="bg-slate-900 text-white">Penthouse</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
