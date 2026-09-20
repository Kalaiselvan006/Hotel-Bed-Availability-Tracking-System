package com.hotel.bedtracking.controller;

import com.hotel.bedtracking.dto.ApiResponse;
import com.hotel.bedtracking.dto.RoomStatsDto;
import com.hotel.bedtracking.model.Room;
import com.hotel.bedtracking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Room>>> getAllRooms(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer beds) {
        List<Room> rooms = roomService.getAllRooms(status, type, beds);
        return ResponseEntity.ok(ApiResponse.ok(rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
            .map(r -> ResponseEntity.ok(ApiResponse.ok(r)))
            .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Room not found")));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<RoomStatsDto>> getRoomStats() {
        RoomStatsDto stats = roomService.getRoomStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Room>> updateRoomStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status field is required"));
        }
        try {
            Room updated = roomService.updateRoomStatus(id, status);
            return ResponseEntity.ok(ApiResponse.ok("Room status updated successfully", updated));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
