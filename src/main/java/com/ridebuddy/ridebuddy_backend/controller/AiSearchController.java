package com.ridebuddy.ridebuddy_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridebuddy.ridebuddy_backend.dto.AiRideSearchRequest;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.service.AiSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiSearchController {

    private final AiSearchService aiSearchService;

    @PostMapping("/search")
    public List<Ride> search(@RequestBody AiRideSearchRequest request) {
        // Use the DTO to extract the prompt safely
        return aiSearchService.search(request.prompt());
    }
}
