package com.courier.controller;

import com.courier.model.Booking;
import com.courier.model.Customer;
import com.courier.model.ParcelStatus;
import com.courier.dto.CancelResponse;
import com.courier.service.BookingService;
import com.courier.service.AuthService;
import com.courier.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cancel-booking")
@CrossOrigin(origins = "http://localhost:4200")
public class CancelBookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/customer")
    public ResponseEntity<CancelResponse> cancelCustomerBooking(
            @RequestParam String bookingId,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("=== Customer Cancellation Debug ===");
            System.out.println("Booking ID: " + bookingId);
            System.out.println("Token: " + token.substring(0, Math.min(token.length(), 50)) + "...");
            
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            String role = jwtUtil.extractRole(token.replace("Bearer ", ""));
            
            System.out.println("Extracted email from token: " + email);
            System.out.println("Extracted role from token: " + role);
            
            // Check if this is a customer request
            if (!"CUSTOMER".equals(role)) {
                System.out.println("Access denied - token contains role: " + role + ", expected: CUSTOMER");
                return ResponseEntity.badRequest()
                    .body(new CancelResponse(false, "Only customers can cancel customer bookings"));
            }
            
            System.out.println("Role validation passed - proceeding with customer lookup");
            
            Customer customer = authService.getCustomerByEmail(email);
            
            if (customer == null) {
                System.out.println("Customer not found for email: " + email);
                return ResponseEntity.badRequest()
                    .body(new CancelResponse(false, "Customer not found"));
            }
            
            System.out.println("Found customer: " + customer.getCustomerName() + " (ID: " + customer.getId() + ")");

            Booking booking = bookingService.getBookingById(bookingId);
            if (booking == null) {
                System.out.println("Booking not found for ID: " + bookingId);
                return ResponseEntity.badRequest()
                    .body(new CancelResponse(false, "Booking not found"));
            }
            
            System.out.println("Found booking: " + booking.getBookingId());
            System.out.println("Booking customer ID: " + booking.getCustomer().getId());
            System.out.println("Current status: " + booking.getParcelStatus());

            // Verify booking belongs to customer
            if (!booking.getCustomer().getId().equals(customer.getId())) {
                System.out.println("Unauthorized access - booking belongs to customer ID: " + booking.getCustomer().getId() + ", but requesting customer ID: " + customer.getId());
                return ResponseEntity.badRequest()
                    .body(new CancelResponse(false, "Unauthorized access"));
            }
            
            System.out.println("Authorization passed - checking booking status");

            // Check if booking can be cancelled
            if (booking.getParcelStatus() != ParcelStatus.BOOKED) {
                System.out.println("Booking cannot be cancelled - status is: " + booking.getParcelStatus());
                return ResponseEntity.badRequest()
                    .body(new CancelResponse(false, "Only booked parcels can be cancelled"));
            }
            
            System.out.println("Status validation passed - updating booking");

            booking.setParcelStatus(ParcelStatus.CANCELLED);
            Booking updatedBooking = bookingService.updateBooking(booking);
            
            if (updatedBooking != null) {
                System.out.println("Booking cancelled successfully");
                return ResponseEntity.ok(new CancelResponse(true, 
                    "Booking cancelled successfully. Booking ID: " + bookingId));
            } else {
                System.out.println("Failed to update booking");
                return ResponseEntity.status(500).body(new CancelResponse(false, "Failed to update booking"));
            }
            
        } catch (Exception e) {
            System.err.println("Error in customer cancellation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new CancelResponse(false, "Cancellation failed: " + e.getMessage()));
        }
    }

    @PostMapping("/officer")
    public ResponseEntity<CancelResponse> cancelOfficerBooking(
            @RequestParam String bookingId,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("=== Officer Cancellation Debug ===");
            System.out.println("Booking ID: " + bookingId);
            System.out.println("Token: " + token.substring(0, Math.min(token.length(), 50)) + "...");
            
            // Extract role from token
            String role = jwtUtil.extractRole(token.replace("Bearer ", ""));
            System.out.println("Extracted role from token: " + role);
            
            if (!"OFFICER".equals(role)) {
                System.out.println("Access denied - token contains role: " + role + ", expected: OFFICER");
                return ResponseEntity.badRequest().body(new CancelResponse(false, "Only officers can cancel officer bookings"));
            }
            
            System.out.println("Role validation passed - proceeding with cancellation");
            
            // Get the booking
            Booking booking = bookingService.getBookingById(bookingId);
            if (booking == null) {
                System.out.println("Booking not found for ID: " + bookingId);
                return ResponseEntity.badRequest().body(new CancelResponse(false, "Booking not found"));
            }
            
            System.out.println("Found booking: " + booking.getBookingId());
            System.out.println("Current status: " + booking.getParcelStatus());
            
            // Check if booking can be cancelled
            if (booking.getParcelStatus() != ParcelStatus.BOOKED) {
                System.out.println("Booking cannot be cancelled - status is: " + booking.getParcelStatus());
                return ResponseEntity.badRequest().body(new CancelResponse(false, "Only booked parcels can be cancelled"));
            }
            
            // Update booking status to CANCELLED
            booking.setParcelStatus(ParcelStatus.CANCELLED);
            Booking updatedBooking = bookingService.updateBooking(booking);
            
            if (updatedBooking != null) {
                System.out.println("Booking cancelled successfully");
                return ResponseEntity.ok(new CancelResponse(true, "Booking cancelled successfully"));
            } else {
                System.out.println("Failed to update booking");
                return ResponseEntity.status(500).body(new CancelResponse(false, "Failed to update booking"));
            }
            
        } catch (Exception e) {
            System.err.println("Error in officer cancellation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new CancelResponse(false, "Failed to cancel booking: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("CancelBookingController is working!");
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("=== Test Endpoint Debug ===");
            System.out.println("Token: " + token.substring(0, Math.min(token.length(), 50)) + "...");
            
            String role = jwtUtil.extractRole(token.replace("Bearer ", ""));
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            
            System.out.println("Extracted role: " + role);
            System.out.println("Extracted email: " + email);
            
            return ResponseEntity.ok("Test successful. Role: " + role + ", Email: " + email);
        } catch (Exception e) {
            System.err.println("Test endpoint error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Test failed: " + e.getMessage());
        }
    }
} 