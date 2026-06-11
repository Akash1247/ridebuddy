package com.ridebuddy.ridebuddy_backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ridebuddy.ridebuddy_backend.dto.CreateBookingRequest;
import com.ridebuddy.ridebuddy_backend.entity.Booking;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.entity.User;
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

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Ride ride = rideRepository.findById(request.rideId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Ride not found with ID: " + request.rideId()));

        if (request.seatsBooked() > ride.getAvailableSeats()) {
            throw new IllegalArgumentException(
                    "Not enough seats available");
        }

        Booking booking = Booking.builder()
                .rideId(request.rideId())
                .userId(loggedInUser.getId()) // <-- JWT user
                .seatsBooked(request.seatsBooked())
                .status("BOOKED")
                .build();

        ride.setAvailableSeats(
                ride.getAvailableSeats() - request.seatsBooked());

        bookingRepository.save(booking);
        rideRepository.save(ride);

        return "Booking created successfully";
    }

    public List<Booking> getMyBookings() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedInUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return bookingRepository.findByUserId(loggedInUser.getId());
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
