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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PickupSchedulingService } from '../../../services/pickup-scheduling.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-pickup-scheduling',
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
    MatDatepickerModule,
    MatNativeDateModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="pickup-scheduling-container">
      <div class="pickup-scheduling-content">
        <!-- Header Section -->
        <div class="pickup-scheduling-header">
          <div class="header-badge">
            <mat-icon>schedule</mat-icon>
            <span>Pickup Scheduling</span>
          </div>
          <h1 class="pickup-scheduling-title">Schedule Package Pickup</h1>
          <p class="pickup-scheduling-subtitle">Schedule pickup times for customer packages</p>
        </div>

        <!-- Scheduling Form Section -->
        <div class="scheduling-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Schedule Pickup</h2>
              <p>Enter booking details and schedule pickup time</p>
            </div>

            <form [formGroup]="schedulingForm" (ngSubmit)="schedulePickup()" class="scheduling-form">
              <!-- Booking ID Section -->
              <div class="form-field-container">
                <label class="field-label">Booking ID</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput 
                         formControlName="bookingId" 
                         placeholder="Enter the booking ID">
                  <mat-icon matSuffix>receipt</mat-icon>
                </mat-form-field>
              </div>

              <!-- Pickup Date Section -->
              <div class="form-field-container">
                <label class="field-label">Pickup Date</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput 
                         [matDatepicker]="pickupDatePicker"
                         formControlName="pickupDate" 
                         placeholder="Select pickup date">
                  <mat-datepicker-toggle matSuffix [for]="pickupDatePicker"></mat-datepicker-toggle>
                  <mat-datepicker #pickupDatePicker></mat-datepicker>
                  <mat-icon matSuffix>calendar_today</mat-icon>
                </mat-form-field>
              </div>

              <!-- Pickup Time Section -->
              <div class="form-field-container">
                <label class="field-label">Pickup Time</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput 
                         type="time"
                         formControlName="pickupTime" 
                         placeholder="Select pickup time">
                  <mat-icon matSuffix>schedule</mat-icon>
                </mat-form-field>
              </div>

              <!-- Pickup Location Section -->
              <div class="form-field-container">
                <label class="field-label">Pickup Location</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput 
                         formControlName="pickupLocation" 
                         placeholder="Enter pickup address">
                  <mat-icon matSuffix>location_on</mat-icon>
                </mat-form-field>
              </div>

              <!-- Pickup Agent Section -->
              <div class="form-field-container">
                <label class="field-label">Pickup Agent</label>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-select formControlName="pickupAgent" placeholder="Select pickup agent">
                    <mat-option value="agent_001">Agent 001 - John Smith</mat-option>
                    <mat-option value="agent_002">Agent 002 - Sarah Johnson</mat-option>
                    <mat-option value="agent_003">Agent 003 - Mike Davis</mat-option>
                    <mat-option value="agent_004">Agent 004 - Lisa Wilson</mat-option>
                    <mat-option value="agent_005">Agent 005 - David Brown</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>person</mat-icon>
                </mat-form-field>
              </div>

              <!-- Vehicle Type Section -->
              <div class="form-field-container">
                <label class="field-label">Vehicle Type</label>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-select formControlName="vehicleType" placeholder="Select vehicle type">
                    <mat-option value="bike">Bike</mat-option>
                    <mat-option value="car">Car</mat-option>
                    <mat-option value="van">Van</mat-option>
                    <mat-option value="truck">Truck</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>local_shipping</mat-icon>
                </mat-form-field>
              </div>

              <!-- Special Instructions Section -->
              <div class="form-field-container">
                <label class="field-label">Special Instructions</label>
                <mat-form-field appearance="outline" class="form-field">
                  <textarea matInput 
                           formControlName="specialInstructions" 
                           rows="4" 
                           placeholder="Add any special instructions for pickup..."></textarea>
                  <mat-icon matSuffix>note</mat-icon>
                </mat-form-field>
              </div>

              <!-- Submit Button -->
              <div class="form-actions">
                <button type="submit" 
                        mat-raised-button 
                        class="submit-btn"
                        [disabled]="schedulingForm.invalid || isLoading">
                  <mat-icon *ngIf="!isLoading">schedule</mat-icon>
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                  <span>{{ isLoading ? 'Scheduling Pickup...' : 'Schedule Pickup' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Scheduling Result Section -->
        <div class="result-section" *ngIf="schedulingResult">
          <div class="result-card">
            <div class="result-header">
              <div class="result-icon">
                <mat-icon>{{ schedulingResult.success ? 'check_circle' : 'error' }}</mat-icon>
              </div>
              <h3>{{ schedulingResult.success ? 'Pickup Scheduled Successfully' : 'Scheduling Failed' }}</h3>
            </div>
            
            <div class="result-details">
              <div class="detail-item">
                <span class="detail-label">Booking ID</span>
                <span class="detail-value">{{ schedulingResult.bookingId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Pickup Date</span>
                <span class="detail-value">{{ schedulingResult.pickupDate | date:'mediumDate' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Pickup Time</span>
                <span class="detail-value">{{ schedulingResult.pickupTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Pickup Location</span>
                <span class="detail-value">{{ schedulingResult.pickupLocation }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Pickup Agent</span>
                <span class="detail-value">{{ schedulingResult.pickupAgent }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Vehicle Type</span>
                <span class="detail-value">{{ schedulingResult.vehicleType }}</span>
              </div>
              <div class="detail-item" *ngIf="schedulingResult.specialInstructions">
                <span class="detail-label">Special Instructions</span>
                <span class="detail-value">{{ schedulingResult.specialInstructions }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scheduling Guidelines Section -->
        <div class="guidelines-section">
          <div class="guidelines-card">
            <div class="guidelines-header">
              <h3>Scheduling Guidelines</h3>
              <p>Best practices for scheduling package pickups</p>
            </div>
            
            <div class="guidelines-grid">
              <div class="guideline-item">
                <div class="guideline-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="guideline-content">
                  <h4>Time Slots</h4>
                  <p>Schedule pickups during business hours (9 AM - 6 PM)</p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <mat-icon>location_on</mat-icon>
                </div>
                <div class="guideline-content">
                  <h4>Location Accuracy</h4>
                  <p>Ensure pickup address is complete and accurate</p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="guideline-content">
                  <h4>Agent Assignment</h4>
                  <p>Assign agents based on location and availability</p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <mat-icon>local_shipping</mat-icon>
                </div>
                <div class="guideline-content">
                  <h4>Vehicle Selection</h4>
                  <p>Choose appropriate vehicle based on package size</p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <mat-icon>notifications</mat-icon>
                </div>
                <div class="guideline-content">
                  <h4>Customer Notification</h4>
                  <p>Customers are automatically notified of pickup schedule</p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <mat-icon>support_agent</mat-icon>
                </div>
                <div class="guideline-content">
                  <h4>Rescheduling</h4>
                  <p>Allow rescheduling up to 2 hours before pickup time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pickup-scheduling-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .pickup-scheduling-container::before {
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

    .pickup-scheduling-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .pickup-scheduling-header {
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

    .pickup-scheduling-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .pickup-scheduling-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .scheduling-form-section {
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

    .scheduling-form {
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
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
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

    .guidelines-section {
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }

    .guidelines-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .guidelines-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .guidelines-header h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .guidelines-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .guidelines-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .guideline-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .guideline-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .guideline-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .guideline-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-inverse);
    }

    .guideline-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .guideline-content p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    @media (max-width: 768px) {
      .pickup-scheduling-container {
        padding: 100px 1rem 2rem;
      }

      .pickup-scheduling-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .guidelines-grid {
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
export class PickupSchedulingComponent implements OnInit {
  schedulingForm: FormGroup;
  isLoading = false;
  schedulingResult: any = null;

  constructor(
    private fb: FormBuilder,
    private pickupSchedulingService: PickupSchedulingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.schedulingForm = this.fb.group({
      bookingId: ['', [Validators.required, Validators.minLength(3)]],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      pickupAgent: ['', Validators.required],
      vehicleType: ['', Validators.required],
      specialInstructions: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Component initialization
  }

  schedulePickup() {
    if (this.schedulingForm.valid) {
      this.isLoading = true;
      
      const schedulingData = {
        ...this.schedulingForm.value,
        scheduledBy: 'officer'
      };

      this.pickupSchedulingService.updateSchedule(schedulingData.bookingId, schedulingData.pickupDate, schedulingData.pickupTime).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.schedulingResult = {
            success: true,
            bookingId: schedulingData.bookingId,
            pickupDate: schedulingData.pickupDate,
            pickupTime: schedulingData.pickupTime,
            pickupLocation: schedulingData.pickupLocation,
            pickupAgent: schedulingData.pickupAgent,
            vehicleType: schedulingData.vehicleType,
            specialInstructions: schedulingData.specialInstructions,
            scheduledAt: new Date()
          };
          this.snackBar.open('Pickup scheduled successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.schedulingResult = {
            success: false,
            bookingId: schedulingData.bookingId,
            pickupDate: schedulingData.pickupDate,
            pickupTime: schedulingData.pickupTime,
            pickupLocation: schedulingData.pickupLocation,
            pickupAgent: schedulingData.pickupAgent,
            vehicleType: schedulingData.vehicleType,
            specialInstructions: schedulingData.specialInstructions,
            scheduledAt: new Date(),
            error: error.message || 'Unknown error occurred'
          };
          this.snackBar.open('Failed to schedule pickup. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}