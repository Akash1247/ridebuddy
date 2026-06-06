package com.ridebuddy.ridebuddy_backend.repository;

import org.springframework.stereotype.Repository;

import com.ridebuddy.ridebuddy_backend.entity.Ride;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// Interface me public likhna v jruri nahi hai, kyunki by default interface ke members public hote hain.
@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

        public List<Ride> findByFromLocationAndToLocation(String fromLocation, String toLocation);
}
