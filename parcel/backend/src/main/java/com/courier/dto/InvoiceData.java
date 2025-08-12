package com.courier.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InvoiceData {
    private String bookingId;
    private String paymentId;
    private String transactionId;
    private String invoiceNumber;
    private String receiverName;
    private String receiverAddress;
    private String receiverMobile;
    private String receiverPin;
    private Integer parcelWeight;
    private String parcelContents;
    private String deliveryType;
    private String packingPreference;
    private LocalDateTime pickupTime;
    private LocalDateTime dropoffTime;
    private BigDecimal serviceCost;
    private LocalDateTime paymentTime;

    public InvoiceData() {}

    public InvoiceData(String bookingId, String paymentId, String transactionId, String invoiceNumber,
                      String receiverName, String receiverAddress, String receiverMobile,
                       Integer parcelWeight, String parcelContents, String deliveryType, String packingPreference,
                      LocalDateTime pickupTime, LocalDateTime dropoffTime, BigDecimal serviceCost, LocalDateTime paymentTime) {
        this.bookingId = bookingId;
        this.paymentId = paymentId;
        this.transactionId = transactionId;
        this.invoiceNumber = invoiceNumber;
        this.receiverName = receiverName;
        this.receiverAddress = receiverAddress;
        this.receiverMobile = receiverMobile;
        this.receiverPin = null;
        this.parcelWeight = parcelWeight;
        this.parcelContents = parcelContents;
        this.deliveryType = deliveryType;
        this.packingPreference = packingPreference;
        this.pickupTime = pickupTime;
        this.dropoffTime = dropoffTime;
        this.serviceCost = serviceCost;
        this.paymentTime = paymentTime;
    }

    // Getters and Setters
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    
    public String getReceiverAddress() { return receiverAddress; }
    public void setReceiverAddress(String receiverAddress) { this.receiverAddress = receiverAddress; }
    
    public String getReceiverMobile() { return receiverMobile; }
    public void setReceiverMobile(String receiverMobile) { this.receiverMobile = receiverMobile; }

    public String getReceiverPin() { return receiverPin; }
    public void setReceiverPin(String receiverPin) { this.receiverPin = receiverPin; }
    
    public Integer getParcelWeight() { return parcelWeight; }
    public void setParcelWeight(Integer parcelWeight) { this.parcelWeight = parcelWeight; }
    
    public String getParcelContents() { return parcelContents; }
    public void setParcelContents(String parcelContents) { this.parcelContents = parcelContents; }
    
    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    
    public String getPackingPreference() { return packingPreference; }
    public void setPackingPreference(String packingPreference) { this.packingPreference = packingPreference; }
    
    public LocalDateTime getPickupTime() { return pickupTime; }
    public void setPickupTime(LocalDateTime pickupTime) { this.pickupTime = pickupTime; }
    
    public LocalDateTime getDropoffTime() { return dropoffTime; }
    public void setDropoffTime(LocalDateTime dropoffTime) { this.dropoffTime = dropoffTime; }
    
    public BigDecimal getServiceCost() { return serviceCost; }
    public void setServiceCost(BigDecimal serviceCost) { this.serviceCost = serviceCost; }
    
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }
} 