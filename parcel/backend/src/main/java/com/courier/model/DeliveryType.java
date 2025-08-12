package com.courier.model;

public enum DeliveryType {
    STANDARD("Standard Delivery", 30),
    EXPRESS("Express Delivery", 80),
    SAME_DAY("Same-Day Delivery", 150);
    
    private final String displayName;
    private final int charge;
    
    DeliveryType(String displayName, int charge) {
        this.displayName = displayName;
        this.charge = charge;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public int getCharge() {
        return charge;
    }
} 