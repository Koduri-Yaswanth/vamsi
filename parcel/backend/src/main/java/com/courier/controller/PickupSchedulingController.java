package com.courier.controller;

import com.courier.model.Booking;
import com.courier.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/pickup-scheduling")
@CrossOrigin(origins = "http://localhost:4200")
public class PickupSchedulingController {

    @Autowired
    private BookingService bookingService;

    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateSchedule(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request) {
        
        System.out.println("=== Update Pickup Schedule ===");
        System.out.println("Booking ID: " + bookingId);
        System.out.println("Pickup DateTime: " + request.get("pickupDateTime"));
        System.out.println("Drop DateTime: " + request.get("dropDateTime"));
        
        try {
            // First, let's check if the booking exists
            System.out.println("Searching for booking with ID: " + bookingId);
            Booking booking = bookingService.getBookingById(bookingId);
            
            if (booking == null) {
                System.out.println("Booking not found for ID: " + bookingId);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Found booking: " + booking.getBookingId());
            System.out.println("Current pickup time: " + booking.getParcelPickupTime());
            System.out.println("Current drop time: " + booking.getParcelDropoffTime());

            // Parse datetime strings
            String pickupDateTimeStr = request.get("pickupDateTime");
            String dropDateTimeStr = request.get("dropDateTime");
            
            if (pickupDateTimeStr == null || dropDateTimeStr == null) {
                System.out.println("Pickup or drop datetime is null");
                return ResponseEntity.badRequest().build();
            }
            
            System.out.println("Parsing pickup datetime: " + pickupDateTimeStr);
            System.out.println("Parsing drop datetime: " + dropDateTimeStr);
            
            try {
                // Handle different datetime formats
                LocalDateTime pickupDateTime;
                LocalDateTime dropDateTime;
                
                // Try parsing with ISO format first (2025-08-13T12:44:00)
                try {
                    pickupDateTime = LocalDateTime.parse(pickupDateTimeStr);
                    dropDateTime = LocalDateTime.parse(dropDateTimeStr);
                } catch (Exception e) {
                    // If ISO format fails, try with space format (2025-08-13 12:44:00)
                    pickupDateTime = LocalDateTime.parse(pickupDateTimeStr.replace(" ", "T"));
                    dropDateTime = LocalDateTime.parse(dropDateTimeStr.replace(" ", "T"));
                }
                
                System.out.println("Parsed pickup datetime: " + pickupDateTime);
                System.out.println("Parsed drop datetime: " + dropDateTime);
                
                booking.setParcelPickupTime(pickupDateTime);
                booking.setParcelDropoffTime(dropDateTime);
                
                Booking updatedBooking = bookingService.updateBooking(booking);
                
                System.out.println("Schedule updated successfully");
                System.out.println("New pickup time: " + updatedBooking.getParcelPickupTime());
                System.out.println("New drop time: " + updatedBooking.getParcelDropoffTime());
                
                return ResponseEntity.ok(updatedBooking);
            } catch (Exception e) {
                System.out.println("Error parsing datetime: " + e.getMessage());
                System.out.println("Pickup datetime string: " + pickupDateTimeStr);
                System.out.println("Drop datetime string: " + dropDateTimeStr);
                return ResponseEntity.badRequest().build();
            }
            
        } catch (Exception e) {
            System.out.println("Error updating schedule: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String bookingId) {
        try {
            System.out.println("=== Get Booking by ID (Pickup Scheduling) ===");
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