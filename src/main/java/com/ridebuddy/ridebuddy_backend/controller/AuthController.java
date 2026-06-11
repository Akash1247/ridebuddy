package com.ridebuddy.ridebuddy_backend.controller;

import org.springframework.http.ResponseEntity;
import com.ridebuddy.ridebuddy_backend.dto.LoginResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridebuddy.ridebuddy_backend.dto.LoginRequest;
import com.ridebuddy.ridebuddy_backend.dto.LoginResponse;
import com.ridebuddy.ridebuddy_backend.dto.SignupRequest;
import com.ridebuddy.ridebuddy_backend.security.JwtUtil;
import com.ridebuddy.ridebuddy_backend.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor    
public class AuthController {

    private final UserService userService;

    private final JwtUtil jwt;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        
        return ResponseEntity.ok(userService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                userService.login(request)
        );
    }

    

}
