package com.courier.dto;

public class InvoiceResponse {
    private boolean success;
    private String message;
    private InvoiceData invoiceData;

    public InvoiceResponse() {}

    public InvoiceResponse(boolean success, String message, InvoiceData invoiceData) {
        this.success = success;
        this.message = message;
        this.invoiceData = invoiceData;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public InvoiceData getInvoiceData() { return invoiceData; }
    public void setInvoiceData(InvoiceData invoiceData) { this.invoiceData = invoiceData; }
}
