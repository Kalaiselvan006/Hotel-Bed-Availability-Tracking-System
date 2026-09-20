package com.hotel.bedtracking.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:msdkalaikalai@gmail.com}")
    private String senderEmail;

    private static class OtpEntry {
        final String code;
        final Instant expiresAt;

        OtpEntry(String code, Instant expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String generateAndSendOtp(String email, String purpose) {
        String normalizedEmail = email.trim().toLowerCase();
        String otp = String.format("%06d", 100000 + random.nextInt(900000));
        Instant expiresAt = Instant.now().plusSeconds(300); // 5 minutes

        otpStorage.put(normalizedEmail, new OtpEntry(otp, expiresAt));
        System.out.println("Generated OTP for " + normalizedEmail + ": " + otp + " (Purpose: " + purpose + ")");

        sendHtmlOtpEmail(normalizedEmail, otp, purpose);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        if (email == null || otp == null) return false;
        String normalizedEmail = email.trim().toLowerCase();
        OtpEntry entry = otpStorage.get(normalizedEmail);

        if (entry == null) {
            return false;
        }

        if (Instant.now().isAfter(entry.expiresAt)) {
            otpStorage.remove(normalizedEmail);
            return false;
        }

        boolean isValid = entry.code.equals(otp.trim());
        if (isValid) {
            otpStorage.remove(normalizedEmail);
        }
        return isValid;
    }

    private void sendHtmlOtpEmail(String recipientEmail, String otp, String purpose) {
        if (mailSender == null) {
            System.err.println("JavaMailSender not configured. Printed OTP to console: " + otp);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, "The Grand Reserve - Bed Tracking");
            helper.setTo(recipientEmail);
            helper.setSubject("Your Security Verification Code: " + otp);

            String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset='UTF-8'></head>"
                + "<body style='margin:0;padding:0;background-color:#0e1117;font-family:Arial,sans-serif;color:#f0f2f5;'>"
                + "<table align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:560px;margin:40px auto;background-color:#161b22;border:1px solid #2d333b;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);'>"
                + "  <tr>"
                + "    <td style='padding:35px 30px;background:linear-gradient(135deg,#1f242c,#161a22);border-bottom:1px solid #2d333b;text-align:center;'>"
                + "      <h1 style='margin:0;font-size:22px;letter-spacing:3px;text-transform:uppercase;color:#d4af37;'>The Grand Reserve</h1>"
                + "      <p style='margin:6px 0 0;font-size:13px;color:#8b949e;letter-spacing:1px;'>HOTEL BED AVAILABILITY & RESERVATION SYSTEM</p>"
                + "    </td>"
                + "  </tr>"
                + "  <tr>"
                + "    <td style='padding:35px 30px;text-align:center;'>"
                + "      <h2 style='margin:0 0 15px;font-size:20px;color:#ffffff;'>Authentication Code</h2>"
                + "      <p style='margin:0 0 25px;font-size:14px;line-height:1.6;color:#c9d1d9;'>Please use the following 6-digit one-time verification code to complete your " + (purpose != null ? purpose.toLowerCase() : "verification") + ". This code is valid for <strong>5 minutes</strong>.</p>"
                + "      <div style='display:inline-block;padding:16px 36px;background:#0d1117;border:1px solid #d4af37;border-radius:8px;font-size:32px;font-weight:bold;letter-spacing:10px;color:#f0c674;font-family:monospace;margin-bottom:25px;'>"
                +          otp
                + "      </div>"
                + "      <p style='margin:0;font-size:12px;color:#8b949e;'>If you did not initiate this request, please disregard this email. Never share this code with anyone.</p>"
                + "    </td>"
                + "  </tr>"
                + "  <tr>"
                + "    <td style='padding:20px 30px;background-color:#0d1117;border-top:1px solid #21262d;text-align:center;font-size:12px;color:#6e7681;'>"
                + "      &copy; 2026 The Grand Reserve Hospitality Group. All rights reserved."
                + "    </td>"
                + "  </tr>"
                + "</table>"
                + "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Successfully sent OTP email to: " + recipientEmail);
        } catch (Exception ex) {
            System.err.println("Error sending OTP email to " + recipientEmail + ": " + ex.getMessage());
        }
    }
}
