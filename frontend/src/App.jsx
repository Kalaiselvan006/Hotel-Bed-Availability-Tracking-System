import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import RoomGrid from './components/RoomGrid';
import BookingModal from './components/BookingModal';
import MyBookingsModal from './components/MyBookingsModal';
import StaffDeskModal from './components/StaffDeskModal';
import AuthPage from './components/AuthPage';
import { api } from './api';
import { BedDouble, Shield, Compass } from 'lucide-react';

export default function App() {
  // Current Authenticated User (from localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterBeds, setFilterBeds] = useState(0);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState('ALL');

  // Modals & Drawers
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showStaffDesk, setShowStaffDesk] = useState(false);

  // Fetch Live Stats & Rooms
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    try {
      const [statsRes, roomsRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getRooms(filterStatus, filterType, filterBeds).catch(() => ({ data: [] })),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (roomsRes?.data) setRooms(roomsRes.data);
    } catch (err) {
      console.error('Error loading hotel data:', err);
    } finally {
      setLoadingRooms(false);
    }
  }, [currentUser, filterStatus, filterType, filterBeds]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, loadData]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const scrollToRooms = () => {
    document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter rooms by floor
  const displayedRooms = rooms.filter((r) => {
    if (selectedFloor && selectedFloor !== 'ALL') {
      return String(r.roomNumber).startsWith(String(selectedFloor));
    }
    return true;
  });

  // 1. AUTH GATE: If user is not logged in, render the dedicated creative AuthPage first!
  if (!currentUser) {
    return <AuthPage onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  // 2. DASHBOARD: Rendered only after authentication!
  return (
    <div className="min-h-screen flex flex-col bg-forest-950 text-parchment-100 font-sans selection:bg-brass-500 selection:text-forest-950">
      {/* Top Heritage Navbar */}
      <Navbar
        stats={stats}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenMyBookings={() => setShowMyBookings(true)}
        onOpenStaffDesk={() => setShowStaffDesk(true)}
        onScrollToRooms={scrollToRooms}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1">
        {/* Hero & Real-time KPI Stats Banner */}
        <HeroStats
          stats={stats}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterBeds={filterBeds}
          setFilterBeds={setFilterBeds}
          filterType={filterType}
          setFilterType={setFilterType}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          onCheckAvailability={scrollToRooms}
        />

        {/* Suites & Bed Availability Grid */}
        <RoomGrid
          rooms={displayedRooms}
          loading={loadingRooms}
          onSelectRoom={(room) => setSelectedRoomForBooking(room)}
        />
      </main>

      {/* Clean Minimal Footer */}
      <footer className="py-6 border-t border-forest-850/80 text-center text-xs text-parchment-200/40">
        &copy; 2026 The Grand Heritage.
      </footer>

      {/* Booking Modal with Email OTP */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          currentUser={currentUser}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingSuccess={() => {
            loadData();
          }}
        />
      )}

      {/* My Bookings Modal */}
      {showMyBookings && (
        <MyBookingsModal
          currentUser={currentUser}
          onClose={() => setShowMyBookings(false)}
          onRefreshData={loadData}
        />
      )}

      {/* Staff Desk Switcher Modal */}
      {showStaffDesk && (
        <StaffDeskModal
          rooms={rooms}
          onClose={() => setShowStaffDesk(false)}
          onRefreshData={loadData}
        />
      )}
    </div>
  );
}
