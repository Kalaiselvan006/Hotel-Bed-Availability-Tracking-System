package com.hotel.bedtracking.service;

import com.hotel.bedtracking.dto.RoomStatsDto;
import com.hotel.bedtracking.model.Room;
import com.hotel.bedtracking.repository.RoomRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @PostConstruct
    public void seedDefaultRoomsIfEmpty() {
        if (roomRepository.count() == 0) {
            roomRepository.save(new Room("101", "Deluxe King", 1, "available"));
            roomRepository.save(new Room("102", "Executive Twin", 2, "occupied"));
            roomRepository.save(new Room("103", "Standard Single", 1, "available"));
            roomRepository.save(new Room("104", "Presidential Suite", 3, "reserved"));
            roomRepository.save(new Room("105", "Royal Double", 2, "available"));
            roomRepository.save(new Room("106", "Courtyard Single", 1, "occupied"));
            roomRepository.save(new Room("107", "Grand Penthouse", 4, "available"));
            roomRepository.save(new Room("108", "Signature Suite", 2, "available"));
            System.out.println("Default luxury rooms seeded into hotel database.");
        }
    }

    public List<Room> getAllRooms(String status, String type, Integer beds) {
        List<Room> rooms = roomRepository.findAll();

        return rooms.stream()
            .filter(r -> status == null || status.equalsIgnoreCase("ALL") || r.getStatus().equalsIgnoreCase(status))
            .filter(r -> type == null || type.equalsIgnoreCase("ALL") || r.getRoomType().toLowerCase().contains(type.toLowerCase()))
            .filter(r -> beds == null || beds == 0 || r.getBedCount().equals(beds))
            .collect(Collectors.toList());
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room updateRoomStatus(Long id, String newStatus) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + id));
        room.setStatus(newStatus.toLowerCase());
        return roomRepository.save(room);
    }

    public RoomStatsDto getRoomStats() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus("available");
        long occupiedRooms = roomRepository.countByStatus("occupied");
        long reservedRooms = roomRepository.countByStatus("reserved");

        int totalBeds = roomRepository.getTotalBeds() != null ? roomRepository.getTotalBeds() : 0;
        int availableBeds = roomRepository.getAvailableBeds() != null ? roomRepository.getAvailableBeds() : 0;
        int occupiedBeds = roomRepository.getOccupiedBeds() != null ? roomRepository.getOccupiedBeds() : 0;
        int reservedBeds = roomRepository.getReservedBeds() != null ? roomRepository.getReservedBeds() : 0;

        double occupancyRate = 0.0;
        if (totalBeds > 0) {
            occupancyRate = Math.round(((double) (occupiedBeds + reservedBeds) / totalBeds * 100.0) * 10.0) / 10.0;
        }

        return new RoomStatsDto(
            totalRooms, availableRooms, occupiedRooms, reservedRooms,
            totalBeds, availableBeds, occupiedBeds, reservedBeds,
            occupancyRate
        );
    }
}
