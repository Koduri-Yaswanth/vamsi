package com.courier.service;

// Import statements for Spring Boot and our custom classes
import com.courier.dto.AuthResponse; // Data transfer object for authentication responses
import com.courier.dto.LoginRequest; // Data transfer object for login requests
import com.courier.dto.RegisterRequest; // Data transfer object for registration requests
import com.courier.dto.PasswordChangeRequest; // Data transfer object for password change requests
import com.courier.dto.PasswordChangeResponse; // Data transfer object for password change responses
import com.courier.model.Customer; // Database entity representing a customer/officer
import com.courier.model.UserRole; // Enum defining user roles (CUSTOMER, OFFICER)
import com.courier.repository.CustomerRepository; // Interface for database operations on customers
import com.courier.util.JwtUtil; // Utility for JWT (JSON Web Token) operations
import com.courier.util.PasswordUtil; // Utility for password hashing and verification
import org.springframework.beans.factory.annotation.Autowired; // Annotation for dependency injection
import org.springframework.stereotype.Service; // Annotation that marks this class as a service
import java.util.Optional; // Java class for handling values that might not exist
import jakarta.persistence.PrePersist; // JPA annotation for pre-save operations
import java.time.LocalDateTime; // Java class for working with dates and times

/**
 * Authentication Service Class
 * 
 * This service handles all authentication-related operations including:
 * - User registration (customers and officers)
 * - User login (separate for customers and officers)
 * - Password management
 * - JWT token generation
 * 
 * What is a Service?
 * - A service is a class that contains business logic (the "rules" of your application)
 * - It's like the "brain" that makes decisions and processes data
 * - Controllers call services to handle complex operations
 * - Services call repositories to save/retrieve data from the database
 * - This creates a clean separation of concerns (each class has one job)
 * 
 * Key Spring Boot Concepts:
 * 
 * 1. @Service:
 *    - Marks this class as a Spring service component
 *    - Spring automatically creates an instance of this class
 *    - Other classes can inject this service using @Autowired
 *    - Part of Spring's dependency injection system
 * 
 * 2. @Autowired:
 *    - Tells Spring to automatically provide (inject) other services/repositories
 *    - Spring creates these objects and gives them to this service
 *    - This is called "dependency injection" - Spring manages object creation
 *    - Without this, you'd have to manually create all the objects you need
 * 
 * 3. Business Logic:
 *    - Contains the core rules and processes of your application
 *    - Examples: checking if email exists, validating passwords, generating tokens
 *    - This is where the "thinking" happens - not just moving data around
 * 
 * 4. Security:
 *    - Handles password hashing (converting passwords to unreadable text)
 *    - Generates JWT tokens (secure way to identify users)
 *    - Validates user permissions and roles
 * 
 * Service Layer Responsibilities:
 * 1. Validate user input (check if data is correct and complete)
 * 2. Check business rules (email uniqueness, role validation, etc.)
 * 3. Interact with repositories for data persistence (save/load from database)
 * 4. Generate security tokens (JWT tokens for user sessions)
 * 5. Return appropriate responses (success/failure with meaningful messages)
 * 
 * How Services Fit Into the Application:
 * 
 * Frontend (Angular) → Controller → Service → Repository → Database
 * 
 * 1. Frontend sends request to controller
 * 2. Controller calls service method
 * 3. Service applies business logic and calls repository
 * 4. Repository saves/loads data from database
 * 5. Service processes the result and returns response
 * 6. Controller sends HTTP response back to frontend
 * 
 * This layered approach makes the code:
 * - Easy to understand (each class has one job)
 * - Easy to test (you can test services without the database)
 * - Easy to maintain (change business logic without changing controllers)
 * - Secure (business rules are centralized in services)
 */
@Service // This annotation tells Spring: "This class is a service - create an instance and manage it"
public class AuthService {
    
    /**
     * Repository for customer data operations
     * Handles database interactions for customer entities
     * 
     * What is a Repository?
     * - A repository is an interface that handles database operations
     * - It's like a "data access layer" that knows how to talk to the database
     * - Services use repositories to save, load, update, and delete data
     * - Spring automatically creates the actual implementation of this interface
     * 
     * @Autowired tells Spring to automatically provide this repository
     * Spring will create a CustomerRepositoryImpl class and inject it here
     */
    @Autowired
    private CustomerRepository customerRepository;
    
    /**
     * Utility for JWT token operations
     * Generates and validates JSON Web Tokens
     * 
     * What is JWT?
     * - JWT = JSON Web Token
     * - It's a secure way to identify users without storing their information on the server
     * - When a user logs in, we create a JWT token with their user ID and role
     * - The frontend stores this token and sends it with every request
     * - We can extract user information from the token to know who is making the request
     * - This is more secure than storing user sessions on the server
     */
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Utility for password operations
     * Handles password hashing and verification
     * 
     * What is Password Hashing?
     * - Hashing converts a password into a long, random-looking string
     * - The same password always produces the same hash
     * - But you cannot reverse the hash to get the original password
     * - When a user logs in, we hash their input and compare it to the stored hash
     * - This way, even if someone steals our database, they can't see the actual passwords
     */
    @Autowired
    private PasswordUtil passwordUtil;
    
    /**
     * Register a new user (customer or officer)
     * 
     * This method creates a new user account with the following steps:
     * 1. Check if email already exists (prevent duplicate accounts)
     * 2. Create new customer object (prepare data for database)
     * 3. Hash the password for security (never store plain text passwords)
     * 4. Generate unique ID (create a reference number for the user)
     * 5. Save to database (persist the user data)
     * 6. Generate JWT token (give user immediate access)
     * 7. Return success response with user details
     * 
     * Business Rules:
     * - Each email can only be used once
     * - Passwords must be hashed before storage
     * - Each user gets a unique ID for reference
     * - Users are automatically logged in after registration
     * 
     * @param request Registration request containing user details (name, email, password, etc.)
     * @return AuthResponse with success/failure status and user information
     */
    public AuthResponse register(RegisterRequest request) {
        try {
            // Check if email already exists in database
            // This prevents multiple accounts with the same email
            // Optional<Customer> means "this might contain a customer, or it might be empty"
            if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
                // Return error response if email is already registered
                return new AuthResponse(false, "Email already registered", null, null, null, null, null, null, null, null, null);
            }
            
            // Create new customer object
            // This represents a new user that will be saved to the database
            Customer customer = new Customer();
            
            // Set customer properties from registration request
            // We copy data from the request object to our customer entity
            customer.setCustomerName(request.getCustomerName());
            customer.setEmail(request.getEmail());
            customer.setCountryCode(request.getCountryCode());
            customer.setMobileNumber(request.getMobileNumber());
            customer.setAddress(request.getAddress());
            
            // Hash password for security before storing
            // Never store plain text passwords in the database
            // The hash function converts "password123" to something like "a1b2c3d4e5f6..."
            String hashedPassword = passwordUtil.encode(request.getPassword());
            customer.setPassword(hashedPassword);
            
            // Set user role (CUSTOMER or OFFICER)
            // UserRole.valueOf() converts a string to an enum value
            // This determines what the user can do in the application
            customer.setRole(UserRole.valueOf(request.getRole()));
            customer.setGetUpdatesVia(request.getPreferences());
            
            // Generate unique ID for user reference
            // This creates a unique identifier like "CUST123456789" or "OFF987654321"
            // CUST = Customer, OFF = Officer
            // Timestamp ensures uniqueness even if multiple users register at the same time
            String prefix = UserRole.valueOf(request.getRole()) == UserRole.CUSTOMER ? "CUST" : "OFF";
            String timestamp = String.valueOf(System.currentTimeMillis()).substring(8); // Last 8 digits of current time
            String randomSuffix = String.valueOf((int)(Math.random() * 1000)); // Random 3-digit number
            String uniqueId = prefix + timestamp + randomSuffix;
            customer.setUniqueId(uniqueId);
            
            // Save customer to database
            // customerRepository.save() inserts the customer into the database
            // It returns the saved customer with an auto-generated ID
            Customer savedCustomer = customerRepository.save(customer);
            
            // Generate JWT token for immediate login
            // The user doesn't need to log in again after registration
            // The token contains the user's email, ID, and role
            String token = jwtUtil.generateToken(savedCustomer.getEmail(), savedCustomer.getId(), savedCustomer.getRole());
            
            // Return success response with all user details
            // This includes the JWT token and all the user information
            return new AuthResponse(
                true, // Success = true
                "Registration successful for: " + savedCustomer.getCustomerName(), // Success message
                token, // JWT token for immediate login
                savedCustomer.getId(), // Database ID
                savedCustomer.getCustomerName(), // User's name
                savedCustomer.getEmail(), // User's email
                savedCustomer.getCountryCode(), // Country code for phone
                savedCustomer.getMobileNumber(), // Phone number
                savedCustomer.getAddress(), // User's address
                savedCustomer.getRole().toString(), // User role (CUSTOMER or OFFICER)
                savedCustomer.getUniqueId(), // Unique reference ID
                savedCustomer.getGetUpdatesVia() // Communication preferences
            );
            
        } catch (Exception e) {
            // Return error response if registration fails
            // This catches any unexpected errors (database issues, validation problems, etc.)
            // We log the error and return a user-friendly message
            return new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null, null, null, null, null, null, null, null);
        }
    }
    
    /**
     * Authenticate a customer login
     * 
     * This method handles customer login with the following steps:
     * 1. Find customer by unique ID (look up user in database)
     * 2. Verify user role is CUSTOMER (ensure they're not an officer)
     * 3. Verify password matches (compare input with stored hash)
     * 4. Generate JWT token (create session token)
     * 5. Return success response (user details and token)
     * 
     * Security Features:
     * - Uses unique ID instead of email for login (more secure)
     * - Verifies user role to prevent unauthorized access
     * - Compares password hash, not plain text
     * - Generates new JWT token for each login
     * 
     * @param request Login request containing unique ID and password
     * @return AuthResponse with authentication result and user details
     */
    public AuthResponse login(LoginRequest request) {
        // Try to find customer by unique ID (used as login identifier)
        // findByUniqueId() searches the database for a customer with this unique ID
        // Optional<Customer> means "this might contain a customer, or it might be empty"
        Optional<Customer> customerOpt = customerRepository.findByUniqueId(request.getEmail());
        
        // Check if customer was found
        if (customerOpt.isEmpty()) {
            // Return error response if no customer found with this unique ID
            // We use a generic message for security (don't reveal if user exists)
            return new AuthResponse(false, "Invalid Customer ID or password", null, null, null, null, null, null, null, null, null);
        }
        
        // Get the customer from the Optional
        Customer customer = customerOpt.get();
        
        // Verify user is a customer (not an officer)
        // This prevents officers from logging in through the customer login endpoint
        // Officers have different privileges and should use officerLogin()
        if (customer.getRole() != UserRole.CUSTOMER) {
            return new AuthResponse(
                false, 
                "Access denied. Customer login required. Please use officer login for officer accounts.", 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null,
                null
            );
        }
        
        // Verify password matches stored hash
        // passwordUtil.matches() compares the input password with the stored hash
        // It hashes the input and compares it to the stored hash
        boolean passwordMatches = passwordUtil.matches(request.getPassword(), customer.getPassword());
        
        if (!passwordMatches) {
            // Return error response if password is incorrect
            // Again, we use a generic message for security
            return new AuthResponse(false, "Invalid Customer ID or password", null, null, null, null, null, null, null, null, null);
        }
        
        // Generate JWT token for authenticated session
        // The token contains the user's email, ID, and role
        // The frontend will store this token and send it with future requests
        String token = jwtUtil.generateToken(customer.getEmail(), customer.getId(), customer.getRole());
        
        // Return success response with user details
        // This includes the JWT token and all the user information
        return new AuthResponse(
            true, // Success = true
            "Login successful", // Success message
            token, // JWT token for session
            customer.getId(), // Database ID
            customer.getCustomerName(), // User's name
            customer.getEmail(), // User's email
            customer.getCountryCode(), // Country code for phone
            customer.getMobileNumber(), // Phone number
            customer.getAddress(), // User's address
            customer.getRole().toString(), // User role (should be CUSTOMER)
            customer.getUniqueId(), // Unique reference ID
            customer.getGetUpdatesVia() // Communication preferences
        );
    }
    
    /**
     * Authenticate an officer login
     * 
     * This method handles officer login with the following steps:
     * 1. Find customer by unique ID (look up user in database)
     * 2. Verify user role is OFFICER (ensure they're not a customer)
     * 3. Verify password matches (compare input with stored hash)
     * 4. Generate JWT token (create session token)
     * 5. Return success response (user details and token)
     * 
     * Note: Officers have different privileges than customers
     * They can manage all bookings, update delivery status, etc.
     * 
     * Security Features:
     * - Uses unique ID instead of email for login
     * - Verifies user role to ensure officer privileges
     * - Compares password hash, not plain text
     * - Generates new JWT token for each login
     * 
     * @param request Login request containing unique ID and password
     * @return AuthResponse with authentication result and user details
     */
    public AuthResponse officerLogin(LoginRequest request) {
        // Try to find customer by unique ID (used as login identifier)
        // Note: Officers are stored in the same table as customers
        // The role field distinguishes between CUSTOMER and OFFICER
        Optional<Customer> customerOpt = customerRepository.findByUniqueId(request.getEmail());
        
        if (customerOpt.isEmpty()) {
            // Return error response if no user found with this unique ID
            return new AuthResponse(
                false, 
                "Invalid Officer ID or password", 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null,
                null
            );
        }
        
        // Get the user from the Optional
        Customer customer = customerOpt.get();
        
        // Verify user is an officer (not a customer)
        // This prevents customers from accessing officer features
        // Officers have administrative privileges and can manage all bookings
        if (customer.getRole() != UserRole.OFFICER) {
            return new AuthResponse(
                false, 
                "Access denied. Officer privileges required", 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null,
                null
            );
        }
        
        // Verify password matches stored hash
        boolean passwordMatches = passwordUtil.matches(request.getPassword(), customer.getPassword());
        
        if (!passwordMatches) {
            // Return error response if password is incorrect
            return new AuthResponse(
                false, 
                "Invalid Officer ID or password", 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null, 
                null,
                null
            );
        }
        
        // Generate JWT token for authenticated session
        String token = jwtUtil.generateToken(customer.getEmail(), customer.getId(), customer.getRole());
        
        // Return success response with user details
        return new AuthResponse(
            true, 
            "Login successful", 
            token, 
            customer.getId(), 
            customer.getCustomerName(), 
            customer.getEmail(), 
            customer.getCountryCode(), 
            customer.getMobileNumber(), 
            customer.getAddress(), 
            customer.getRole().toString(),
            customer.getUniqueId(),
            customer.getGetUpdatesVia()
        );
    }
    
    /**
     * Get customer by ID
     * 
     * This method retrieves a customer from the database by their unique ID
     * It's used by other parts of the application to get customer information
     * 
     * @param id Customer ID to search for (the auto-generated database ID)
     * @return Customer object or null if not found
     */
    public Customer getCustomerById(Long id) {
        // findById() searches the database for a customer with this ID
        // orElse(null) returns null if no customer is found
        return customerRepository.findById(id).orElse(null);
    }
    
    /**
     * Get customer by email address
     * 
     * This method retrieves a customer from the database by their email address
     * It's used to check if an email is already registered
     * 
     * @param email Email address to search for
     * @return Customer object or null if not found
     */
    public Customer getCustomerByEmail(String email) {
        // findByEmail() searches the database for a customer with this email
        // orElse(null) returns null if no customer is found
        return customerRepository.findByEmail(email).orElse(null);
    }

    /**
     * Change user password
     * 
     * This method allows users to change their password with the following steps:
     * 1. Verify current password is correct (security check)
     * 2. Check new password matches confirmation (prevent typos)
     * 3. Hash new password (security)
     * 4. Update database (persist the change)
     * 5. Return success/failure response
     * 
     * Security Features:
     * - Requires current password verification (prevents unauthorized changes)
     * - Passwords are hashed before storage
     * - Password confirmation prevents typos
     * - Only logged-in users can change passwords (JWT token required)
     * 
     * @param userId ID of the user changing password (extracted from JWT token)
     * @param request Password change request with current, new, and confirm passwords
     * @return PasswordChangeResponse with success/failure status
     */
    public PasswordChangeResponse changePassword(Long userId, PasswordChangeRequest request) {
        try {
            // Debug logging for troubleshooting
            // In production, you'd use a proper logging framework instead of System.out.println
            System.out.println("=== Password Change Service Debug ===");
            System.out.println("Changing password for user ID: " + userId);
            System.out.println("Current password provided: " + (request.getCurrentPassword() != null ? "YES" : "NO"));
            System.out.println("New password provided: " + (request.getNewPassword() != null ? "YES" : "NO"));
            System.out.println("Confirm password provided: " + (request.getConfirmPassword() != null ? "YES" : "NO"));
            
            // Get the customer from database
            // findById() searches for a customer with this ID
            // orElseThrow() throws an exception if no customer is found
            // This ensures we have a valid customer before proceeding
            Customer customer = customerRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            System.out.println("Found customer: " + customer.getCustomerName());
            System.out.println("Customer email: " + customer.getEmail());
            System.out.println("Customer current password hash: " + customer.getPassword().substring(0, Math.min(customer.getPassword().length(), 20)) + "...");
            
            // Verify current password matches stored hash
            // This is a security check - users must know their current password
            boolean passwordMatches = passwordUtil.matches(request.getCurrentPassword(), customer.getPassword());
            System.out.println("Current password verification: " + (passwordMatches ? "SUCCESS" : "FAILED"));
            
            if (!passwordMatches) {
                System.out.println("Current password verification failed");
                return new PasswordChangeResponse(false, "Current password is incorrect");
            }
            
            // Check if new password matches confirm password
            // This prevents typos when changing passwords
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                System.out.println("Password confirmation mismatch");
                return new PasswordChangeResponse(false, "New password and confirm password do not match");
            }
            
            // Hash the new password for security
            // Never store plain text passwords in the database
            String hashedPassword = passwordUtil.encode(request.getNewPassword());
            System.out.println("New password hashed successfully");
            System.out.println("New password hash: " + hashedPassword.substring(0, Math.min(hashedPassword.length(), 20)) + "...");
            
            // Update the password in database
            // We change the password in the customer object and save it
            customer.setPassword(hashedPassword);
            customerRepository.save(customer);
            
            System.out.println("Password updated successfully in database");
            return new PasswordChangeResponse(true, "Password updated successfully");
            
        } catch (Exception e) {
            // Log error and return failure response
            // This catches any unexpected errors (database issues, validation problems, etc.)
            System.err.println("Error changing password: " + e.getMessage());
            e.printStackTrace(); // Print the full error stack trace for debugging
            return new PasswordChangeResponse(false, "Failed to update password: " + e.getMessage());
        }
    }
}

/**
 * How This Service Fits Into the Application:
 * 
 * 1. User Registration Flow:
 *    - Frontend sends registration data to AuthController.register()
 *    - Controller calls AuthService.register()
 *    - Service validates data, creates customer, saves to database
 *    - Service generates JWT token and returns success response
 *    - Controller sends HTTP response back to frontend
 * 
 * 2. User Login Flow:
 *    - Frontend sends login credentials to AuthController.login()
 *    - Controller calls AuthService.login() or officerLogin()
 *    - Service verifies credentials, checks role, generates JWT token
 *    - Service returns user details and token
 *    - Controller sends HTTP response back to frontend
 * 
 * 3. Password Change Flow:
 *    - Frontend sends password change request to AuthController.changePassword()
 *    - Controller extracts user ID from JWT token
 *    - Controller calls AuthService.changePassword()
 *    - Service verifies current password, hashes new password, updates database
 *    - Service returns success/failure response
 *    - Controller sends HTTP response back to frontend
 * 
 * Security Features Implemented:
 * - Password hashing (never store plain text)
 * - JWT token authentication (secure user identification)
 * - Role-based access control (customers vs officers)
 * - Input validation (check required fields, prevent duplicates)
 * - Secure password change (require current password verification)
 * 
 * This service is the core of the authentication system,
 * ensuring that only authorized users can access the application
 * and that their credentials are stored securely.
 */ 