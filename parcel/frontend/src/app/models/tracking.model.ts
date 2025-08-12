/**
 * Tracking Model Interfaces
 * 
 * These interfaces define the structure of data used for tracking operations
 * in the courier management system. They ensure type safety and provide
 * clear contracts for data exchange between components and services.
 * 
 * Key Concepts:
 * - Interface: TypeScript feature that defines the shape of an object
 * - Type Safety: Ensures data has the correct structure at compile time
 * - Optional Properties: Properties marked with ? are not required
 * - Data Contracts: Clear definition of what tracking data should look like
 */

/**
 * Tracking Response Interface
 * 
 * Defines the structure of data returned from tracking operations.
 * Contains success status, message, and booking details with tracking information.
 */
export interface TrackingResponse {
  /** Whether the tracking operation was successful */
  success: boolean;
  
  /** Message describing the result of the tracking operation */
  message: string;
  
  /** The booking object with tracking details (optional) */
  booking?: Booking;
}

/**
 * Booking Interface for Tracking
 * 
 * Defines the structure of booking data used in tracking operations.
 * Contains essential information needed for tracking a parcel's journey.
 */
export interface Booking {
  /** Unique identifier of the booking being tracked */
  bookingId: string;
  
  /** Name of the person receiving the parcel */
  receiverName: string;
  
  /** Complete address where parcel should be delivered */
  receiverAddress: string;
  
  /** When the booking was created (ISO date string) */
  createdAt: string;
  
  /** Current status of the parcel (NEW, PICKED_UP, IN_TRANSIT, DELIVERED, etc.) */
  parcelStatus: string;
  
  /** Customer who made this booking (optional) */
  customer?: Customer;
}

/**
 * Customer Interface for Tracking
 * 
 * Defines the structure of customer data used in tracking operations.
 * Contains essential customer information for tracking context.
 */
export interface Customer {
  /** Unique identifier for the customer */
  id: number;
  
  /** Full name of the customer */
  customerName: string;
  
  /** Email address of the customer */
  email: string;
  
  /** Complete address of the customer */
  address: string;
} 