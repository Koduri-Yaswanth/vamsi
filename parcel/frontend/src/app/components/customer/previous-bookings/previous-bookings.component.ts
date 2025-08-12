import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviousBookingsService } from '../../../services/previous-bookings.service';
import { BookingPage, Booking } from '../../../models/booking.model';
import { NavbarComponent } from '../../shared/navbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-previous-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NavbarComponent,
    MatIconModule
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="bookings-container">
      <div class="bookings-content">
        <!-- Header Section -->
        <div class="bookings-header">
          <div class="header-badge">
            <mat-icon>history</mat-icon>
            <span>Booking History</span>
          </div>
          <h1 class="bookings-title">Previous Bookings</h1>
          <p class="bookings-subtitle">View and manage your complete booking history</p>
        </div>

        <!-- Statistics Section -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>receipt</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getOrderedCount() }}</div>
                <div class="stat-label">Ordered</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getCompletedCount() }}</div>
                <div class="stat-label">Delivered</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getInTransitCount() }}</div>
                <div class="stat-label">In Transit</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getPendingCount() }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>cancel</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getCancelledCount() }}</div>
                <div class="stat-label">Cancelled</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings List Section -->
        <div class="bookings-list-section">
          <div class="list-header">
            <h2>Your Bookings</h2>
            <div class="list-actions">
              <button mat-stroked-button class="export-button" (click)="exportBookings('xls')">
                <mat-icon>download</mat-icon>
                Export Excel
              </button>
              <button mat-stroked-button class="export-button" (click)="exportBookings('pdf')">
                <mat-icon>picture_as_pdf</mat-icon>
                Export PDF
              </button>
            </div>
          </div>

          <div class="bookings-grid">
            <div class="booking-card" *ngFor="let booking of bookings">
              <div class="booking-header">
                <div class="booking-id">
                  <mat-icon>receipt</mat-icon>
                  <span>{{ booking.bookingId }}</span>
                </div>
                <div class="status-badge" [class]="'status-' + booking.parcelStatus.toLowerCase()">
                  <mat-icon>{{ getStatusIcon(booking.parcelStatus) }}</mat-icon>
                  <span>{{ booking.parcelStatus }}</span>
                </div>
              </div>

              <div class="booking-details">
                <div class="detail-row">
                  <div class="detail-item">
                    <div class="detail-icon">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="detail-content">
                      <span class="detail-label">Receiver</span>
                      <span class="detail-value">{{ booking.receiverName }}</span>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <mat-icon>location_on</mat-icon>
                    </div>
                    <div class="detail-content">
                      <span class="detail-label">Delivery Address</span>
                      <span class="detail-value">{{ booking.receiverAddress }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-item">
                    <div class="detail-icon">
                      <mat-icon>schedule</mat-icon>
                    </div>
                    <div class="detail-content">
                      <span class="detail-label">Booking Date</span>
                      <span class="detail-value">{{ booking.createdAt | date:'medium' }}</span>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-icon">
                      <mat-icon>payments</mat-icon>
                    </div>
                    <div class="detail-content">
                      <span class="detail-label">Amount</span>
                      <span class="detail-value">₹{{ booking.parcelServiceCost | number:'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="booking-actions">
                <button mat-raised-button class="track-button" (click)="trackBooking(booking.bookingId)">
                  <mat-icon>location_on</mat-icon>
                  Track Package
                </button>
                <button mat-stroked-button class="cancel-button" (click)="cancelBooking(booking.bookingId)">
                  <mat-icon>cancel</mat-icon>
                  Cancel
                  </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination-section" *ngIf="totalElements > pageSize">
            <mat-paginator 
              [length]="totalElements"
              [pageSize]="pageSize"
              [pageIndex]="currentPage"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="onPageChange($event)"
              class="custom-paginator">
            </mat-paginator>
          </div>
        </div>
          </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .bookings-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(8, 145, 178, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
      pointer-events: none;
    }

    .bookings-content {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .bookings-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(8, 145, 178, 0.1);
      color: var(--primary-color);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 2rem;
      border: 1px solid rgba(8, 145, 178, 0.2);
      transition: all var(--transition-fast);
    }

    .header-badge:hover {
      background: rgba(8, 145, 178, 0.15);
      transform: translateY(-1px);
    }

    .header-badge mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .bookings-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .bookings-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Statistics Section */
    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      text-align: center;
      transition: all var(--transition-fast);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .stat-icon {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-dark) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      transition: all var(--transition-fast);
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.1);
    }

    .stat-icon mat-icon {
      color: var(--text-inverse);
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .stat-content {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      display: block;
    }

    .stat-label {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Bookings List Section */
    .bookings-list-section {
      margin-bottom: 3rem;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .list-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .list-actions {
      display: flex;
      gap: 1rem;
    }

    .export-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .export-button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .export-button mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .booking-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      transition: all var(--transition-fast);
    }

    .booking-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .booking-id {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.125rem;
    }

    .booking-id mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: 0.875rem;
    }

    /* Neutral badges */
    .status-badge.pending,
    .status-badge.booked,
    .status-badge.in_transit {
      background: var(--background-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-light);
    }

    /* Only delivered in green */
    .status-badge.delivered {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success-color);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    /* Only cancelled in red */
    .status-badge.cancelled {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .status-badge mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .booking-details {
      margin-bottom: 2rem;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .detail-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon mat-icon {
      color: var(--primary-color);
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .detail-content {
      flex: 1;
    }

    .detail-label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .detail-value {
      display: block;
      font-size: 1rem;
      color: var(--text-primary);
      font-weight: 600;
      line-height: 1.4;
    }

    .booking-actions {
      display: flex;
      gap: 1rem;
    }

    .track-button {
      flex: 1;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      border: none;
      padding: 0.875rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .track-button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .cancel-button {
      padding: 0.875rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .cancel-button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    /* Pagination Section */
    .pagination-section {
      display: flex;
      justify-content: center;
      margin-top: 3rem;
    }

    .custom-paginator {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 1rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .bookings-container {
        padding: 100px 2rem 2rem;
      }

      .bookings-title {
        font-size: 2.5rem;
      }

      .bookings-grid {
        grid-template-columns: 1fr;
      }

      .detail-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    @media (max-width: 768px) {
      .bookings-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .bookings-title {
        font-size: 2rem;
      }

      .list-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .list-actions {
        width: 100%;
        justify-content: center;
      }

      .booking-actions {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .bookings-container {
        padding: 70px 1rem 1rem;
      }

      .bookings-title {
        font-size: 1.75rem;
      }

      .booking-card {
        padding: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PreviousBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  displayedColumns: string[] = ['bookingId', 'bookingDate', 'receiverName', 'deliveryAddress', 'amount', 'status', 'actions'];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private previousBookingsService: PreviousBookingsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.previousBookingsService.getCustomerBookings(
      this.currentPage, 
      this.pageSize
    ).subscribe({
      next: (response: BookingPage) => {
        this.bookings = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        console.log('Loaded bookings:', this.bookings);
      },
      error: (error: any) => {
        console.error('Error loading bookings:', error);
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBookings();
  }

  trackBooking(bookingId: string) {
    this.router.navigate(['/customer/tracking'], { queryParams: { bookingId } });
  }

  cancelBooking(bookingId: string) {
    this.router.navigate(['/customer/cancel-booking'], { queryParams: { bookingId } });
  }

  exportBookings(format: string) {
    this.previousBookingsService.exportBookings(format).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookings.${format}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Export error:', error);
        this.snackBar.open('Failed to export bookings', 'Close', { duration: 3000 });
      }
    });
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'schedule';
      case 'BOOKED':
        return 'confirmed';
      case 'IN_TRANSIT':
        return 'local_shipping';
      case 'DELIVERED':
        return 'check_circle';
      case 'CANCELLED':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getCompletedCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'DELIVERED').length;
  }

  getInTransitCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'IN_TRANSIT').length;
  }

  getPendingCount(): number {
    // Pending = Ordered - Delivered for current page
    return Math.max(this.getOrderedCount() - this.getCompletedCount(), 0);
  }

  getBookedCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'BOOKED').length;
  }

  getCancelledCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'CANCELLED').length;
  }

  getOrderedCount(): number {
    return this.bookings.length;
  }
} 