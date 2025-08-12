import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TrackingService } from '../../../services/tracking.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-tracking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="tracking-container">
      <div class="tracking-content">
        <!-- Header Section -->
        <div class="tracking-header">
          <div class="header-badge">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Officer Tracking</span>
          </div>
          <h1 class="tracking-title">Track Parcel</h1>
          <p class="tracking-subtitle">Enter Booking ID to track any parcel with full officer privileges</p>
        </div>

        <!-- Tracking Form Section -->
        <div class="tracking-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Track Parcel</h2>
              <p>Enter the booking ID to access detailed tracking information</p>
            </div>

            <form [formGroup]="trackingForm" (ngSubmit)="trackParcel()" class="tracking-form">
                <div class="form-field-container">
                  <label class="field-label">Booking ID</label>
                  <mat-form-field appearance="outline" class="form-field">
                  <input matInput formControlName="bookingId" placeholder="Enter booking ID">
                    <mat-error *ngIf="trackingForm.get('bookingId')?.hasError('required')">
                      Booking ID is required
                    </mat-error>
                  </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-raised-button type="submit"
                        [disabled]="trackingForm.invalid || isLoading"
                        class="track-button">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">search</mat-icon>
                  <span *ngIf="!isLoading">Track Parcel</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tracking Result Section -->
        <div class="tracking-result-section" *ngIf="trackingData">
          <div class="result-card">
            <div class="result-header">
              <div class="result-badge">
                <mat-icon>info</mat-icon>
                <span>Tracking Information</span>
              </div>
              <h2>Parcel Details</h2>
            </div>

            <div class="result-content">
              <div class="status-section">
                <div class="status-header">
                  <h3>Current Status</h3>
                  <div class="status-badge" [class]="'status-' + trackingData.parcelStatus?.toLowerCase()">
                    <mat-icon>{{ getStatusIcon(trackingData.parcelStatus) }}</mat-icon>
                    <span>{{ trackingData.parcelStatus }}</span>
                  </div>
                </div>
              </div>

              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>receipt</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">{{ trackingData.bookingId }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Customer Name</span>
                    <span class="detail-value">{{ trackingData.customer?.customerName }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>location_on</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Customer Address</span>
                    <span class="detail-value">{{ trackingData.customer?.address }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>person_add</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Receiver Name</span>
                    <span class="detail-value">{{ trackingData.receiverName }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>location_on</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Receiver Address</span>
                    <span class="detail-value">{{ trackingData.receiverAddress }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Created Date</span>
                    <span class="detail-value">{{ trackingData.createdAt | date:'medium' }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>inventory_2</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Package Type</span>
                    <span class="detail-value">{{ trackingData.packageType }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>scale</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Weight</span>
                    <span class="detail-value">{{ trackingData.weight }} kg</span>
                  </div>
                </div>
              </div>

              <!-- Tracking Timeline -->
              <div class="timeline-section">
                <h3>Tracking Timeline</h3>
                <div class="timeline">
                  <div class="timeline-item completed">
                    <div class="timeline-icon">
                      <mat-icon>check_circle</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <h4>Booking Created</h4>
                      <p>Customer booking has been successfully created</p>
                      <span class="timeline-time">{{ trackingData.createdAt | date:'short' }}</span>
                    </div>
                  </div>

                  <div class="timeline-item" [class.completed]="trackingData.parcelStatus !== 'PENDING'">
                    <div class="timeline-icon">
                      <mat-icon>{{ trackingData.parcelStatus !== 'PENDING' ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <h4>Pickup Scheduled</h4>
                      <p>Pickup has been scheduled for the package</p>
                      <span class="timeline-time">In Progress</span>
                    </div>
                  </div>

                  <div class="timeline-item" [class.completed]="trackingData.parcelStatus === 'IN_TRANSIT' || trackingData.parcelStatus === 'DELIVERED'">
                    <div class="timeline-icon">
                      <mat-icon>{{ (trackingData.parcelStatus === 'IN_TRANSIT' || trackingData.parcelStatus === 'DELIVERED') ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <h4>In Transit</h4>
                      <p>Package is currently in transit to destination</p>
                      <span class="timeline-time">In Progress</span>
                    </div>
                  </div>

                  <div class="timeline-item" [class.completed]="trackingData.parcelStatus === 'DELIVERED'">
                    <div class="timeline-icon">
                      <mat-icon>{{ trackingData.parcelStatus === 'DELIVERED' ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <h4>Delivered</h4>
                      <p>Package has been successfully delivered</p>
                      <span class="timeline-time">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .tracking-container::before {
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

    .tracking-content {
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .tracking-header {
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

    .tracking-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .tracking-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Tracking Form Section */
    .tracking-form-section {
      margin-bottom: 3rem;
    }

    .form-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
    }

    .form-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .form-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .form-header p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
    }

    .tracking-form {
      max-width: 500px;
      margin: 0 auto;
    }

    .form-field-container {
      margin-bottom: 2rem;
    }

    .field-label {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
      display: block;
    }

    .form-field {
      width: 100%;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      transition: all var(--transition-fast);
      padding: 0.5rem 0;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper:hover {
      border-color: var(--primary-color);
      background: var(--background-primary);
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--focused {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .form-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      background: transparent;
    }

    .form-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .form-actions {
      display: flex;
      justify-content: center;
    }

    .track-button {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      border: none;
      padding: 1.25rem 3rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 1.125rem;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      letter-spacing: 0.025em;
    }

    .track-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .track-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Tracking Result Section */
    .tracking-result-section {
      margin-top: 3rem;
    }

    .result-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
    }

    .result-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .result-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      color: var(--success-color);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .result-badge mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .result-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .result-content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    /* Status Section */
    .status-section {
      text-align: center;
    }

    .status-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .status-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: 1rem;
    }

    .status-badge.pending {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning-color);
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    .status-badge.in_transit {
      background: rgba(8, 145, 178, 0.1);
      color: var(--primary-color);
      border: 1px solid rgba(8, 145, 178, 0.2);
    }

    .status-badge.delivered {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success-color);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .status-badge.cancelled {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .detail-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .detail-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon mat-icon {
      color: var(--text-inverse);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
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
    }

    /* Timeline Section */
    .timeline-section {
      border-top: 1px solid var(--border-light);
      padding-top: 3rem;
    }

    .timeline-section h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2rem;
      text-align: center;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 1.5rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border-light);
      z-index: 1;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 2rem;
      position: relative;
      z-index: 2;
    }

    .timeline-icon {
      width: 3rem;
      height: 3rem;
      background: var(--background-primary);
      border: 2px solid var(--border-medium);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }

    .timeline-item.completed .timeline-icon {
      background: var(--success-color);
      border-color: var(--success-color);
    }

    .timeline-icon mat-icon {
      color: var(--text-muted);
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .timeline-item.completed .timeline-icon mat-icon {
      color: var(--text-inverse);
    }

    .timeline-content {
      flex: 1;
      padding-top: 0.25rem;
    }

    .timeline-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .timeline-content p {
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .timeline-time {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .tracking-container {
        padding: 100px 2rem 2rem;
      }

      .tracking-title {
        font-size: 2.5rem;
      }

      .form-card,
      .result-card {
        padding: 2rem;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .tracking-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .tracking-title {
        font-size: 2rem;
      }

      .form-card,
      .result-card {
        padding: 1.5rem;
      }

      .timeline-item {
        gap: 1.5rem;
      }

      .timeline::before {
        left: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .tracking-container {
        padding: 70px 1rem 1rem;
      }

      .tracking-title {
        font-size: 1.75rem;
      }

      .form-card,
      .result-card {
        padding: 1rem;
      }

      .detail-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }
  `]
})
export class OfficerTrackingComponent implements OnInit {
  trackingForm: FormGroup;
  isLoading = false;
  trackingData: any = null;

  constructor(
    private fb: FormBuilder,
    private trackingService: TrackingService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.trackingForm = this.fb.group({
      bookingId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check for booking ID in query parameters
    this.route.queryParams.subscribe(params => {
      const bookingId = params['bookingId'];
      if (bookingId) {
        this.trackingForm.patchValue({ bookingId: bookingId });
        this.trackParcel();
      }
    });
  }

  trackParcel() {
    if (this.trackingForm.valid) {
      this.isLoading = true;
      const bookingId = this.trackingForm.get('bookingId')?.value;

      this.trackingService.trackOfficerBooking(bookingId).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.trackingData = response.booking;
          } else {
            this.snackBar.open(response.message || 'Tracking failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Tracking failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'schedule';
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
}