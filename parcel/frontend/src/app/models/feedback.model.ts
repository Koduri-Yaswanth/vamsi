/**
 * Feedback Model Interfaces
 * 
 * These interfaces define the structure of data used for feedback operations
 * in the courier management system. They ensure type safety and provide
 * clear contracts for data exchange between components and services.
 * 
 * Key Concepts:
 * - Interface: TypeScript feature that defines the shape of an object
 * - Type Safety: Ensures data has the correct structure at compile time
 * - Optional Properties: Properties marked with ? are not required
 * - Data Contracts: Clear definition of what feedback data should look like
 */

/**
 * Feedback Request Interface
 * 
 * Defines the structure of data sent when submitting new feedback.
 * Contains the essential information needed to create a feedback entry.
 */
export interface FeedbackRequest {
  /** Unique identifier of the booking being reviewed */
  bookingId: string;
  
  /** Detailed feedback description from the customer */
  description: string;
  
  /** Rating given by the customer (typically 1-5 stars) */
  rating: number;
}

/**
 * Feedback Response Interface
 * 
 * Defines the structure of data returned from feedback operations.
 * Contains success status, message, and feedback details.
 */
export interface FeedbackResponse {
  /** Whether the feedback operation was successful */
  success: boolean;
  
  /** Message describing the result of the feedback operation */
  message: string;
  
  /** The created feedback object (optional) */
  feedback?: Feedback;
}

/**
 * Feedback Page Interface
 * 
 * Defines the structure of paginated feedback data returned from
 * the backend when fetching multiple feedback entries.
 * 
 * Note: This interface matches Spring Data's Page response format
 */
export interface FeedbackPage {
  /** Array of feedback objects for the current page */
  content: Feedback[];
  
  /** Total number of feedback entries across all pages */
  totalElements: number;
  
  /** Total number of pages available */
  totalPages: number;
  
  /** Current page number (0-based) - Spring Data uses 'number' */
  number: number;
  
  /** Number of feedback items per page */
  size: number;
  
  /** Whether this is the first page */
  first: boolean;
  
  /** Whether this is the last page */
  last: boolean;
  
  /** Whether this page has content */
  hasContent: boolean;
  
  /** Total number of elements on this page */
  numberOfElements: number;
}

/**
 * Feedback Interface
 * 
 * Defines the structure of a feedback entry. Contains all information
 * about customer feedback including rating, description, and related data.
 */
export interface Feedback {
  /** Unique identifier for the feedback (optional for new feedback) */
  id?: number;
  
  /** Customer who submitted the feedback (optional) */
  customer?: Customer;
  
  /** Booking associated with this feedback (optional) */
  booking?: Booking;
  
  /** Detailed feedback description from the customer */
  feedbackDescription: string;
  
  /** Rating given by the customer (typically 1-5 stars) */
  rating: number;
  
  /** When the feedback was created (ISO date string) */
  createdAt: string;
  
  /** When the feedback was last updated (ISO date string) */
  updatedAt: string;
  
  /** UI property to control description expansion (optional) */
  showFullDescription?: boolean;
}

/**
 * Customer Interface for Feedback
 * 
 * Defines the structure of customer data used in feedback operations.
 * Contains essential customer information for feedback context.
 */
export interface Customer {
  /** Unique identifier for the customer */
  id: number;
  
  /** Full name of the customer */
  customerName: string;
  
  /** Email address of the customer */
  email: string;
  
  /** Mobile phone number of the customer */
  mobileNumber: string;
  
  /** Country code for the phone number (e.g., +91) */
  countryCode: string;
  
  /** Complete address of the customer */
  address: string;
  
  /** User role: 'CUSTOMER' or 'OFFICER' */
  role: string;
}

/**
 * Booking Interface for Feedback
 * 
 * Defines the structure of booking data used in feedback operations.
 * Contains all booking information associated with the feedback.
 */
export interface Booking {
  /** Unique identifier for the booking (optional) */
  id?: number;
  
  /** Unique booking ID for reference */
  bookingId: string;
  
  /** ID of the customer who made the booking (optional) */
  customerId?: number;
  
  /** Customer object with full details (optional) */
  customer?: Customer;
  
  /** Name of the person receiving the parcel */
  receiverName: string;
  
  /** Complete address where parcel should be delivered */
  receiverAddress: string;
  
  /** PIN code of the delivery location */
  receiverPin: string;
  
  /** Mobile number of the receiver for delivery coordination */
  receiverMobile: string;
  
  /** Weight of the parcel in grams */
  parcelWeightInGram: number;
  
  /** Description of what's inside the parcel */
  parcelContentsDescription: string;
  
  /** Type of delivery service: STANDARD, EXPRESS, or SAME_DAY */
  parcelDeliveryType: string;
  
  /** Type of packing service: BASIC or PREMIUM */
  parcelPackingPreference: string;
  
  /** When the parcel was/will be picked up (ISO date string) */
  parcelPickupTime: string;
  
  /** When the parcel was/will be delivered (ISO date string) */
  parcelDropoffTime: string;
  
  /** Total cost of the courier service in rupees */
  parcelServiceCost: number;
  
  /** Current status of the parcel */
  parcelStatus: string;
  
  /** When the booking was created (ISO date string) */
  createdAt: string;
  
  /** When the booking was last updated (ISO date string) */
  updatedAt: string;
} 