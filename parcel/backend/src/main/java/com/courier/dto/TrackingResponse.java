package com.courier.dto;

import com.courier.model.Booking;

public class TrackingResponse {
    private boolean success;
    private String message;
    private Booking booking;

    public TrackingResponse() {}

    public TrackingResponse(boolean success, String message, Booking booking) {
        this.success = success;
        this.message = message;
        this.booking = booking;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
} 