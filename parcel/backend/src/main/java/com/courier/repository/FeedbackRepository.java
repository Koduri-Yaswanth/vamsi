package com.courier.repository;

import com.courier.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByBookingId(Long bookingId);
    
    List<Feedback> findByCustomerId(Long customerId);
    
    /**
     * Get all feedback with customer and booking details
     */
    @Query("SELECT f FROM Feedback f JOIN FETCH f.customer c JOIN FETCH f.booking b")
    List<Feedback> findAllWithCustomerAndBooking();
    
    /**
     * Get paginated feedback (using basic JPA method for reliability)
     */
    Page<Feedback> findAll(Pageable pageable);
    
    /**
     * Find feedback by customer name containing (case insensitive)
     */
    @Query("SELECT f FROM Feedback f WHERE LOWER(f.customer.customerName) LIKE LOWER(CONCAT('%', :customerName, '%'))")
    Page<Feedback> findByCustomerNameContainingIgnoreCase(@Param("customerName") String customerName, Pageable pageable);
    
    /**
     * Find feedback by booking ID containing
     */
    @Query("SELECT f FROM Feedback f WHERE LOWER(f.booking.bookingId) LIKE LOWER(CONCAT('%', :bookingId, '%'))")
    Page<Feedback> findByBookingIdContainingIgnoreCase(@Param("bookingId") String bookingId, Pageable pageable);
    
    /**
     * Find feedback by description containing (case insensitive)
     */
    @Query("SELECT f FROM Feedback f WHERE LOWER(f.feedbackDescription) LIKE LOWER(CONCAT('%', :description, '%'))")
    Page<Feedback> findByFeedbackDescriptionContainingIgnoreCase(@Param("description") String description, Pageable pageable);
    
    /**
     * Get average rating across all feedback
     */
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
    
    /**
     * Count feedback by rating
     */
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating = :rating")
    Long countByRating(@Param("rating") int rating);
} 