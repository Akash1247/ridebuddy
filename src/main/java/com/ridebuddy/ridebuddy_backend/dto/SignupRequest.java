package com.ridebuddy.ridebuddy_backend.dto;

import com.ridebuddy.ridebuddy_backend.entity.Role;

public record SignupRequest(

        String name,
        String email,
        String password,
        String phoneNumber,
        Role role
        
) { 
}
