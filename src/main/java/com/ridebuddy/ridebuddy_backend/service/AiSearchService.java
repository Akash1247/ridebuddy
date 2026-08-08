package com.ridebuddy.ridebuddy_backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections; // ADD THIS IMPORT
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.ridebuddy.ridebuddy_backend.dto.RideSearchFilters;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.repository.RideRepository;
import com.ridebuddy.ridebuddy_backend.specification.RideSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiSearchService {

    private final ChatClient chatClient;
    private final RideRepository rideRepository;

    public RideSearchFilters extractFilters(String userPrompt) {
        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return null; 
        }

        String currentDate = LocalDate.now().toString();
        String currentTime = LocalTime.now().toString();

        String systemPrompt = String.format("""
            Extract ride search filters.
            Today's date is %s and current time is %s.

            STRICT RULES:
            1. If a detail is NOT explicitly mentioned by the user, you MUST return null.
            2. DO NOT use placeholder words like "your current location" or "destination". Return null instead.
            3. DO NOT assume today's date or time unless the user explicitly says 'today', 'now', or gives a time.

            Return values for:
            - fromLocation (String or null)
            - toLocation (String or null)
            - minPrice (Number or null. Use this ONLY if user says 'more than', 'above', or 'minimum').
            - maxPrice (Number or null. Use this ONLY if user says 'under', 'less than', or 'maximum').
            - requiredSeats (Number only or null)
            - departureDate (Format YYYY-MM-DD or null. Explicit date mentions only.)
            - departureTime (Format HH:mm or null)
            """, currentDate, currentTime);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .entity(RideSearchFilters.class);
    }

    public List<Ride> search(String prompt) {
        RideSearchFilters filters = extractFilters(prompt);
        System.out.println("Extracted Filters: " + filters);

        // --- THE FIX STARTS HERE ---
        
        // If the AI completely failed to return an object
        if (filters == null) {
            return Collections.emptyList();
        }

        // Check if the AI returned an object, but ALL major fields are null.
        // This means the user asked something irrelevant like "what is my name".
        boolean isIrrelevantPrompt = 
            filters.fromLocation() == null && 
            filters.toLocation() == null && 
            filters.departureDate() == null && 
            filters.minPrice() == null && 
            filters.maxPrice() == null;

        if (isIrrelevantPrompt) {
            System.out.println("AI could not find relevant search criteria. Returning empty list.");
            return Collections.emptyList(); 
        }
        
        // --- THE FIX ENDS HERE ---

        return rideRepository.findAll(
                RideSpecification.build(filters)
        );
    }
}