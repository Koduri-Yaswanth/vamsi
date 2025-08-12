package com.courier.dto;

import com.courier.model.UserRole;

public class AuthResponse {
    private String token;
    private String message;
    private Long userId;
    private Long id; // Added to match frontend expectations
    private String customerName;
    private String email;
    private UserRole role;
    private boolean success;
    private String uniqueId;
    private String countryCode;
    private String mobileNumber;
    private String address;
    private String getUpdatesVia;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String message, Long userId, String customerName, String email, UserRole role, boolean success) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.id = userId; // Set id to same as userId for frontend compatibility
        this.customerName = customerName;
        this.email = email;
        this.role = role;
        this.success = success;
    }

    public AuthResponse(boolean success, String message, String token, Long userId, String customerName, 
                   String email, String countryCode, String mobileNumber, String address, String role, String uniqueId) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.id = userId; // Set id to same as userId for frontend compatibility
        this.customerName = customerName;
        this.email = email;
        this.countryCode = countryCode;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.role = UserRole.valueOf(role);
        this.uniqueId = uniqueId;
    }
    
    public AuthResponse(boolean success, String message, String token, Long userId, String customerName, 
                   String email, String countryCode, String mobileNumber, String address, String role, String uniqueId, String getUpdatesVia) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.id = userId; // Set id to same as userId for frontend compatibility
        this.customerName = customerName;
        this.email = email;
        this.countryCode = countryCode;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.role = UserRole.valueOf(role);
        this.uniqueId = uniqueId;
        this.getUpdatesVia = getUpdatesVia;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
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
    
    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGetUpdatesVia() {
        return getUpdatesVia;
    }

    public void setGetUpdatesVia(String getUpdatesVia) {
        this.getUpdatesVia = getUpdatesVia;
    }
} 