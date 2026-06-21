package com.ridebuddy.ridebuddy_backend.dto;

import java.time.LocalDateTime;

public record CreateRideRequest(

    String host,

    String fromLocation,
    String toLocation,

    Double pickupLatitude,
    Double pickupLongitude,

    Double destinationLatitude,
    Double destinationLongitude,

    Double distanceKm,
    Integer estimatedDurationMinutes,

    LocalDateTime departureTime,

    int totalSeats,
    double price,

    String carModel,
    String carLicensePlate
) {
    
} 
