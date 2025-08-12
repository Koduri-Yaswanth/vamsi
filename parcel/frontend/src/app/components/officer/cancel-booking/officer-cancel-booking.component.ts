import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CancelBookingService } from '../../../services/cancel-booking.service';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-cancel-booking',
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

    <div class="cancel-booking-container">
      <div class="cancel-booking-content">
        <div class="cancel-booking-header">
          <h1 class="cancel-booking-title">Cancel Booking</h1>
          <p class="cancel-booking-subtitle">Cancel customer bookings by booking ID</p>
        </div>

        <mat-card class="cancel-card">
          <mat-card-header>
            <mat-card-title>Cancel Booking</mat-card-title>
            <mat-card-subtitle>Cancel customer bookings by booking ID</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="cancelForm" (ngSubmit)="performCancellation()" class="cancel-form">
              <div class="form-section">
                <div class="section-title">
                  <mat-icon>cancel</mat-icon>
                  <span>Cancel Booking</span>
                </div>
                
                <div class="form-field-container">
                  <label class="field-label">Booking ID</label>
                  <mat-form-field appearance="outline" class="form-field">
                    <input matInput formControlName="bookingId">
                    <mat-error *ngIf="cancelForm.get('bookingId')?.hasError('required')">
                      Booking ID is required
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <div class="cancel-actions">
                <button mat-raised-button type="submit" 
                        [disabled]="cancelForm.invalid || isLoading"
                        class="btn-primary">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <span *ngIf="!isLoading">Cancel Booking</span>
                </button>
              </div>
            </form>

            <div class="cancel-result" *ngIf="cancelResult">
              <div class="result-title">
                <mat-icon>check_circle</mat-icon>
                <span>Cancellation Result</span>
              </div>
              <div class="result-grid">
                <div class="result-item">
                  <span class="result-label">Booking ID:</span>
                  <span class="result-value">{{ extractBookingId() }}</span>
                </div>
                <div class="result-item">
                  <span class="result-label">Status:</span>
                  <span class="result-value status-cancelled">Cancelled</span>
                </div>
                <div class="result-item">
                  <span class="result-label">Message:</span>
                  <span class="result-value">{{ cancelResult.message }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cancel-booking-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%);
      padding: 80px 20px 20px;
      position: relative;
    }

    .cancel-booking-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .cancel-booking-content {
      width: 100%;
      max-width: 800px;
      position: relative;
      z-index: 2;
    }

    .cancel-booking-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .cancel-booking-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cancel-booking-subtitle {
      font-size: 1.1rem;
      color: #a0a0a0;
      margin: 0;
    }

    .cancel-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .cancel-card ::ng-deep .mat-mdc-card-header {
      margin-bottom: 30px;
    }

    .cancel-card ::ng-deep .mat-mdc-card-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cancel-card ::ng-deep .mat-mdc-card-subtitle {
      font-size: 1.1rem;
      color: #a0a0a0;
      margin: 0;
    }

    .cancel-form {
      margin-bottom: 30px;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #ff6b35;
      display: flex;
      align-items: center;
      gap: 12px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .section-title mat-icon {
      color: #ff6b35;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .form-field-container {
      width: 100%;
      margin-bottom: 24px;
    }

    .field-label {
      display: block;
      color: #ff6b35;
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 8px;
      margin-left: 4px;
    }

    .form-field {
      width: 100%;
    }

    .form-field ::ng-deep .mat-mdc-form-field {
      color: #fff;
    }

    /* Hide the default mat-label since we're using custom labels */
    .form-field ::ng-deep .mat-mdc-form-field-label {
      display: none !important;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper:hover {
      border-color: rgba(255, 107, 53, 0.7);
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--focused {
      border-color: #ff6b35;
      background: rgba(255, 255, 255, 0.25);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
    }

    .form-field ::ng-deep .mat-mdc-input-element {
      color: #ffffff;
      font-weight: 600;
      font-size: 1rem;
    }

    .form-field ::ng-deep .mat-mdc-input-element::placeholder {
      color: rgba(255, 255, 255, 0.8);
      opacity: 1;
      font-style: italic;
      font-weight: 500;
    }

    .form-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    /* Additional form field enhancements */
    .form-field ::ng-deep .mat-mdc-form-field-infix {
      padding: 12px 0;
    }

    .form-field ::ng-deep .mat-mdc-form-field-outline {
      color: rgba(255, 255, 255, 0.2);
    }

    .form-field ::ng-deep .mat-mdc-form-field-outline-thick {
      color: #ff6b35;
    }

    /* Enhanced focus states */
    .form-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline-thick {
      color: #ff6b35;
    }

    .form-field ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-label {
      color: #ff6b35;
    }

    .form-field ::ng-deep .mat-mdc-form-field-error {
      color: #ff6b6b;
      font-size: 0.85rem;
      margin-top: 8px;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .cancel-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 32px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 32px rgba(244, 67, 54, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(244, 67, 54, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .cancel-result {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      margin-top: 32px;
    }

    .result-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 20px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .result-title mat-icon {
      color: #4caf50;
    }

    .result-grid {
      display: grid;
      gap: 16px;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .result-label {
      color: #e0e0e0;
      font-size: 0.9rem;
    }

    .result-value {
      color: #ffffff;
      font-weight: 600;
    }

    .status-cancelled {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .cancel-booking-container {
        padding: 60px 20px 20px;
      }

      .cancel-card {
        padding: 30px 20px;
      }

      .cancel-booking-title {
        font-size: 2rem;
      }

      .cancel-actions {
        flex-direction: column;
        align-items: center;
      }

      .result-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .cancel-booking-title {
        font-size: 1.8rem;
      }

      .cancel-card {
        padding: 20px 15px;
      }
    }
  `]
})
export class OfficerCancelBookingComponent implements OnInit {
  cancelForm: FormGroup;
  isLoading = false;
  cancelResult: any = null;

  constructor(
    private fb: FormBuilder,
    private cancelBookingService: CancelBookingService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.cancelForm = this.fb.group({
      bookingId: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if officer is authenticated
    if (!this.authService.isOfficerAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  performCancellation() {
    if (this.cancelForm.valid) {
      const bookingId = this.cancelForm.get('bookingId')?.value;
      
      // Check for officer token
      const officerToken = localStorage.getItem('officer_token');
      if (!officerToken) {
        this.snackBar.open('Authentication error. Please login again.', 'Close', { duration: 3000 });
        return;
      }

      // Confirm cancellation
      if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        this.isLoading = true;
        this.cancelResult = null; // Clear previous results
        
        this.cancelBookingService.cancelOfficerBooking(bookingId).subscribe({
          next: (response) => {
            this.isLoading = false;
            
            if (response.success) {
              this.cancelResult = response;
              this.snackBar.open('Booking cancelled successfully!', 'Close', { duration: 3000 });
              this.cancelForm.reset();
            } else {
              this.snackBar.open(response.message || 'Cancellation failed', 'Close', { duration: 3000 });
            }
          },
          error: (error) => {
            this.isLoading = false;
            
            let errorMessage = 'Cancellation failed. Please try again.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else if (error.status === 401) {
              errorMessage = 'Authentication failed. Please login again.';
            } else if (error.status === 404) {
              errorMessage = 'Booking not found. Please check the booking ID.';
            }
            
            this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
          }
        });
      }
    } else {
      this.snackBar.open('Please enter a valid booking ID', 'Close', { duration: 3000 });
    }
  }

  extractBookingId(): string {
    if (!this.cancelResult || !this.cancelResult.message) {
      return this.cancelForm.get('bookingId')?.value || '';
    }
    
    // Extract booking ID from message using regex
    const match = this.cancelResult.message.match(/BK\d+/);
    return match ? match[0] : this.cancelForm.get('bookingId')?.value || '';
  }
} 