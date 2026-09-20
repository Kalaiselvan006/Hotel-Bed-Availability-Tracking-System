import React, { useState } from 'react';
import { X, SlidersHorizontal, Bed, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function StaffDeskModal({ rooms, onClose, onRefreshData }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (roomId, newStatus) => {
    setUpdatingId(roomId);
    try {
      await api.updateRoomStatus(roomId, newStatus);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl heritage-card rounded-2xl border border-brass-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-750 bg-forest-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brass-400" />
            <div>
              <h3 className="font-serif text-lg text-parchment-50">Hotel Desk — Room & Bed Control</h3>
              <p className="text-[10px] text-parchment-200/50">
                Interactive evaluator panel: instantly toggle statuses to test bed tracking metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-parchment-200/50 hover:text-parchment-100 hover:bg-forest-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {rooms.map((r) => {
            const isBusy = updatingId === r.id;
            return (
              <div
                key={r.id}
                className="bg-forest-900 border border-forest-750 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-forest-850 border border-brass-500/30 text-brass-400 font-mono font-bold">
                    #{r.roomNumber}
                  </span>
                  <div>
                    <h4 className="font-semibold text-parchment-100">{r.roomType}</h4>
                    <span className="text-[11px] text-parchment-200/50 flex items-center gap-1">
                      <Bed className="w-3 h-3 text-brass-400" /> {r.bedCount} {r.bedCount === 1 ? 'Bed' : 'Beds'}
                    </span>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleStatusChange(r.id, 'available')}
                    disabled={isBusy || r.status === 'available'}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                      r.status === 'available'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-semibold'
                        : 'bg-forest-850 text-parchment-200/60 hover:text-emerald-300 hover:bg-forest-800 border border-forest-750'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Available</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(r.id, 'reserved')}
                    disabled={isBusy || r.status === 'reserved'}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                      r.status === 'reserved'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-semibold'
                        : 'bg-forest-850 text-parchment-200/60 hover:text-amber-300 hover:bg-forest-800 border border-forest-750'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Reserved</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(r.id, 'occupied')}
                    disabled={isBusy || r.status === 'occupied'}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                      r.status === 'occupied'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/50 font-semibold'
                        : 'bg-forest-850 text-parchment-200/60 hover:text-rose-300 hover:bg-forest-800 border border-forest-750'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>Occupied</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
