package com.courier.controller;

import com.courier.dto.BookingPage;
import com.courier.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/all-bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class AllBookingsController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<BookingPage> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            System.out.println("=== All Bookings Request ===");
            System.out.println("Page: " + page + ", Size: " + size);

            BookingPage bookings = bookingService.getAllBookingsPaginated(page, size);
            
            System.out.println("Found " + bookings.getContent().size() + " bookings");
            System.out.println("Total elements: " + bookings.getTotalElements());
            
            return ResponseEntity.ok(bookings);
            
        } catch (Exception e) {
            System.out.println("Error in all bookings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}