// Import statements for Angular core functionality and dependencies
import { Component, OnInit } from '@angular/core'; // Component decorator and lifecycle interface
import { CommonModule } from '@angular/common'; // Common Angular directives like *ngIf, *ngFor
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms'; // Form handling and validation
import { Router } from '@angular/router'; // Navigation service
import { MatCardModule } from '@angular/material/card'; // Material Design card component
import { MatFormFieldModule } from '@angular/material/form-field'; // Material Design form field wrapper
import { MatInputModule } from '@angular/material/input'; // Material Design input component
import { MatButtonModule } from '@angular/material/button'; // Material Design button component
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Loading spinner component
import { MatSnackBar } from '@angular/material/snack-bar'; // Toast notification service
import { MatSelectModule } from '@angular/material/select'; // Material Design dropdown select
import { MatDatepickerModule } from '@angular/material/datepicker'; // Date picker component
import { MatNativeDateModule } from '@angular/material/core'; // Native date adapter for date picker
import { MatIconModule } from '@angular/material/icon'; // Material Design icon component
import { BookingService } from '../../../services/booking.service'; // Service for booking operations
import { AuthService } from '../../../services/auth.service'; // Service for authentication
import { NavbarComponent } from '../../shared/navbar.component'; // Navigation bar component

/**
 * Officer Booking Component
 * 
 * What This Component Does:
 * This component allows courier officers (staff members) to create courier bookings on behalf of customers.
 * Officers have special privileges and can manage all aspects of the courier service.
 * 
 * Key Features:
 * - Create courier bookings for customers
 * - Calculate shipping costs automatically
 * - Set pickup and delivery schedules
 * - Choose delivery and packing options
 * - Access to officer-only features
 * 
 * How It Works:
 * 1. Officer fills out a form with customer and parcel details
 * 2. Component automatically calculates the total cost
 * 3. Officer submits the booking
 * 4. System creates the booking and sends confirmation
 * 
 * Angular Concepts Used:
 * - Reactive Forms: Modern way to handle form input and validation
 * - Material Design: Google's design system for beautiful, consistent UI
 * - Services: Classes that handle business logic and API calls
 * - Lifecycle Hooks: Methods that run at specific times (like when component loads)
 */

// Component decorator - defines metadata for this Angular component
@Component({
  selector: 'app-officer-booking', // HTML tag name to use this component in templates (<app-officer-booking>)
  standalone: true, // Standalone component (doesn't need to be declared in a module - modern Angular approach)
  imports: [ // List of components and modules this component depends on
    CommonModule, // Provides common Angular directives like *ngIf, *ngFor
    ReactiveFormsModule, // Provides reactive form functionality (FormGroup, FormControl, etc.)
    MatCardModule, // Material Design card components (containers with shadows and borders)
    MatFormFieldModule, // Material Design form field components (wrappers for form inputs)
    MatInputModule, // Material Design input components (text fields, textareas)
    MatButtonModule, // Material Design button components (primary, secondary, etc.)
    MatProgressSpinnerModule, // Loading spinner component (shows when processing)
    MatSelectModule, // Material Design select dropdown components
    MatDatepickerModule, // Date picker components (calendar for selecting dates)
    MatNativeDateModule, // Native date adapter for date picker (handles date formatting)
    MatIconModule, // Material Design icon components (symbols like checkmarks, arrows)
    NavbarComponent // Custom navigation bar component (shows menu and user info)
  ],
  template: `
    <!-- Navigation Bar -->
    <!-- This shows the top menu bar with officer-specific options -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <!-- Main Container -->
    <div class="booking-container">
      <div class="booking-content">
        
        <!-- Header Section -->
        <!-- This shows the title and description of what this page does -->
        <div class="booking-header">
          <div class="header-badge">
            <mat-icon>admin_panel_settings</mat-icon> <!-- Officer icon -->
            <span>Officer Booking</span>
          </div>
          <h1 class="booking-title">Create Customer Booking</h1>
          <p class="booking-subtitle">Fill in the details to create a courier booking for customer with full officer privileges</p>
        </div>

        <!-- Officer Info Section -->
        <!-- This shows information about the currently logged-in officer -->
        <div class="officer-info-section" *ngIf="currentUser">
          <div class="info-card">
            <div class="info-header">
              <mat-icon>admin_panel_settings</mat-icon>
              <h3>Officer Information</h3>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Officer Name:</span>
                  <span class="info-value">{{ currentUser.officerName || currentUser.customerName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Officer ID:</span>
                  <span class="info-value">{{ currentUser.uniqueId }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Role:</span>
                <span class="info-value">Courier Officer</span>
              </div>
                </div>
              </div>
            </div>

        <!-- Booking Form Section -->
        <!-- This is the main form where officers enter all the booking details -->
        <div class="booking-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Customer Booking Details</h2>
              <p>Enter all required information for the customer's courier service</p>
            </div>

            <!-- The main booking form - this handles all user input -->
            <form [formGroup]="bookingForm" (ngSubmit)="createBooking()" class="booking-form">
              
              <!-- Receiver Details Section -->
              <!-- Information about who will receive the parcel -->
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
                      <mat-error *ngIf="showError('receiverName') && bookingForm.get('receiverName')?.hasError('required')">
                        Receiver name is required
                      </mat-error>
                      <mat-error *ngIf="showError('receiverName') && bookingForm.get('receiverName')?.hasError('minlength')">
                        Name must be at least 3 characters
                      </mat-error>
                      <mat-error *ngIf="showError('receiverName') && bookingForm.get('receiverName')?.hasError('invalidName')">
                        Please enter a valid name (no placeholders like NA, N/A, NULL, AT)
                      </mat-error>
                    </mat-form-field>
                </div>

                  <div class="form-field-container">
                    <label class="field-label">Receiver Mobile *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverMobile" placeholder="Enter receiver's mobile number">
                      <mat-error *ngIf="showError('receiverMobile') && bookingForm.get('receiverMobile')?.hasError('required')">
                        Receiver mobile is required
                      </mat-error>
                      <mat-error *ngIf="showError('receiverMobile') && bookingForm.get('receiverMobile')?.hasError('pattern')">
                        Mobile number must be 10 digits and start with 6-9
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">PIN Code *</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="receiverPin" placeholder="Enter 6-digit PIN code">
                      <mat-error *ngIf="showError('receiverPin') && bookingForm.get('receiverPin')?.hasError('required')">
                        PIN code is required
                      </mat-error>
                      <mat-error *ngIf="showError('receiverPin') && bookingForm.get('receiverPin')?.hasError('pattern')">
                        PIN code must be exactly 6 numbers
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-field-container full-width">
                    <label class="field-label">Receiver Address</label>
                    <mat-form-field appearance="outline" class="form-field">
                    <textarea matInput formControlName="receiverAddress" rows="3" placeholder="Enter complete receiver address"></textarea>
                      <mat-error *ngIf="showError('receiverAddress') && bookingForm.get('receiverAddress')?.hasError('required')">
                        Receiver address is required
                      </mat-error>
                      <mat-error *ngIf="showError('receiverAddress') && bookingForm.get('receiverAddress')?.hasError('minlength')">
                        Address must be at least 10 characters
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
                      <mat-error *ngIf="showError('weight') && bookingForm.get('weight')?.hasError('required')">
                        Weight is required
                      </mat-error>
                      <mat-error *ngIf="showError('weight') && bookingForm.get('weight')?.hasError('min')">
                        Weight must be at least 100 grams
                      </mat-error>
                      <mat-error *ngIf="showError('weight') && bookingForm.get('weight')?.hasError('max')">
                        Weight cannot exceed 50000 grams
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
                      <mat-error *ngIf="showError('packageType') && bookingForm.get('packageType')?.hasError('required')">
                        Package type is required
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-field-container full-width">
                    <label class="field-label">Package Description</label>
                    <mat-form-field appearance="outline" class="form-field">
                    <textarea matInput formControlName="description" rows="3" placeholder="Describe your package contents"></textarea>
                    <mat-error *ngIf="showError('description') && bookingForm.get('description')?.hasError('required')">
                        Package description is required
                      </mat-error>
                    <mat-error *ngIf="showError('description') && bookingForm.get('description')?.hasError('minlength')">
                        Description must be at least 10 characters
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
                      <mat-error *ngIf="showError('deliveryType') && bookingForm.get('deliveryType')?.hasError('required')">
                        Delivery type is required
                      </mat-error>
                    </mat-form-field>
                </div>

                  <div class="form-field-container">
                    <label class="field-label">Packing Preference</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="packingPreference">
                         <mat-option value="BASIC">Basic Packing</mat-option>
                        <mat-option value="STANDARD">Standard Packing</mat-option>
                         <mat-option value="PREMIUM">Premium Packing</mat-option>
                       </mat-select>
                      <mat-error *ngIf="showError('packingPreference') && bookingForm.get('packingPreference')?.hasError('required')">
                        Packing preference is required
                      </mat-error>
                    </mat-form-field>
                </div>
              </div>

                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Pickup Date</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [matDatepicker]="pickupPicker" formControlName="pickupDate" placeholder="Choose pickup date" (dateChange)="onPickupDateChange()" [min]="minPickupDate">
                      <mat-datepicker-toggle matSuffix [for]="pickupPicker"></mat-datepicker-toggle>
                      <mat-datepicker #pickupPicker></mat-datepicker>
                      <mat-error *ngIf="showError('pickupDate') && bookingForm.get('pickupDate')?.hasError('required')">
                        Pickup date is required
                      </mat-error>
                      <mat-error *ngIf="showError('pickupDate') && bookingForm.get('pickupDate')?.hasError('pastDate')">
                        Pickup date cannot be in the past
                      </mat-error>
                    </mat-form-field>
                </div>

                  <div class="form-field-container">
                    <label class="field-label">Pickup Time</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="time" formControlName="pickupTime" placeholder="Choose pickup time">
                      <mat-error *ngIf="showError('pickupTime') && bookingForm.get('pickupTime')?.hasError('required')">
                        Pickup time is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Drop-off Date</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [matDatepicker]="dropoffPicker" formControlName="dropoffDate" placeholder="Choose drop-off date" (dateChange)="onDropoffDateChange()" [min]="minDropoffDate">
                      <mat-datepicker-toggle matSuffix [for]="dropoffPicker"></mat-datepicker-toggle>
                      <mat-datepicker #dropoffPicker></mat-datepicker>
                      <mat-error *ngIf="showError('dropoffDate') && bookingForm.get('dropoffDate')?.hasError('required')">
                        Drop-off date is required
                      </mat-error>
                      <mat-error *ngIf="showError('dropoffDate') && bookingForm.get('dropoffDate')?.hasError('invalidDateRange')">
                        Drop-off date must be after pickup date
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Drop-off Time</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput type="time" formControlName="dropoffTime" placeholder="Choose drop-off time">
                      <mat-error *ngIf="showError('dropoffTime') && bookingForm.get('dropoffTime')?.hasError('required')">
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
                  <span class="cost-label">Base Rate:</span>
                  <span class="cost-value">₹{{ baseRate }}</span>
                </div>
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
                  <span class="cost-label">Admin Fee:</span>
                  <span class="cost-value">₹{{ adminFee }}</span>
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

    /* Officer Info Section */
    .officer-info-section {
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

    .form-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      background: transparent;
    }

    /* Show Angular Material error messages (subscript area) */
    .form-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: block;
      height: auto;
    }

    /* Make caret and text visible immediately on focus */
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
      justify-content: center;
      margin-top: 3rem;
    }

    .submit-button {
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

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
/**
 * Main component class that handles officer booking functionality
 * 
 * This class contains all the logic for:
 * - Managing the booking form
 * - Calculating courier costs
 * - Handling user input validation
 * - Creating bookings in the system
 * - Managing dates and times
 * 
 * Angular Lifecycle:
 * - ngOnInit(): Runs when component first loads
 * - Constructor: Runs when component is created
 * - Template: HTML that shows the form to users
 */
export class OfficerBookingComponent implements OnInit {
  
  // ===== FORM AND STATE PROPERTIES =====
  // These properties store the current state of the component
  
  bookingForm: FormGroup; // Angular reactive form group - manages all form fields and validation
  isLoading = false; // Flag to show/hide loading spinner (prevents multiple submissions)
  currentUser: any = null; // Currently logged-in officer user information (from JWT token)
  
  // ===== COST CALCULATION PROPERTIES =====
  // These properties store the breakdown of the courier service cost
  
  calculatedCost = 0; // Total calculated cost for the booking (final amount customer pays)
  baseRate = 50; // Base rate for courier service (in Indian Rupees) - starting price
  weightCharge = 0; // Additional charge based on parcel weight (heavier = more expensive)
  deliveryCharge = 0; // Charge based on delivery type (standard = cheaper, express = more expensive)
  packingCharge = 0; // Charge based on packing preference (basic = free, premium = extra cost)
  adminFee = 50; // Fixed administrative fee (handling charges, paperwork, etc.)
  subtotal = 0; // Subtotal before tax (base + weight + delivery + packing + admin)
  taxAmount = 0; // Tax amount (GST - Goods and Services Tax in India)
  
  // ===== PARCEL AND DATE PROPERTIES =====
  // These properties store parcel details and date constraints
  
  parcelWeightInGram = 0; // Weight of parcel in grams (used for cost calculation)
  minPickupDate: Date = new Date(); // Minimum allowed pickup date (cannot pick up in the past)
  minDropoffDate: Date = new Date(); // Minimum allowed dropoff date (must be after pickup)
  submitted = false; // Flag to track if form has been submitted (prevents double submission)

  /**
   * Constructor - initializes the component with required services and form
   * 
   * What Happens Here:
   * 1. Angular creates this component
   * 2. Angular automatically provides (injects) the services we need
   * 3. We create the form structure with all fields and validation rules
   * 
   * Dependency Injection:
   * - Angular automatically creates these services and gives them to us
   * - We don't need to manually create them - Spring manages this for us
   * - This is called "dependency injection" - a key Angular feature
   */
  constructor(
    private fb: FormBuilder, // Service for building reactive forms (creates FormGroup, FormControl)
    private bookingService: BookingService, // Service for managing booking operations (API calls)
    private authService: AuthService, // Service for authentication and user management (JWT tokens)
    private router: Router, // Service for navigating between different pages (like a GPS for the app)
    private snackBar: MatSnackBar // Service for displaying toast notifications (popup messages)
  ) {
    // Initialize the reactive form with all required fields and validations
    // This creates the structure that will hold all the form data
    this.bookingForm = this.fb.group({
      
      // ===== RECEIVER INFORMATION FIELDS =====
      // These fields collect information about who will receive the parcel
      
      receiverName: ['', [Validators.required, Validators.minLength(3), this.validHumanNameValidator()]], 
      // Required: Must be filled, min 3 chars, must be a valid human name format
      
      receiverAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]], 
      // Required: Must be filled, min 10 chars (meaningful address), max 200 chars (not too long)
      
      receiverMobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      // Required: Must be filled, must match Indian mobile format (6-9 followed by 9 digits)
      
      receiverPin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], 
      // Required: Must be filled, must be exactly 6 digits (Indian postal code format)
      
      // ===== PARCEL INFORMATION FIELDS =====
      // These fields collect information about the parcel being shipped
      
      weight: ['', [Validators.required, Validators.min(100), Validators.max(50000)]], 
      // Required: Must be filled, min 100g (too light to ship), max 50kg (too heavy for courier)
      
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]], 
      // Required: Must be filled, min 10 chars (meaningful description), max 500 chars (not too long)
      
      packageType: ['DOCUMENTS', Validators.required], 
      // Required: Must be filled, default to DOCUMENTS (other options: ELECTRONICS, CLOTHING, etc.)
      
      deliveryType: ['STANDARD', Validators.required], 
      // Required: Must be filled, default to STANDARD (other option: EXPRESS for faster delivery)
      
      packingPreference: ['BASIC', Validators.required], 
      // Required: Must be filled, default to BASIC (other option: PREMIUM for extra protection)
      
      // ===== DATE AND TIME FIELDS =====
      // These fields collect when the parcel should be picked up and delivered
      
      pickupDate: ['', [Validators.required, this.pastDateValidator()]], 
      // Required: Must be filled, cannot be in the past (custom validator)
      
      pickupTime: ['', Validators.required], 
      // Required: Must be filled (what time to pick up the parcel)
      
      dropoffDate: ['', [Validators.required, this.pastDateValidator()]], 
      // Required: Must be filled, cannot be in the past (custom validator)
      
      dropoffTime: ['', Validators.required] 
      // Required: Must be filled (what time to deliver the parcel)
      
    }, { validators: this.dateRangeValidator }); // Custom validator to ensure dropoff date is after pickup date
  }

  /**
   * ngOnInit() - Lifecycle method called when component is initialized
   * 
   * What Happens When Component Loads:
   * 1. Check if user is logged in as an officer
   * 2. Set up automatic cost calculation when form changes
   * 3. Initialize date picker constraints
   * 
   * This is like the "startup checklist" for the component
   */
  ngOnInit() {
    // Get the currently logged-in officer user from the authentication service
    // This checks if someone is logged in and has officer privileges
    this.currentUser = this.authService.getCurrentUserByRole('OFFICER');
    
    // Security check: If no officer is logged in, redirect to login page
    // This prevents unauthorized access to officer features
    if (!this.currentUser) {
      this.router.navigate(['/login']); // Redirect to login page
      return; // Stop execution here
    }
    
    // Set up automatic cost calculation - whenever any form field changes, recalculate the total cost
    // This gives users real-time feedback on pricing as they fill out the form
    this.bookingForm.valueChanges.subscribe(() => this.calculateCost());
    
    // Initialize date picker constraints (set minimum dates to today)
    this.initializeDatePickers();
  }

  /**
   * Method to initialize date picker constraints
   * 
   * What This Does:
   * - Sets the minimum allowed dates for pickup and dropoff
   * - Prevents users from selecting dates in the past
   * - Ensures logical booking dates
   */
  initializeDatePickers() {
    // Set minimum dates for date pickers to today (cannot select past dates)
    this.minPickupDate = new Date(); // Pickup cannot be in the past
    this.minDropoffDate = new Date(); // Dropoff cannot be in the past
  }

  /**
   * Custom validator function to prevent selection of past dates
   * 
   * What This Does:
   * - Checks if the selected date is in the past
   * - Returns an error if someone tries to pick a past date
   * - Returns null (no error) if the date is valid
   * 
   * How Validation Works:
   * - Angular calls this function whenever the user selects a date
   * - If it returns an error object, the form field shows an error message
   * - If it returns null, the validation passes
   */
  pastDateValidator() {
    return (control: any) => {
      if (!control.value) return null; // If no value, validation passes (field is empty)
      
      const selectedDate = new Date(control.value); // Convert selected value to Date object
      const today = new Date(); // Get current date
      today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison (ignore time)
      
      if (selectedDate < today) {
        return { pastDate: true }; // Return error if date is in the past
      }
      return null; // Return null if validation passes (date is today or in the future)
    };
  }

  // Custom validator function to ensure dropoff date is after pickup date
  dateRangeValidator(form: FormGroup) {
    const pickupDate = form.get('pickupDate'); // Get pickup date form control
    const dropoffDate = form.get('dropoffDate'); // Get dropoff date form control
    
    // Only validate if both dates have values
    if (pickupDate && dropoffDate && pickupDate.value && dropoffDate.value) {
      const pickup = new Date(pickupDate.value); // Convert pickup date to Date object
      const dropoff = new Date(dropoffDate.value); // Convert dropoff date to Date object
      
      // Check if dates are valid (not NaN)
      if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
        return { invalidDate: true }; // Return error if dates are invalid
      }
      
      // Check if dropoff date is after pickup date
      if (dropoff <= pickup) {
        dropoffDate.setErrors({ invalidDateRange: true }); // Set error on dropoff date field
        return { invalidDateRange: true }; // Return form-level error
      }
    }
    
    return null; // Return null if validation passes
  }

  // Event handler called when pickup date changes
  onPickupDateChange() {
    this.calculateCost(); // Recalculate cost as delivery charges may change
    this.updateMinDropoffDate(); // Update minimum allowed dropoff date
  }

  // Event handler called when dropoff date changes
  onDropoffDateChange() {
    this.calculateCost(); // Recalculate cost as delivery charges may change
  }

  // Method to update the minimum allowed dropoff date based on selected pickup date
  updateMinDropoffDate() {
    const pickupDate = this.bookingForm.get('pickupDate')?.value; // Get selected pickup date
    if (pickupDate) {
      const pickup = new Date(pickupDate); // Convert to Date object
      // Set minimum dropoff date to next day after pickup (ensures at least 1 day delivery time)
      this.minDropoffDate = new Date(pickup); // Create new Date object from pickup date
      this.minDropoffDate.setDate(pickup.getDate() + 1); // Add 1 day to pickup date
    }
  }

  // Method to update pickup date and time with default values
  updatePickupDateTime() {
    const pickupDate = this.bookingForm.get('pickupDate')?.value; // Get selected pickup date
    if (pickupDate) {
      const date = new Date(pickupDate); // Convert to Date object
      const timeString = '09:00'; // Default pickup time (9:00 AM)
      this.combineDateTime(date, timeString); // Combine date and time
    }
  }

  // Method to update dropoff date and time with default values
  updateDropoffDateTime() {
    const dropoffDate = this.bookingForm.get('dropoffDate')?.value; // Get selected dropoff date
    if (dropoffDate) {
      const date = new Date(dropoffDate); // Convert to Date object
      const timeString = '18:00'; // Default dropoff time (6:00 PM)
      this.combineDateTime(date, timeString); // Combine date and time
    }
  }

  /**
   * Method to calculate the total cost of the courier service
   * 
   * What This Method Does:
   * 1. Gets the current form values (weight, delivery type, packing preference)
   * 2. Calculates charges based on these values
   * 3. Adds up all charges to get the total cost
   * 4. Applies tax (GST) to get the final amount
   * 
   * Cost Breakdown:
   * - Base Rate: ₹50 (starting price for any courier service)
   * - Weight Charge: ₹0.02 per gram (heavier parcels cost more)
   * - Delivery Charge: Based on speed (Standard ₹30, Express ₹80, Same Day ₹150)
   * - Packing Charge: Based on protection level (Basic ₹10, Premium ₹20)
   * - Admin Fee: ₹50 (fixed handling charge)
   * - Tax: 5% GST on subtotal
   * 
   * This method runs automatically whenever the user changes any form field
   * (thanks to the subscription in ngOnInit)
   */
  calculateCost() {
    // Get current values from the form (or use defaults if not filled)
    const weight = this.bookingForm.get('weight')?.value || 0; // Get parcel weight from form
    const deliveryType = this.bookingForm.get('deliveryType')?.value || 'STANDARD'; // Get delivery type from form
    const packingType = this.bookingForm.get('packingPreference')?.value || 'BASIC'; // Get packing preference from form
    
    // Store weight in grams for display purposes
    this.parcelWeightInGram = weight || 0; // Store weight in grams for display

    // Early exit: If the weight field is not valid yet, reset all costs to 0
    // This prevents showing incorrect costs while the user is still typing
    if (!this.bookingForm.get('weight')?.valid) {
      this.weightCharge = 0; // Reset weight charge
      this.deliveryCharge = 0; // Reset delivery charge
      this.packingCharge = 0; // Reset packing charge
      this.subtotal = 0; // Reset subtotal
      this.taxAmount = 0; // Reset tax amount
      this.calculatedCost = 0; // Reset total cost
      return; // Exit method early (don't calculate anything)
    }

    // ===== WEIGHT CHARGE CALCULATION =====
    // Calculate additional charge based on parcel weight
    // Formula: 2% of weight in grams (₹0.02 per gram)
    this.weightCharge = this.parcelWeightInGram * 0.02; // Calculate weight charge: 2% of weight in grams
    
    // ===== DELIVERY CHARGE CALCULATION =====
    // Calculate charge based on how fast the customer wants delivery
    switch (deliveryType) {
      case 'STANDARD':
        this.deliveryCharge = 30; // Standard delivery: ₹30 (3-5 business days)
        break;
      case 'EXPRESS':
        this.deliveryCharge = 80; // Express delivery: ₹80 (1-2 business days)
        break;
      case 'SAME_DAY':
        this.deliveryCharge = 150; // Same day delivery: ₹150 (within 24 hours)
        break;
      default:
        this.deliveryCharge = 30; // Default to standard delivery charge if something goes wrong
    }
    
    // ===== PACKING CHARGE CALCULATION =====
    // Calculate charge based on how much protection the customer wants
    switch (packingType) {
      case 'BASIC':
        this.packingCharge = 10; // Basic packing: ₹10 (standard bubble wrap and box)
        break;
      case 'PREMIUM':
        this.packingCharge = 20; // Premium packing: ₹20 (extra protection, special materials)
        break;
      default:
        this.packingCharge = 10; // Default to basic packing charge if something goes wrong
    }
    
    // ===== FINAL COST CALCULATION =====
    // Add up all the individual charges to get the subtotal
    this.subtotal = this.baseRate + this.weightCharge + this.deliveryCharge + this.packingCharge + this.adminFee;
    
    // Calculate tax (GST - Goods and Services Tax in India) at 5%
    this.taxAmount = this.subtotal * 0.05; // Calculate 5% GST (Goods and Services Tax)
    
    // Add tax to subtotal and round to nearest rupee for clean pricing
    this.calculatedCost = Math.round(this.subtotal + this.taxAmount); // Round total cost to nearest rupee
  }

  getDeliveryTypeName(): string {
    const deliveryType = this.bookingForm.get('deliveryType')?.value;
    switch (deliveryType) {
      case 'STANDARD': return 'Standard Delivery';
      case 'EXPRESS': return 'Express Delivery';
      case 'SAME_DAY': return 'Same Day Delivery';
      default: return 'Standard Delivery';
    }
  }

  getPackingTypeName(): string {
    const packingType = this.bookingForm.get('packingPreference')?.value;
    switch (packingType) {
      case 'BASIC': return 'Basic Packing';
      case 'PREMIUM': return 'Premium Packing';
      default: return 'Basic Packing';
    }
  }

  combineDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}:00.000`;
  }

  /**
   * Main method that handles the creation of a new courier booking
   * 
   * What This Method Does:
   * 1. Validates that all required form fields are filled correctly
   * 2. Converts form data into the format expected by the backend
   * 3. Sends the booking data to the backend via the booking service
   * 4. Handles the response (success or failure)
   * 5. Redirects to payment page on success or shows error messages
   * 
   * This is the "submit button" logic - it runs when the officer clicks "Create Booking"
   * 
   * Flow:
   * Form Submission → Validation → Data Conversion → API Call → Response Handling → Navigation
   */
  createBooking() {
    // Mark form as submitted to show validation errors
    this.submitted = true;
    
    // Check if all form fields are valid before proceeding
    if (this.bookingForm.valid) {
      // Show loading spinner to prevent multiple submissions
      this.isLoading = true;
      
      // ===== DATA CONVERSION =====
      // Convert form data from Angular format to backend API format
      // The backend expects specific field names and data types
      const bookingData = {
        // Receiver information
        receiverName: this.bookingForm.get('receiverName')?.value, // Who will receive the parcel
        receiverAddress: this.bookingForm.get('receiverAddress')?.value, // Where to deliver
        receiverPin: this.bookingForm.get('receiverPin')?.value, // Postal code for delivery
        receiverMobile: this.bookingForm.get('receiverMobile')?.value, // Contact number for delivery
        
        // Parcel information
        parcelWeightInGram: parseInt(this.bookingForm.get('weight')?.value), // Weight in grams (convert string to number)
        parcelContentsDescription: this.bookingForm.get('description')?.value, // What's inside the parcel
        parcelDeliveryType: this.bookingForm.get('deliveryType')?.value, // How fast (STANDARD/EXPRESS/SAME_DAY)
        parcelPackingPreference: this.bookingForm.get('packingPreference')?.value, // How much protection (BASIC/PREMIUM)
        
        // Date and time information
        parcelPickupTime: this.bookingForm.get('pickupDate')?.value ? 
          this.combineDateTime(this.bookingForm.get('pickupDate')?.value, this.bookingForm.get('pickupTime')?.value || '09:00') : null,
        // Combine pickup date and time, default to 9:00 AM if no time selected
        
        parcelDropoffTime: this.bookingForm.get('dropoffDate')?.value ? 
          this.combineDateTime(this.bookingForm.get('dropoffDate')?.value, this.bookingForm.get('dropoffTime')?.value || '18:00') : null
        // Combine dropoff date and time, default to 6:00 PM if no time selected
      };

      // ===== API CALL =====
      // Send the booking data to the backend via the booking service
      // This creates the actual booking in the database
      this.bookingService.createOfficerBooking(bookingData).subscribe({
        
        // ===== SUCCESS HANDLING =====
        // This runs when the backend successfully creates the booking
        next: (response) => {
          this.isLoading = false; // Hide loading spinner
          
          if (response.success) {
            // Show success message to the officer
            this.snackBar.open('Booking created successfully! Redirecting to payment...', 'Close', { 
              duration: 3000, // Show for 3 seconds
              panelClass: ['success-snackbar'] // Green styling for success
            });
            
            // Redirect to payment page with booking details
            this.router.navigate(['/officer/payment'], {
              queryParams: { 
                bookingId: response.booking?.bookingId, // Unique ID for the new booking
                amount: this.calculatedCost, // Total cost calculated earlier
                customerName: this.currentUser?.officerName || 'Officer', // Who created the booking
                receiverName: this.bookingForm.get('receiverName')?.value, // Who will receive
                receiverAddress: this.bookingForm.get('receiverAddress')?.value // Where to deliver
              }
            });
          } else {
            // Show error message from backend
            this.snackBar.open(response.message || 'Booking creation failed', 'Close', { 
              duration: 5000, // Show for 5 seconds
              panelClass: ['error-snackbar'] // Red styling for errors
            });
          }
        },
        
        // ===== ERROR HANDLING =====
        // This runs when something goes wrong (network error, server error, etc.)
        error: (error) => {
          this.isLoading = false; // Hide loading spinner
          
          // Default error message
          let errorMessage = 'Failed to create booking. Please try again.';
          
          // Check different types of errors and show appropriate messages
          if (error.error && error.error.message) {
            // Backend sent a specific error message
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            // Authentication failed (JWT token expired or invalid)
            errorMessage = 'Authentication failed. Please login again.';
          } else if (error.status === 400) {
            // Bad request (validation errors on backend)
            if (error.error && error.error.errors) {
              // Backend sent detailed validation errors
              const validationErrors = error.error.errors.map((err: any) => err.defaultMessage || err.message).join(', ');
              errorMessage = `Validation errors: ${validationErrors}`;
            } else {
              // Generic validation error
              errorMessage = 'Invalid booking data. Please check all fields.';
            }
          } else if (error.status === 500) {
            // Server error (something went wrong on backend)
            errorMessage = 'Server error. Please try again later.';
          }
          
          // Show the error message to the user
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    } else {
      // Form validation failed - show error message
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
    }
  }

  // Validator to ensure sensible human names and avoid placeholders
  validHumanNameValidator(): ValidatorFn {
    const forbidden = ['na', 'n/a', 'null', 'none', 'test', 'unknown', 'at'];
    return (control: AbstractControl) => {
      const raw = (control.value || '').toString();
      const value = raw.trim();
      if (!value) return { invalidName: true };
      if (value.length < 3) return { invalidName: true };
      if (!/[A-Za-z]/.test(value)) return { invalidName: true };
      if (forbidden.includes(value.toLowerCase())) return { invalidName: true };
      return null;
    };
  }

  // Helper to show errors after user interaction or after submit attempt
  showError(controlName: string): boolean {
    const ctrl = this.bookingForm.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted);
  }
} 