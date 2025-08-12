package com.courier.controller;

import com.courier.model.Booking;
import com.courier.model.ParcelStatus;
import com.courier.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery-status")
@CrossOrigin(origins = "http://localhost:4200")
public class DeliveryStatusController {

    @Autowired
    private BookingService bookingService;

    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateDeliveryStatus(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request) {
        
        System.out.println("=== Update Delivery Status ===");
        System.out.println("Booking ID: " + bookingId);
        System.out.println("New Status: " + request.get("status"));
        
        try {
            // First, let's check if the booking exists
            System.out.println("Searching for booking with ID: " + bookingId);
            Booking booking = bookingService.getBookingById(bookingId);
            
            if (booking == null) {
                System.out.println("Booking not found for ID: " + bookingId);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Found booking: " + booking.getBookingId());
            System.out.println("Current status: " + booking.getParcelStatus());

            String newStatus = request.get("status");
            System.out.println("Requested new status: " + newStatus);
            
            if (newStatus == null || newStatus.isEmpty()) {
                System.out.println("Status is null or empty");
                // Default to BOOKED if no status provided so officer isn't blocked
                newStatus = ParcelStatus.BOOKED.name();
            }
            
            try {
                ParcelStatus status = ParcelStatus.valueOf(newStatus);
                booking.setParcelStatus(status);
                
                Booking updatedBooking = bookingService.updateBooking(booking);
                
                System.out.println("Status updated successfully");
                System.out.println("New status: " + updatedBooking.getParcelStatus());
                
                return ResponseEntity.ok(updatedBooking);
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid status: " + newStatus + ", forcing BOOKED as fallback");
                booking.setParcelStatus(ParcelStatus.BOOKED);
                Booking updatedBooking = bookingService.updateBooking(booking);
                return ResponseEntity.ok(updatedBooking);
            }
            
        } catch (Exception e) {
            System.out.println("Error updating status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String bookingId) {
        try {
            System.out.println("=== Get Booking by ID ===");
            System.out.println("Searching for booking ID: " + bookingId);
            
            Booking booking = bookingService.getBookingById(bookingId);
            
            if (booking == null) {
                System.out.println("Booking not found for ID: " + bookingId);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Found booking: " + booking.getBookingId());
            return ResponseEntity.ok(booking);
            
        } catch (Exception e) {
            System.out.println("Error getting booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
} 