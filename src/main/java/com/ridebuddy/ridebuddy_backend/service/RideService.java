package com.ridebuddy.ridebuddy_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ridebuddy.ridebuddy_backend.dto.CreateRideRequest;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.repository.RideRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;


    public String createRide(CreateRideRequest request) {
        Ride ride = Ride.builder()
                    .driverId(request.driverId())
                    .host(request.host())
                    .fromLocation(request.fromLocation())
                    .toLocation(request.toLocation())
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
        return rideRepository.findAll();
    }

    public Ride getRideById(Long id){
        return rideRepository.findById(id).orElse(null);
    }

    public List<Ride> searchRides(String fromLocation, String toLocation){
        return rideRepository.findByFromLocationAndToLocation(fromLocation, toLocation);
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
