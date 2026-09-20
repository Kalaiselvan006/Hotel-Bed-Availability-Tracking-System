package com.hotel.bedtracking.service;

import com.hotel.bedtracking.dto.LoginRequest;
import com.hotel.bedtracking.dto.RegisterRequest;
import com.hotel.bedtracking.model.User;
import com.hotel.bedtracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    public User register(RegisterRequest req) {
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
        String email = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        if (req.getOtp() != null && !req.getOtp().trim().isEmpty()) {
            boolean valid = otpService.verifyOtp(email, req.getOtp());
            if (!valid) {
                throw new IllegalArgumentException("Invalid or expired OTP. Please try again.");
            }
        }

        String hashedPassword = hashPassword(req.getPassword());
        User user = new User(
            req.getFullName() != null ? req.getFullName().trim() : "Guest",
            email,
            req.getPhone() != null ? req.getPhone().trim() : "",
            hashedPassword
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required.");
        }

        String email = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String hashed = hashPassword(req.getPassword());
        if (!hashed.equals(user.getPasswordHash()) && !req.getPassword().equals(user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return user;
    }

    private String hashPassword(String password) {
        if (password == null) return "";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return password;
        }
    }
}
