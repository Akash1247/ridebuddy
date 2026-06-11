package com.ridebuddy.ridebuddy_backend.dto;

public record LoginResponse(
    String token,
    String role
) {

    
}
