import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../services/booking.service';
import { CancelBookingService } from '../../../services/cancel-booking.service';
import { BookingPage, Booking } from '../../../models/booking.model';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="all-bookings-container">
      <div class="all-bookings-content">
        <!-- Header Section -->
        <div class="all-bookings-header">
          <div class="header-badge">
            <mat-icon>list_alt</mat-icon>
            <span>All Bookings</span>
          </div>
          <h1 class="all-bookings-title">Manage All Bookings</h1>
          <p class="all-bookings-subtitle">View and manage all customer bookings in the system</p>
          <div class="filter-buttons">
            <button mat-raised-button class="filter-btn primary" [class.active]="filter==='OFFICER'" (click)="showOfficerBookings()">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Officer Bookings</span>
            </button>
            <button mat-stroked-button class="filter-btn" [class.active-outline]="filter==='CUSTOMER'" (click)="showCustomerBookings()">
              <mat-icon>people</mat-icon>
              <span>Customer Bookings</span>
            </button>
            <button mat-button class="filter-btn reset" [class.active-text]="filter==='ALL'" (click)="resetFilter()">
              <mat-icon>refresh</mat-icon>
              <span>All</span>
            </button>
          </div>
        </div>

        <!-- Statistics Section -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>receipt</mat-icon>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ getOrderedCount() }}</h3>
                <p class="stat-label">Ordered</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon delivered">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ getDeliveredCount() }}</h3>
                <p class="stat-label">Delivered</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon in-transit">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ getInTransitCount() }}</h3>
                <p class="stat-label">In Transit</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon pending">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ getPendingCount() }}</h3>
                <p class="stat-label">Pending</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon" style="background: linear-gradient(135deg, var(--error-color) 0%, var(--error-dark) 100%);">
                <mat-icon>cancel</mat-icon>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ getCancelledCount() }}</h3>
                <p class="stat-label">Cancelled</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings Table Section -->
        <div class="bookings-table-section">
          <div class="table-card">
            <div class="table-header">
              <h2>All Bookings</h2>
              <p>Complete list of all customer bookings</p>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="bookings" class="bookings-table">
                <!-- Customer/Officer ID Column -->
                <ng-container matColumnDef="customerId">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>badge</mat-icon>
                      <span>{{ idHeaderLabel }}</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value">{{ getIdForRow(booking) }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Customer Name Column -->
                <ng-container matColumnDef="customerName">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>person_outline</mat-icon>
                      <span>Customer Name</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value">{{ booking.customer?.customerName || 'N/A' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Booking ID Column -->
                <ng-container matColumnDef="bookingId">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>receipt</mat-icon>
                      <span>Booking ID</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value booking-id">{{ booking.bookingId }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Booking Date Column -->
                <ng-container matColumnDef="bookingDate">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>schedule</mat-icon>
                      <span>Booking Date</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value">{{ booking.createdAt | date:'medium' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Receiver Name Column -->
                <ng-container matColumnDef="receiverName">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>person_add</mat-icon>
                      <span>Receiver Name</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value">{{ booking.receiverName }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Delivery Address Column -->
                <ng-container matColumnDef="deliveryAddress">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>location_on</mat-icon>
                      <span>Delivery Address</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value address">{{ booking.receiverAddress }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Amount Column -->
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>payments</mat-icon>
                      <span>Amount</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <span class="cell-value amount">₹{{ booking.parcelServiceCost | number:'1.2-2' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>info</mat-icon>
                      <span>Status</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <div class="status-badge" [class]="'status-' + booking.parcelStatus.toLowerCase()">
                        <mat-icon>{{ getStatusIcon(booking.parcelStatus) }}</mat-icon>
                        <span>{{ booking.parcelStatus }}</span>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>settings</mat-icon>
                      <span>Actions</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let booking" class="table-cell">
                    <div class="cell-content">
                      <div class="action-buttons">
                    <button mat-button class="action-btn track-btn" (click)="trackBooking(booking.bookingId)">
                      <mat-icon>track_changes</mat-icon>
                          <span>Track</span>
                    </button>
                    <button mat-button class="action-btn cancel-btn" 
                            *ngIf="booking.parcelStatus === 'BOOKED'"
                            (click)="cancelBooking(booking.bookingId)">
                      <mat-icon>cancel</mat-icon>
                          <span>Cancel</span>
                    </button>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns" class="table-header-row"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
              </table>
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
    </div>
  `,
  styles: [`
    .all-bookings-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .all-bookings-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, var(--primary-light) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, var(--accent-light) 0%, transparent 50%);
      opacity: 0.1;
      pointer-events: none;
    }

    .all-bookings-content {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .all-bookings-header {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1rem;
      box-shadow: var(--shadow-sm);
    }

    .header-badge mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .all-bookings-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .all-bookings-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .filter-buttons {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    .filter-btn { display: inline-flex; align-items: center; gap: 0.5rem; transition: box-shadow var(--transition-fast); }
    .filter-btn.primary { background: var(--primary-color); color: var(--text-inverse); }
    .filter-btn.reset { color: var(--text-primary); }
    .filter-btn.active, .filter-btn.active-outline, .filter-btn.active-text { box-shadow: 0 0 0 3px rgba(8,145,178,0.25); }

    .stats-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--background-card);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all var(--transition-fast);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon.pending {
      background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-dark) 100%);
    }

    .stat-icon.in-transit {
      background: linear-gradient(135deg, var(--info-color) 0%, var(--info-dark) 100%);
    }

    .stat-icon.delivered {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark) 100%);
    }

    .stat-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-inverse);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
      font-weight: 500;
    }

    .bookings-table-section {
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .table-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .table-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .table-header h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .table-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .table-container {
      overflow-x: auto;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      background: var(--background-secondary);
    }

    .bookings-table {
      width: 100%;
      background: var(--background-secondary);
    }

    .table-header-row {
      background: var(--background-tertiary);
    }

    .table-header-cell {
      padding: 1rem;
      border-bottom: 2px solid var(--border-light);
      background: var(--background-tertiary);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .header-content mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: var(--primary-color);
    }

    .table-row {
      transition: all var(--transition-fast);
    }

    .table-row:hover {
      background: var(--background-card);
    }

    .table-cell {
      padding: 1rem;
      border-bottom: 1px solid var(--border-light);
      vertical-align: middle;
    }

    .cell-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cell-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .cell-value.booking-id {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: var(--primary-color);
    }

    .cell-value.amount {
      font-weight: 600;
      color: var(--success-color);
    }

    .cell-value.address {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    /* Neutral styles for most statuses */
    .status-pending,
    .status-booked,
    .status-in_transit {
      background: var(--background-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-light);
    }

    /* Only Delivered in green */
    .status-delivered {
      background: #ecfdf5 !important; /* green-50 */
      color: #065f46 !important;      /* green-800 */
      border: 1px solid #10b981 !important; /* green-500 */
    }

    /* Only Cancelled in red */
    .status-cancelled {
      background: #fef2f2 !important; /* red-50 */
      color: #991b1b !important;      /* red-800 */
      border: 1px solid #ef4444 !important; /* red-500 */
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
      transition: all var(--transition-fast);
      min-height: auto;
    }

    .action-btn mat-icon {
      font-size: 0.875rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    .track-btn {
      background: var(--primary-light);
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }

    .track-btn:hover {
      background: var(--primary-color);
      color: var(--text-inverse);
    }

    .cancel-btn {
      background: var(--error-light);
      color: var(--error-color);
      border: 1px solid var(--error-color);
    }

    .cancel-btn:hover {
      background: var(--error-color);
      color: var(--text-inverse);
    }

    .pagination-section {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
    }

    .custom-paginator {
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      padding: 1rem;
      border: 1px solid var(--border-light);
    }

    @media (max-width: 768px) {
      .all-bookings-container {
        padding: 100px 1rem 2rem;
      }

      .all-bookings-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .table-card {
        padding: 1rem;
      }

      .table-container {
        overflow-x: auto;
      }

      .bookings-table {
        min-width: 800px;
      }

      .action-buttons {
        flex-direction: column;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AllBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  displayedColumns: string[] = ['customerId', 'customerName', 'bookingId', 'bookingDate', 'receiverName', 'deliveryAddress', 'amount', 'status', 'actions'];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  filter: 'ALL' | 'OFFICER' | 'CUSTOMER' = 'ALL';
  idHeaderLabel = 'Customer ID';

  constructor(
    private bookingService: BookingService,
    private cancelBookingService: CancelBookingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings(this.currentPage, this.pageSize).subscribe({
      next: (response: BookingPage) => {
        let rows = response.content;
        if (this.filter === 'OFFICER') {
          rows = rows.filter(b => (b.customer?.role || '').toString() === 'OFFICER');
          this.idHeaderLabel = 'Officer ID';
        } else if (this.filter === 'CUSTOMER') {
          rows = rows.filter(b => (b.customer?.role || '').toString() === 'CUSTOMER');
          this.idHeaderLabel = 'Customer ID';
        } else {
          this.idHeaderLabel = 'Customer ID';
        }
        this.bookings = rows;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
    });
  }

  showOfficerBookings() {
    this.filter = 'OFFICER';
    this.currentPage = 0;
    this.loadBookings();
  }

  showCustomerBookings() {
    this.filter = 'CUSTOMER';
    this.currentPage = 0;
    this.loadBookings();
  }

  resetFilter() {
    this.filter = 'ALL';
    this.currentPage = 0;
    this.loadBookings();
  }

  getIdForRow(booking: Booking): string {
    // Officer/Customer ID used during login; prefer uniqueId if present, else id
    const unique = booking.customer?.uniqueId;
    const id = booking.customer?.id || booking.customerId;
    return unique || (id ? id.toString() : '');
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBookings();
  }

  trackBooking(bookingId: string) {
    this.router.navigate(['/officer/tracking'], { queryParams: { bookingId } });
  }

  cancelBooking(bookingId: string) {
      this.cancelBookingService.cancelOfficerBooking(bookingId).subscribe({
      next: (response: any) => {
            this.snackBar.open('Booking cancelled successfully', 'Close', { duration: 3000 });
            this.loadBookings();
        },
      error: (error: any) => {
        this.snackBar.open('Failed to cancel booking', 'Close', { duration: 3000 });
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

  getPendingCount(): number {
    // Pending = Ordered - Delivered (page-level)
    return Math.max(this.getOrderedCount() - this.getDeliveredCount(), 0);
  }

  getInTransitCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'IN_TRANSIT').length;
  }

  getDeliveredCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'DELIVERED').length;
  }

  getBookedCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'BOOKED').length;
  }

  getCancelledCount(): number {
    return this.bookings.filter(booking => booking.parcelStatus === 'CANCELLED').length;
  }

  getOrderedCount(): number {
    // Show ordered as the number of rows currently loaded (page-level)
    return this.bookings.length;
  }
}