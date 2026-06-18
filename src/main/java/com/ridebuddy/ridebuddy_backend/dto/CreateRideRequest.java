package com.ridebuddy.ridebuddy_backend.dto;

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

    String departureTime,

    int totalSeats,
    double price,

    String carModel,
    String carLicensePlate
) {
    
} 
