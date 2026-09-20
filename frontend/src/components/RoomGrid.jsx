import React from 'react';
import { Bed, Users, Wifi, Tv, Coffee, ArrowRight, MapPin } from 'lucide-react';

const ROOM_IMAGES = {
  Single: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  Double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  Deluxe: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  Executive: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  Suite: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
  Penthouse: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
};

function getRoomImage(roomType) {
  const typeLower = (roomType || '').toLowerCase();
  if (typeLower.includes('penthouse')) return ROOM_IMAGES.Penthouse;
  if (typeLower.includes('suite')) return ROOM_IMAGES.Suite;
  if (typeLower.includes('executive')) return ROOM_IMAGES.Executive;
  if (typeLower.includes('deluxe')) return ROOM_IMAGES.Deluxe;
  if (typeLower.includes('double')) return ROOM_IMAGES.Double;
  return ROOM_IMAGES.Single;
}

function getRoomWing(roomNumber) {
  const num = parseInt(roomNumber, 10);
  if (num >= 200) return 'Floor 2 • West Wing';
  return 'Floor 1 • Courtyard Wing';
}

export function getRoomPrice(roomType) {
  const typeLower = (roomType || '').toLowerCase();
  if (typeLower.includes('penthouse')) return '₹12,500';
  if (typeLower.includes('suite')) return '₹8,500';
  if (typeLower.includes('executive')) return '₹6,200';
  if (typeLower.includes('deluxe')) return '₹4,800';
  if (typeLower.includes('double')) return '₹3,500';
  return '₹2,200';
}


export default function RoomGrid({ rooms, loading, onSelectRoom }) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400 tracking-wider font-light">Loading suite and bed availability...</p>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto glass-card p-8 rounded-2xl border border-white/10">
          <Bed className="w-12 h-12 text-gold-500/60 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-white mb-2">No Suites Match Your Filter</h3>
          <p className="text-xs text-slate-400 mb-6">
            Try adjusting your bed count or availability filter above to view all suites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" id="rooms-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            Available Suites & Beds
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Showing {rooms.length} suites (20 beds total inventory)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const isAvailable = room.status === 'available';
          const isReserved = room.status === 'reserved';
          const isOccupied = room.status === 'occupied';
          const wing = getRoomWing(room.roomNumber);
          const price = getRoomPrice(room.roomType);

          return (
            <div
              key={room.id}
              className={`group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col glass-card ${
                isAvailable
                  ? 'border-white/10 hover:border-gold-500/50 hover:shadow-gold-glow hover:-translate-y-1'
                  : 'border-white/5 opacity-85'
              }`}
            >
              {/* Room Image with Badge Overlay */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                <img
                  src={getRoomImage(room.roomType)}
                  alt={room.roomType}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10141C] via-[#10141C]/40 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Available
                    </span>
                  )}
                  {isReserved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Reserved
                    </span>
                  )}
                  {isOccupied && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      Occupied
                    </span>
                  )}
                </div>

                {/* Room Number Pill */}
                <div className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/90 border border-gold-500/30 text-gold-400 font-mono font-bold text-xs tracking-wider">
                    SUITE {room.roomNumber}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/90 border border-white/10 text-white font-serif font-semibold text-xs">
                    {price} <span className="text-[10px] text-slate-400 font-sans">/ night</span>
                  </span>
                </div>
              </div>

              {/* Room Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg text-white group-hover:text-gold-300 transition">
                      {room.roomType}
                    </h3>
                  </div>

                  {/* Floor / Location */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3 font-medium">
                    <MapPin className="w-3 h-3 text-gold-400/80" />
                    <span>{wing}</span>
                  </div>

                  {/* Bed Configuration Visualizer */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-white/5 mb-4">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center justify-between">
                      <span>Bed Allocation:</span>
                      <span className="text-gold-400 font-bold">{room.bedCount} {room.bedCount === 1 ? 'Bed' : 'Beds'}</span>
                    </div>

                    {/* Visual Bed Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {Array.from({ length: room.bedCount }).map((_, i) => (
                        <div
                          key={i}
                          className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 border ${
                            isAvailable
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                              : isOccupied
                              ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          <Bed className="w-3 h-3 shrink-0" />
                          <span>Bed #{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] py-2 border-t border-white/5 mb-4">
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-gold-500/70" /> WiFi</span>
                    <span className="flex items-center gap-1"><Tv className="w-3 h-3 text-gold-500/70" /> 4K TV</span>
                    <span className="flex items-center gap-1"><Coffee className="w-3 h-3 text-gold-500/70" /> Espresso</span>
                    <span className="flex items-center gap-1 ml-auto"><Users className="w-3 h-3 text-gold-500/70" /> Up to {room.bedCount * 2}</span>
                  </div>
                </div>

                {/* Booking Button */}
                <div>
                  {isAvailable ? (
                    <button
                      onClick={() => onSelectRoom(room)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-gold-glow flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Reserve This Bed</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-slate-500 font-medium text-xs tracking-wider uppercase border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>{isReserved ? 'Currently Reserved' : 'Currently Occupied'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
