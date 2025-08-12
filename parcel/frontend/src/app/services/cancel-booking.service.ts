import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CancelResponse } from '../models/cancel-booking.model';

@Injectable({
  providedIn: 'root'
})
export class CancelBookingService {
  private baseUrl = 'http://localhost:8080/api/cancel-booking';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    // Get both tokens
    const officerToken = localStorage.getItem('officer_token');
    const customerToken = localStorage.getItem('customer_token');
    
    // For customer cancellations, prioritize customer token
    // For officer cancellations, prioritize officer token
    const token = customerToken || officerToken;
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  cancelCustomerBooking(bookingId: string): Observable<CancelResponse> {
    try {
      console.log('Cancel booking service - cancelling customer booking:', bookingId);
      const headers = this.getHeaders();
      console.log('Headers:', headers);
      return this.http.post<CancelResponse>(`${this.baseUrl}/customer?bookingId=${bookingId}`, {}, { headers });
    } catch (error) {
      console.error('Cancel booking service error:', error);
      return throwError(() => error);
    }
  }

  cancelOfficerBooking(bookingId: string): Observable<CancelResponse> {
    try {
      const headers = this.getHeaders();
      return this.http.post<CancelResponse>(`${this.baseUrl}/officer?bookingId=${bookingId}`, {}, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  testAuthentication(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`, { headers: this.getHeaders() });
  }
} 