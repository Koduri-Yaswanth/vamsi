import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../shared/navbar.component';
import { TrackingService } from '../../../services/tracking.service';

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
            <mat-icon>track_changes</mat-icon>
            <span>Package Tracking</span>
          </div>
          <h1 class="tracking-title">Track Package</h1>
          <p class="tracking-subtitle">Enter booking ID to track shipment status</p>
        </div>

        <!-- Tracking Form Section -->
        <div class="tracking-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Track Package</h2>
              <p>Enter booking ID to track shipment status</p>
            </div>

            <form [formGroup]="trackingForm" (ngSubmit)="trackPackage()" class="tracking-form">
              <div class="form-field-container">
                <label class="field-label">Booking ID</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput formControlName="bookingId" placeholder="Enter the booking ID">
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
                  <span *ngIf="!isLoading">Track Package</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tracking Result Section -->
        <div class="tracking-result-section" *ngIf="trackingResult">
          <div class="result-card">
            <div class="result-header">
              <div class="result-badge">
                <mat-icon>info</mat-icon>
                <span>Tracking Information</span>
              </div>
              <h2>Package Details</h2>
            </div>

            <div class="result-content">
              <div class="status-section">
                <div class="status-header">
                  <h3>Current Status</h3>
                  <div class="status-badge" [class]="'status-' + trackingResult.parcelStatus?.toLowerCase()">
                    <mat-icon>{{ getStatusIcon(trackingResult.parcelStatus) }}</mat-icon>
                    <span>{{ trackingResult.parcelStatus }}</span>
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
                    <span class="detail-value">{{ trackingResult.bookingId }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Customer Name</span>
                    <span class="detail-value">{{ trackingResult.customerName }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>person_add</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Receiver Name</span>
                    <span class="detail-value">{{ trackingResult.receiverName }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>location_on</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Receiver Address</span>
                    <span class="detail-value">{{ trackingResult.receiverAddress }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>phone</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Receiver Mobile</span>
                    <span class="detail-value">{{ trackingResult.receiverMobile }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>inventory</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Package Weight</span>
                    <span class="detail-value">{{ trackingResult.packageWeight }} kg</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>description</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Package Description</span>
                    <span class="detail-value">{{ trackingResult.packageDescription }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>local_shipping</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Delivery Type</span>
                    <span class="detail-value">{{ getDeliveryTypeName(trackingResult.deliveryType) }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>inventory_2</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Packing Type</span>
                    <span class="detail-value">{{ getPackingTypeName(trackingResult.packingType) }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Pickup Date</span>
                    <span class="detail-value">{{ trackingResult.pickupDate | date:'mediumDate' }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>access_time</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Pickup Time</span>
                    <span class="detail-value">{{ trackingResult.pickupTime }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <mat-icon>payments</mat-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value amount">₹{{ trackingResult.totalAmount }}</span>
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
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem 0;
    }

    .tracking-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .tracking-header {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
    }

    .tracking-title {
      font-size: 3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .tracking-subtitle {
      font-size: 1.125rem;
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }

    .tracking-form-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .form-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .form-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .form-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .form-header p {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
    }

    .form-field-container {
      margin-bottom: 2rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      display: block;
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      text-align: center;
    }

    .track-button {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 1rem 3rem;
      border-radius: 50px;
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 200px;
      justify-content: center;
    }

    .track-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4);
    }

    .track-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .tracking-result-section {
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .result-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .result-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .result-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    .result-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .status-section {
      margin-bottom: 3rem;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .status-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .status-pending {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .status-in_transit {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .status-out_for_delivery {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
    }

    .status-delivered {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .status-failed_delivery {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .status-returned {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: white;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .detail-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border-color: #0891b2;
    }

    .detail-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .detail-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .detail-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.4;
    }

    .detail-value.amount {
      color: #0891b2;
      font-size: 1.125rem;
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

    @media (max-width: 768px) {
      .tracking-content {
        padding: 0 1rem;
      }

      .tracking-title {
        font-size: 2rem;
      }

      .form-card,
      .result-card {
        padding: 2rem 1.5rem;
      }

      .details-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .status-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .track-button {
        width: 100%;
        padding: 1rem 2rem;
      }
    }
  `]
})
export class TrackingComponent implements OnInit {
  trackingForm: FormGroup;
  isLoading = false;
  trackingResult: any = null;

  constructor(
    private fb: FormBuilder,
    private trackingService: TrackingService,
    private snackBar: MatSnackBar
  ) {
    this.trackingForm = this.fb.group({
      bookingId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  trackPackage() {
    if (this.trackingForm.valid) {
      this.isLoading = true;
      const bookingId = this.trackingForm.get('bookingId')?.value;

      this.trackingService.trackOfficerBooking(bookingId).subscribe({
        next: (response) => {
          this.trackingResult = response;
          this.isLoading = false;
          this.snackBar.open('Package tracked successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.trackingResult = null;
          this.snackBar.open('Error tracking package. Please check the booking ID.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
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
      case 'OUT_FOR_DELIVERY':
        return 'delivery_dining';
      case 'DELIVERED':
        return 'check_circle';
      case 'FAILED_DELIVERY':
        return 'error';
      case 'RETURNED':
        return 'undo';
      default:
        return 'help';
    }
  }

  getDeliveryTypeName(type: string): string {
    switch (type) {
      case 'STANDARD':
        return 'Standard Delivery';
      case 'EXPRESS':
        return 'Express Delivery';
      case 'SAME_DAY':
        return 'Same Day Delivery';
      default:
        return type;
    }
  }

  getPackingTypeName(type: string): string {
    switch (type) {
      case 'BASIC':
        return 'Basic Packing';
      case 'PREMIUM':
        return 'Premium Packing';
      default:
        return type;
    }
  }
} 