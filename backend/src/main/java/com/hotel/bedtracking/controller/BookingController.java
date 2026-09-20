package com.hotel.bedtracking.controller;

import com.hotel.bedtracking.dto.ApiResponse;
import com.hotel.bedtracking.dto.BookingRequest;
import com.hotel.bedtracking.model.Booking;
import com.hotel.bedtracking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(ApiResponse.ok("Booking confirmed successfully!", booking));
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Booking error: " + ex.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getBookings(@RequestParam(required = false) String email) {
        List<Booking> bookings = bookingService.getBookings(email);
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        try {
            Booking updated = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(ApiResponse.ok("Booking status updated to " + status, updated));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
