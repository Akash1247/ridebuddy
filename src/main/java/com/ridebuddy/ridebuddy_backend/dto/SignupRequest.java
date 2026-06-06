package com.ridebuddy.ridebuddy_backend.dto;

public record SignupRequest(

        String name,
        String email,
        String password,
        String phoneNumber
) { 
}
