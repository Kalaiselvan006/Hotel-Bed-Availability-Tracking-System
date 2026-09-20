package com.hotel.bedtracking.dto;

import java.time.LocalDate;

public class BookingRequest {
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private Long roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String otp;

    public BookingRequest() {}

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
