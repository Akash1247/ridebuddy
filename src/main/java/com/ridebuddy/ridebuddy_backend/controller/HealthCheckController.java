package com.ridebuddy.ridebuddy_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthCheckController {

    @GetMapping("/heartbeat")
    public ResponseEntity<String> heartbeat() {
        // Returns a simple 200 OK with a tiny string. 
        // No database calls, keeping it extremely lightweight.
        return ResponseEntity.ok("RideBuddy backend is awake!");
    }
}