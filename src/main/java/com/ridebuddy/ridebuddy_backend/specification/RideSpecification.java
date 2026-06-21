package com.ridebuddy.ridebuddy_backend.specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.ridebuddy.ridebuddy_backend.dto.RideSearchFilters;
import com.ridebuddy.ridebuddy_backend.entity.Ride;

import jakarta.persistence.criteria.Predicate;

public class RideSpecification {

    public static Specification<Ride> build(RideSearchFilters filters) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Dynamic Seats Logic
            if (filters.requiredSeats() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("availableSeats"), filters.requiredSeats()));
            } else {
                predicates.add(cb.greaterThan(root.get("availableSeats"), 0)); // Baseline rule
            }

            // 2. Existing Location & Price Logic
            if (filters.fromLocation() != null) {
                predicates.add(cb.like(cb.lower(root.get("fromLocation")), "%" + filters.fromLocation().toLowerCase() + "%"));
            }
            if (filters.toLocation() != null) {
                predicates.add(cb.like(cb.lower(root.get("toLocation")), "%" + filters.toLocation().toLowerCase() + "%"));
            }
            if (filters.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filters.minPrice()));
            }
            if (filters.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filters.maxPrice()));
            }

            // 3. Date and Time Logic ("Aas Paas" Feature)
            if (filters.departureDate() != null) {
                try {
                    LocalDate targetDate = LocalDate.parse(filters.departureDate());
                    LocalDateTime startWindow;
                    LocalDateTime endWindow;

                    if (filters.departureTime() != null) {
                        LocalTime targetTime = LocalTime.parse(filters.departureTime());
                        startWindow = targetDate.atTime(targetTime).minusHours(2);
                        endWindow = targetDate.atTime(targetTime).plusHours(2);
                    } else {
                        startWindow = targetDate.atStartOfDay();
                        endWindow = targetDate.atTime(LocalTime.MAX);
                    }

                    // BETWEEN query lagao
                    predicates.add(cb.between(root.get("departureTime"), startWindow, endWindow));
                    
                } catch (Exception e) {
                    System.out.println("AI ne galat date/time format diya: " + e.getMessage());
                }
            }

            // Show active rides only
            predicates.add(cb.equal(root.get("status"), "ACTIVE"));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}