import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrackingResponse } from '../models/tracking.model';

/**
 * Tracking Service
 * 
 * This service handles all tracking-related operations in the frontend application.
 * It communicates with the backend API to retrieve real-time tracking information
 * for parcels, allowing both customers and officers to monitor delivery progress.
 * 
 * Key Concepts:
 * - @Injectable: Marks this class as a service that can be injected into components
 * - providedIn: 'root' - Makes this service available throughout the entire application
 * - HttpClient: Angular service for making HTTP requests to the backend
 * - Observable: RxJS concept for handling asynchronous data streams
 * - Console logging: Used for debugging and monitoring API calls
 * 
 * Service Responsibilities:
 * 1. Retrieve tracking information for customer bookings
 * 2. Retrieve tracking information for officer-managed bookings
 * 3. Provide real-time parcel status updates
 * 4. Manage authentication headers for API calls
 * 5. Handle tracking data display and updates
 */
@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  
  /**
   * Base URL for tracking API endpoints
   * Points to the Spring Boot backend server
   */
  private baseUrl = 'http://localhost:8080/api/tracking';

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
   * Track a customer's booking
   * 
   * Retrieves tracking information for a specific booking made by a customer.
   * This includes current status, location updates, and delivery progress.
   * 
   * @param bookingId Unique identifier of the booking to track
   * @returns Observable that emits the tracking response with parcel status
   */
  trackCustomerBooking(bookingId: string): Observable<TrackingResponse> {
    // Debug logging to monitor API calls
    console.log('Tracking service - tracking customer booking:', bookingId);
    console.log('Headers:', this.getHeaders());
    
    return this.http.get<TrackingResponse>(`${this.baseUrl}/customer/${bookingId}`, { headers: this.getHeaders() });
  }

  /**
   * Track a booking managed by an officer
   * 
   * Retrieves tracking information for a booking that was created or managed
   * by an officer. Officers can track any booking in the system.
   * 
   * @param bookingId Unique identifier of the booking to track
   * @returns Observable that emits the tracking response with parcel status
   */
  trackOfficerBooking(bookingId: string): Observable<TrackingResponse> {
    return this.http.get<TrackingResponse>(`${this.baseUrl}/officer/${bookingId}`, { headers: this.getHeaders() });
  }
} 