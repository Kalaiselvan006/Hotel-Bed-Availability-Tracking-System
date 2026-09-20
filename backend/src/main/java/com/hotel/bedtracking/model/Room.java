package com.hotel.bedtracking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, unique = true, length = 20)
    private String roomNumber;

    @Column(name = "room_type", nullable = false, length = 40)
    private String roomType;

    @Column(name = "bed_count", nullable = false)
    private Integer bedCount;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "available"; // available, occupied, reserved

    public Room() {}

    public Room(String roomNumber, String roomType, Integer bedCount, String status) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.bedCount = bedCount;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Integer getBedCount() {
        return bedCount;
    }

    public void setBedCount(Integer bedCount) {
        this.bedCount = bedCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
