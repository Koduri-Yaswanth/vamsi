import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse, InvoiceResponse } from '../models/payment.model';
import { map } from 'rxjs/operators';

/**
 * Payment Service
 * 
 * This service handles all payment-related operations in the frontend application.
 * It communicates with the backend API to process payments, generate invoices,
 * and manage payment-related functionality for both customers and officers.
 * 
 * Key Concepts:
 * - @Injectable: Marks this class as a service that can be injected into components
 * - providedIn: 'root' - Makes this service available throughout the entire application
 * - HttpClient: Angular service for making HTTP requests to the backend
 * - Observable: RxJS concept for handling asynchronous data streams
 * - Blob: Binary data type for handling file downloads (PDF invoices)
 * 
 * Service Responsibilities:
 * 1. Process payment transactions
 * 2. Generate and retrieve invoices
 * 3. Download invoice PDFs
 * 4. Manage authentication headers for API calls
 * 5. Handle payment confirmation and status updates
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  /**
   * Base URL for payment API endpoints
   * Points to the Spring Boot backend server
   */
  private baseUrl = 'http://localhost:8080/api/payments';

  /**
   * Constructor - injects HttpClient for making API calls
   * 
   * @param http Angular's HTTP client for making requests to backend
   */
  constructor(private http: HttpClient) { }

  /**
   * Creates HTTP headers for API requests with authentication
   * 
   * This method:
   * 1. Checks for customer token first
   * 2. Falls back to officer token if customer token not found
   * 3. Creates headers with the appropriate authentication token
   * 
   * @returns HttpHeaders object with JSON content type and authorization token
   */
  private getHeaders(): HttpHeaders {
    // Try to get customer token first, then officer token
    const customerToken = localStorage.getItem('customer_token');
    const officerToken = localStorage.getItem('officer_token');
    const token = customerToken || officerToken;
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Process a payment for a booking
   * 
   * Sends payment information to backend and processes the transaction.
   * This handles the actual payment processing including validation
   * and confirmation.
   * 
   * @param paymentRequest Payment details including amount, method, booking ID, etc.
   * @returns Observable that emits the payment processing response
   */
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.baseUrl, paymentRequest, { headers: this.getHeaders() });
  }

  /**
   * Generate an invoice for a booking
   * 
   * Creates a new invoice for a specific booking. This is typically
   * called after a successful payment to generate the invoice document.
   * 
   * @param bookingId Unique identifier of the booking
   * @returns Observable that emits the invoice generation response
   */
  generateInvoice(bookingId: string): Observable<InvoiceResponse> {
    const url = `${this.baseUrl}/${bookingId}/invoice`;
    return this.http.get<InvoiceResponse>(url, { headers: this.getHeaders() });
  }

  /**
   * Get invoice details for a booking
   * 
   * Retrieves detailed invoice information for a specific booking.
   * This includes cost breakdown, customer details, and payment information.
   * 
   * @param bookingId Unique identifier of the booking
   * @returns Observable that emits the invoice details
   */
  getInvoiceDetails(bookingId: string): Observable<InvoiceResponse> {
    const url = `${this.baseUrl}/${bookingId}/invoice`;
    return this.http.get<InvoiceResponse>(url, { headers: this.getHeaders() });
  }

  /**
   * Download invoice as PDF file
   * 
   * Downloads the invoice as a PDF file for printing or storage.
   * The response is a Blob (binary data) that can be saved as a file.
   * 
   * @param bookingId Unique identifier of the booking
   * @returns Observable that emits a Blob containing the PDF data
   */
  downloadInvoicePdf(bookingId: string): Observable<Blob> {
    const url = `${this.baseUrl}/invoice/${bookingId}/download`;
    
    return this.http.get(url, { 
      headers: this.getHeaders(),
      responseType: 'blob',
      observe: 'response'  // Get full response to check status
    }).pipe(
      map(response => {
        // Check if response is successful
        if (response.status === 200 && response.body) {
          return response.body as Blob;
        } else if (response.status === 404) {
          throw new Error('Invoice not found for this booking');
        } else if (response.status === 500) {
          throw new Error('Server error while generating PDF');
        } else {
          throw new Error(`Failed to download invoice (Status: ${response.status})`);
        }
      })
    );
  }
} 