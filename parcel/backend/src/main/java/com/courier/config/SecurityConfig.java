package com.courier.config;

// Import Spring Security classes for configuring application security
import org.springframework.context.annotation.Bean; // Annotation to create Spring-managed objects
import org.springframework.context.annotation.Configuration; // Marks this class as a configuration class
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // HTTP security configuration
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Enables web security
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Password hashing algorithm
import org.springframework.security.crypto.password.PasswordEncoder; // Interface for password encoding
import org.springframework.security.web.SecurityFilterChain; // Security filter chain configuration

/**
 * Security Configuration Class
 * 
 * What This Class Does:
 * This class configures the security settings for our Courier Management System.
 * It's like setting up the "security checkpoints" and "access rules" for our application.
 * 
 * Key Responsibilities:
 * 1. Configure which URLs are accessible to which users
 * 2. Set up password encryption (hashing) for security
 * 3. Configure CORS (Cross-Origin Resource Sharing) for frontend communication
 * 4. Set up security filters that run before each request
 * 
 * What is Spring Security?
 * - Spring Security is a framework that provides authentication, authorization, and security features
 * - It acts like a "security guard" that checks every request to your application
 * - It can require users to log in, check their permissions, and protect sensitive data
 * - It's highly configurable and can integrate with databases, LDAP, OAuth, etc.
 * 
 * Security Concepts:
 * - Authentication: "Who are you?" (username/password, JWT tokens)
 * - Authorization: "What are you allowed to do?" (roles, permissions)
 * - Encryption: Converting sensitive data (like passwords) into unreadable format
 * - CORS: Allowing web browsers to make requests from different domains
 */

@Configuration // Tells Spring: "This class contains configuration settings"
@EnableWebSecurity // Tells Spring: "Enable web security features for this application"
public class SecurityConfig {

    /**
     * Security Filter Chain Configuration
     * 
     * What This Method Does:
     * This method configures the security rules for our application.
     * It's like setting up the "security policy" that determines who can access what.
     * 
     * Security Settings Explained:
     * - CSRF Disabled: Cross-Site Request Forgery protection is turned off (common for REST APIs)
     * - CORS Enabled: Allows our Angular frontend to communicate with this backend
     * - All Requests Permitted: Currently allows anyone to access any endpoint (for development)
     * 
     * @param http HttpSecurity object that we configure with our security rules
     * @return SecurityFilterChain that Spring will use to secure our application
     * @throws Exception if security configuration fails
     */
    @Bean // Tells Spring: "Create an instance of this object and manage it for me"
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection (Cross-Site Request Forgery)
            // CSRF is a security feature that prevents malicious websites from making requests on behalf of users
            // We disable it because we're building a REST API that will be used by our Angular frontend
            .csrf(csrf -> csrf.disable())
            
            // Enable CORS (Cross-Origin Resource Sharing)
            // CORS allows web browsers to make requests from one domain (localhost:4200) to another (localhost:8080)
            // Without this, our Angular frontend couldn't communicate with our Spring Boot backend
            .cors(cors -> cors.and())
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Currently allow all requests (anyRequest().permitAll())
                // This means anyone can access any endpoint without authentication
                // In production, you would restrict access based on user roles and permissions
                .anyRequest().permitAll()
            );

        // Build and return the security configuration
        return http.build();
    }

    /**
     * Password Encoder Bean
     * 
     * What This Method Does:
     * This method creates a password encoder that Spring will use to hash passwords.
     * It's like providing a "password encryption machine" for the application.
     * 
     * Why Do We Hash Passwords?
     * - Security: If someone steals our database, they can't see the actual passwords
     * - Hashing is one-way: You can't reverse a hash to get the original password
     * - Verification: When users log in, we hash their input and compare it to the stored hash
     * 
     * What is BCrypt?
     * - BCrypt is a strong password hashing algorithm
     * - It automatically adds "salt" (random data) to make hashes more secure
     * - It's designed to be slow, making brute-force attacks harder
     * - It's the industry standard for password hashing
     * 
     * @return BCryptPasswordEncoder that Spring will use to hash and verify passwords
     */
    @Bean // Tells Spring: "Create an instance of BCryptPasswordEncoder and manage it for me"
    public PasswordEncoder passwordEncoder() {
        // Create and return a new BCrypt password encoder
        // Spring will automatically inject this wherever PasswordEncoder is needed
        return new BCryptPasswordEncoder();
    }
}

/**
 * How This Security Configuration Fits Into the Application:
 * 
 * 1. Application Startup:
 *    - Spring Boot starts and loads this configuration class
 *    - Spring creates the SecurityFilterChain and PasswordEncoder beans
 *    - Security filters are set up to intercept all HTTP requests
 * 
 * 2. Request Processing:
 *    - When a request comes in (e.g., POST /api/auth/login)
 *    - Security filters check the request against our security rules
 *    - If allowed, the request proceeds to the controller
 *    - If blocked, an error response is returned
 * 
 * 3. Password Security:
 *    - When users register, passwords are hashed using BCrypt
 *    - When users login, their input is hashed and compared to stored hash
 *    - This ensures passwords are never stored in plain text
 * 
 * 4. Frontend Communication:
 *    - CORS is enabled so Angular can make API calls
 *    - CSRF is disabled because we're using JWT tokens for authentication
 *    - All endpoints are currently open (development mode)
 * 
 * Current Security Status:
 * - ✅ Password hashing (secure)
 * - ✅ CORS enabled (frontend can communicate)
 * - ✅ CSRF disabled (REST API friendly)
 * - ⚠️ All endpoints open (no authentication required - development only)
 * 
 * Production Security Considerations:
 * - Restrict access to endpoints based on user roles
 * - Enable CSRF protection if needed
 * - Add rate limiting to prevent abuse
 * - Use HTTPS in production
 * - Implement proper session management
 */ 