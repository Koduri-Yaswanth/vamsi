package com.courier.service;

import com.courier.dto.FeedbackRequest;
import com.courier.model.Customer;
import com.courier.model.Booking;
import com.courier.model.Feedback;
import com.courier.model.ParcelStatus;
import com.courier.repository.FeedbackRepository;
import com.courier.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    public Feedback addFeedback(Customer customer, Booking booking, FeedbackRequest request) {
        // Check if feedback already exists for this booking
        List<Feedback> existingFeedback = feedbackRepository.findByBookingId(booking.getId());
        if (!existingFeedback.isEmpty()) {
            throw new RuntimeException("Feedback already exists for this booking");
        }

        Feedback feedback = new Feedback();
        feedback.setCustomer(customer);
        feedback.setBooking(booking);
        feedback.setFeedbackDescription(request.getDescription());
        feedback.setRating(request.getRating());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllDeliveredFeedback() {
        try {
            System.out.println("=== getAllDeliveredFeedback Debug ===");
            List<Feedback> allFeedbacks = feedbackRepository.findAll();
            System.out.println("Total feedback found: " + allFeedbacks.size());
            
            // Debug each feedback entry
            for (int i = 0; i < allFeedbacks.size(); i++) {
                Feedback f = allFeedbacks.get(i);
                System.out.println("Feedback " + i + ": ID=" + f.getId() + 
                                 ", Customer=" + (f.getCustomer() != null ? f.getCustomer().getCustomerName() : "NULL") +
                                 ", Booking=" + (f.getBooking() != null ? f.getBooking().getBookingId() : "NULL") +
                                 ", Rating=" + f.getRating());
            }
            
            return allFeedbacks;
        } catch (Exception e) {
            System.out.println("Error in getAllDeliveredFeedback: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve all feedback", e);
        }
    }

    public List<Feedback> getAllDeliveredFeedbackPaginated(Pageable pageable) {
        Page<Feedback> feedbackPage = feedbackRepository.findAll(pageable);
        return feedbackPage.getContent();
    }
    
    /**
     * Get all feedback for delivered parcels with customer and booking details
     * This method is specifically for officers to view customer feedback
     */
    public List<Feedback> getOfficerFeedback() {
        return feedbackRepository.findAllWithCustomerAndBooking();
    }
    
    /**
     * Get paginated feedback for officers with filtering options
     */
    public Page<Feedback> getOfficerFeedbackPaginated(Pageable pageable, String filter) {
        try {
            System.out.println("=== getOfficerFeedbackPaginated Debug ===");
            System.out.println("Page: " + pageable.getPageNumber() + ", Size: " + pageable.getPageSize());
            System.out.println("Filter: " + (filter != null ? filter : "null"));
            
            if (filter != null && !filter.trim().isEmpty()) {
                String trimmedFilter = filter.trim();
                System.out.println("Using filter: " + trimmedFilter);
                
                // Try to find by customer name first
                Page<Feedback> customerResults = feedbackRepository.findByCustomerNameContainingIgnoreCase(trimmedFilter, pageable);
                System.out.println("Customer search results: " + customerResults.getTotalElements());
                if (customerResults.hasContent()) {
                    return customerResults;
                }
                
                // Try to find by booking ID
                Page<Feedback> bookingResults = feedbackRepository.findByBookingIdContainingIgnoreCase(trimmedFilter, pageable);
                System.out.println("Booking search results: " + bookingResults.getTotalElements());
                if (bookingResults.hasContent()) {
                    return bookingResults;
                }
                
                // Try to find by description
                Page<Feedback> descriptionResults = feedbackRepository.findByFeedbackDescriptionContainingIgnoreCase(trimmedFilter, pageable);
                System.out.println("Description search results: " + descriptionResults.getTotalElements());
                if (descriptionResults.hasContent()) {
                    return descriptionResults;
                }
                
                // If no results found with any filter, return empty page
                System.out.println("No results found with filter, returning empty page");
                return feedbackRepository.findAll(PageRequest.of(0, pageable.getPageSize()));
            } else {
                // No filter, return all feedback
                System.out.println("No filter, returning all feedback");
                Page<Feedback> allResults = feedbackRepository.findAll(pageable);
                System.out.println("Total feedback found: " + allResults.getTotalElements());
                return allResults;
            }
        } catch (Exception e) {
            System.out.println("Error in getOfficerFeedbackPaginated: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve feedback data", e);
        }
    }
    
    /**
     * Get feedback statistics for officers
     */
    public java.util.Map<String, Object> getFeedbackStatistics() {
        try {
            long totalFeedbacks = feedbackRepository.count();
            Double averageRating = feedbackRepository.getAverageRating();
            long fiveStarFeedbacks = feedbackRepository.countByRating(5);
            long fourStarFeedbacks = feedbackRepository.countByRating(4);
            long threeStarFeedbacks = feedbackRepository.countByRating(3);
            long twoStarFeedbacks = feedbackRepository.countByRating(2);
            long oneStarFeedbacks = feedbackRepository.countByRating(1);
            
            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalFeedbacks", totalFeedbacks);
            stats.put("averageRating", averageRating != null ? averageRating : 0.0);
            stats.put("fiveStarFeedbacks", fiveStarFeedbacks);
            stats.put("fourStarFeedbacks", fourStarFeedbacks);
            stats.put("threeStarFeedbacks", threeStarFeedbacks);
            stats.put("twoStarFeedbacks", twoStarFeedbacks);
            stats.put("oneStarFeedbacks", oneStarFeedbacks);
            
            return stats;
        } catch (Exception e) {
            System.out.println("Error getting feedback statistics: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve feedback statistics", e);
        }
    }

    /**
     * Get total count of feedback records
     */
    public long getFeedbackCount() {
        try {
            long count = feedbackRepository.count();
            System.out.println("Feedback count retrieved: " + count);
            return count;
        } catch (Exception e) {
            System.out.println("Error getting feedback count: " + e.getMessage());
            e.printStackTrace();
            return 0;
        }
    }
} 