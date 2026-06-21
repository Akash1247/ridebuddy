package com.ridebuddy.ridebuddy_backend.dto;

import java.time.LocalDateTime;


public record UserBookingDetailsResponse(
    Long bookingId,
    
    Integer seatsBooked,
    
    String status,

    String fromLocation,

    String toLocation,

    LocalDateTime departureTime,
    
    String driverName,

    String carModel,

    Double price,

    Double distanceKm,

    Integer estimatedDurationMinutes
) {

 
} 
    

