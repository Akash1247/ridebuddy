package com.ridebuddy.ridebuddy_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridebuddy.ridebuddy_backend.dto.CreateBookingRequest;
import com.ridebuddy.ridebuddy_backend.entity.Booking;
import com.ridebuddy.ridebuddy_backend.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;   
    
    @PostMapping("/create")
    public String createBooking(@RequestBody CreateBookingRequest request ){
        return bookingService.createBooking(request);
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId){
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    
}
