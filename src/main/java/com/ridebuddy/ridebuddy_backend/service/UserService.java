package com.ridebuddy.ridebuddy_backend.service;

import org.springframework.stereotype.Service;

import com.ridebuddy.ridebuddy_backend.dto.LoginRequest;
import com.ridebuddy.ridebuddy_backend.dto.LoginResponse;
import com.ridebuddy.ridebuddy_backend.dto.SignupRequest;
import com.ridebuddy.ridebuddy_backend.entity.User;
import com.ridebuddy.ridebuddy_backend.repository.UserRepository;
import com.ridebuddy.ridebuddy_backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    public String signup(SignupRequest request) {
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(request.password())
                .phoneNumber(request.phoneNumber())
                .role(request.role())
                .build();
            
            userRepository.save(user);
            return "User registered successfully";    
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getRole().name()
        );
    }

    
}
