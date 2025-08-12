package com.courier.util;

import com.courier.model.DeliveryType;
import com.courier.model.PackingPreference;

public class CostCalculator {
    
    private static final double BASE_RATE = 50.0;
    private static final double WEIGHT_CHARGE_PER_GRAM = 0.02;
    private static final double TAX_RATE = 0.05;
    private static final double ADMIN_FEE = 50.0;
    
    public static double calculateServiceCost(int weightInGrams, DeliveryType deliveryType, 
                                           PackingPreference packingPreference, boolean isOfficerBooking) {
        
        // Calculate weight charge
        double weightCharge = weightInGrams * WEIGHT_CHARGE_PER_GRAM;
        
        // Get delivery charge based on delivery type
        double deliveryCharge = getDeliveryCharge(deliveryType);
        
        // Get packing charge based on packing preference
        double packingCharge = getPackingCharge(packingPreference);
        
        // Calculate subtotal
        double subtotal = BASE_RATE + weightCharge + deliveryCharge + packingCharge;
        
        // Add admin fee for officer bookings
        if (isOfficerBooking) {
            subtotal += ADMIN_FEE;
        }
        
        // Apply tax
        double totalCost = subtotal * (1 + TAX_RATE);
        
        return Math.round(totalCost * 100.0) / 100.0; // Round to 2 decimal places
    }
    
    private static double getDeliveryCharge(DeliveryType deliveryType) {
        switch (deliveryType) {
            case STANDARD:
                return 30.0;
            case EXPRESS:
                return 80.0;
            case SAME_DAY:
                return 150.0;
            default:
                return 30.0;
        }
    }
    
    private static double getPackingCharge(PackingPreference packingPreference) {
        switch (packingPreference) {
            case BASIC:
                return 10.0;
            case PREMIUM:
                return 20.0;
            default:
                return 10.0;
        }
    }
} 