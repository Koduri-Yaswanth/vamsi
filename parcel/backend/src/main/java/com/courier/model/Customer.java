package com.courier.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Customer Entity Class
 * 
 * This class represents a customer in our courier management system.
 * It maps to the "customers" table in the database and contains all customer
 * information including personal details, contact information, and account settings.
 * 
 * Key Concepts:
 * - @Entity: Marks this class as a JPA entity that maps to a database table
 * - @Table: Specifies the database table name
 * - @Id: Marks a field as the primary key
 * - @GeneratedValue: Automatically generates values for the primary key
 * - @Column: Maps a field to a database column with specific properties
 * - @PrePersist: Method called before an entity is saved for the first time
 * - @PreUpdate: Method called before an entity is updated
 * - Validation annotations: @NotBlank, @Email, @Pattern, @Size for data validation
 */
@Entity
@Table(name = "customers")
public class Customer {
    
    /**
     * Primary Key - Unique identifier for each customer
     * Generated automatically by the database (auto-increment)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Full name of the customer
     * Required field with maximum length validation
     */
    @NotBlank(message = "Customer name is required")
    @Size(max = 50, message = "Customer name cannot exceed 50 characters")
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    /**
     * Email address of the customer (used for login)
     * Must be unique across all customers
     * Validated for proper email format
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(unique = true, nullable = false)
    private String email;
    
    /**
     * Mobile number of the customer
     * Must be 10 digits starting with 6-9 (Indian mobile format)
     * Used for SMS notifications and delivery coordination
     */
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be 10 digits starting with 6-9")
    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;
    
    /**
     * Country code for the mobile number (e.g., +91 for India)
     * Required for international communication
     */
    @NotBlank(message = "Country code is required")
    @Column(name = "country_code", nullable = false)
    private String countryCode;
    
    /**
     * Complete address of the customer
     * Minimum 10 characters required for proper address details
     */
    @NotBlank(message = "Address is required")
    @Size(min = 10, message = "Address must be at least 10 characters")
    @Column(nullable = false)
    private String address;
    
    /**
     * Encrypted password for customer authentication
     * Stored as hashed value for security
     */
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    /**
     * When this customer account was created
     * Automatically set when customer is saved
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /**
     * When this customer record was last updated
     * Automatically updated on every save/update
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Customer preferences stored as JSON string
     * Can include delivery preferences, notification settings, etc.
     */
    @Column(name = "preferences")
    private String preferences;
    
    /**
     * How the customer wants to receive updates
     * Options: EMAIL, SMS, BOTH, NONE
     */
    @NotBlank(message = "Get updates preference is required")
    @Column(name = "get_updates_via", nullable = false)
    private String getUpdatesVia;
    
    /**
     * Role of the user in the system
     * Default is CUSTOMER, can also be OFFICER
     * Used for authorization and access control
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role = UserRole.CUSTOMER;
    
    /**
     * Unique identifier for customer reference
     * Format: "CUST" + timestamp + random suffix
     */
    @Column(name = "unique_id", unique = true)
    private String uniqueId;
    
    /**
     * Default constructor
     * Initializes timestamps when customer object is created
     */
    public Customer() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    // These methods allow other classes to access and modify the private fields
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMobileNumber() {
        return mobileNumber;
    }
    
    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
    
    public String getCountryCode() {
        return countryCode;
    }
    
    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getPreferences() {
        return preferences;
    }
    
    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }
    
    public String getGetUpdatesVia() {
        return getUpdatesVia;
    }
    
    public void setGetUpdatesVia(String getUpdatesVia) {
        this.getUpdatesVia = getUpdatesVia;
    }
    
    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }
    
    public String getUniqueId() {
        return uniqueId;
    }
    
    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }
    
    /**
     * JPA lifecycle method called before an entity is saved for the first time
     * Generates unique ID and sets timestamps
     */
    @PrePersist
    protected void onCreate() {
        if (getId() == null) {
            // Generate unique ID based on role
            String prefix = this.role == UserRole.CUSTOMER ? "CUST" : "OFF";
            String timestamp = String.valueOf(System.currentTimeMillis());
            String randomSuffix = String.valueOf((int)(Math.random() * 1000));
            String uniqueId = prefix + timestamp.substring(timestamp.length() - 6) + randomSuffix;
            
            // Set the generated ID
            this.setId(Long.parseLong(timestamp + randomSuffix));
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * JPA lifecycle method called before an entity is updated
     * Automatically updates the updatedAt timestamp
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 