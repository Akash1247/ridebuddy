package com.ridebuddy.ridebuddy_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridebuddy.ridebuddy_backend.dto.BookingDetailsResponse;
import com.ridebuddy.ridebuddy_backend.dto.CreateBookingRequest;
import com.ridebuddy.ridebuddy_backend.entity.Booking;
import com.ridebuddy.ridebuddy_backend.entity.Ride;
import com.ridebuddy.ridebuddy_backend.service.BookingService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class BookingController {

    private final BookingService bookingService;   
    
    
    @PostMapping("/create")
    public String createBooking(@RequestBody CreateBookingRequest request ){
        return bookingService.createBooking(request);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getUserBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId){
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @GetMapping("/ride/{rideId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity <List<BookingDetailsResponse>> getRideDetails(@PathVariable Long rideId){
        return ResponseEntity.ok(bookingService.getRideDetails(rideId));
    }
    
    
}
