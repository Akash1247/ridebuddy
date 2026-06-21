package com.ridebuddy.ridebuddy_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.ridebuddy.ridebuddy_backend.entity.User;

import com.ridebuddy.ridebuddy_backend.dto.CreateRideRequest;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.repository.RideRepository;
import com.ridebuddy.ridebuddy_backend.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;

    private final UserRepository userRepository;

    public String createRide(CreateRideRequest request) {
        
        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();
        
        String email = authentication.getName();

        User loggedInDriver = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        
        Ride ride = Ride.builder()
                    .driverId(loggedInDriver.getId())
                    .host(request.host())
                    .fromLocation(request.fromLocation())
                    .toLocation(request.toLocation())
                    .pickupLatitude(request.pickupLatitude())
                    .pickupLongitude(request.pickupLongitude())
                    .destinationLatitude(request.destinationLatitude())
                    .destinationLongitude(request.destinationLongitude())
                    .distanceKm(request.distanceKm())
                    .estimatedDurationMinutes(request.estimatedDurationMinutes())
                    .departureTime(request.departureTime())
                    .totalSeats(request.totalSeats())
                    .availableSeats(request.totalSeats())
                    .price(request.price())
                    .status("ACTIVE")
                    .carModel(request.carModel())
                    .carLicensePlate(request.carLicensePlate())
                    .build();

        rideRepository.save(ride);
        return "Ride created successfully";
    }

    public List<Ride> getAllRides(){
        return rideRepository.findByAvailableSeatsGreaterThan(0);
    }

    public List<Ride> getMyRides(){ 
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return rideRepository.findByDriverId(loggedInUser.getId());


    }

    public List<Ride> searchRides(String fromLocation, String toLocation, String dateStr) {
        
        
        String from = (fromLocation != null) ? fromLocation : "";
        String to = (toLocation != null) ? toLocation : "";

        
        if (dateStr != null && !dateStr.isEmpty()) {
            LocalDate date = LocalDate.parse(dateStr);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX); // 23:59:59

            return rideRepository.findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndAvailableSeatsGreaterThanAndDepartureTimeBetween(
                    from, to, 0, startOfDay, endOfDay
            );
        } 
        
        return rideRepository.findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndAvailableSeatsGreaterThan(
                from, to, 0
        );
    }

    

    public String deleteride(Long id){
        if(rideRepository.existsById(id)){
            rideRepository.deleteById(id);
            return "Ride deleted successfully";
        }
        else{
            return "Ride not found with ID: " + id;
        }
    }


    
    
}
