package com.courier.controller;

import com.courier.dto.BookingPage;
import com.courier.model.Customer;
import com.courier.service.BookingService;
import com.courier.service.AuthService;
import com.courier.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/previous-bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class PreviousBookingsController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<BookingPage> getCustomerBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Customer customer = authService.getCustomerByEmail(email);
            
            if (customer == null) {
                return ResponseEntity.badRequest().build();
            }

            System.out.println("=== Previous Bookings Request ===");
            System.out.println("Customer ID: " + customer.getId());
            System.out.println("Page: " + page + ", Size: " + size);

            BookingPage bookings = bookingService.getCustomerBookingsPaginated(
                customer.getId(), page, size);
            
            System.out.println("Found " + bookings.getContent().size() + " bookings");
            System.out.println("Total elements: " + bookings.getTotalElements());
            
            return ResponseEntity.ok(bookings);
            
        } catch (Exception e) {
            System.out.println("Error in previous bookings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportBookings(
            @RequestHeader("Authorization") String token,
            @RequestParam String format) {
        try {
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            Customer customer = authService.getCustomerByEmail(email);
            
            if (customer == null) {
                return ResponseEntity.badRequest().build();
            }

            byte[] fileContent = bookingService.exportCustomerBookings(customer.getId(), format);
            String filename = "bookings." + format.toLowerCase();
            
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(fileContent);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 