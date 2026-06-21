package com.ridebuddy.ridebuddy_backend.repository;

import org.springframework.stereotype.Repository;

import com.ridebuddy.ridebuddy_backend.entity.Ride;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

// Interface me public likhna v jruri nahi hai, kyunki by default interface ke members public hote hain.
@Repository
public interface RideRepository extends JpaRepository<Ride, Long>, JpaSpecificationExecutor<Ride> {

        List<Ride> findByAvailableSeatsGreaterThan(int availableSeats);
       
        List<Ride> findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndAvailableSeatsGreaterThan(
                String fromLocation, String toLocation, int availableSeats
        );

        List<Ride> findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndAvailableSeatsGreaterThanAndDepartureTimeBetween(
                String fromLocation, 
                String toLocation, 
                int availableSeats, 
                java.time.LocalDateTime startOfDay, 
                java.time.LocalDateTime endOfDay
        );

        List<Ride> findByDriverId(Long driverId);
}
