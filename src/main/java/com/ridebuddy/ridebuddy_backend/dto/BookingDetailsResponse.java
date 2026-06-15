package com.ridebuddy.ridebuddy_backend.dto;

public record BookingDetailsResponse(
    Long bookingId,
    String passengerName,
    String passengerEmail,
    int seatsBooked,
    String status
) {
    
}
