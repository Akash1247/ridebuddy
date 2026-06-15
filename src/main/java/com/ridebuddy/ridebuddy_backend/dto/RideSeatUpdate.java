package com.ridebuddy.ridebuddy_backend.dto;

public record RideSeatUpdate(
    Long rideId,
    Integer availableSeats
) {
    
}
