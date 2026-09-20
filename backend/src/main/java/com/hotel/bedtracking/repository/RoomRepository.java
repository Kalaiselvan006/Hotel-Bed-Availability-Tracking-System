package com.hotel.bedtracking.repository;

import com.hotel.bedtracking.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    List<Room> findByStatus(String status);
    List<Room> findByRoomTypeIgnoreCase(String roomType);

    @Query("SELECT COALESCE(SUM(r.bedCount), 0) FROM Room r")
    Integer getTotalBeds();

    @Query("SELECT COALESCE(SUM(r.bedCount), 0) FROM Room r WHERE r.status = 'available'")
    Integer getAvailableBeds();

    @Query("SELECT COALESCE(SUM(r.bedCount), 0) FROM Room r WHERE r.status = 'occupied'")
    Integer getOccupiedBeds();

    @Query("SELECT COALESCE(SUM(r.bedCount), 0) FROM Room r WHERE r.status = 'reserved'")
    Integer getReservedBeds();

    long countByStatus(String status);
}
