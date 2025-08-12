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
  selector: 'app-booking',
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
    <!-- Navigation -->
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="booking-container">
      <div class="booking-content">
        <!-- Header Section -->
        <div class="booking-header">
          <div class="header-badge">
            <mat-icon>add_shopping_cart</mat-icon>
            <span>New Booking</span>
          </div>
          <h1 class="booking-title">Create New Booking</h1>
          <p class="booking-subtitle">Fill in the details to create your courier booking with our streamlined process</p>
        </div>

        <!-- Customer Info Section -->
        <div class="customer-info-section" *ngIf="currentUser">
          <div class="info-card">
            <div class="info-header">
              <mat-icon>person</mat-icon>
              <h3>Customer Information</h3>
            </div>
              <div class="info-grid">
                <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">{{ currentUser.customerName }}</span>
                </div>
                <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ currentUser.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Customer ID:</span>
                <span class="info-value">{{ currentUser.uniqueId || currentUser.id }}</span>
              </div>
                </div>
              </div>
        </div>

        <!-- Booking Form Section -->
        <div class="booking-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Booking Details</h2>
              <p>Enter all required information for your courier service</p>
            </div>

            <form [formGroup]="bookingForm" (ngSubmit)="createBooking()" class="booking-form">
              <!-- Receiver Details Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>person_add</mat-icon>
                <h3>Receiver Details</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Receiver Name</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverName" placeholder="Enter receiver's full name">
                      <mat-error *ngIf="bookingForm.get('receiverName')?.hasError('required')">
                        Receiver name is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverName')?.hasError('minlength')">
                        Name must be at least 3 characters long
                      </mat-error>
                    </mat-form-field>
                </div>

                  <div class="form-field-container">
                    <label class="field-label">PIN Code</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverPin" placeholder="Enter 6-digit PIN code">
                      <mat-error *ngIf="bookingForm.get('receiverPin')?.hasError('required')">
                        PIN code is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverPin')?.hasError('pattern')">
                        PIN code must be exactly 6 numbers
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverPin')?.hasError('minlength')">
                        PIN code must be 6 digits
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Receiver Mobile</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverMobile" placeholder="Enter receiver's mobile number">
                      <mat-error *ngIf="bookingForm.get('receiverMobile')?.hasError('required')">
                        Mobile number is required
                      </mat-error>
                       <mat-error *ngIf="bookingForm.get('receiverMobile')?.hasError('pattern')">
                        Mobile number must be 10 digits and start with 6-9
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverMobile')?.hasError('minlength')">
                        Mobile number must be 10 digits
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverMobile')?.hasError('maxlength')">
                        Mobile number must be 10 digits
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-field-container full-width">
                  <label class="field-label">Receiver Address</label>
                                      <mat-form-field appearance="outline" class="form-field">
                      <textarea matInput formControlName="receiverAddress" rows="3" placeholder="Enter complete receiver address"></textarea>
                      <mat-error *ngIf="bookingForm.get('receiverAddress')?.hasError('required')">
                        Receiver address is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverAddress')?.hasError('minlength')">
                        Address must be at least 5 characters long
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('receiverAddress')?.hasError('maxlength')">
                        Address must not exceed 50 characters
                      </mat-error>
                    </mat-form-field>
                </div>
              </div>

              <!-- Package Details Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>inventory_2</mat-icon>
                  <h3>Package Details</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Package Weight (grams)</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="number" formControlName="weight" placeholder="Enter weight in grams">
                      <mat-error *ngIf="bookingForm.get('weight')?.hasError('required')">
                        Weight is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('weight')?.hasError('min')">
                        Weight must be at least 100 grams
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('weight')?.hasError('max')">
                        Weight must not exceed 50000 grams
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Package Type</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="packageType">
                        <mat-option value="DOCUMENTS">Documents</mat-option>
                        <mat-option value="ELECTRONICS">Electronics</mat-option>
                        <mat-option value="CLOTHING">Clothing</mat-option>
                        <mat-option value="FOOD">Food</mat-option>
                        <mat-option value="OTHERS">Others</mat-option>
                      </mat-select>
                      <mat-error *ngIf="bookingForm.get('packageType')?.hasError('required')">
                        Package type is required
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-field-container full-width">
                  <label class="field-label">Package Description</label>
                  <mat-form-field appearance="outline" class="form-field">
                    <textarea matInput formControlName="description" rows="3" placeholder="Describe your package contents"></textarea>
                    <mat-error *ngIf="bookingForm.get('description')?.hasError('required')">
                      Package description is required
                    </mat-error>
                    <mat-error *ngIf="bookingForm.get('description')?.hasError('minlength')">
                      Description must be at least 10 characters long
                    </mat-error>
                    <mat-error *ngIf="bookingForm.get('description')?.hasError('maxlength')">
                      Description must not exceed 500 characters
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <!-- Service Options Section -->
              <div class="form-section">
                <div class="section-header">
                  <mat-icon>settings</mat-icon>
                  <h3>Service Options</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Delivery Type</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="deliveryType">
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
                    <label class="field-label">Packing Preference</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="packingPreference">
                        <mat-option value="BASIC">Basic Packing</mat-option>
                        <mat-option value="PREMIUM">Premium Packing</mat-option>
                      </mat-select>
                      <mat-error *ngIf="bookingForm.get('packingPreference')?.hasError('required')">
                        Packing preference is required
                      </mat-error>
                    </mat-form-field>
                </div>
              </div>

                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Pickup Date</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [matDatepicker]="pickupPicker" formControlName="pickupDate" placeholder="Choose pickup date" (dateChange)="onPickupDateChange()">
                      <mat-datepicker-toggle matSuffix [for]="pickupPicker"></mat-datepicker-toggle>
                      <mat-datepicker #pickupPicker></mat-datepicker>
                      <mat-error *ngIf="bookingForm.get('pickupDate')?.hasError('required')">
                        Pickup date is required
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('pickupDate')?.hasError('pastDate')">
                        Pickup date cannot be in the past
                      </mat-error>
                      <mat-error *ngIf="bookingForm.get('pickupDate')?.hasError('invalidDate')">
                        Please select a valid date
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Pickup Time</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="time" formControlName="pickupTime" placeholder="Choose pickup time">
                      <mat-error *ngIf="bookingForm.get('pickupTime')?.hasError('required')">
                        Pickup time is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Drop-off Date</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [matDatepicker]="dropoffPicker" formControlName="dropoffDate" placeholder="Choose drop-off date" (dateChange)="onDropoffDateChange()">
                      <mat-datepicker-toggle matSuffix [for]="dropoffPicker"></mat-datepicker-toggle>
                      <mat-datepicker #dropoffPicker></mat-datepicker>
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
                      <mat-error *ngIf="bookingForm.get('dropoffDate')?.hasError('invalidDate')">
                        Please select a valid date
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Drop-off Time</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="time" formControlName="dropoffTime" placeholder="Choose drop-off time">
                      <mat-error *ngIf="bookingForm.get('dropoffTime')?.hasError('required')">
                        Drop-off time is required
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>
                </div>

              <!-- Cost Breakdown Section -->
              <div class="cost-breakdown-section">
                <div class="cost-header">
                  <mat-icon>receipt</mat-icon>
                  <h3>Cost Breakdown</h3>
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
                  <div class="cost-item subtotal">
                   <span class="cost-label">Subtotal:</span>
                    <span class="cost-value">₹{{ subtotal }}</span>
                 </div>
                  <div class="cost-item tax">
                    <span class="cost-label">Tax (5%):</span>
                    <span class="cost-value">₹{{ taxAmount }}</span>
                 </div>
                  <div class="cost-item total">
                    <span class="cost-label">Total Amount:</span>
                    <span class="cost-value">₹{{ calculatedCost }}</span>
                  </div>
                 </div>
               </div>

              <!-- Submit Button -->
              <div class="form-actions">
                <div class="form-status" *ngIf="bookingForm.invalid && bookingForm.touched">
                  <mat-icon>error</mat-icon>
                  <span>Please fix the errors above before submitting</span>
                </div>
                <button mat-raised-button type="submit" 
                        [disabled]="bookingForm.invalid || isLoading"
                        class="submit-button">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">send</mat-icon>
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
         .booking-container {
       min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
       position: relative;
     }

    .booking-container::before {
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

    .booking-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .booking-header {
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

    .booking-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .booking-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Customer Info Section */
    .customer-info-section {
      margin-bottom: 3rem;
    }

    .info-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-fast);
    }

    .info-card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .info-header mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .info-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
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
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .info-label {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .info-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Booking Form Section */
    .booking-form-section {
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

    .booking-form {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .form-section {
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      background: var(--background-secondary);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .section-header mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .form-field-container {
      display: flex;
      flex-direction: column;
    }

    .form-field-container.full-width {
      grid-column: 1 / -1;
    }

    .field-label {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .form-field {
      width: 100%;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: var(--background-primary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      transition: all var(--transition-fast);
      padding: 0.5rem 0;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper:hover {
      border-color: var(--primary-color);
      background: var(--background-secondary);
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--focused {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--invalid {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-field ::ng-deep .mat-mdc-form-field-error {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .form-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      background: transparent;
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

    /* Cost Breakdown Section */
    .cost-breakdown-section {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-xl);
      padding: 2rem;
      color: var(--text-inverse);
    }

    .cost-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .cost-header mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .cost-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .cost-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .cost-item.subtotal {
      border-top: 2px solid rgba(255, 255, 255, 0.3);
      margin-top: 1rem;
      padding-top: 1.5rem;
    }

    .cost-item.tax {
      background: rgba(255, 255, 255, 0.15);
    }

    .cost-item.total {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 700;
      font-size: 1.125rem;
    }

    .cost-label {
      font-weight: 500;
    }

    .cost-value {
      font-weight: 600;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 3rem;
      gap: 1rem;
    }

    .form-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--radius-md);
    }

    .form-status mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .submit-button {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      border: none;
      padding: 1.5rem 4rem;
      border-radius: var(--radius-lg);
      font-weight: 700;
      font-size: 1.25rem;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 1rem;
      letter-spacing: 0.025em;
      min-width: 200px;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: var(--shadow-xl);
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .booking-container {
        padding: 100px 2rem 2rem;
      }

      .booking-title {
        font-size: 2.5rem;
      }

      .form-card {
        padding: 2rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .booking-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .booking-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .form-section {
        padding: 1.5rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .booking-container {
        padding: 70px 1rem 1rem;
      }

      .booking-title {
        font-size: 1.75rem;
      }

      .form-card {
        padding: 1rem;
      }

      .form-section {
        padding: 1rem;
      }
    }
  `]
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  isLoading = false;
  currentUser: any = null;
  calculatedCost = 0;
  weightCharge = 0;
  deliveryCharge = 0;
  packingCharge = 0;
  subtotal = 0;
  taxAmount = 0;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      receiverName: ['', [Validators.required, Validators.minLength(3), this.validHumanNameValidator()]],
      receiverAddress: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      receiverPin: ['', [
        Validators.required, 
        Validators.pattern(/^\d{6}$/),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]],
      receiverMobile: ['', [
        Validators.required, 
        Validators.pattern(/^[6-9]\d{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      weight: ['', [
        Validators.required, 
        Validators.min(100), 
        Validators.max(50000)
      ]],
      packageType: ['DOCUMENTS', Validators.required],
      description: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(500)
      ]],
      deliveryType: ['STANDARD', Validators.required],
      packingPreference: ['BASIC', Validators.required],
      pickupDate: ['', [Validators.required, this.pastDateValidator()]],
      pickupTime: ['', Validators.required],
      dropoffDate: ['', [Validators.required, this.pastDateValidator(), this.dropoffDateValidator()]],
      dropoffTime: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserByRole('CUSTOMER');
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.calculateCost();
    
    // Watch for form changes to recalculate cost
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateCost();
    });
  }

  // Custom validator for past dates
  pastDateValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  // Custom validator for dropoff date after pickup date
  dropoffDateValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const pickupDate = this.bookingForm?.get('pickupDate')?.value;
      if (!pickupDate) return null;
      
      const dropoffDate = new Date(control.value);
      const pickup = new Date(pickupDate);
      
      // Reset time to compare only dates
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

  onPickupDateChange() {
    // Update dropoff date validation when pickup date changes
    const dropoffDateControl = this.bookingForm.get('dropoffDate');
    if (dropoffDateControl) {
      dropoffDateControl.setValidators([Validators.required, this.pastDateValidator(), this.dropoffDateValidator()]);
      dropoffDateControl.updateValueAndValidity();
    }
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

  onDropoffDateChange() {
    // Validation is handled by the dropoffDateValidator
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
    // Return without timezone to map cleanly to Java LocalDateTime
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }



  calculateCost() {
    const weight = this.bookingForm.get('weight')?.value || 0;
    const deliveryType = this.bookingForm.get('deliveryType')?.value || 'STANDARD';
    const packingType = this.bookingForm.get('packingPreference')?.value || 'BASIC';

    // Base rate
    const baseRate = 50.0;

    // Weight charge (₹0.02 per gram)
    this.weightCharge = weight * 0.02;

    // Delivery charge
    switch (deliveryType) {
      case 'STANDARD':
        this.deliveryCharge = 30.0;
        break;
      case 'EXPRESS':
        this.deliveryCharge = 80.0;
        break;
      case 'SAME_DAY':
        this.deliveryCharge = 150.0;
        break;
      default:
        this.deliveryCharge = 30.0;
    }

    // Packing charge
    switch (packingType) {
      case 'BASIC':
        this.packingCharge = 10.0;
        break;
      case 'PREMIUM':
        this.packingCharge = 20.0;
        break;
      default:
        this.packingCharge = 10.0;
    }

    // Calculate subtotal
    this.subtotal = baseRate + this.weightCharge + this.deliveryCharge + this.packingCharge;

    // Calculate tax (5%)
    this.taxAmount = this.subtotal * 0.05;

    // Calculate total and round to nearest whole number
    this.calculatedCost = Math.round(this.subtotal + this.taxAmount);
  }

  getDeliveryTypeName(): string {
    const deliveryType = this.bookingForm.get('deliveryType')?.value;
    switch (deliveryType) {
      case 'STANDARD':
        return 'Standard';
      case 'EXPRESS':
        return 'Express';
      case 'SAME_DAY':
        return 'Same Day';
      default:
        return 'Standard';
    }
  }

  getPackingTypeName(): string {
    const packingType = this.bookingForm.get('packingPreference')?.value;
    switch (packingType) {
      case 'BASIC':
        return 'Basic';
      case 'PREMIUM':
        return 'Premium';
      default:
        return 'Basic';
    }
  }

  createBooking() {
    if (this.bookingForm.valid) {
      // Calculate cost before submission
      this.calculateCost();
      
      this.isLoading = true;
      
      // Map form data to backend expected format
      const formData = this.bookingForm.value;
      const bookingRequest = {
        receiverName: formData.receiverName,
        receiverAddress: formData.receiverAddress,
        receiverPin: formData.receiverPin,
        receiverMobile: formData.receiverMobile,
        parcelWeightInGram: Math.round(parseFloat(formData.weight)), // Already in grams
        parcelContentsDescription: formData.description,
        parcelDeliveryType: formData.deliveryType,
        parcelPackingPreference: formData.packingPreference,
        parcelPickupTime: this.combineDateAndTime(formData.pickupDate, formData.pickupTime),
        parcelDropoffTime: this.combineDateAndTime(formData.dropoffDate, formData.dropoffTime)
      };

      console.log('Submitting booking:', bookingRequest);

      this.bookingService.createBooking(bookingRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open('Booking created successfully! Redirecting to payment...', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/customer/payment'], {
              queryParams: { 
                bookingId: response.booking?.bookingId,
                amount: this.calculatedCost,
                receiverName: this.bookingForm.get('receiverName')?.value,
                receiverAddress: this.bookingForm.get('receiverAddress')?.value
              }
            });
          } else {
            this.snackBar.open(response.message || 'Booking creation failed', 'Close', { 
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Booking creation error:', error);
          let errorMessage = 'Booking creation failed. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.snackBar.open(errorMessage, 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }
} 