package com.ridebuddy.ridebuddy_backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.ridebuddy.ridebuddy_backend.dto.RideSeatUpdate;
import com.ridebuddy.ridebuddy_backend.dto.BookingDetailsResponse;
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

    private final EmailService emailService;

    private final SimpMessagingTemplate messagingTemplate;

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

        messagingTemplate.convertAndSend(
        "/topic/rides/" + ride.getId(),
        new RideSeatUpdate(
                ride.getId(),
                ride.getAvailableSeats()
        )
        );

        
        try {
                
                emailService.sendBookingConfirmation(
                loggedInUser.getEmail(),
                "Ride Booking Confirmed",
                """
                Hi %s,

                Your booking has been confirmed.

                From: %s
                To: %s

                Seats Booked: %d

                Thanks,
                RideBuddy
                """.formatted(
                        loggedInUser.getName(),
                        ride.getFromLocation(),
                        ride.getToLocation(),
                        request.seatsBooked()
                )
        );

        } catch (Exception e) {

        System.out.println(
                "Email failed: " + e.getMessage()
        );
        }

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

        //Websocket wala cancel krne pe v seats update ho jyngim
        messagingTemplate.convertAndSend(
                "/topic/rides/" + ride.getId(),
                new RideSeatUpdate(
                        ride.getId(),
                        ride.getAvailableSeats()
                )
        );

        System.out.println(
                "📢 Sent update for ride "
                + ride.getId()
                + " seats: "
                + ride.getAvailableSeats()
        );

        return "Booking cancelled successfully.";
    }

        public List<BookingDetailsResponse> getRideDetails(Long rideId) {

                System.out.println("========== DEBUG ==========");
                System.out.println("Ride ID Received = " + rideId);

                List<Booking> bookings =
                        bookingRepository.findByRideId(rideId);

                System.out.println("Bookings Found = " + bookings.size());

                bookings.forEach(b ->
                        System.out.println(
                                "BookingId=" + b.getBookingId()
                                        + " RideId=" + b.getRideId()
                                        + " UserId=" + b.getUserId()
                        ));

                return bookings.stream().map(booking -> {

                        User passenger = userRepository
                                .findById(booking.getUserId())
                                .orElseThrow(() ->
                                        new IllegalArgumentException("User not found"));

                        return new BookingDetailsResponse(
                                booking.getBookingId(),
                                passenger.getName(),
                                passenger.getEmail(),
                                booking.getSeatsBooked(),
                                booking.getStatus()
                        );

                }).toList();
                }

}
