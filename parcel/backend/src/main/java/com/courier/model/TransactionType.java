package com.courier.model;

public enum TransactionType {
    CREDIT("Credit"),
    DEBIT("Debit");
    
    private final String displayName;
    
    TransactionType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 