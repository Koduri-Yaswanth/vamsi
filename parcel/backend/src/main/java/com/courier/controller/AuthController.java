package com.courier.controller;

// Import statements for Spring Boot and our custom classes
import com.courier.dto.AuthResponse; // Data transfer object for authentication responses
import com.courier.dto.LoginRequest; // Data transfer object for login requests
import com.courier.dto.RegisterRequest; // Data transfer object for registration requests
import com.courier.dto.PasswordChangeRequest; // Data transfer object for password change requests
import com.courier.dto.PasswordChangeResponse; // Data transfer object for password change responses
import com.courier.service.AuthService; // Service class that handles authentication business logic
import com.courier.util.JwtUtil; // Utility class for JWT (JSON Web Token) operations
import jakarta.validation.Valid; // Annotation for validating request data
import org.springframework.beans.factory.annotation.Autowired; // Annotation for dependency injection
import org.springframework.http.ResponseEntity; // Spring class for HTTP responses with status codes
import org.springframework.web.bind.annotation.*; // Spring annotations for REST endpoints

import java.util.Map; // Java utility for working with key-value pairs

/**
 * Authentication Controller Class
 * 
 * This controller handles all HTTP requests related to authentication including:
 * - User registration (creating new accounts)
 * - Customer login (authenticating customers)
 * - Officer login (authenticating officers)
 * - Password changes (updating user passwords)
 * 
 * What is a Controller?
 * - A controller is a class that handles HTTP requests from clients (like web browsers or mobile apps)
 * - It's like a "receptionist" that receives requests and directs them to the right place
 * - Controllers don't contain business logic - they just coordinate between the client and services
 * - They're part of the MVC (Model-View-Controller) pattern in web applications
 * 
 * Key Spring Boot Concepts:
 * 
 * 1. @RestController:
 *    - Marks this class as a REST controller that returns JSON responses
 *    - REST means "Representational State Transfer" - a way to design web APIs
 *    - JSON is a format for exchanging data between frontend and backend
 * 
 * 2. @RequestMapping:
 *    - Defines the base URL path for all endpoints in this controller
 *    - All URLs in this controller start with /api/auth
 *    - Example: /api/auth/register, /api/auth/login, etc.
 * 
 * 3. @CrossOrigin:
 *    - Allows requests from the frontend application (CORS configuration)
 *    - CORS = Cross-Origin Resource Sharing
 *    - Without this, browsers would block requests from localhost:4200 to localhost:8080
 * 
 * 4. @PostMapping:
 *    - Defines HTTP POST endpoints (used for creating/updating data)
 *    - POST is one of the HTTP methods (GET, POST, PUT, DELETE)
 *    - POST is typically used for forms, login, registration, etc.
 * 
 * 5. @RequestBody:
 *    - Extracts JSON data from HTTP request body
 *    - Converts JSON into Java objects automatically
 *    - Example: {"email": "user@example.com", "password": "123456"}
 * 
 * 6. @RequestHeader:
 *    - Extracts data from HTTP request headers
 *    - Headers contain metadata about the request (like authentication tokens)
 *    - Example: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * 7. ResponseEntity:
 *    - Wraps HTTP responses with status codes and body
 *    - Status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 500 (Server Error)
 *    - Body contains the actual response data
 * 
 * Controller Layer Responsibilities:
 * 1. Receive HTTP requests from clients (frontend, mobile apps, etc.)
 * 2. Validate request data (check if required fields are present, format is correct)
 * 3. Call appropriate service methods (delegate business logic to services)
 * 4. Return HTTP responses with proper status codes (success, error, etc.)
 * 5. Handle errors and exceptions (catch errors and return appropriate error responses)
 * 
 * How This Controller Works:
 * 1. Frontend sends HTTP request to a specific URL (e.g., POST /api/auth/login)
 * 2. Spring Boot routes the request to this controller based on the URL
 * 3. Controller method receives the request data and validates it
 * 4. Controller calls the appropriate service method to handle the business logic
 * 5. Controller receives the result from the service and returns an HTTP response
 * 6. Frontend receives the response and can display success/error messages
 */
@RestController // This annotation tells Spring: "This class handles HTTP requests and returns JSON"
@RequestMapping("/api/auth") // All URLs in this controller start with /api/auth
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from our Angular frontend
public class AuthController {
    
    /**
     * Service for authentication business logic
     * Handles registration, login, and password operations
     * 
     * @Autowired tells Spring to automatically create and inject this service
     * This is called "dependency injection" - Spring manages object creation for us
     */
    @Autowired
    private AuthService authService;
    
    /**
     * Utility for JWT token operations
     * Extracts user information from JWT tokens
     * 
     * JWT = JSON Web Token - a secure way to identify users
     * When a user logs in, we give them a JWT token
     * They include this token in future requests to prove who they are
     */
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Register a new user (customer or officer)
     * 
     * HTTP Method: POST
     * URL: /api/auth/register
     * 
     * This endpoint:
     * 1. Receives registration data from frontend (name, email, password, etc.)
     * 2. Validates the request data (@Valid checks if required fields are present)
     * 3. Calls the auth service to register the user in the database
     * 4. Returns appropriate HTTP status code based on result
     * 
     * @param request Registration data (name, email, password, etc.)
     * @return ResponseEntity with registration result and user details
     */
    @PostMapping("/register") // This method handles POST requests to /api/auth/register
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Call service to handle registration
        // The service contains the actual business logic (checking if email exists, hashing password, etc.)
        AuthResponse response = authService.register(request);
        
        if (response.isSuccess()) {
            // Return 200 OK for successful registration
            // 200 means "everything worked fine"
            return ResponseEntity.ok(response);
        } else {
            // Return appropriate error status based on the error type
            if (response.getMessage() != null && response.getMessage().contains("Email already registered")) {
                // Return 409 Conflict for duplicate email
                // 409 means "there's a conflict - this email is already in use"
                return ResponseEntity.status(409).body(response);
            } else {
                // Return 400 Bad Request for other validation errors
                // 400 means "the request was bad - missing fields, wrong format, etc."
                return ResponseEntity.badRequest().body(response);
            }
        }
    }
    
    /**
     * Authenticate a customer login
     * 
     * HTTP Method: POST
     * URL: /api/auth/login
     * 
     * This endpoint:
     * 1. Receives login credentials from frontend (unique ID and password)
     * 2. Validates the request data (checks if fields are present)
     * 3. Calls the auth service to authenticate customer (check password, create JWT token)
     * 4. Returns JWT token and user details on success
     * 
     * @param request Login credentials (unique ID and password)
     * @return ResponseEntity with authentication result and user details
     */
    @PostMapping("/login") // This method handles POST requests to /api/auth/login
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Call service to handle customer login
        // The service checks if the password is correct and creates a JWT token
        AuthResponse response = authService.login(request);
        
        if (response.isSuccess()) {
            // Return 200 OK for successful login
            // The response includes the JWT token that the frontend will store
            return ResponseEntity.ok(response);
        } else {
            // Return 400 Bad Request for failed login
            // This could be wrong password, user not found, etc.
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Authenticate an officer login
     * 
     * HTTP Method: POST
     * URL: /api/auth/officer-login
     * 
     * This endpoint:
     * 1. Receives login credentials from frontend (unique ID and password)
     * 2. Validates the request data (checks if fields are present)
     * 3. Calls the auth service to authenticate officer (check password, create JWT token)
     * 4. Returns JWT token and user details on success
     * 
     * Note: Officers have different privileges than customers
     * They can manage all bookings, update delivery status, etc.
     * 
     * @param request Login credentials (unique ID and password)
     * @return ResponseEntity with authentication result and user details
     */
    @PostMapping("/officer-login") // This method handles POST requests to /api/auth/officer-login
    public ResponseEntity<AuthResponse> officerLogin(@Valid @RequestBody LoginRequest request) {
        // Call service to handle officer login
        // The service checks if the password is correct and creates a JWT token
        AuthResponse response = authService.officerLogin(request);
        
        if (response.isSuccess()) {
            // Return 200 OK for successful login
            // The response includes the JWT token and officer details
            return ResponseEntity.ok(response);
        } else {
            // Return 400 Bad Request for failed login
            // This could be wrong password, user not found, etc.
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Change user password
     * 
     * HTTP Method: POST
     * URL: /api/auth/change-password
     * 
     * This endpoint:
     * 1. Receives password change request from frontend (current password, new password)
     * 2. Extracts user ID from JWT token in Authorization header (identifies who is changing password)
     * 3. Validates current password and new password (checks if current password is correct)
     * 4. Updates password in database (hashes the new password for security)
     * 5. Returns success/failure response
     * 
     * Security Features:
     * - Requires JWT token (user must be logged in)
     * - Validates current password before allowing change
     * - Passwords are hashed (not stored as plain text)
     * 
     * @param request Password change data (current, new, confirm passwords)
     * @param token JWT token from Authorization header (proves user identity)
     * @return ResponseEntity with password change result
     */
    @PostMapping("/change-password") // This method handles POST requests to /api/auth/change-password
    public ResponseEntity<PasswordChangeResponse> changePassword(
            @RequestBody PasswordChangeRequest request,
            @RequestHeader("Authorization") String token) {
        
        try {
            // Debug logging for troubleshooting
            // In production, you'd use a proper logging framework instead of System.out.println
            System.out.println("=== Password Change Debug ===");
            System.out.println("Password change request received");
            System.out.println("Token: " + token);
            
            // Extract user ID from JWT token
            // JWT tokens start with "Bearer " followed by the actual token
            // We need to remove "Bearer " to get just the token
            String jwt = token.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(jwt); // Extract user ID from the token
            
            System.out.println("User ID from token: " + userId);
            
            // Validate password confirmation
            // Check if new password and confirm password match
            // This prevents typos when changing passwords
            if (request.getNewPassword() == null || !request.getNewPassword().equals(request.getConfirmPassword())) {
                System.out.println("Password confirmation mismatch");
                return ResponseEntity.badRequest()
                        .body(new PasswordChangeResponse(false, "New password and confirm password do not match"));
            }
            
            // Call service to handle password change
            // The service will check if current password is correct and update to new password
            PasswordChangeResponse response = authService.changePassword(userId, request);
            
            System.out.println("Password change response: " + response.isSuccess() + " - " + response.getMessage());
            
            if (response.isSuccess()) {
                // Return 200 OK for successful password change
                return ResponseEntity.ok(response);
            } else {
                // Return 400 Bad Request for failed password change
                // This could be wrong current password, validation errors, etc.
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            // Log error and return 500 Internal Server Error
            // 500 means "something went wrong on the server side"
            // This could be database errors, JWT parsing errors, etc.
            System.err.println("Error in password change endpoint: " + e.getMessage());
            e.printStackTrace(); // Print the full error stack trace for debugging
            return ResponseEntity.status(500)
                    .body(new PasswordChangeResponse(false, "Internal server error: " + e.getMessage()));
        }
    }
}

/**
 * How This Controller Fits Into the Application:
 * 
 * 1. Frontend (Angular):
 *    - User fills out login form
 *    - Angular sends HTTP POST request to /api/auth/login
 *    - Request includes JSON with email and password
 * 
 * 2. Spring Boot Router:
 *    - Receives request and routes it to this controller
 *    - Matches URL /api/auth/login to the login() method
 * 
 * 3. Controller Method:
 *    - Receives the request data
 *    - Calls authService.login() to handle business logic
 *    - Returns HTTP response with success/error and JWT token
 * 
 * 4. Frontend Response:
 *    - Angular receives the response
 *    - If successful, stores JWT token and redirects to dashboard
 *    - If failed, shows error message to user
 * 
 * This creates a complete authentication flow:
 * - User registration → Account creation → Database storage
 * - User login → Password verification → JWT token generation
 * - Password change → Security validation → Database update
 * 
 * The controller acts as the "bridge" between the frontend and backend services,
 * ensuring proper HTTP communication and error handling.
 */
 