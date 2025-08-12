/**
 * Authentication Model Interfaces
 * 
 * These interfaces define the structure of data used for authentication
 * operations in the frontend application. They ensure type safety and
 * provide clear contracts for data exchange between components and services.
 * 
 * Key Concepts:
 * - Interface: TypeScript feature that defines the shape of an object
 * - Type Safety: Ensures data has the correct structure at compile time
 * - Optional Properties: Properties marked with ? are not required
 * - Data Contracts: Clear definition of what data should look like
 */

/**
 * Login Request Interface
 * 
 * Defines the structure of data sent when a user tries to log in.
 * Used for both customer and officer login operations.
 * 
 * Note: The 'email' field is used to send the uniqueId to maintain
 * backend compatibility, but it actually contains the Customer ID or Officer ID.
 */
export interface LoginRequest {
  /** Unique ID (Customer ID or Officer ID) used for login */
  email: string; // Backend expects 'email' but we send uniqueId here
  
  /** User's password for authentication */
  password: string;
}

/**
 * Registration Request Interface
 * 
 * Defines the structure of data sent when a new user registers.
 * Used for both customer and officer registration.
 */
export interface RegisterRequest {
  /** Full name of the user */
  customerName: string;
  
  /** Email address (must be unique) */
  email: string;
  
  /** Country code for phone number (e.g., +91) */
  countryCode: string;
  
  /** Mobile phone number */
  mobileNumber: string;
  
  /** Complete address of the user */
  address: string;
  
  /** User's password (will be hashed on backend) */
  password: string;
  
  /** Password confirmation to ensure correct entry */
  confirmPassword: string;
  
  /** User preferences (optional) */
  preferences?: string;
  
  /** User role: 'CUSTOMER' or 'OFFICER' */
  role: string;
}

/**
 * Authentication Response Interface
 * 
 * Defines the structure of data returned from authentication operations
 * (login, register). Contains success status, message, and user details.
 */
export interface AuthResponse {
  /** Whether the authentication operation was successful */
  success: boolean;
  
  /** Message describing the result of the operation */
  message: string;
  
  /** JWT token for authenticated sessions (optional) */
  token?: string;
  
  /** User's unique database ID (optional) */
  id?: number;
  
  /** User's full name (optional) */
  customerName?: string;
  
  /** User's email address (optional) */
  email?: string;
  
  /** User's country code (optional) */
  countryCode?: string;
  
  /** User's mobile number (optional) */
  mobileNumber?: string;
  
  /** User's address (optional) */
  address?: string;
  
  /** User's role: 'CUSTOMER' or 'OFFICER' (optional) */
  role?: string;
  
  /** User's unique identifier for login (optional) */
  uniqueId?: string;
} 