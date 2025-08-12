package com.courier.service;

// Import DTOs (Data Transfer Objects) for structured data exchange
import com.courier.dto.BookingPage; // Contains paginated booking results with metadata

// Import model classes (the data structures we work with)
import com.courier.model.Booking; // Represents a courier booking

// Import repository interface for database operations
import com.courier.repository.BookingRepository; // Handles all database operations for bookings

// Import Spring framework classes
import org.springframework.beans.factory.annotation.Autowired; // Annotation for dependency injection
import org.springframework.data.domain.Page; // Represents a page of results from database
import org.springframework.data.domain.PageRequest; // Builder for creating pagination requests
import org.springframework.data.domain.Pageable; // Interface containing pagination information
import org.springframework.stereotype.Service; // Annotation that marks this as a service component

// Import Java utilities
import java.util.List; // Collection for holding multiple items
import java.util.ArrayList; // Implementation of List interface

/**
 * Booking Service Class
 * 
 * What This Class Does:
 * This class contains the business logic for managing courier bookings.
 * It acts as a "middleman" between controllers (which handle HTTP requests) and
 * repositories (which handle database operations).
 * 
 * What is a Service Layer?
 * - Services contain the business logic of your application
 * - They handle complex operations that involve multiple steps
 * - They ensure data consistency and business rules
 * - They provide a clean interface for controllers to use
 * 
 * What is Dependency Injection?
 * - @Autowired tells Spring: "Find a BookingRepository and give it to me"
 * - Spring automatically creates and manages the repository object
 * - This makes the code more testable and flexible
 * - You don't need to manually create objects with "new"
 * 
 * How This Service Works:
 * 1. Controllers call service methods when they receive HTTP requests
 * 2. Service methods contain business logic (validation, calculations, etc.)
 * 3. Service methods call repository methods to perform database operations
 * 4. Service methods return results back to controllers
 * 
 * Database Operations This Service Handles:
 * - Creating new bookings
 * - Finding bookings by ID
 * - Updating existing bookings
 * - Retrieving paginated lists of bookings
 * - Exporting booking data
 * - Generating reports
 */
@Service // Tells Spring: "This is a service component - manage it for me"
public class BookingService {

    /**
     * Dependency Injection - Spring automatically provides a BookingRepository instance
     * 
     * What is @Autowired?
     * - This annotation tells Spring to automatically inject (provide) a BookingRepository
     * - Spring looks for a class that implements BookingRepository interface
     * - It creates an instance and gives it to this service
     * - This is called "dependency injection" - Spring manages dependencies for you
     */
    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Create a new booking in the database
     * 
     * What This Method Does:
     * Takes a booking object and saves it to the database.
     * This is typically called when a customer creates a new courier booking.
     * 
     * Flow:
     * 1. Receive booking data from controller
     * 2. Call repository to save to database
     * 3. Return the saved booking (with generated ID and timestamps)
     * 
     * @param booking The booking object to create (contains all booking details)
     * @return The saved booking with database-generated ID and timestamps
     */
    public Booking createBooking(Booking booking) {
        // Save the booking to database and return the saved version
        // The repository.save() method will:
        // - Generate a unique ID if it's a new booking
        // - Set created_at and updated_at timestamps
        // - Return the complete booking object
        return bookingRepository.save(booking);
    }

    /**
     * Find a booking by its unique booking ID
     * 
     * What This Method Does:
     * Searches the database for a specific booking using the booking ID.
     * Used for tracking parcels, viewing booking details, and processing payments.
     * 
     * Error Handling:
     * - If anything goes wrong (database error, invalid ID, etc.), returns null
     * - This prevents the application from crashing due to database issues
     * 
     * @param bookingId The unique booking identifier (e.g., "BK001", "BK002")
     * @return The booking if found, or null if not found or if an error occurs
     */
    public Booking getBookingById(String bookingId) {
        try {
            // Try to find the booking in the database
            // findByBookingId() returns an Optional<Booking>
            // orElse(null) means "return the booking if found, or null if not found"
            return bookingRepository.findByBookingId(bookingId).orElse(null);
        } catch (Exception e) {
            // If any error occurs (database connection issue, invalid data, etc.)
            // return null instead of crashing the application
            return null;
        }
    }

    /**
     * Update an existing booking in the database
     * 
     * What This Method Does:
     * Takes an updated booking object and saves the changes to the database.
     * Used when updating delivery status, pickup times, or other booking details.
     * 
     * Flow:
     * 1. Receive updated booking data from controller
     * 2. Call repository to save changes to database
     * 3. Return the updated booking
     * 
     * @param booking The updated booking object
     * @return The updated booking if successful, or null if an error occurs
     */
    public Booking updateBooking(Booking booking) {
        try {
            // Save the updated booking to database
            // If it's an existing booking (has an ID), it will update the record
            // If it's a new booking (no ID), it will create a new record
            return bookingRepository.save(booking);
        } catch (Exception e) {
            // If any error occurs, return null instead of crashing
            return null;
        }
    }

    /**
     * Get paginated list of bookings for a specific customer
     * 
     * What This Method Does:
     * Retrieves a specific page of bookings for a customer, ordered by creation date.
     * This is used for customer dashboards where you don't want to load all bookings at once.
     * 
     * What is Pagination?
     * - Instead of loading all 1000 bookings, load 20 at a time
     * - Page 0 = first 20 bookings, Page 1 = next 20 bookings, etc.
     * - This improves performance and user experience
     * 
     * @param customerId The ID of the customer whose bookings we want
     * @param page Which page to retrieve (0 = first page, 1 = second page, etc.)
     * @param size How many bookings per page (e.g., 20)
     * @return BookingPage object containing the requested page of results and metadata
     */
    public BookingPage getCustomerBookingsPaginated(Long customerId, int page, int size) {
        // Create a Pageable object that contains pagination information
        // PageRequest.of(page, size) creates pagination request
        // page = which page (0-based), size = how many items per page
        Pageable pageable = PageRequest.of(page, size);
        
        // Get the requested page of bookings from the database
        // The repository method handles the SQL query with LIMIT and OFFSET
        Page<Booking> bookingPage = bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
        
        // Convert the Spring Page object to our custom BookingPage DTO
        // This provides a clean interface for the frontend
        return new BookingPage(
            bookingPage.getContent(),        // List of bookings for this page
            bookingPage.getTotalElements(),  // Total number of bookings for this customer
            bookingPage.getTotalPages(),     // Total number of pages available
            bookingPage.getNumber(),         // Current page number
            bookingPage.getSize()            // Number of items per page
        );
    }

    /**
     * Get paginated list of all bookings in the system
     * 
     * What This Method Does:
     * Retrieves a specific page of all bookings from all customers.
     * This is used by officers to view and manage all bookings in the system.
     * 
     * @param page Which page to retrieve (0 = first page, 1 = second page, etc.)
     * @param size How many bookings per page
     * @return BookingPage object containing the requested page of results and metadata
     */
    public BookingPage getAllBookingsPaginated(int page, int size) {
        // Create pagination request
        Pageable pageable = PageRequest.of(page, size);
        
        // Get the requested page of all bookings from the database
        Page<Booking> bookingPage = bookingRepository.findAllByOrderByCreatedAtDesc(pageable);
        
        // Convert to our custom DTO format
        return new BookingPage(
            bookingPage.getContent(),        // List of bookings for this page
            bookingPage.getTotalElements(),  // Total number of bookings in the system
            bookingPage.getTotalPages(),     // Total number of pages available
            bookingPage.getNumber(),         // Current page number
            bookingPage.getSize()            // Number of items per page
        );
    }

    /**
     * Get all bookings in the system (without pagination)
     * 
     * What This Method Does:
     * Retrieves all bookings from all customers at once.
     * Use this carefully as it can be slow if there are many bookings.
     * 
     * Error Handling:
     * - If database error occurs, returns empty list instead of crashing
     * 
     * @return List of all bookings, or empty list if an error occurs
     */
    public List<Booking> getAllBookings() {
        try {
            // Get all bookings from database
            return bookingRepository.findAll();
        } catch (Exception e) {
            // If error occurs, return empty list instead of crashing
            return new ArrayList<>();
        }
    }

    /**
     * Export customer bookings (placeholder method)
     * 
     * What This Method Does:
     * This is a placeholder method for future implementation.
     * It will export a customer's bookings to a file (Excel, PDF, etc.).
     * 
     * @param customerId The ID of the customer whose bookings to export
     */
    public void exportCustomerBookings(Long customerId) {
        // TODO: Implement export functionality
        // This could generate Excel, PDF, or CSV files
        // Implementation for exporting customer bookings
    }

    /**
     * Export customer bookings with specific format (placeholder method)
     * 
     * What This Method Does:
     * This is a placeholder method for future implementation.
     * It will export customer bookings in a specific format and return the file as bytes.
     * 
     * @param customerId The ID of the customer whose bookings to export
     * @param format The format to export (e.g., "excel", "pdf", "csv")
     * @return Byte array containing the exported file (placeholder returns empty array)
     */
    public byte[] exportCustomerBookings(Long customerId, String format) {
        // TODO: Implement export functionality with format support
        // This could generate files in different formats based on the format parameter
        // Implementation for exporting customer bookings with format
        // This is a placeholder implementation
        return new byte[0];
    }

    /**
     * Generate Excel report for bookings (placeholder method)
     * 
     * What This Method Does:
     * This is a placeholder method for future implementation.
     * It will generate an Excel report containing the specified bookings.
     * 
     * @param bookings List of bookings to include in the report
     * @param filename Name of the file to generate
     */
    public void generateExcelReport(List<Booking> bookings, String filename) {
        // TODO: Implement Excel report generation
        // This could use libraries like Apache POI to create Excel files
        // Implementation for generating Excel report
    }

    /**
     * Generate PDF report for bookings (placeholder method)
     * 
     * What This Method Does:
     * This is a placeholder method for future implementation.
     * It will generate a PDF report containing the specified bookings.
     * 
     * @param bookings List of bookings to include in the report
     * @param filename Name of the file to generate
     */
    public void generatePdfReport(List<Booking> bookings, String filename) {
        // TODO: Implement PDF report generation
        // This could use libraries like iText or Apache PDFBox to create PDF files
        // Implementation for generating PDF report
    }
}

/**
 * How This Service Fits Into the Application:
 * 
 * 1. Request Flow:
 *    - Frontend sends HTTP request to controller (e.g., "get my bookings")
 *    - Controller calls this service method (e.g., getCustomerBookingsPaginated)
 *    - Service method calls repository to get data from database
 *    - Service returns data to controller
 *    - Controller sends HTTP response back to frontend
 * 
 * 2. Business Logic:
 *    - Service methods contain the "rules" for how data should be processed
 *    - They handle pagination logic, data transformation, and error handling
 *    - They ensure data consistency and business rules are followed
 * 
 * 3. Error Handling:
 *    - Service methods catch exceptions and handle them gracefully
 *    - They return null or empty collections instead of crashing the application
 *    - This makes the application more robust and user-friendly
 * 
 * 4. Data Transformation:
 *    - Service methods convert between different data formats
 *    - They transform Spring Page objects to custom DTOs
 *    - They prepare data in the format expected by controllers
 * 
 * 5. Integration Points:
 *    - Controllers depend on this service for business logic
 *    - This service depends on repositories for data access
 *    - This creates a clean separation of concerns
 * 
 * This service is essential for the booking management system, providing
 * a clean interface for controllers while handling complex business logic
 * and ensuring data consistency.
 */ 