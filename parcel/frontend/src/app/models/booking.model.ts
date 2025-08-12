/**
 * Booking Model Interfaces
 * 
 * These interfaces define the structure of data used for booking operations
 * in the courier management system. They ensure type safety and provide
 * clear contracts for data exchange between components and services.
 * 
 * Key Concepts:
 * - Interface: TypeScript feature that defines the shape of an object
 * - Enum: TypeScript feature that defines a set of named constants
 * - Type Safety: Ensures data has the correct structure at compile time
 * - Optional Properties: Properties marked with ? are not required
 */

/**
 * Customer Interface
 * 
 * Defines the structure of customer data used in booking operations.
 * Contains essential customer information for parcel bookings.
 */
export interface Customer {
  /** Unique identifier for the customer */
  id: number;
  /** Login unique ID shown to users (e.g., CUST..., OFF...) */
  uniqueId?: string;
  
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
 * Booking Interface
 * 
 * Defines the structure of a parcel booking. Contains all information
 * about a courier service booking including sender, receiver, parcel
 * details, and tracking information.
 */
export interface Booking {
  /** Unique identifier for the booking (optional for new bookings) */
  id?: number;
  
  /** Unique booking ID for customer reference (e.g., BK1703123456789) */
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

/**
 * Booking Request Interface
 * 
 * Defines the structure of data sent when creating a new booking.
 * Contains all the information needed to create a parcel booking.
 */
export interface BookingRequest {
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
  
  /** When the parcel should be picked up (ISO date string) */
  parcelPickupTime: string;
  
  /** When the parcel should be delivered (ISO date string) */
  parcelDropoffTime: string;
}

/**
 * Booking Response Interface
 * 
 * Defines the structure of data returned from booking operations.
 * Contains success status, message, and the created booking details.
 */
export interface BookingResponse {
  /** Whether the booking operation was successful */
  success: boolean;
  
  /** Message describing the result of the operation */
  message: string;
  
  /** The created booking object (optional) */
  booking?: Booking;
}

/**
 * Booking Page Interface
 * 
 * Defines the structure of paginated booking data returned from
 * the backend when fetching multiple bookings.
 */
export interface BookingPage {
  /** Array of booking objects for the current page */
  content: Booking[];
  
  /** Total number of bookings across all pages */
  totalElements: number;
  
  /** Total number of pages available */
  totalPages: number;
  
  /** Current page number (0-based) */
  currentPage: number;
  
  /** Number of bookings per page */
  pageSize: number;
}

/**
 * Delivery Type Enumeration
 * 
 * Defines the available delivery service types and their costs.
 * Used for calculating service costs and providing delivery options.
 */
export enum DeliveryType {
  /** Standard delivery (2-3 days) - ₹30 */
  STANDARD = 'STANDARD',
  
  /** Express delivery (1-2 days) - ₹80 */
  EXPRESS = 'EXPRESS',
  
  /** Same day delivery - ₹150 */
  SAME_DAY = 'SAME_DAY'
}

/**
 * Packing Preference Enumeration
 * 
 * Defines the available packing service types and their costs.
 * Used for calculating service costs and providing packing options.
 */
export enum PackingPreference {
  /** Basic packing service - ₹10 */
  BASIC = 'BASIC',
  
  /** Premium packing service with extra protection - ₹20 */
  PREMIUM = 'PREMIUM'
}

/**
 * Parcel Status Enumeration
 * 
 * Defines all possible states that a parcel can be in during its journey
 * from booking to delivery. Used for tracking and status updates.
 */
export enum ParcelStatus {
  /** Initial status when booking is created */
  NEW = 'NEW',
  
  /** Pickup has been scheduled */
  SCHEDULED = 'SCHEDULED',
  
  /** Parcel has been collected from sender */
  PICKED_UP = 'PICKED_UP',
  
  /** Parcel has been assigned to delivery agent */
  ASSIGNED = 'ASSIGNED',
  
  /** Parcel is confirmed and ready for processing */
  BOOKED = 'BOOKED',
  
  /** Parcel is being transported between locations */
  IN_TRANSIT = 'IN_TRANSIT',
  
  /** Parcel has been successfully delivered */
  DELIVERED = 'DELIVERED',
  
  /** Booking has been cancelled */
  CANCELLED = 'CANCELLED'
} 