/**
 * Payment Model Interfaces
 * 
 * These interfaces define the structure of data used for payment operations
 * in the courier management system. They ensure type safety and provide
 * clear contracts for data exchange between components and services.
 * 
 * Key Concepts:
 * - Interface: TypeScript feature that defines the shape of an object
 * - Type Safety: Ensures data has the correct structure at compile time
 * - Optional Properties: Properties marked with ? are not required
 * - Data Contracts: Clear definition of what payment data should look like
 */

/**
 * Payment Request Interface
 * 
 * Defines the structure of data sent when processing a payment.
 * Contains payment method details and booking information.
 */
export interface PaymentRequest {
  /** Unique identifier of the booking being paid for */
  bookingId: string;
  
  /** Credit/debit card number (masked for security) */
  cardNumber: string;
  
  /** Name of the cardholder as it appears on the card */
  cardholderName: string;
  
  /** Card expiry date in MM/YY format */
  expiryDate: string;
  
  /** Card verification value (3-4 digit security code) */
  cvv: string;
}

/**
 * Payment Response Interface
 * 
 * Defines the structure of data returned from payment processing operations.
 * Contains success status, message, and payment details.
 */
export interface PaymentResponse {
  /** Whether the payment operation was successful */
  success: boolean;
  
  /** Message describing the result of the payment operation */
  message: string;
  
  /** The processed payment object (optional) */
  payment?: Payment;
}

/**
 * Payment Interface
 * 
 * Defines the structure of a payment transaction. Contains all information
 * about a payment including transaction details and card information.
 */
export interface Payment {
  /** Unique identifier for the payment */
  paymentId: string;
  
  /** Unique transaction identifier from payment gateway */
  transactionId: string;
  
  /** Amount paid in rupees */
  transactionAmount: number;
  
  /** When the payment was processed (ISO date string) */
  transactionDate: string;
  
  /** Type of transaction: 'PAYMENT', 'REFUND', etc. */
  transactionType: string;
  
  /** Status of the transaction: 'SUCCESS', 'FAILED', 'PENDING' */
  transactionStatus: string;
  
  /** Masked card number for security (e.g., **** **** **** 1234) */
  cardNumber: string;
  
  /** Name of the cardholder */
  cardholderName: string;
}

/**
 * Invoice Response Interface
 * 
 * Defines the structure of data returned from invoice operations.
 * Contains success status, message, and invoice details.
 */
export interface InvoiceResponse {
  /** Whether the invoice operation was successful */
  success: boolean;
  
  /** Message describing the result of the invoice operation */
  message: string;
  
  /** The invoice data object (optional) */
  invoiceData?: InvoiceData;
}

/**
 * Invoice Data Interface
 * 
 * Defines the structure of invoice information. Contains all details
 * needed to generate and display an invoice including booking details,
 * payment information, and cost breakdown.
 */
export interface InvoiceData {
  /** Unique identifier of the booking */
  bookingId: string;
  
  /** Unique identifier of the payment */
  paymentId: string;
  
  /** Unique transaction identifier from payment gateway */
  transactionId: string;
  
  /** Unique invoice number for reference */
  invoiceNumber: string;
  
  /** Name of the person receiving the parcel */
  receiverName: string;
  
  /** Complete address where parcel should be delivered */
  receiverAddress: string;
  
  /** PIN code of the delivery location */
  receiverPin: string;
  
  /** Mobile number of the receiver for delivery coordination */
  receiverMobile: string;
  
  /** Weight of the parcel in grams */
  parcelWeight: number;
  
  /** Description of what's inside the parcel */
  parcelContents: string;
  
  /** Type of delivery service: STANDARD, EXPRESS, or SAME_DAY */
  deliveryType: string;
  
  /** Type of packing service: BASIC or PREMIUM */
  packingPreference: string;
  
  /** When the parcel should be picked up (ISO date string) */
  pickupTime: string;
  
  /** When the parcel should be delivered (ISO date string) */
  dropoffTime: string;
  
  /** Total cost of the courier service in rupees */
  serviceCost: number;
  
  /** When the payment was made (ISO date string) */
  paymentTime: string;

  /** Optional fields enriched on the frontend for display completeness */
  /** Name of the customer who booked the service */
  customerName?: string;
  /** Customer email address */
  customerEmail?: string;
  /** Customer phone number */
  customerPhone?: string;
  /** Customer address */
  customerAddress?: string;
  /** Officer name (for officer invoices) */
  officerName?: string;
  /** Derived invoice issue date for UI display */
  issueDate?: Date | string;
  /** Derived invoice due date for UI display */
  dueDate?: Date | string;
} 