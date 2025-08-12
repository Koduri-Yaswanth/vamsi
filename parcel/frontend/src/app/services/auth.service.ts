import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations in the frontend application.
 * It communicates with the backend API to manage user registration, login, logout,
 * and session management for both customers and officers.
 * 
 * Key Concepts:
 * - @Injectable: Marks this class as a service that can be injected into components
 * - providedIn: 'root' - Makes this service available throughout the entire application
 * - HttpClient: Angular service for making HTTP requests to the backend
 * - Observable: RxJS concept for handling asynchronous data streams
 * - localStorage: Browser storage for persisting user sessions
 * 
 * Service Responsibilities:
 * 1. Make HTTP requests to backend authentication endpoints
 * 2. Manage user sessions (tokens and user data)
 * 3. Provide authentication status checks
 * 4. Handle login/logout for different user roles
 * 5. Manage password changes
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  /**
   * Base URL for authentication API endpoints
   * Points to the Spring Boot backend server
   */
  private baseUrl = 'http://localhost:8080/api/auth';

  /**
   * Constructor - injects HttpClient for making API calls
   * 
   * @param http Angular's HTTP client for making requests to backend
   */
  constructor(private http: HttpClient) { }

  /**
   * Creates HTTP headers for API requests
   * Sets Content-Type to application/json for JSON data
   * 
   * @returns HttpHeaders object with JSON content type
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Register a new user (customer or officer)
   * 
   * Sends registration data to backend and returns the response
   * 
   * @param registerRequest User registration data (name, email, password, etc.)
   * @returns Observable that emits the registration response
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, registerRequest, { headers: this.getHeaders() });
  }

  /**
   * Login for customers
   * 
   * Sends login credentials to backend and returns authentication response
   * 
   * @param loginRequest Login credentials (unique ID and password)
   * @returns Observable that emits the login response
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginRequest, { headers: this.getHeaders() });
  }

  /**
   * Login for officers
   * 
   * Sends login credentials to backend and returns authentication response
   * 
   * @param loginRequest Login credentials (unique ID and password)
   * @returns Observable that emits the login response
   */
  officerLogin(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/officer-login`, loginRequest, { headers: this.getHeaders() });
  }

  /**
   * Get the currently logged-in user
   * 
   * Determines which user is currently active based on stored tokens.
   * Handles cases where both customer and officer might be logged in.
   * 
   * @returns User object or null if no user is logged in
   */
  getCurrentUser(): any {
    // Check which token is available to determine the user type
    const customerToken = localStorage.getItem('customer_token');
    const officerToken = localStorage.getItem('officer_token');
    
    if (customerToken && !officerToken) {
      // Only customer is logged in
      const customerUser = localStorage.getItem('customer_user');
      return customerUser ? JSON.parse(customerUser) : null;
    } else if (officerToken && !customerToken) {
      // Only officer is logged in
      const officerUser = localStorage.getItem('officer_user');
      return officerUser ? JSON.parse(officerUser) : null;
    } else if (customerToken && officerToken) {
      // Both are logged in - return the most recently accessed one
      // For now, prioritize customer if both exist
      const customerUser = localStorage.getItem('customer_user');
      return customerUser ? JSON.parse(customerUser) : null;
    }
    return null;
  }

  /**
   * Get user by specific role
   * 
   * @param role User role ('CUSTOMER' or 'OFFICER')
   * @returns User object for the specified role or null
   */
  getCurrentUserByRole(role: string): any {
    if (role === 'CUSTOMER') {
      const user = localStorage.getItem('customer_user');
      return user ? JSON.parse(user) : null;
    } else if (role === 'OFFICER') {
      const user = localStorage.getItem('officer_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  /**
   * Get user based on current route
   * 
   * Determines which user to return based on the URL path
   * 
   * @param route Current route path
   * @returns User object appropriate for the current route
   */
  getCurrentUserByRoute(route: string): any {
    // Determine which user to return based on the current route
    if (route.startsWith('/customer')) {
      return this.getCurrentUserByRole('CUSTOMER');
    } else if (route.startsWith('/officer')) {
      return this.getCurrentUserByRole('OFFICER');
    } else {
      // Default to customer if route is ambiguous
      return this.getCurrentUserByRole('CUSTOMER') || this.getCurrentUserByRole('OFFICER');
    }
  }

  /**
   * Check if any user is authenticated
   * 
   * @returns true if any user (customer or officer) is logged in
   */
  isAuthenticated(): boolean {
    return !!(localStorage.getItem('customer_token') || localStorage.getItem('officer_token'));
  }

  /**
   * Check if a customer is authenticated
   * 
   * @returns true if a customer is logged in
   */
  isCustomerAuthenticated(): boolean {
    return !!localStorage.getItem('customer_token');
  }

  /**
   * Check if an officer is authenticated
   * 
   * @returns true if an officer is logged in
   */
  isOfficerAuthenticated(): boolean {
    return !!localStorage.getItem('officer_token');
  }

  /**
   * Logout all users
   * 
   * Clears all stored tokens and user data from localStorage
   */
  logout(): void {
    // Clear both customer and officer sessions
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    localStorage.removeItem('officer_token');
    localStorage.removeItem('officer_user');
  }

  /**
   * Logout user by specific role
   * 
   * @param role User role to logout ('CUSTOMER' or 'OFFICER')
   */
  logoutByRole(role: string): void {
    if (role === 'CUSTOMER') {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_user');
    } else if (role === 'OFFICER') {
      localStorage.removeItem('officer_token');
      localStorage.removeItem('officer_user');
    }
  }

  /**
   * Logout the current role based on context
   * 
   * Determines which role to logout based on current tokens
   */
  logoutCurrentRole(): void {
    // Determine which role to logout based on current route or context
    const customerToken = localStorage.getItem('customer_token');
    const officerToken = localStorage.getItem('officer_token');
    
    // If both are logged in, logout the one that's not being used
    if (customerToken && officerToken) {
      // This is a simplified approach - in a real app, you might want to use route detection
      // For now, we'll logout both to be safe
      this.logout();
    } else if (customerToken) {
      this.logoutByRole('CUSTOMER');
    } else if (officerToken) {
      this.logoutByRole('OFFICER');
    }
  }

  /**
   * Change user password
   * 
   * Sends password change request to backend with authentication token
   * 
   * @param passwordData Password change data (current, new, confirm passwords)
   * @returns Observable that emits the password change response
   */
  changePassword(passwordData: any): Observable<any> {
    // Get the appropriate token (customer or officer)
    const customerToken = localStorage.getItem('customer_token');
    const officerToken = localStorage.getItem('officer_token');
    const token = customerToken || officerToken;
    
    // Create headers with authentication token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Make HTTP request to change password endpoint
    return this.http.post<any>(`${this.baseUrl}/change-password`, passwordData, { headers })
      .pipe(
        // Handle any errors that occur during the request
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
} 