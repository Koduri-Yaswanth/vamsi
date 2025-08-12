package com.courier.controller;

import com.courier.model.Booking;
import com.courier.model.Customer;
import com.courier.dto.TrackingResponse;
import com.courier.service.BookingService;
import com.courier.service.AuthService;
import com.courier.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "http://localhost:4200")
public class TrackingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/customer/{bookingId}")
    public ResponseEntity<TrackingResponse> trackCustomerBooking(
            @PathVariable String bookingId,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Customer customer = authService.getCustomerByEmail(email);
            
            if (customer == null) {
                return ResponseEntity.badRequest()
                    .body(new TrackingResponse(false, "Customer not found", null));
            }

            Booking booking = bookingService.getBookingById(bookingId);
            if (booking == null) {
                return ResponseEntity.badRequest()
                    .body(new TrackingResponse(false, "Booking not found", null));
            }

            // Verify booking belongs to customer
            if (!booking.getCustomer().getId().equals(customer.getId())) {
                return ResponseEntity.badRequest()
                    .body(new TrackingResponse(false, "Unauthorized access", null));
            }

            return ResponseEntity.ok(new TrackingResponse(true, "Tracking details found", booking));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new TrackingResponse(false, "Tracking failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/officer/{bookingId}")
    public ResponseEntity<TrackingResponse> trackOfficerBooking(@PathVariable String bookingId) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            if (booking == null) {
                return ResponseEntity.badRequest()
                    .body(new TrackingResponse(false, "Booking not found", null));
            }

            return ResponseEntity.ok(new TrackingResponse(true, "Tracking details found", booking));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new TrackingResponse(false, "Tracking failed: " + e.getMessage(), null));
        }
    }
} 