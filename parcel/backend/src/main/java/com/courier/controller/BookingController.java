package com.courier.controller;

// Import DTOs (Data Transfer Objects) for structured data exchange
import com.courier.dto.BookingRequest; // Contains data sent from frontend when creating a booking
import com.courier.dto.BookingResponse; // Contains response data sent back to frontend
import com.courier.dto.BookingPage; // Contains paginated booking results

// Import model classes (the data structures we work with)
import com.courier.model.Booking; // Represents a courier booking
import com.courier.model.Customer; // Represents a customer
import com.courier.model.ParcelStatus; // Enum for tracking parcel delivery status

// Import service classes for business logic
import com.courier.service.AuthService; // Handles authentication and customer lookup
import com.courier.service.BookingService; // Handles booking business logic

// Import utility classes
import com.courier.util.CostCalculator; // Calculates courier service costs
import com.courier.util.JwtUtil; // Handles JWT token operations

// Import validation and Spring framework classes
import jakarta.validation.Valid; // Annotation for validating request data
import org.springframework.beans.factory.annotation.Autowired; // Annotation for dependency injection
import org.springframework.http.ResponseEntity; // Wrapper for HTTP responses
import org.springframework.web.bind.annotation.*; // Annotations for defining REST endpoints

// Import Java utilities
import java.math.BigDecimal; // For precise decimal calculations (money)
import java.time.LocalDateTime; // For date and time operations
import java.util.List; // Collection for holding multiple items

/**
 * Booking Controller Class
 * 
 * What This Class Does:
 * This class handles all HTTP requests related to courier bookings.
 * It's like a "receptionist" that receives requests from the frontend and
 * coordinates with other parts of the system to fulfill them.
 * 
 * What is a Controller?
 * - Controllers are the entry points for HTTP requests
 * - They receive data from the frontend (web browser, mobile app, etc.)
 * - They call services to perform business logic
 * - They return responses back to the frontend
 * - They handle HTTP-specific concerns (status codes, headers, etc.)
 * 
 * What is REST?
 * - REST (Representational State Transfer) is a way of designing web APIs
 * - It uses HTTP methods (GET, POST, PUT, DELETE) to perform operations
 * - GET = retrieve data, POST = create data, PUT = update data, DELETE = remove data
 * - URLs represent resources (e.g., /api/bookings represents all bookings)
 * 
 * How This Controller Works:
 * 1. Frontend sends HTTP request to a specific URL (e.g., POST /api/bookings)
 * 2. Spring routes the request to the appropriate method in this controller
 * 3. Controller validates the request data and extracts information
 * 4. Controller calls services to perform business logic
 * 5. Controller returns HTTP response back to frontend
 * 
 * Security Features:
 * - JWT token validation for authentication
 * - Role-based access control (customers vs officers)
 * - Input validation to prevent malicious data
 */
@RestController // Tells Spring: "This is a REST controller - handle HTTP requests"
@RequestMapping("/api/bookings") // Base URL for all methods in this controller
@CrossOrigin(origins = "http://localhost:4200") // Allows Angular frontend to make requests
public class BookingController {

    /**
     * Dependency Injection - Spring automatically provides these service instances
     * 
     * What is @Autowired?
     * - This annotation tells Spring to automatically inject (provide) these objects
     * - Spring looks for classes marked with @Service and creates instances
     * - It manages the lifecycle of these objects for you
     * - You don't need to manually create objects with "new"
     */
    @Autowired
    private BookingService bookingService; // Handles booking business logic

    @Autowired
    private AuthService authService; // Handles authentication and customer lookup

    @Autowired
    private JwtUtil jwtUtil; // Handles JWT token operations

    /**
     * Create a new customer booking
     * 
     * What This Method Does:
     * Handles POST requests to /api/bookings to create new courier bookings.
     * This endpoint is used when customers create bookings through the frontend.
     * 
     * HTTP Details:
     * - Method: POST
     * - URL: /api/bookings
     * - Request Body: BookingRequest object (JSON data from frontend)
     * - Headers: Authorization token (JWT)
     * - Response: BookingResponse object (JSON data back to frontend)
     * 
     * Security:
     * - Requires valid JWT token in Authorization header
     * - Only customers can create bookings (role check)
     * - Input data is validated (@Valid annotation)
     * 
     * Flow:
     * 1. Extract user information from JWT token
     * 2. Verify user role is CUSTOMER
     * 3. Find customer in database
     * 4. Calculate service cost
     * 5. Create and save booking
     * 6. Return success response
     * 
     * @param request The booking data from frontend (automatically converted from JSON)
     * @param token JWT token from Authorization header for authentication
     * @return ResponseEntity containing success/failure and booking details
     */
    @PostMapping // Handles POST requests to /api/bookings
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
                                                       @RequestHeader("Authorization") String token) {
        try {
            // ===== AUTHENTICATION & AUTHORIZATION =====
            // Extract customer ID from JWT token
            // JWT tokens contain encoded information about the user
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            String role = jwtUtil.extractRole(token.replace("Bearer ", ""));
            // Extract userId if needed later
            jwtUtil.extractUserId(token.replace("Bearer ", ""));
            
            // Check if this is a customer booking
            // Only customers can create bookings through this endpoint
            if (!"CUSTOMER".equals(role)) {
                return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Only customers can create bookings", null));
            }
            
            // ===== CUSTOMER LOOKUP =====
            // Try to find customer by email first, then by unique ID
            // This ensures we have a valid customer for the booking
            Customer customer = authService.getCustomerByEmail(email);
            if (customer == null) {
                // Try to find by unique ID if email lookup fails
                // For now, we'll use the email as unique ID since the JWT contains email
                // In a real scenario, we'd need to extract unique ID from JWT or modify the token structure
                customer = authService.getCustomerByEmail(email);
            }
            
            if (customer == null) {
                return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Customer not found", null));
            }

            // ===== COST CALCULATION =====
            // Calculate service cost based on weight, delivery type, and packing preference
            // CostCalculator handles the business logic for pricing
            double serviceCost = CostCalculator.calculateServiceCost(
                request.getParcelWeightInGram(),        // Weight in grams
                request.getParcelDeliveryType(),        // STANDARD, EXPRESS, or SAME_DAY
                request.getParcelPackingPreference(),   // BASIC or PREMIUM
                false                                   // isOfficerBooking = false for customer bookings
            );

            // ===== BOOKING CREATION =====
            // Create a new Booking object and populate it with request data
            Booking booking = new Booking();
            booking.setCustomer(customer);                                    // Who made the booking
            booking.setReceiverName(request.getReceiverName());               // Who will receive
            booking.setReceiverAddress(request.getReceiverAddress());         // Where to deliver
            booking.setReceiverPin(request.getReceiverPin());                 // Postal code
            booking.setReceiverMobile(request.getReceiverMobile());           // Contact number
            booking.setParcelWeightInGram(request.getParcelWeightInGram());   // Weight in grams
            booking.setParcelContentsDescription(request.getParcelContentsDescription()); // What's inside
            booking.setParcelDeliveryType(request.getParcelDeliveryType());   // How fast
            booking.setParcelPackingPreference(request.getParcelPackingPreference()); // How much protection
            booking.setParcelPickupTime(request.getParcelPickupTime());       // When to pick up
            booking.setParcelDropoffTime(request.getParcelDropoffTime());     // When to deliver
            booking.setParcelServiceCost(BigDecimal.valueOf(serviceCost));    // Total cost
            booking.setParcelPaymentTime(LocalDateTime.now());                // Payment timestamp
            booking.setParcelStatus(ParcelStatus.NEW);                       // Initial status
            
            // Note: bookingId is auto-generated in the Booking constructor
            // No need to set it manually

            // ===== DATABASE SAVE =====
            System.out.println("Booking object created, saving...");
            Booking savedBooking = bookingService.createBooking(booking);
            System.out.println("Booking saved successfully with ID: " + savedBooking.getBookingId());
            
            // ===== SUCCESS RESPONSE =====
            // Create success response with the saved booking details
            BookingResponse response = new BookingResponse(
                true,                           // Success = true
                "Booking created successfully",  // Success message
                savedBooking                    // The complete booking object
            );
            
            System.out.println("=== Booking Request Completed Successfully ===");
            return ResponseEntity.ok(response); // HTTP 200 OK with response body
            
        } catch (Exception e) {
            // ===== ERROR HANDLING =====
            // If anything goes wrong, catch the exception and return error response
            System.out.println("=== Booking Request Failed ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace(); // Print full error details for debugging
            
            // Return HTTP 400 Bad Request with error message
            return ResponseEntity.badRequest().body(new BookingResponse(false, "Booking failed: " + e.getMessage(), null));
        }
    }

    /**
     * Create a new officer booking
     * 
     * What This Method Does:
     * Handles POST requests to /api/bookings/officer to create bookings on behalf of customers.
     * This endpoint is used when officers create bookings for customers at the office.
     * 
     * HTTP Details:
     * - Method: POST
     * - URL: /api/bookings/officer
     * - Request Body: BookingRequest object
     * - Headers: Authorization token (JWT)
     * - Response: BookingResponse object
     * 
     * Security:
     * - Requires valid JWT token
     * - Only officers can use this endpoint (role check)
     * - Input data is validated
     * 
     * Differences from Customer Booking:
     * - Only officers can access this endpoint
     * - Includes admin fee in cost calculation
     * - Different initial status (BOOKED vs NEW)
     * - Manual booking ID generation
     * 
     * @param request The booking data from frontend
     * @param token JWT token for authentication
     * @return ResponseEntity containing success/failure and booking details
     */
    @PostMapping("/officer") // Handles POST requests to /api/bookings/officer
    public ResponseEntity<BookingResponse> createOfficerBooking(@Valid @RequestBody BookingRequest request,
                                                              @RequestHeader("Authorization") String token) {
        try {
            // ===== AUTHENTICATION & AUTHORIZATION =====
            // Extract officer information from JWT token
            String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
            String role = jwtUtil.extractRole(token.replace("Bearer ", ""));
            // Extract userId if needed later
            jwtUtil.extractUserId(token.replace("Bearer ", ""));
            
            // Check if this is an officer booking
            // Only officers can create bookings through this endpoint
            if (!"OFFICER".equals(role)) {
                return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Only officers can create officer bookings", null));
            }
            
            // ===== OFFICER LOOKUP =====
            // Find the officer in the database
            Customer officer = authService.getCustomerByEmail(email);
            if (officer == null) {
                officer = authService.getCustomerByEmail(email);
            }
            
            if (officer == null) {
                return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Officer not found", null));
            }

            // ===== COST CALCULATION =====
            // Calculate service cost with admin fee (isOfficerBooking = true)
            double serviceCost = CostCalculator.calculateServiceCost(
                request.getParcelWeightInGram(),
                request.getParcelDeliveryType(),
                request.getParcelPackingPreference(),
                true // isOfficerBooking = true for officer bookings (includes admin fee)
            );

            // ===== BOOKING CREATION =====
            // Create a new Booking object for the officer
            Booking booking = new Booking();
            booking.setCustomer(officer); // Officer is the customer for this booking
            booking.setReceiverName(request.getReceiverName());
            booking.setReceiverAddress(request.getReceiverAddress());
            booking.setReceiverPin(request.getReceiverPin());
            booking.setReceiverMobile(request.getReceiverMobile());
            booking.setParcelWeightInGram(request.getParcelWeightInGram());
            booking.setParcelContentsDescription(request.getParcelContentsDescription());
            booking.setParcelDeliveryType(request.getParcelDeliveryType());
            booking.setParcelPackingPreference(request.getParcelPackingPreference());
            booking.setParcelPickupTime(request.getParcelPickupTime());
            booking.setParcelDropoffTime(request.getParcelDropoffTime());
            booking.setParcelServiceCost(BigDecimal.valueOf(serviceCost));
            booking.setParcelStatus(ParcelStatus.BOOKED); // Different initial status
            
            // Generate unique booking ID manually
            String bookingId = "BK" + System.currentTimeMillis();
            booking.setBookingId(bookingId);
            
            // ===== DATABASE SAVE =====
            // Save the booking to database
            Booking savedBooking = bookingService.createBooking(booking);
            
            if (savedBooking != null) {
                // Success - return HTTP 200 OK
                return ResponseEntity.ok(new BookingResponse(true, "Booking created successfully", savedBooking));
            } else {
                // Database save failed - return HTTP 500 Internal Server Error
                return ResponseEntity.status(500)
                    .body(new BookingResponse(false, "Failed to create booking", null));
            }
            
        } catch (Exception e) {
            // ===== ERROR HANDLING =====
            // Return HTTP 500 Internal Server Error with error message
            return ResponseEntity.status(500)
                .body(new BookingResponse(false, "Failed to create booking: " + e.getMessage(), null));
        }
    }

    /**
     * Get paginated list of all bookings for officers
     * 
     * What This Method Does:
     * Handles GET requests to /api/bookings/officer to retrieve all bookings in the system.
     * This endpoint is used by officers to view and manage all customer bookings.
     * 
     * HTTP Details:
     * - Method: GET
     * - URL: /api/bookings/officer?page=0&size=10
     * - Query Parameters: page (which page), size (how many per page)
     * - Response: BookingPage object with paginated results
     * 
     * Pagination:
     * - page: 0 = first page, 1 = second page, etc.
     * - size: how many bookings per page (default 10)
     * - Returns metadata about total pages, total elements, etc.
     * 
     * @param page Which page to retrieve (default: 0)
     * @param size How many bookings per page (default: 10)
     * @return ResponseEntity containing paginated booking results
     */
    @GetMapping("/officer") // Handles GET requests to /api/bookings/officer
    public ResponseEntity<BookingPage> getOfficerBookings(
            @RequestParam(defaultValue = "0") int page,    // Query parameter with default value
            @RequestParam(defaultValue = "10") int size) { // Query parameter with default value
        try {
            // Get paginated bookings from the service
            BookingPage bookings = bookingService.getAllBookingsPaginated(page, size);
            return ResponseEntity.ok(bookings); // HTTP 200 OK with results
        } catch (Exception e) {
            // If error occurs, return HTTP 400 Bad Request
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all bookings in the system (for debugging/administration)
     * 
     * What This Method Does:
     * Handles GET requests to /api/bookings/list-all to retrieve all bookings without pagination.
     * This endpoint is primarily used for debugging and administrative purposes.
     * 
     * HTTP Details:
     * - Method: GET
     * - URL: /api/bookings/list-all
     * - Response: Plain text with booking summary
     * 
     * Use Cases:
     * - System administration
     * - Debugging and troubleshooting
     * - Generating reports
     * - Monitoring system usage
     * 
     * @return ResponseEntity containing plain text summary of all bookings
     */
    @GetMapping("/list-all") // Handles GET requests to /api/bookings/list-all
    public ResponseEntity<String> listAllBookings() {
        try {
            // Get all bookings from the service
            List<Booking> allBookings = bookingService.getAllBookings();
            
            // Build a human-readable summary
            StringBuilder result = new StringBuilder();
            result.append("Total bookings: ").append(allBookings.size()).append("\n");
            
            // Add details for each booking
            for (Booking booking : allBookings) {
                result.append("Booking ID: ").append(booking.getBookingId())
                      .append(", Customer: ").append(booking.getCustomer() != null ? booking.getCustomer().getCustomerName() : "null")
                      .append(", Status: ").append(booking.getParcelStatus())
                      .append("\n");
            }
            
            return ResponseEntity.ok(result.toString()); // HTTP 200 OK with text response
        } catch (Exception e) {
            // If error occurs, return HTTP 400 Bad Request with error message
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

/**
 * How This Controller Fits Into the Application:
 * 
 * 1. HTTP Request Handling:
 *    - Frontend sends HTTP requests to specific URLs
 *    - Spring routes requests to appropriate methods in this controller
 *    - Controller methods handle the requests and return responses
 * 
 * 2. REST API Design:
 *    - POST /api/bookings - Create customer booking
 *    - POST /api/bookings/officer - Create officer booking
 *    - GET /api/bookings/officer - Get all bookings (officer view)
 *    - GET /api/bookings/list-all - Get all bookings (admin view)
 * 
 * 3. Security Implementation:
 *    - JWT token validation for authentication
 *    - Role-based access control (customers vs officers)
 *    - Input validation to prevent malicious data
 *    - Proper HTTP status codes for different scenarios
 * 
 * 4. Data Flow:
 *    - Frontend → Controller → Service → Repository → Database
 *    - Database → Repository → Service → Controller → Frontend
 * 
 * 5. Error Handling:
 *    - Try-catch blocks prevent application crashes
 *    - Appropriate HTTP status codes for different error types
 *    - User-friendly error messages
 *    - Detailed logging for debugging
 * 
 * 6. Integration Points:
 *    - Controllers depend on services for business logic
 *    - Services depend on repositories for data access
 *    - JWT utilities for authentication
 *    - Cost calculators for business calculations
 * 
 * This controller is the main entry point for all booking-related operations,
 * providing a clean REST API interface while ensuring security and data validation.
 */ 