import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingResponse, BookingPage } from '../models/booking.model';

/**
 * Booking Service
 * 
 * This service handles all booking-related operations in the frontend application.
 * It communicates with the backend API to manage parcel bookings for both
 * customers and officers.
 * 
 * Key Concepts:
 * - @Injectable: Marks this class as a service that can be injected into components
 * - providedIn: 'root' - Makes this service available throughout the entire application
 * - HttpClient: Angular service for making HTTP requests to the backend
 * - Observable: RxJS concept for handling asynchronous data streams
 * - localStorage: Browser storage for retrieving authentication tokens
 * 
 * Service Responsibilities:
 * 1. Make HTTP requests to backend booking endpoints
 * 2. Handle booking creation for customers and officers
 * 3. Retrieve booking lists with pagination
 * 4. Update booking information
 * 5. Manage authentication headers for API calls
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  
  /**
   * Base URL for booking API endpoints
   * Points to the Spring Boot backend server
   */
  private baseUrl = 'http://localhost:8080/api/bookings';

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
   * Create headers for a specific role to satisfy backend role checks
   */
  private getHeadersForRole(role: 'CUSTOMER' | 'OFFICER'): HttpHeaders {
    const customerToken = localStorage.getItem('customer_token');
    const officerToken = localStorage.getItem('officer_token');
    const token = role === 'CUSTOMER' ? customerToken : officerToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  /**
   * Create a new booking for customers
   * 
   * Sends booking data to backend and returns the response with booking details
   * 
   * @param bookingData Complete booking information (receiver details, parcel info, etc.)
   * @returns Observable that emits the booking creation response
   */
  createBooking(bookingData: any): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.baseUrl}`, bookingData, {
      headers: this.getHeadersForRole('CUSTOMER')
    });
  }

  /**
   * Create a new booking for officers (on behalf of customers)
   * 
   * Officers can create bookings for customers. This endpoint allows officers
   * to create bookings with additional privileges.
   * 
   * @param bookingData Complete booking information (receiver details, parcel info, etc.)
   * @returns Observable that emits the booking creation response
   */
  createOfficerBooking(bookingData: any): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.baseUrl}/officer`, bookingData, {
      headers: this.getHeadersForRole('OFFICER')
    });
  }

  /**
   * Get paginated list of bookings for the current customer
   * 
   * Retrieves all bookings made by the logged-in customer with pagination support.
   * 
   * @param page Page number (0-based)
   * @param size Number of bookings per page
   * @returns Observable that emits paginated booking data
   */
  getCustomerBookings(page: number, size: number): Observable<BookingPage> {
    const url = `${this.baseUrl}/customer?page=${page}&size=${size}`;
    return this.http.get<BookingPage>(url, { headers: this.getHeadersForRole('CUSTOMER') });
  }

  /**
   * Get paginated list of all bookings (for officers)
   * 
   * Officers can view all bookings in the system. This endpoint provides
   * comprehensive booking data with pagination support.
   * 
   * @param page Page number (0-based)
   * @param size Number of bookings per page
   * @returns Observable that emits paginated booking data for all bookings
   */
  getAllBookings(page: number, size: number): Observable<BookingPage> {
    const url = `${this.baseUrl}/officer?page=${page}&size=${size}`;
    return this.http.get<BookingPage>(url, { headers: this.getHeadersForRole('OFFICER') });
  }

  /**
   * Get a specific booking by its ID
   * 
   * Retrieves detailed information about a specific booking.
   * 
   * @param bookingId Unique booking identifier
   * @returns Observable that emits the booking details
   */
  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${bookingId}`, { headers: this.getHeaders() });
  }

  /**
   * Update an existing booking
   * 
   * Allows modification of booking details. Typically used by officers
   * to update booking status or other information.
   * 
   * @param booking Updated booking object with modified information
   * @returns Observable that emits the updated booking details
   */
  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.baseUrl}/${booking.bookingId}`, booking, { headers: this.getHeaders() });
  }
} 