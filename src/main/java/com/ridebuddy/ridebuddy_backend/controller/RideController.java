package com.ridebuddy.ridebuddy_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ridebuddy.ridebuddy_backend.dto.CreateRideRequest;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.service.RideService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/create")
    public String createRide(@RequestBody CreateRideRequest request) {
        return rideService.createRide(request);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ride>> getAllRides(){
        return ResponseEntity.ok(rideService.getAllRides());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ride> getRideById(@PathVariable Long id){
        return ResponseEntity.ok(rideService.getRideById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ride>> searchRides(@RequestParam String fromLocation,@RequestParam String toLocation){
        return ResponseEntity.ok(rideService.searchRides(fromLocation, toLocation));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteRide(@PathVariable Long id){
        return ResponseEntity.ok(rideService.deleteride(id));
    }
    
    
        
    }
