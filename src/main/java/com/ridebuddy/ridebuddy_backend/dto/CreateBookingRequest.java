package com.ridebuddy.ridebuddy_backend.dto;

public record CreateBookingRequest(
    Long rideId,
    Long userId,
    int seatsBooked
) {
    
}
