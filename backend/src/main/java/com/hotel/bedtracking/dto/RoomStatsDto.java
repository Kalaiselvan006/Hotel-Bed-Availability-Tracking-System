package com.hotel.bedtracking.dto;

public class RoomStatsDto {
    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long reservedRooms;

    private int totalBeds;
    private int availableBeds;
    private int occupiedBeds;
    private int reservedBeds;

    private double occupancyRate;

    public RoomStatsDto() {}

    public RoomStatsDto(long totalRooms, long availableRooms, long occupiedRooms, long reservedRooms,
                        int totalBeds, int availableBeds, int occupiedBeds, int reservedBeds, double occupancyRate) {
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.reservedRooms = reservedRooms;
        this.totalBeds = totalBeds;
        this.availableBeds = availableBeds;
        this.occupiedBeds = occupiedBeds;
        this.reservedBeds = reservedBeds;
        this.occupancyRate = occupancyRate;
    }

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(long availableRooms) { this.availableRooms = availableRooms; }

    public long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public long getReservedRooms() { return reservedRooms; }
    public void setReservedRooms(long reservedRooms) { this.reservedRooms = reservedRooms; }

    public int getTotalBeds() { return totalBeds; }
    public void setTotalBeds(int totalBeds) { this.totalBeds = totalBeds; }

    public int getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(int availableBeds) { this.availableBeds = availableBeds; }

    public int getOccupiedBeds() { return occupiedBeds; }
    public void setOccupiedBeds(int occupiedBeds) { this.occupiedBeds = occupiedBeds; }

    public int getReservedBeds() { return reservedBeds; }
    public void setReservedBeds(int reservedBeds) { this.reservedBeds = reservedBeds; }

    public double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(double occupancyRate) { this.occupancyRate = occupancyRate; }
}
