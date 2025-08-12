import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-booking',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation - Always Visible -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="booking-container">
      <div class="booking-content">
        <!-- Header Section -->
        <div class="booking-header">
          <div class="header-badge">
            <mat-icon>add_shopping_cart</mat-icon>
            <span>Create Booking</span>
          </div>
          <h1 class="booking-title">Create Customer Booking</h1>
          <p class="booking-subtitle">Fill in the details to create a courier booking for customer</p>
        </div>

        <!-- Officer Information Section -->
        <div class="officer-info-section">
          <div class="info-card">
            <div class="info-header">
              <mat-icon>admin_panel_settings</mat-icon>
              <h3>Officer Information</h3>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Officer Name:</span>
                <span class="info-value">{{ currentOfficer?.officerName || 'Loading...' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Officer ID:</span>
                <span class="info-value">{{ currentOfficer?.officerId || 'Loading...' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Role:</span>
                <span class="info-value role-badge">Courier Officer</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Form Section -->
        <div class="booking-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Customer Booking Details</h2>
              <p>Enter all required information for the customer's courier service</p>
            </div>

            <form [formGroup]="bookingForm" (ngSubmit)="createBooking()" class="booking-form">
              <!-- Customer Details Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>person</mat-icon>
                  <h3>Customer Details</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Customer Name *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="customerName" placeholder="Enter customer's full name">
                      <mat-error *ngIf="bookingForm.get('customerName')?.hasError('required')">
                        Customer name is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('customerName')?.hasError('minlength')">
                        Name must be at least 3 characters
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Customer Email *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="customerEmail" type="email" placeholder="Enter customer's email">
                      <mat-error *ngIf="bookingForm.get('customerEmail')?.hasError('required')">
                        Customer email is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('customerEmail')?.hasError('email')">
                        Please enter a valid email
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Customer Mobile *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="customerMobile" placeholder="Enter customer's mobile number">
                      <mat-error *ngIf="bookingForm.get('customerMobile')?.hasError('required')">
                        Customer mobile is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('customerMobile')?.hasError('pattern')">
                        Mobile number must be 10 digits and start with 6-9
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <!-- Receiver Details Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>person_add</mat-icon>
                  <h3>Receiver Details</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Receiver Name *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverName" placeholder="Enter receiver's full name">
                      <mat-error *ngIf="bookingForm.get('receiverName')?.hasError('required')">
                        Receiver name is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverName')?.hasError('minlength')">
                        Name must be at least 3 characters
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Receiver Mobile *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverMobile" placeholder="Enter receiver's mobile number">
                      <mat-error *ngIf="bookingForm.get('receiverMobile')?.hasError('required')">
                        Receiver mobile is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverMobile')?.hasError('pattern')">
                        Mobile number must be 10 digits and start with 6-9
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">PIN Code *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverPin" placeholder="Enter 6-digit PIN code">
                      <mat-error *ngIf="bookingForm.get('receiverPin')?.hasError('required')">
                        PIN code is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverPin')?.hasError('pattern')">
                        PIN code must be exactly 6 numbers
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container full-width">
                    <label class="field-label">Receiver Address *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <textarea matInput formControlName="receiverAddress" rows="3" placeholder="Enter complete receiver address"></textarea>
                      <mat-error *ngIf="bookingForm.get('receiverAddress')?.hasError('required')">
                        Receiver address is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverAddress')?.hasError('minlength')">
                        Address must be at least 10 characters
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverAddress')?.hasError('maxlength')">
                        Address cannot exceed 50 characters
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <!-- Package Details Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>inventory</mat-icon>
                  <h3>Package Details</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Package Weight (grams) *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="number" formControlName="packageWeight" placeholder="Enter package weight in grams" min="100" max="50000">
                      <mat-error *ngIf="bookingForm.get('packageWeight')?.hasError('required')">
                        Package weight is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('packageWeight')?.hasError('min')">
                        Weight must be at least 100 grams
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('packageWeight')?.hasError('max')">
                        Weight cannot exceed 50000 grams
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Package Description *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="packageDescription" placeholder="Describe the package contents">
                      <mat-error *ngIf="bookingForm.get('packageDescription')?.hasError('required')">
                        Package description is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('packageDescription')?.hasError('minlength')">
                        Description must be at least 5 characters
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Delivery Type *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="deliveryType" placeholder="Select delivery type">
                        <mat-option value="STANDARD">Standard Delivery</mat-option>
                        <mat-option value="EXPRESS">Express Delivery</mat-option>
                        <mat-option value="SAME_DAY">Same Day Delivery</mat-option>
                      </mat-select>
                      <mat-error *ngIf="bookingForm.get('deliveryType')?.hasError('required')">
                        Delivery type is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Packing Type *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="packingType" placeholder="Select packing type">
                        <mat-option value="BASIC">Basic Packing</mat-option>
                        <mat-option value="PREMIUM">Premium Packing</mat-option>
                      </mat-select>
                      <mat-error *ngIf="bookingForm.get('packingType')?.hasError('required')">
                        Packing type is required
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <!-- Pickup Details Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>schedule</mat-icon>
                  <h3>Pickup & Drop-off Details</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Pickup Date *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [matDatepicker]="pickupDatePicker" formControlName="pickupDate" placeholder="Select pickup date">
                      <mat-datepicker-toggle matSuffix [for]="pickupDatePicker"></mat-datepicker-toggle>
                      <mat-datepicker #pickupDatePicker></mat-datepicker>
                      <mat-error *ngIf="bookingForm.get('pickupDate')?.hasError('required')">
                        Pickup date is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('pickupDate')?.hasError('pastDate')">
                        Pickup date cannot be in the past
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Pickup Time *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="time" formControlName="pickupTime" placeholder="Select pickup time">
                      <mat-error *ngIf="bookingForm.get('pickupTime')?.hasError('required')">
                        Pickup time is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Drop-off Date *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [matDatepicker]="dropDatePicker" formControlName="dropoffDate" placeholder="Select drop-off date">
                      <mat-datepicker-toggle matSuffix [for]="dropDatePicker"></mat-datepicker-toggle>
                      <mat-datepicker #dropDatePicker></mat-datepicker>
                      <mat-error *ngIf="bookingForm.get('dropoffDate')?.hasError('required')">
                        Drop-off date is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('dropoffDate')?.hasError('pastDate')">
                        Drop-off date cannot be in the past
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('dropoffDate')?.hasError('sameDate')">
                        Pickup and Drop-off dates cannot be the same
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('dropoffDate')?.hasError('dropoffDate')">
                        Drop-off date must be after pickup date
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Drop-off Time *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="time" formControlName="dropoffTime" placeholder="Select drop-off time">
                      <mat-error *ngIf="bookingForm.get('dropoffTime')?.hasError('required')">
                        Drop-off time is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container full-width">
                    <label class="field-label">Pickup Address *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <textarea matInput formControlName="pickupAddress" rows="3" placeholder="Enter pickup address"></textarea>
                      <mat-error *ngIf="bookingForm.get('pickupAddress')?.hasError('required')">
                        Pickup address is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('pickupAddress')?.hasError('minlength')">
                        Address must be at least 10 characters
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <!-- Cost Summary Section -->
              <div class="cost-summary-section" *ngIf="calculatedCost > 0">
                <div class="cost-card">
                  <div class="cost-header">
                    <mat-icon>receipt</mat-icon>
                    <h3>Cost Summary</h3>
                  </div>
                  <div class="cost-grid">
                    <div class="cost-item">
                      <span class="cost-label">Weight Charge:</span>
                      <span class="cost-value">₹{{ weightCharge }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">Delivery Charge:</span>
                      <span class="cost-value">₹{{ deliveryCharge }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">Packing Charge:</span>
                      <span class="cost-value">₹{{ packingCharge }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">Subtotal:</span>
                      <span class="cost-value">₹{{ subtotal }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">Tax (5%):</span>
                      <span class="cost-value">₹{{ taxAmount }}</span>
                    </div>
                    <div class="cost-item total">
                      <span class="cost-label">Total Amount:</span>
                      <span class="cost-value">₹{{ calculatedCost }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Status -->
              <div class="form-status" *ngIf="bookingForm.invalid && bookingForm.touched">
                <mat-icon>error</mat-icon>
                <span>Please fix the errors above before submitting</span>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button mat-raised-button type="submit" 
                        [disabled]="bookingForm.invalid || isLoading"
                        class="submit-button">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">add_shopping_cart</mat-icon>
                  <span *ngIf="!isLoading">Create Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Ensure navbar is always visible */
    app-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      width: 100%;
    }

    .booking-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem 0;
      margin-top: 80px; /* Add margin to account for fixed navbar */
    }

    .booking-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Navbar Styles */
    app-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      width: 100%;
    }

    /* Header Section */
    .booking-header {
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

    .booking-title {
      font-size: 3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .booking-subtitle {
      font-size: 1.125rem;
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }

    /* Officer Information Section */
    .officer-info-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.1s both;
    }

    .info-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .info-header mat-icon {
      color: #0891b2;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .info-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .info-label {
      font-weight: 600;
      color: #64748b;
      font-size: 0.875rem;
    }

    .info-value {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .role-badge {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    /* Booking Form Section */
    .booking-form-section {
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .form-field-container {
      display: flex;
      flex-direction: column;
    }

    .form-field-container.full-width {
      grid-column: 1 / -1;
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
      display: block;
    }

    .form-field mat-form-field {
      width: 100%;
      display: block;
    }

    .form-field.mat-form-field-invalid .mat-form-field-outline {
      border-color: #ef4444;
    }

    .form-field.mat-form-field-invalid .mat-form-field-label {
      color: #ef4444;
    }

    /* Ensure Angular Material error messages are visible */
    .form-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: block;
      height: auto;
    }

    /* Ensure text caret and text are visible on focus */
    .form-field input.mat-mdc-input-element,
    .form-field textarea.mat-mdc-input-element {
      caret-color: var(--primary-dark);
      color: var(--text-primary);
    }

    .cost-summary-section {
      margin: 3rem 0;
      animation: fadeInUp 0.6s ease-out;
    }

    .cost-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid #bae6fd;
    }

    .cost-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .cost-header mat-icon {
      color: #0891b2;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .cost-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .cost-grid {
      display: grid;
      gap: 1rem;
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .cost-item:last-child {
      border-bottom: none;
    }

    .cost-item.total {
      border-top: 2px solid #0891b2;
      border-bottom: none;
      padding-top: 1rem;
      margin-top: 0.5rem;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .cost-label {
      color: #64748b;
      font-weight: 500;
    }

    .cost-value {
      color: #1e293b;
      font-weight: 600;
    }

    .cost-item.total .cost-label,
    .cost-item.total .cost-value {
      color: #0891b2;
    }

    .form-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .form-status mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .form-actions {
      text-align: center;
      margin-top: 3rem;
    }

    .submit-button {
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

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
      .booking-content {
        padding: 0 1rem;
      }

      .booking-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 2rem 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .submit-button {
        width: 100%;
        padding: 1rem 2rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  isLoading = false;
  calculatedCost = 0;
  weightCharge = 0;
  deliveryCharge = 0;
  packingCharge = 0;
  subtotal = 0;
  taxAmount = 0;
  currentOfficer: any = null;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3), this.validHumanNameValidator()]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerMobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      receiverName: ['', [Validators.required, Validators.minLength(3), this.validHumanNameValidator()]],
      receiverMobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      receiverPin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      receiverAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      packageWeight: ['', [Validators.required, Validators.min(100), Validators.max(50000)]],
      packageDescription: ['', [Validators.required, Validators.minLength(5)]],
      deliveryType: ['', Validators.required],
      packingType: ['', Validators.required],
      pickupDate: ['', [Validators.required, this.pastDateValidator()]],
      pickupTime: ['', Validators.required],
      pickupAddress: ['', [Validators.required, Validators.minLength(10)]],
      dropoffDate: ['', [Validators.required, this.pastDateValidator(), this.dropoffDateValidator()]],
      dropoffTime: ['', Validators.required]
    });

    // Listen for form changes to calculate cost
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateCost();
    });
  }

  ngOnInit() {
    this.loadOfficerInfo();
  }

  loadOfficerInfo() {
    this.currentOfficer = this.authService.getCurrentUserByRole('OFFICER');
    if (!this.currentOfficer) {
      this.snackBar.open('Please login as an officer', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/login']);
    }
  }

  pastDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  // Helper method to combine date and time into a LocalDateTime-friendly string (no timezone)
  combineDateAndTime(date: Date, time: string): string {
    if (!date || !time) return '';
    const d = new Date(date);
    const [hh, mm] = time.split(':');
    d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = '00';
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Ensure dropoff date validation relative to pickup date
  dropoffDateValidator() {
    return (control: any) => {
      if (!control.value) return null;
      const pickupDate = this.bookingForm?.get('pickupDate')?.value;
      if (!pickupDate) return null;
      const dropoffDate = new Date(control.value);
      const pickup = new Date(pickupDate);
      dropoffDate.setHours(0, 0, 0, 0);
      pickup.setHours(0, 0, 0, 0);
      if (dropoffDate.getTime() === pickup.getTime()) {
        return { sameDate: true };
      }
      if (dropoffDate < pickup) {
        return { dropoffDate: true };
      }
      return null;
    };
  }

  calculateCost() {
    const weight = parseFloat(this.bookingForm.get('packageWeight')?.value) || 0;
    const deliveryType = this.bookingForm.get('deliveryType')?.value;
    const packingType = this.bookingForm.get('packingType')?.value;

    // Weight charge: ₹50 per kg
    this.weightCharge = weight * 50;

    // Delivery charge based on type (matching backend enum)
    switch (deliveryType) {
      case 'STANDARD':
        this.deliveryCharge = 30;
        break;
      case 'EXPRESS':
        this.deliveryCharge = 80;
        break;
      case 'SAME_DAY':
        this.deliveryCharge = 150;
        break;
      default:
        this.deliveryCharge = 0;
    }

    // Packing charge based on type (matching backend enum)
    switch (packingType) {
      case 'BASIC':
        this.packingCharge = 10;
        break;
      case 'PREMIUM':
        this.packingCharge = 20;
        break;
      default:
        this.packingCharge = 0;
    }

    this.subtotal = this.weightCharge + this.deliveryCharge + this.packingCharge;
    this.taxAmount = this.subtotal * 0.05; // 5% tax
    this.calculatedCost = Math.round(this.subtotal + this.taxAmount); // round to nearest whole number
  }

  // Custom validator to ensure a sensible human name
  validHumanNameValidator(): ValidatorFn {
    const forbiddenTerms = [
      'null', 'nothing', 'something', 'somewhat', 'nobody', 'none', 'unknown', 'test', 'na', 'n/a'
    ];
    return (control: AbstractControl) => {
      const raw = (control.value ?? '') as string;
      const value = raw.trim();
      if (!value) {
        return { invalidName: true };
      }
      if (value.length < 3) {
        return { invalidName: true };
      }
      if (!/[A-Za-z]/.test(value)) {
        return { invalidName: true };
      }
      const lower = value.toLowerCase();
      if (forbiddenTerms.includes(lower)) {
        return { invalidName: true };
      }
      return null;
    };
  }

  createBooking() {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });

      if (this.bookingForm.invalid) {
        this.isLoading = false;
        this.snackBar.open('Please fix the errors before submitting', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }
      
      // Map form data to backend expected format
      const formData = this.bookingForm.value;
      const bookingData = {
        receiverName: formData.receiverName,
        receiverAddress: formData.receiverAddress,
        receiverPin: formData.receiverPin,
        receiverMobile: formData.receiverMobile,
        parcelWeightInGram: Math.round(parseFloat(formData.packageWeight)), // value already in grams
        parcelContentsDescription: formData.packageDescription,
        parcelDeliveryType: formData.deliveryType,
        parcelPackingPreference: formData.packingType,
        parcelPickupTime: this.combineDateAndTime(formData.pickupDate, formData.pickupTime),
        parcelDropoffTime: this.combineDateAndTime(formData.dropoffDate, formData.dropoffTime)
      };

      console.log('Submitting officer booking:', bookingData);

      this.bookingService.createOfficerBooking(bookingData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Booking created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // On success, go to payment page for officer flow with details
          this.router.navigate(['/officer/payment'], {
            queryParams: {
              bookingId: response.booking?.bookingId,
              amount: this.calculatedCost,
              customerName: formData.customerName,
              receiverName: formData.receiverName,
              receiverAddress: formData.receiverAddress
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating booking:', error);
          let errorMessage = 'Error creating booking. Please try again.';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Please check your input and try again.';
          } else if (error.status === 401) {
            errorMessage = 'Authentication failed. Please login again.';
            this.router.navigate(['/login']);
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}