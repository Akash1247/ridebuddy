package com.ridebuddy.ridebuddy_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ridebuddy.ridebuddy_backend.dto.CreateBookingRequest;
import com.ridebuddy.ridebuddy_backend.entity.Booking;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.repository.BookingRepository;
import com.ridebuddy.ridebuddy_backend.repository.RideRepository;
import com.ridebuddy.ridebuddy_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;

    private final RideRepository rideRepository;

    private final UserRepository userRepository;

    public String createBooking(CreateBookingRequest request) {

        // 1. Safe fetch or throw error if Ride doesn't exist
        Ride ride = rideRepository.findById(request.rideId())
                .orElseThrow(() -> new IllegalArgumentException("Ride not found with ID: " + request.rideId()));

        // 2. Safe check if User exists
        boolean userExists = userRepository.existsById(request.userId());
        if (!userExists) {
            throw new IllegalArgumentException("User not found with ID: " + request.userId());
        }

        // 3. Check seat availability
        if (request.seatsBooked() > ride.getAvailableSeats()) {
            throw new IllegalArgumentException("Not enough seats available. Requested: " 
                    + request.seatsBooked() + ", Available: " + ride.getAvailableSeats());
        }

        // 4. Build and save booking object
        Booking booking = Booking.builder()
                .rideId(request.rideId())
                .userId(request.userId())
                .seatsBooked(request.seatsBooked())
                .status("BOOKED")
                .build();

        // 5. Update seats remaining
        ride.setAvailableSeats(ride.getAvailableSeats() - request.seatsBooked());

        bookingRepository.save(booking);
        rideRepository.save(ride);
        
        return "Booking created successfully";
    }

    public List<Booking> getBookingsByUserId(Long userId){
        return bookingRepository.findByUserId(userId);
    }

    public String cancelBooking(Long bookingId){
        Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));
        
        if(booking.getStatus().equals("CANCELLED")){
            throw new IllegalArgumentException("Booking is already cancelled");
        }
        booking.setStatus("CANCELLED");

        Ride ride = rideRepository.findById(booking.getRideId())
                        .orElseThrow(() -> new IllegalArgumentException("Booking not found with rideId" + booking.getRideId()));

        ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
        rideRepository.save(ride);
        bookingRepository.save(booking);
        return "Booking cancelled successfully.";
    }
}
