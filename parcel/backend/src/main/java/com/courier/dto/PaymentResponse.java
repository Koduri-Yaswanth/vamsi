package com.courier.dto;

import com.courier.model.Payment;

public class PaymentResponse {
    private boolean success;
    private String message;
    private Payment payment;

    public PaymentResponse() {}

    public PaymentResponse(boolean success, String message, Payment payment) {
        this.success = success;
        this.message = message;
        this.payment = payment;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
}