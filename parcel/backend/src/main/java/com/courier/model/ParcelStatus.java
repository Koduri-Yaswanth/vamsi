package com.courier.model;

/**
 * Parcel Status Enumeration
 * 
 * This enum defines all possible states that a parcel can be in during its journey
 * from booking to delivery. Each status represents a specific stage in the courier
 * service lifecycle.
 * 
 * Key Concepts:
 * - Enum: A special class that represents a group of constants (like final variables)
 * - Each enum value has a display name for user-friendly representation
 * - Used throughout the application to track parcel progress
 * 
 * Parcel Journey Flow:
 * 1. NEW → SCHEDULED → PICKED_UP → IN_TRANSIT → DELIVERED
 * 2. Can be CANCELLED at any stage
 * 3. ASSIGNED and BOOKED are intermediate states
 */
public enum ParcelStatus {
    
    /**
     * Initial status when a booking is first created
     * Parcel is ready for pickup scheduling
     */
    NEW("New"),
    
    /**
     * Pickup has been scheduled but not yet picked up
     * Customer and courier are notified of pickup time
     */
    SCHEDULED("Scheduled"),
    
    /**
     * Parcel has been collected from the sender
     * Journey from sender to receiver has begun
     */
    PICKED_UP("Picked Up"),
    
    /**
     * Parcel has been assigned to a delivery agent
     * Agent is responsible for delivery to receiver
     */
    ASSIGNED("Assigned"),
    
    /**
     * Parcel is confirmed and ready for processing
     * All details verified and payment confirmed
     */
    BOOKED("Booked"),
    
    /**
     * Parcel is being transported between locations
     * Could be in warehouse, transit center, or delivery vehicle
     */
    IN_TRANSIT("In Transit"),
    
    /**
     * Parcel has been successfully delivered to receiver
     * Final status - journey completed
     */
    DELIVERED("Delivered"),
    
    /**
     * Booking has been cancelled by customer or system
     * No further processing will occur
     */
    CANCELLED("Cancelled");
    
    /**
     * User-friendly display name for the status
     * Used in UI to show readable status to customers
     */
    private final String displayName;
    
    /**
     * Constructor for enum values
     * Each status is created with a display name
     * 
     * @param displayName The human-readable name for this status
     */
    ParcelStatus(String displayName) {
        this.displayName = displayName;
    }
    
    /**
     * Get the user-friendly display name for this status
     * 
     * @return String representation suitable for UI display
     */
    public String getDisplayName() {
        return displayName;
    }
} 