package com.ridebuddy.ridebuddy_backend.dto;

public record CreateRideRequest (

    Long driverId,
    String host,
    String fromLocation,
    String toLocation,
    String departureTime,
    int totalSeats,
    double price,
    String carModel,
    String carLicensePlate
) {
}   
