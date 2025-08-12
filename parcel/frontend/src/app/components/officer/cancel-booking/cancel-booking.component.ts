import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CancelBookingService } from '../../../services/cancel-booking.service';
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
    MatSelectModule,
    MatIconModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="cancel-booking-container">
      <div class="cancel-booking-content">
        <!-- Header Section -->
        <div class="cancel-booking-header">
          <div class="header-badge">
            <mat-icon>cancel</mat-icon>
            <span>Cancel Booking</span>
          </div>
          <h1 class="cancel-booking-title">Cancel Customer Booking</h1>
          <p class="cancel-booking-subtitle">Cancel a customer's courier service booking</p>
        </div>

        <!-- Cancel Form Section -->
        <div class="cancel-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Cancel Booking</h2>
              <p>Enter the booking details to cancel the service</p>
            </div>

            <form [formGroup]="cancelForm" (ngSubmit)="cancelBooking()" class="cancel-form">
              <!-- Booking ID Section -->
              <div class="form-field-container">
                <label class="field-label">Booking ID</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput 
                         formControlName="bookingId" 
                         placeholder="Enter the booking ID to cancel">
                  <mat-icon matSuffix>receipt</mat-icon>
                </mat-form-field>
              </div>

              <!-- Cancellation Reason Section -->
              <div class="form-field-container">
                <label class="field-label">Cancellation Reason</label>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-select formControlName="cancellationReason" placeholder="Select cancellation reason">
                    <mat-option value="customer_request">Customer Request</mat-option>
                    <mat-option value="service_unavailable">Service Unavailable</mat-option>
                    <mat-option value="payment_issue">Payment Issue</mat-option>
                    <mat-option value="operational_issue">Operational Issue</mat-option>
                    <mat-option value="other">Other</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>help</mat-icon>
                </mat-form-field>
              </div>

              <!-- Additional Comments Section -->
              <div class="form-field-container">
                <label class="field-label">Additional Comments</label>
                <mat-form-field appearance="outline" class="form-field">
                  <textarea matInput 
                           formControlName="comments" 
                           rows="4" 
                           placeholder="Provide additional details about the cancellation..."></textarea>
                  <mat-icon matSuffix>comment</mat-icon>
                </mat-form-field>
              </div>

              <!-- Submit Button -->
              <div class="form-actions">
                <button type="submit" 
                        mat-raised-button 
                        class="submit-btn"
                        [disabled]="cancelForm.invalid || isLoading">
                  <mat-icon *ngIf="!isLoading">cancel</mat-icon>
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                  <span>{{ isLoading ? 'Cancelling Booking...' : 'Cancel Booking' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Cancellation Result Section -->
        <div class="result-section" *ngIf="cancellationResult">
          <div class="result-card">
            <div class="result-header">
              <div class="result-icon">
                <mat-icon>{{ cancellationResult.success ? 'check_circle' : 'error' }}</mat-icon>
              </div>
              <h3>{{ cancellationResult.success ? 'Booking Cancelled Successfully' : 'Cancellation Failed' }}</h3>
            </div>
            
            <div class="result-details">
              <div class="detail-item">
                <span class="detail-label">Booking ID</span>
                <span class="detail-value">{{ cancellationResult.bookingId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cancellation Date</span>
                <span class="detail-value">{{ cancellationResult.cancellationDate | date:'medium' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Reason</span>
                <span class="detail-value">{{ cancellationResult.reason }}</span>
              </div>
              <div class="detail-item" *ngIf="cancellationResult.comments">
                <span class="detail-label">Comments</span>
                <span class="detail-value">{{ cancellationResult.comments }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancellation Policy Section -->
        <div class="policy-section">
          <div class="policy-card">
            <div class="policy-header">
              <h3>Cancellation Policy</h3>
              <p>Important information about booking cancellations</p>
            </div>
            
            <div class="policy-grid">
              <div class="policy-item">
                <div class="policy-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="policy-content">
                  <h4>24-Hour Notice</h4>
                  <p>Cancellations require at least 24 hours notice before pickup</p>
                </div>
              </div>
              
              <div class="policy-item">
                <div class="policy-icon">
                  <mat-icon>payment</mat-icon>
                </div>
                <div class="policy-content">
                  <h4>Refund Policy</h4>
                  <p>Full refunds are provided for cancellations made within 24 hours</p>
                </div>
              </div>
              
              <div class="policy-item">
                <div class="policy-icon">
                  <mat-icon>notifications</mat-icon>
                </div>
                <div class="policy-content">
                  <h4>Customer Notification</h4>
                  <p>Customers are automatically notified of cancellations</p>
                </div>
              </div>
              
              <div class="policy-item">
                <div class="policy-icon">
                  <mat-icon>support_agent</mat-icon>
                </div>
                <div class="policy-content">
                  <h4>Support Available</h4>
                  <p>Customer support is available for cancellation inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cancel-booking-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .cancel-booking-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, var(--error-light) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, var(--primary-light) 0%, transparent 50%);
      opacity: 0.1;
      pointer-events: none;
    }

    .cancel-booking-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cancel-booking-header {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--error-color) 0%, var(--error-dark) 100%);
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

    .cancel-booking-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--error-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cancel-booking-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .cancel-form-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .form-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .cancel-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-label {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .submit-btn {
      background: linear-gradient(135deg, var(--error-color) 0%, var(--error-dark) 100%);
      color: var(--text-inverse);
      border: none;
      padding: 1rem 2rem;
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 200px;
      justify-content: center;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .result-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .result-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-light);
    }

    .result-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .result-icon.success {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark) 100%);
    }

    .result-icon.error {
      background: linear-gradient(135deg, var(--error-color) 0%, var(--error-dark) 100%);
    }

    .result-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--text-inverse);
    }

    .result-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .result-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .detail-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .detail-value {
      font-size: 1rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .policy-section {
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }

    .policy-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .policy-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .policy-header h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .policy-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .policy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .policy-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .policy-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .policy-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .policy-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-inverse);
    }

    .policy-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .policy-content p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    @media (max-width: 768px) {
      .cancel-booking-container {
        padding: 100px 1rem 2rem;
      }

      .cancel-booking-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .policy-grid {
        grid-template-columns: 1fr;
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
export class CancelBookingComponent implements OnInit {
  cancelForm: FormGroup;
  isLoading = false;
  cancellationResult: any = null;

  constructor(
    private fb: FormBuilder,
    private cancelBookingService: CancelBookingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.cancelForm = this.fb.group({
      bookingId: ['', [Validators.required, Validators.minLength(3)]],
      cancellationReason: ['', Validators.required],
      comments: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Get booking ID from route params if available
    this.route.queryParams.subscribe(params => {
      const bookingId = params['bookingId'];
      if (bookingId) {
        this.cancelForm.patchValue({ bookingId });
      }
    });
  }

  cancelBooking() {
    if (this.cancelForm.valid) {
      this.isLoading = true;
      
      const cancellationData = {
        ...this.cancelForm.value,
        cancelledBy: 'officer'
      };

      this.cancelBookingService.cancelOfficerBooking(cancellationData.bookingId).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.cancellationResult = {
            success: true,
            bookingId: cancellationData.bookingId,
            cancellationDate: new Date(),
            reason: cancellationData.cancellationReason,
            comments: cancellationData.comments
          };
          this.snackBar.open('Booking cancelled successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.cancellationResult = {
            success: false,
            bookingId: cancellationData.bookingId,
            cancellationDate: new Date(),
            reason: cancellationData.cancellationReason,
            comments: cancellationData.comments,
            error: error.message || 'Unknown error occurred'
          };
          this.snackBar.open('Failed to cancel booking. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}