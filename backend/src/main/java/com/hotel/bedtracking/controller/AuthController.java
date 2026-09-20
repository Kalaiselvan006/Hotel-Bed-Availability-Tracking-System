package com.hotel.bedtracking.controller;

import com.hotel.bedtracking.dto.*;
import com.hotel.bedtracking.model.User;
import com.hotel.bedtracking.service.AuthService;
import com.hotel.bedtracking.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendOtp(@RequestBody SendOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email address is required."));
        }
        try {
            String purpose = request.getPurpose() != null ? request.getPurpose() : "Verification";
            otpService.generateAndSendOtp(request.getEmail().trim(), purpose);
            return ResponseEntity.ok(ApiResponse.ok("Verification OTP sent to " + request.getEmail().trim(), 
                Map.of("email", request.getEmail().trim())));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to dispatch OTP: " + ex.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (request.getEmail() == null || request.getOtp() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email and OTP code are required."));
        }
        boolean verified = otpService.verifyOtp(request.getEmail().trim(), request.getOtp().trim());
        if (verified) {
            return ResponseEntity.ok(ApiResponse.ok("OTP verified successfully.", Map.of("verified", true)));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or expired OTP code."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.ok(ApiResponse.ok("User registered successfully.", user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Registration failed: " + ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful.", user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Login failed: " + ex.getMessage()));
        }
    }
}
