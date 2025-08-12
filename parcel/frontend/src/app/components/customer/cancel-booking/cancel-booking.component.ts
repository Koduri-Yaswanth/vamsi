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
  selector: 'app-cancel-booking',
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
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="cancel-container">
      <div class="cancel-content">
        <!-- Header Section -->
        <div class="cancel-header">
          <div class="header-badge">
            <mat-icon>cancel</mat-icon>
            <span>Cancel Booking</span>
          </div>
          <h1 class="cancel-title">Cancel Your Booking</h1>
          <p class="cancel-subtitle">Enter your booking ID to cancel your shipment and receive a refund</p>
        </div>

        <!-- Cancel Form Section -->
        <div class="cancel-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Cancel Booking</h2>
              <p>Please provide your booking ID to proceed with cancellation</p>
            </div>

            <form [formGroup]="cancelForm" (ngSubmit)="performCancellation()" class="cancel-form">
                <div class="form-field-container">
                  <label class="field-label">Booking ID</label>
                  <mat-form-field appearance="outline" class="form-field">
                  <input matInput formControlName="bookingId" placeholder="Enter your booking ID">
                    <mat-error *ngIf="cancelForm.get('bookingId')?.hasError('required')">
                      Booking ID is required
                    </mat-error>
                  </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-raised-button type="submit" 
                        [disabled]="cancelForm.invalid || isLoading"
                        class="cancel-button">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">cancel</mat-icon>
                  <span *ngIf="!isLoading">Cancel Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Cancel Result Section -->
        <div class="cancel-result-section" *ngIf="cancelResult">
          <div class="result-card">
            <div class="result-header">
              <div class="result-badge">
                 <mat-icon>check_circle</mat-icon>
                <span>Cancellation Successful</span>
              </div>
              <h2>Cancellation Details</h2>
            </div>

            <div class="result-content">
               <div class="result-grid">
                 <div class="result-item">
                  <div class="result-icon">
                    <mat-icon>receipt</mat-icon>
                  </div>
                  <div class="result-content">
                    <span class="result-label">Booking ID</span>
                   <span class="result-value">{{ cancelResult.bookingId || extractBookingId(cancelResult.message) }}</span>
                 </div>
                </div>

                 <div class="result-item">
                  <div class="result-icon">
                    <mat-icon>cancel</mat-icon>
                  </div>
                  <div class="result-content">
                    <span class="result-label">Status</span>
                    <span class="result-value status-cancelled">Cancelled</span>
                  </div>
                </div>

                <div class="result-item full-width">
                  <div class="result-icon">
                    <mat-icon>message</mat-icon>
                 </div>
                  <div class="result-content">
                    <span class="result-label">Message</span>
                   <span class="result-value">{{ cancelResult.message }}</span>
                 </div>
               </div>
             </div>
            </div>
          </div>
        </div>

        <!-- Cancellation Policy Section -->
        <div class="policy-section">
          <div class="policy-card">
            <div class="policy-header">
              <mat-icon>info</mat-icon>
              <h3>Cancellation Policy</h3>
            </div>
            <div class="policy-content">
              <div class="policy-item">
                <mat-icon>check_circle</mat-icon>
                <span>Free cancellation within 2 hours of booking</span>
              </div>
              <div class="policy-item">
                <mat-icon>check_circle</mat-icon>
                <span>Partial refund available for cancellations after 2 hours</span>
              </div>
              <div class="policy-item">
                <mat-icon>check_circle</mat-icon>
                <span>No cancellation once package is in transit</span>
              </div>
              <div class="policy-item">
                <mat-icon>check_circle</mat-icon>
                <span>Refund will be processed within 5-7 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cancel-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .cancel-container::before {
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

    .cancel-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .cancel-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 2rem;
      border: 1px solid rgba(239, 68, 68, 0.2);
      transition: all var(--transition-fast);
    }

    .header-badge:hover {
      background: rgba(239, 68, 68, 0.15);
      transform: translateY(-1px);
    }

    .header-badge mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .cancel-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .cancel-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Cancel Form Section */
    .cancel-form-section {
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

    .cancel-form {
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
      margin-top: 3rem;
    }

    .cancel-button {
      background: linear-gradient(135deg, var(--error-color) 0%, #dc2626 100%);
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

    .cancel-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .cancel-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Cancel Result Section */
    .cancel-result-section {
      margin-bottom: 3rem;
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
      margin-top: 2rem;
    }

    .result-grid {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: var(--background-secondary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .result-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .result-item.full-width {
      grid-column: 1 / -1;
    }

    .result-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .result-icon mat-icon {
      color: var(--text-inverse);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .result-content {
      flex: 1;
    }

    .result-label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .result-value {
      display: block;
      font-size: 1.125rem;
      color: var(--text-primary);
      font-weight: 600;
      line-height: 1.4;
    }

    .result-value.status-cancelled {
      color: var(--error-color);
      font-weight: 700;
    }

    /* Policy Section */
    .policy-section {
      margin-top: 3rem;
    }

    .policy-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .policy-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .policy-header mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .policy-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .policy-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .policy-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .policy-item mat-icon {
      color: var(--success-color);
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
    }

    .policy-item span {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .cancel-container {
        padding: 100px 2rem 2rem;
      }

      .cancel-title {
        font-size: 2.5rem;
      }

      .form-card,
      .result-card {
        padding: 2rem;
      }
    }

    @media (max-width: 768px) {
      .cancel-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .cancel-title {
        font-size: 2rem;
      }

      .form-card,
      .result-card {
        padding: 1.5rem;
      }

      .result-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .cancel-container {
        padding: 70px 1rem 1rem;
      }

      .cancel-title {
        font-size: 1.75rem;
      }

      .form-card,
      .result-card {
        padding: 1rem;
      }
    }
  `]
})
export class CancelBookingComponent implements OnInit {
  cancelForm: FormGroup;
  isLoading = false;
  cancelResult: any; // To store cancellation result

  constructor(
    private fb: FormBuilder,
    private cancelBookingService: CancelBookingService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cancelForm = this.fb.group({
      bookingId: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if customer is authenticated
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
    }
  }

     extractBookingId(message: string): string {
     // Extract booking ID from message like "Booking cancelled successfully. Booking ID: BK1754499405362"
     const match = message.match(/Booking ID:\s*([A-Z0-9]+)/);
     return match ? match[1] : '';
   }

   performCancellation() {
     if (this.cancelForm.valid) {
       const bookingId = this.cancelForm.get('bookingId')?.value;
       
       console.log('Attempting to cancel booking:', bookingId);
       
       // Check for customer token
       const customerToken = localStorage.getItem('customer_token');
       if (!customerToken) {
         console.error('No customer token found');
         this.snackBar.open('Authentication error. Please login again.', 'Close', { duration: 3000 });
         this.router.navigate(['/login']);
         return;
       }

       console.log('Customer token found, proceeding with cancellation');

       // Confirm cancellation
       if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
         this.isLoading = true;
         this.cancelResult = null; // Clear previous results
         
         console.log('Making API call to cancel booking...');
         
         this.cancelBookingService.cancelCustomerBooking(bookingId).subscribe({
           next: (response) => {
             this.isLoading = false;
             console.log('Cancellation response:', response);
             this.cancelResult = response;
             if (response.success) {
               this.snackBar.open(response.message, 'Close', { duration: 5000 });
               this.cancelForm.reset();
             } else {
               this.snackBar.open(response.message || 'Cancellation failed', 'Close', { duration: 3000 });
             }
           },
           error: (error) => {
             this.isLoading = false;
             console.error('Cancellation error:', error);
             console.error('Error details:', error.error);
             console.error('Error status:', error.status);
             console.error('Error message:', error.message);
             
             let errorMessage = 'Cancellation failed. Please try again.';
             if (error.error && error.error.message) {
               errorMessage = error.error.message;
             } else if (error.status === 401) {
               errorMessage = 'Authentication failed. Please login again.';
               this.router.navigate(['/login']);
             } else if (error.status === 404) {
               errorMessage = 'Booking not found. Please check the booking ID.';
             } else if (error.status === 403) {
               errorMessage = 'You can only cancel your own bookings.';
             }
             
             this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
           }
         });
       }
     }
   }
}