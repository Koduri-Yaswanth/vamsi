import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback, FeedbackResponse, FeedbackPage } from '../models/feedback.model';

/**
 * Feedback Service
 * 
 * This service handles all feedback-related operations in the frontend application.
 * It communicates with the backend API to manage customer feedback, ratings,
 * and reviews for the courier service.
 * 
 * Key Concepts:
 * - @Injectable: Marks this class as a service that can be injected into components
 * - providedIn: 'root' - Makes this service available throughout the entire application
 * - HttpClient: Angular service for making HTTP requests to the backend
 * - Observable: RxJS concept for handling asynchronous data streams
 * - Pagination: Handles large lists of feedback with page-based navigation
 * 
 * Service Responsibilities:
 * 1. Retrieve all feedback for officers to review
 * 2. Add new feedback from customers
 * 3. Manage feedback pagination
 * 4. Handle authentication headers for API calls
 * 5. Process feedback submission and retrieval
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  
  /**
   * Base URL for feedback API endpoints
   * Points to the Spring Boot backend server
   */
  private baseUrl = 'http://localhost:8080/api/feedback';

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
   * Creates HTTP headers for API requests without authentication
   * 
   * This method creates headers without authorization for endpoints
   * that don't require authentication (like officer feedback viewing)
   * 
   * @returns HttpHeaders object with JSON content type only
   */
  private getHeadersNoAuth(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Get all feedback with pagination (for officers)
   * 
   * Retrieves all feedback in the system with pagination support.
   * This allows officers to review customer feedback and ratings.
   * 
   * @param page Page number (0-based)
   * @param size Number of feedback items per page
   * @returns Observable that emits paginated feedback data
   */
  getAllFeedbacks(page: number, size: number): Observable<FeedbackPage> {
    const url = `${this.baseUrl}/officer/all?page=${page}&size=${size}`;
    return this.http.get<FeedbackPage>(url, { headers: this.getHeaders() });
  }

  /**
   * Get officer feedback with advanced filtering and pagination
   * 
   * Retrieves feedback for officers with optional filtering by customer name,
   * booking ID, or feedback description.
   * 
   * @param page Page number (0-based)
   * @param size Number of feedback items per page
   * @param filter Optional filter string for searching
   * @returns Observable that emits paginated feedback data
   */
  getOfficerFeedbacks(page: number, size: number, filter?: string): Observable<FeedbackPage> {
    let url = `${this.baseUrl}/officer/feedbacks?page=${page}&size=${size}`;
    if (filter && filter.trim()) {
      url += `&filter=${encodeURIComponent(filter.trim())}`;
    }
    
    console.log('Calling getOfficerFeedbacks with URL:', url);
    console.log('Headers (no auth):', this.getHeadersNoAuth());
    
    return this.http.get<FeedbackPage>(url, { headers: this.getHeadersNoAuth() });
  }

  /**
   * Get feedback statistics for officers
   * 
   * Retrieves aggregated statistics about feedback including total count,
   * average rating, and rating distribution.
   * 
   * @returns Observable that emits feedback statistics
   */
  getFeedbackStatistics(): Observable<any> {
    const url = `${this.baseUrl}/officer/statistics`;
    console.log('Calling getFeedbackStatistics with URL:', url);
    console.log('Headers (no auth):', this.getHeadersNoAuth());
    
    return this.http.get<any>(url, { headers: this.getHeadersNoAuth() });
  }

  /**
   * Get all feedback without pagination (fallback method)
   * 
   * This method is useful for debugging and as a fallback when
   * paginated methods fail.
   * 
   * @returns Observable that emits all feedback data
   */
  getAllFeedbackSimple(): Observable<Feedback[]> {
    const url = `${this.baseUrl}/officer/all-simple`;
    console.log('Calling getAllFeedbackSimple with URL:', url);
    console.log('Headers (no auth):', this.getHeadersNoAuth());
    
    return this.http.get<Feedback[]>(url, { headers: this.getHeadersNoAuth() });
  }

  /**
   * Get feedback count for testing
   * 
   * @returns Observable that emits the feedback count
   */
  getFeedbackCount(): Observable<string> {
    const url = `${this.baseUrl}/count`;
    console.log('Calling getFeedbackCount with URL:', url);
    console.log('Headers (no auth):', this.getHeadersNoAuth());
    
    return this.http.get<string>(url, { headers: this.getHeadersNoAuth() });
  }

  /**
   * Add new feedback from a customer
   * 
   * Submits new feedback including rating, comments, and booking reference.
   * This allows customers to provide their experience and ratings.
   * 
   * @param feedbackRequest Feedback data including rating, comments, booking ID, etc.
   * @returns Observable that emits the feedback submission response
   */
  addFeedback(feedbackRequest: any): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.baseUrl}/add`, feedbackRequest, { headers: this.getHeaders() });
  }
} 