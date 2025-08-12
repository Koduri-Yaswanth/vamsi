import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingPage } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class AllBookingsService {
  private baseUrl = 'http://localhost:8080/api/all-bookings';

  constructor(private http: HttpClient) { }

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

  getAllBookings(page: number, size: number): Observable<BookingPage> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<BookingPage>(url, { headers: this.getHeaders() });
  }
}