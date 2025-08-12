/**
 * User Model Interfaces
 * 
 * These interfaces define the structure of data used for user management
 * in the courier management system. They ensure type safety and provide
 * clear contracts for data exchange between components and services.
 * 
 * Key Concepts:
 * - Interface: TypeScript feature that defines the shape of an object
 * - Enum: TypeScript feature that defines a set of named constants
 * - Type Safety: Ensures data has the correct structure at compile time
 * - Optional Properties: Properties marked with ? are not required
 * - Data Contracts: Clear definition of what user data should look like
 */

/**
 * User Interface
 * 
 * Defines the structure of user data in the system. Contains all information
 * about a user including personal details, contact information, and account settings.
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  
  /** Full name of the user */
  customerName: string;
  
  /** Email address of the user (used for login) */
  email: string;
  
  /** Mobile phone number of the user */
  mobileNumber: string;
  
  /** Country code for the phone number (e.g., +91) */
  countryCode: string;
  
  /** Complete address of the user */
  address: string;
  
  /** User preferences stored as JSON string (optional) */
  preferences?: string;
  
  /** User role in the system */
  role: UserRole;
  
  /** When the user account was created (ISO date string) */
  createdAt: string;
  
  /** When the user account was last updated (ISO date string) */
  updatedAt: string;
}

/**
 * User Role Enumeration
 * 
 * Defines the available user roles in the system. Each role has different
 * permissions and access levels within the application.
 */
export enum UserRole {
  /** Customer role - can book parcels, track deliveries, provide feedback */
  CUSTOMER = 'CUSTOMER',
  
  /** Officer role - can manage all bookings, update status, view all data */
  OFFICER = 'OFFICER'
}

/**
 * Authentication Response Interface
 * 
 * Defines the structure of data returned from authentication operations
 * (login, register). Contains success status, user details, and access token.
 */
export interface AuthResponse {
  /** JWT token for authenticated sessions */
  token: string;
  
  /** Message describing the authentication result */
  message: string;
  
  /** Unique identifier of the authenticated user */
  userId: number;
  
  /** Full name of the authenticated user */
  customerName: string;
  
  /** Email address of the authenticated user */
  email: string;
  
  /** Role of the authenticated user */
  role: UserRole;
  
  /** Whether the authentication operation was successful */
  success: boolean;
}

/**
 * Login Request Interface
 * 
 * Defines the structure of data sent when a user tries to log in.
 * Contains the credentials needed for authentication.
 */
export interface LoginRequest {
  /** Email address or unique ID used for login */
  email: string;
  
  /** User's password for authentication */
  password: string;
}

/**
 * Registration Request Interface
 * 
 * Defines the structure of data sent when a new user registers.
 * Contains all the information needed to create a new user account.
 */
export interface RegisterRequest {
  /** Full name of the user */
  customerName: string;
  
  /** Email address (must be unique) */
  email: string;
  
  /** Mobile phone number */
  mobileNumber: string;
  
  /** Country code for phone number (e.g., +91) */
  countryCode: string;
  
  /** Complete address of the user */
  address: string;
  
  /** User's password (will be hashed on backend) */
  password: string;
  
  /** Password confirmation to ensure correct entry */
  confirmPassword: string;
  
  /** User preferences (optional) */
  preferences?: string;
} 