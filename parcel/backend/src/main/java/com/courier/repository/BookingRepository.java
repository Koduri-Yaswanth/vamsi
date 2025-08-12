package com.courier.repository;

// Import the Booking model class (the data structure we're working with)
import com.courier.model.Booking;

// Import Spring Data classes for pagination and advanced querying
import org.springframework.data.domain.Page; // Represents a page of results (like a page in a book)
import org.springframework.data.domain.Pageable; // Contains pagination information (page number, size, sorting)
import org.springframework.data.jpa.repository.JpaRepository; // Base interface for database operations
import org.springframework.data.jpa.repository.Query; // Annotation for custom SQL queries
import org.springframework.data.repository.query.Param; // Annotation for query parameters
import org.springframework.stereotype.Repository; // Annotation that marks this as a repository component

// Import Java utilities for collections
import java.util.List; // A collection that can hold multiple items
import java.util.Optional; // A container that might hold a value or be empty

/**
 * Booking Repository Interface
 * 
 * What This Interface Does:
 * This interface defines how our application interacts with the booking database.
 * It handles all database operations related to courier bookings - creating, finding,
 * updating, and deleting booking records.
 * 
 * What is a Booking?
 * A booking represents a courier service request, including:
 * - Sender and receiver information
 * - Parcel details (weight, contents, packaging preferences)
 * - Pickup and delivery dates/times
 * - Cost calculations
 * - Current status (pending, in transit, delivered, etc.)
 * - Payment information
 * 
 * What is Pagination?
 * - Pagination is like dividing a long list into pages (like a book)
 * - Instead of loading all 1000 bookings at once, we load 20 at a time
 * - This improves performance and user experience
 * - Pageable contains: page number (which page), page size (how many items per page), sorting
 * 
 * Database Table: This repository works with a "booking" table that stores:
 * - Booking ID (unique identifier like "BK001")
 * - Customer information (who made the booking)
 * - Receiver details (who will receive the parcel)
 * - Parcel information (weight, contents, packaging)
 * - Pickup and delivery details
 * - Status tracking
 * - Cost and payment information
 * - Timestamps (when created, updated, etc.)
 */
@Repository // Tells Spring: "This is a repository component - manage it for me"
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Find a booking by its unique booking ID
     * 
     * What This Method Does:
     * Searches the database for a specific booking using its booking ID.
     * Used for tracking parcels, viewing booking details, and processing payments.
     * 
     * How Spring Generates SQL:
     * Method name "findByBookingId" becomes: "SELECT * FROM booking WHERE booking_id = ?"
     * 
     * @param bookingId The unique booking identifier (e.g., "BK001", "BK002")
     * @return Optional<Booking> - contains the booking if found, or empty if not found
     */
    Optional<Booking> findByBookingId(String bookingId);
    
    /**
     * Find all bookings for a specific customer, ordered by creation date (newest first)
     * 
     * What This Method Does:
     * Retrieves all bookings made by a particular customer.
     * Used for customer dashboards, order history, and account management.
     * 
     * How Spring Generates SQL:
     * Method name "findByCustomerIdOrderByCreatedAtDesc" becomes:
     * "SELECT * FROM booking WHERE customer_id = ? ORDER BY created_at DESC"
     * 
     * @param customerId The ID of the customer whose bookings we want to find
     * @return List<Booking> - all bookings for this customer, newest first
     */
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    
    /**
     * Find all bookings for a specific customer with pagination support
     * 
     * What This Method Does:
     * Same as above, but returns results in pages instead of all at once.
     * This is useful when a customer has many bookings - we can show them 10 at a time.
     * 
     * How Spring Generates SQL:
     * Method name "findByCustomerIdOrderByCreatedAtDesc" becomes:
     * "SELECT * FROM booking WHERE customer_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
     * 
     * @param customerId The ID of the customer whose bookings we want to find
     * @param pageable Contains pagination information (page number, size, sorting)
     * @return Page<Booking> - a page of results with metadata (total pages, total elements, etc.)
     */
    Page<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
    
    /**
     * Find all bookings in the system with pagination support
     * 
     * What This Method Does:
     * Retrieves all bookings from all customers, ordered by creation date.
     * Used by officers to view all bookings in the system.
     * 
     * How Spring Generates SQL:
     * Method name "findAllByOrderByCreatedAtDesc" becomes:
     * "SELECT * FROM booking ORDER BY created_at DESC LIMIT ? OFFSET ?"
     * 
     * @param pageable Contains pagination information (page number, size, sorting)
     * @return Page<Booking> - a page of results with metadata
     */
    Page<Booking> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * Find bookings for a customer with advanced filtering and pagination
     * 
     * What This Method Does:
     * This is a custom query that allows searching for bookings with multiple filters:
     * - By customer ID (required)
     * - By booking ID (optional - partial match)
     * - By status (optional - exact match)
     * Results are always ordered by creation date (newest first)
     * 
     * This method is used for advanced search functionality in customer dashboards.
     * 
     * Custom Query Explanation:
     * - "SELECT b FROM Booking b" - Select from the Booking entity
     * - "WHERE b.customer.id = :customerId" - Must match the specified customer
     * - "AND (:bookingId IS NULL OR b.bookingId LIKE %:bookingId%)" - Optional booking ID filter
     *   (if bookingId is null, ignore this filter; if not null, find partial matches)
     * - "AND (:status IS NULL OR b.parcelStatus = :status)" - Optional status filter
     *   (if status is null, ignore this filter; if not null, find exact matches)
     * - "ORDER BY b.createdAt DESC" - Sort by creation date, newest first
     * 
     * @param customerId The ID of the customer (required filter)
     * @param bookingId The booking ID to search for (optional - can be null)
     * @param status The parcel status to filter by (optional - can be null)
     * @param pageable Contains pagination information (page number, size, sorting)
     * @return Page<Booking> - filtered and paginated results
     */
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId " +
           "AND (:bookingId IS NULL OR b.bookingId LIKE %:bookingId%) " +
           "AND (:status IS NULL OR b.parcelStatus = :status) " +
           "ORDER BY b.createdAt DESC")
    Page<Booking> findByCustomerIdAndFilters(
        @Param("customerId") Long customerId,
        @Param("bookingId") String bookingId,
        @Param("status") String status,
        Pageable pageable
    );
}

/**
 * How This Repository Fits Into the Application:
 * 
 * 1. Data Access Layer:
 *    - Controllers call services, services call repositories
 *    - This repository handles all booking-related database operations
 *    - It provides a clean interface for finding, creating, and updating bookings
 * 
 * 2. Pagination Benefits:
 *    - Improves performance when dealing with large datasets
 *    - Better user experience (faster loading, easier navigation)
 *    - Reduces memory usage on both server and client
 *    - Allows for infinite scrolling or page-by-page navigation
 * 
 * 3. Automatic SQL Generation:
 *    - Most methods use Spring Data JPA naming conventions
 *    - findByCustomerIdOrderByCreatedAtDesc → "SELECT * FROM booking WHERE customer_id = ? ORDER BY created_at DESC"
 *    - No need to write SQL manually for common operations
 * 
 * 4. Custom Queries:
 *    - The @Query annotation allows for complex, custom SQL when needed
 *    - Useful for advanced filtering, complex joins, or performance optimization
 *    - Parameters are safely bound to prevent SQL injection attacks
 * 
 * 5. Integration with Services:
 *    - BookingService uses this repository for all booking operations
 *    - CustomerService uses it to find customer-specific bookings
 *    - Officer services use it to view and manage all bookings
 * 
 * 6. Common Use Cases:
 *    - Customer viewing their booking history
 *    - Officers managing all bookings in the system
 *    - Tracking specific parcels by booking ID
 *    - Filtering bookings by status (pending, in transit, delivered)
 *    - Paginated results for better performance
 * 
 * This repository is essential for the booking management system, providing efficient
 * data access with built-in pagination and flexible filtering capabilities.
 */ 