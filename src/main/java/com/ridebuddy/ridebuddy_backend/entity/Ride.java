package com.ridebuddy.ridebuddy_backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {
        
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private Long driverId;
        
        private String host;
        
        private String fromLocation;
        
        private String toLocation;
        
        private LocalDateTime departureTime;
        
        private int totalSeats;
        
        private int availableSeats;
        
        private double price;
        
        private String status;
        
        private String carModel;
        
        @Column(unique = true)
        private String carLicensePlate;

        private Double pickupLatitude;
        private Double pickupLongitude;

        private Double destinationLatitude;
        private Double destinationLongitude;

        private Double distanceKm;
        private Integer estimatedDurationMinutes;

        public int getAvailableSeats() {
            return availableSeats;
        }

        public void setAvailableSeats(int availableSeats) {
            this.availableSeats = availableSeats;
        }

    }
