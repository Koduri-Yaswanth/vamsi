package com.courier.repository;

// Import the Customer model class (the data structure we're working with)
import com.courier.model.Customer;

// Import Spring Data JPA classes for database operations
import org.springframework.data.jpa.repository.JpaRepository; // Base interface that provides common database operations
import org.springframework.stereotype.Repository; // Annotation that marks this as a repository component

// Import Java utility for handling values that might not exist
import java.util.Optional; // Optional<T> means "this might contain a value of type T, or it might be empty"

/**
 * Customer Repository Interface
 * 
 * What This Interface Does:
 * This interface defines how our application interacts with the customer database.
 * Think of it as the "data access layer" - it's responsible for storing, retrieving,
 * and searching for customer information in the database.
 * 
 * What is a Repository?
 * - A repository is a design pattern that separates business logic from data access logic
 * - It acts like a "data manager" that handles all database operations for a specific entity (Customer)
 * - Instead of writing SQL queries directly, we define methods and Spring generates the SQL for us
 * - This makes our code cleaner, more maintainable, and database-agnostic
 * 
 * What is Spring Data JPA?
 * - JPA (Java Persistence API) is a standard for managing relational data in Java applications
 * - Spring Data JPA makes it easy to create repositories without writing boilerplate code
 * - It automatically generates SQL queries based on method names
 * - It handles database connections, transactions, and error handling
 * 
 * How This Works:
 * 1. Spring sees this interface and automatically creates an implementation class
 * 2. The implementation class handles all the database operations (SQL queries, connections, etc.)
 * 3. Other parts of the application can inject this repository and use its methods
 * 4. Spring automatically generates SQL based on method names (e.g., findByEmail becomes "SELECT * FROM customer WHERE email = ?")
 * 
 * Database Table: This repository works with a "customer" table that stores:
 * - Customer ID (auto-generated)
 * - Name, email, phone number, address
 * - Password (hashed for security)
 * - Unique ID (for login purposes)
 * - Role (CUSTOMER or OFFICER)
 * - Other customer-related information
 */
@Repository // Tells Spring: "This is a repository component - manage it for me"
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    /**
     * Find a customer by their email address
     * 
     * What This Method Does:
     * Searches the database for a customer with the specified email address.
     * Used for login, registration validation, and finding customer details.
     * 
     * How Spring Generates SQL:
     * Method name "findByEmail" becomes: "SELECT * FROM customer WHERE email = ?"
     * 
     * @param email The email address to search for
     * @return Optional<Customer> - contains the customer if found, or empty if not found
     *         Optional is used because an email might not exist in the database
     */
    Optional<Customer> findByEmail(String email);
    
    /**
     * Find a customer by their unique ID
     * 
     * What This Method Does:
     * Searches the database for a customer with the specified unique ID.
     * This is the primary method used for customer login (customers log in with unique ID, not email).
     * 
     * How Spring Generates SQL:
     * Method name "findByUniqueId" becomes: "SELECT * FROM customer WHERE unique_id = ?"
     * 
     * @param uniqueId The unique identifier to search for (e.g., "CUST001", "OFF001")
     * @return Optional<Customer> - contains the customer if found, or empty if not found
     */
    Optional<Customer> findByUniqueId(String uniqueId);
    
    /**
     * Find a customer by email and password combination
     * 
     * What This Method Does:
     * Searches for a customer with both the specified email and password.
     * This method is used for authentication purposes.
     * 
     * How Spring Generates SQL:
     * Method name "findByEmailAndPassword" becomes: "SELECT * FROM customer WHERE email = ? AND password = ?"
     * 
     * Note: In modern applications, password comparison is usually done in the service layer
     * after retrieving the customer, because passwords are stored as hashes, not plain text.
     * 
     * @param email The email address to search for
     * @param password The password to match (usually hashed)
     * @return Optional<Customer> - contains the customer if both email and password match
     */
    Optional<Customer> findByEmailAndPassword(String email, String password);
    
    /**
     * Check if a customer with the specified email already exists
     * 
     * What This Method Does:
     * Checks whether a customer with the given email address is already registered.
     * Used during registration to prevent duplicate email addresses.
     * 
     * How Spring Generates SQL:
     * Method name "existsByEmail" becomes: "SELECT COUNT(*) > 0 FROM customer WHERE email = ?"
     * 
     * @param email The email address to check
     * @return true if a customer with this email exists, false otherwise
     */
    boolean existsByEmail(String email);
}

/**
 * How This Repository Fits Into the Application:
 * 
 * 1. Data Access Layer:
 *    - Controllers call services, services call repositories
 *    - Repositories handle all database operations (CRUD: Create, Read, Update, Delete)
 *    - This separation makes the code more organized and testable
 * 
 * 2. Automatic SQL Generation:
 *    - Spring Data JPA automatically creates SQL queries based on method names
 *    - findByEmail(String email) → "SELECT * FROM customer WHERE email = ?"
 *    - existsByEmail(String email) → "SELECT COUNT(*) > 0 FROM customer WHERE email = ?"
 *    - No need to write SQL manually!
 * 
 * 3. Database Operations:
 *    - save(Customer customer) - Insert new customer or update existing one
 *    - findById(Long id) - Find customer by database ID
 *    - findAll() - Get all customers
 *    - deleteById(Long id) - Remove customer from database
 *    - count() - Count total number of customers
 * 
 * 4. Integration with Services:
 *    - AuthService uses this repository for login/registration
 *    - CustomerService uses it for customer management
 *    - Other services use it to find customer information
 * 
 * 5. Transaction Management:
 *    - Spring automatically handles database transactions
 *    - If an operation fails, the entire transaction is rolled back
 *    - This ensures data consistency
 * 
 * This repository is a crucial part of the data layer, providing a clean interface
 * for all customer-related database operations while hiding the complexity of SQL
 * and database connections from the rest of the application.
 */ 