package com.ridebuddy.ridebuddy_backend.dto;

public record RideSearchFilters(
        String fromLocation,
        String toLocation,
        Double minPrice,  // NAYA FIELD
        Double maxPrice,
        Integer requiredSeats,
        String departureDate,
        String departureTime
) {
    // Add this no-argument constructor
    public RideSearchFilters() {
        this(null, null, null, null, null, null, null);
    }
}