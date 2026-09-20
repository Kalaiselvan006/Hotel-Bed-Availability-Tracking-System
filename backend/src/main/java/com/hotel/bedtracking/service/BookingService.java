package com.hotel.bedtracking.service;

import com.hotel.bedtracking.dto.BookingRequest;
import com.hotel.bedtracking.model.Booking;
import com.hotel.bedtracking.model.Room;
import com.hotel.bedtracking.repository.BookingRepository;
import com.hotel.bedtracking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private OtpService otpService;

    @Transactional
    public Booking createBooking(BookingRequest req) {
        if (req.getGuestName() == null || req.getGuestName().trim().isEmpty()) {
            throw new IllegalArgumentException("Guest name is required.");
        }
        if (req.getGuestEmail() == null || req.getGuestEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Guest email is required.");
        }
        if (req.getRoomId() == null) {
            throw new IllegalArgumentException("Room selection is required.");
        }
        if (req.getCheckIn() == null || req.getCheckOut() == null) {
            throw new IllegalArgumentException("Check-in and Check-out dates are required.");
        }
        if (!req.getCheckOut().isAfter(req.getCheckIn())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date.");
        }

        // Verify OTP if provided
        if (req.getOtp() != null && !req.getOtp().trim().isEmpty()) {
            boolean verified = otpService.verifyOtp(req.getGuestEmail(), req.getOtp());
            if (!verified) {
                throw new IllegalArgumentException("Invalid or expired OTP. Please enter the correct 6-digit code.");
            }
        }

        Room room = roomRepository.findById(req.getRoomId())
            .orElseThrow(() -> new IllegalArgumentException("Selected room not found."));

        if (!"available".equalsIgnoreCase(room.getStatus())) {
            throw new IllegalStateException("Room " + room.getRoomNumber() + " is currently " + room.getStatus() + ". Please choose another available room.");
        }

        // Mark room as reserved
        room.setStatus("reserved");
        roomRepository.save(room);

        Booking booking = new Booking();
        booking.setGuestName(req.getGuestName().trim());
        booking.setGuestEmail(req.getGuestEmail().trim().toLowerCase());
        booking.setRoomId(room.getId());
        booking.setRoom(room);
        booking.setCheckIn(req.getCheckIn());
        booking.setCheckOut(req.getCheckOut());
        booking.setStatus("reserved");
        booking.setCreatedAt(OffsetDateTime.now());

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookings(String guestEmail) {
        if (guestEmail != null && !guestEmail.trim().isEmpty()) {
            return bookingRepository.findByGuestEmailIgnoreCaseOrderByCreatedAtDesc(guestEmail.trim());
        }
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Booking updateBookingStatus(Long id, String newStatus) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + id));

        String status = newStatus.toLowerCase();
        booking.setStatus(status);

        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room != null) {
            if ("checked_in".equals(status)) {
                room.setStatus("occupied");
            } else if ("checked_out".equals(status) || "cancelled".equals(status)) {
                room.setStatus("available");
            } else if ("reserved".equals(status)) {
                room.setStatus("reserved");
            }
            roomRepository.save(room);
        }

        return bookingRepository.save(booking);
    }
}
