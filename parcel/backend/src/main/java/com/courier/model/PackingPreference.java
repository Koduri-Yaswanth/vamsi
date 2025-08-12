package com.courier.model;

public enum PackingPreference {
    BASIC("Basic Packing", 10),
    PREMIUM("Premium Packing", 20);
    
    private final String displayName;
    private final int charge;
    
    PackingPreference(String displayName, int charge) {
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