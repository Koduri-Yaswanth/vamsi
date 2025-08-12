package com.courier.util;

// Import classes for JWT (JSON Web Token) operations
import com.courier.model.UserRole; // Enum defining user roles (CUSTOMER, OFFICER)
import io.jsonwebtoken.Claims; // JWT claims (data stored in the token)
import io.jsonwebtoken.Jwts; // Main JWT builder and parser
import io.jsonwebtoken.SignatureAlgorithm; // Algorithm used to sign the token (HS256)
import io.jsonwebtoken.security.Keys; // Utility for creating secret keys
import org.springframework.beans.factory.annotation.Value; // Annotation to inject values from properties file
import org.springframework.security.core.userdetails.UserDetails; // Spring Security user interface
import org.springframework.stereotype.Component; // Marks this class as a Spring component

// Import Java classes for cryptography and data handling
import javax.crypto.SecretKey; // Interface for cryptographic keys
import java.util.Date; // Java date class for timestamps
import java.util.HashMap; // Map to store JWT claims
import java.util.Map; // Interface for key-value pairs
import java.util.function.Function; // Functional interface for operations on claims

/**
 * JWT Utility Class
 * 
 * What This Class Does:
 * This class handles all JWT (JSON Web Token) operations for our Courier Management System.
 * It's like a "passport office" that creates, validates, and reads secure identity tokens.
 * 
 * What is a JWT?
 * - JWT stands for JSON Web Token
 * - It's a secure way to transmit information between parties
 * - Think of it like a digital passport that proves who you are
 * - It contains encoded information about the user (email, role, user ID)
 * - It's signed with a secret key to prevent tampering
 * - It has an expiration time for security
 * 
 * How JWT Authentication Works:
 * 1. User logs in with email/password
 * 2. If credentials are correct, we create a JWT token
 * 3. We send this token back to the user
 * 4. User includes this token in future requests
 * 5. We validate the token to identify the user
 * 6. If valid, we allow the request; if not, we reject it
 * 
 * JWT Structure (Header.Payload.Signature):
 * - Header: Contains algorithm and token type
 * - Payload: Contains user data (claims) like email, role, user ID
 * - Signature: Ensures the token hasn't been tampered with
 * 
 * Security Features:
 * - Signed with a secret key (only our server can create valid tokens)
 * - Has expiration time (tokens become invalid after 24 hours)
 * - Contains user role information (for authorization)
 * - Cannot be modified without invalidating the signature
 */

@Component // Tells Spring: "This class is a component - create and manage an instance"
public class JwtUtil {

    /**
     * Secret key for signing JWT tokens
     * 
     * This value comes from the application.properties file
     * It's like a "master password" that only our server knows
     * 
     * @Value("${jwt.secret}") tells Spring to inject the value from properties
     * Example in application.properties: jwt.secret=mySuperSecretKey123
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Creates a cryptographic key for signing JWT tokens
     * 
     * What This Method Does:
     * - Converts our secret string into a cryptographic key
     * - Uses HMAC-SHA256 algorithm for signing
     * - This key is used to both create and verify tokens
     * 
     * Why HMAC-SHA256?
     * - HMAC (Hash-based Message Authentication Code) provides integrity and authenticity
     * - SHA256 is a strong cryptographic hash function
     * - It's fast and secure for JWT signing
     * 
     * @return SecretKey that will be used to sign and verify JWT tokens
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Extracts the email (subject) from a JWT token
     * 
     * The "subject" of a JWT is typically the user's email address
     * This is the primary identifier for the user
     * 
     * @param token The JWT token to extract email from
     * @return The email address stored in the token
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the username from a JWT token
     * 
     * In our system, username and email are the same
     * This method provides compatibility with Spring Security
     * 
     * @param token The JWT token to extract username from
     * @return The username (email) stored in the token
     */
    public String extractUsername(String token) {
        return extractEmail(token);
    }

    /**
     * Extracts the expiration date from a JWT token
     * 
     * This tells us when the token becomes invalid
     * We use this to check if a token has expired
     * 
     * @param token The JWT token to extract expiration from
     * @return The date when the token expires
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic method to extract any claim from a JWT token
     * 
     * Claims are pieces of information stored in the JWT
     * Examples: email, role, user ID, expiration date
     * 
     * @param token The JWT token to extract claims from
     * @param claimsResolver Function that specifies which claim to extract
     * @return The extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a JWT token
     * 
     * This method parses the JWT and returns all the data stored in it
     * It's the core method that reads the token content
     * 
     * @param token The JWT token to parse
     * @return Claims object containing all token data
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Use our secret key to verify the token
                .build()
                .parseClaimsJws(token) // Parse the JWT and verify its signature
                .getBody(); // Return the claims (payload) from the token
    }

    /**
     * Checks if a JWT token has expired
     * 
     * This is a security check - expired tokens should be rejected
     * 
     * @param token The JWT token to check
     * @return true if token is expired, false if still valid
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates a JWT token for a Spring Security user
     * 
     * This method is used when we have a UserDetails object from Spring Security
     * It creates a basic token with just the username
     * 
     * @param userDetails Spring Security user details object
     * @return JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Generates a JWT token with custom claims
     * 
     * This method creates a token with additional information:
     * - User ID: Unique identifier for the user
     * - Role: User's role (CUSTOMER or OFFICER)
     * - Email: User's email address
     * 
     * @param email User's email address
     * @param userId Unique user identifier
     * @param role User's role (CUSTOMER or OFFICER)
     * @return JWT token string with custom claims
     */
    public String generateToken(String email, Long userId, UserRole role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString()); // Store user ID in token
        claims.put("role", role.name()); // Store user role in token
        return createToken(claims, email);
    }

    /**
     * Generates a JWT token with string role
     * 
     * Alternative method that accepts role as a string
     * Useful when you have the role as a string rather than enum
     * 
     * @param email User's email address
     * @param userId Unique user identifier
     * @param role User's role as a string
     * @return JWT token string with custom claims
     */
    public String generateToken(String email, Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString()); // Store user ID in token
        claims.put("role", role); // Store user role in token
        return createToken(claims, email);
    }

    /**
     * Creates the actual JWT token
     * 
     * This is the core method that builds the JWT token
     * It sets all the claims, timestamps, and signs the token
     * 
     * @param claims Map of custom claims (user ID, role, etc.)
     * @param subject The subject (email) of the token
     * @return Complete JWT token string
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims) // Set custom claims (user ID, role)
                .setSubject(subject) // Set the subject (email)
                .setIssuedAt(new Date(System.currentTimeMillis())) // When token was created
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expires in 24 hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with our secret key using HS256
                .compact(); // Build and return the token
    }

    /**
     * Validates a JWT token against Spring Security user details
     * 
     * This method checks if a token is valid for a specific user
     * It verifies:
     * 1. The token hasn't expired
     * 2. The token belongs to the specified user
     * 
     * @param token JWT token to validate
     * @param userDetails Spring Security user details to validate against
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        System.out.println("=== JwtUtil.validateToken (UserDetails) ===");
        System.out.println("Validating token for user: " + userDetails.getUsername());
        
        try {
            final String email = extractEmail(token); // Get email from token
            final boolean isValid = (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
            // Check: email matches AND token hasn't expired
            System.out.println("Token validation result: " + isValid);
            return isValid;
        } catch (Exception e) {
            System.out.println("Error validating token: " + e.getMessage());
            return false; // If any error occurs, token is invalid
        }
    }

    // New method to validate token with email string
    public Boolean validateToken(String token, String email) {
        System.out.println("=== JwtUtil.validateToken (String) ===");
        System.out.println("Validating token for email: " + email);
        
        try {
            final String extractedEmail = extractEmail(token);
            final boolean isValid = (extractedEmail.equals(email) && !isTokenExpired(token));
            System.out.println("Token validation result: " + isValid);
            return isValid;
        } catch (Exception e) {
            System.out.println("Error validating token: " + e.getMessage());
            return false;
        }
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        String userIdStr = claims.get("userId", String.class);
        return userIdStr != null ? Long.parseLong(userIdStr) : null;
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }
} 