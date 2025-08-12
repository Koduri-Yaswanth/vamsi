import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../../services/payment.service';
import { BookingService } from '../../../services/booking.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="invoice-container">
      <div class="invoice-content">
        <!-- Header Section -->
        <div class="invoice-header">
          <div class="header-badge">
            <mat-icon>receipt</mat-icon>
            <span>Invoice Details</span>
          </div>
          <h1 class="invoice-title">Invoice & Receipt</h1>
          <p class="invoice-subtitle">Complete details of your courier service booking</p>
        </div>

        <!-- Loading State -->
        <div class="loading-section" *ngIf="isLoading">
          <div class="loading-card">
            <mat-spinner diameter="50"></mat-spinner>
            <h3>Loading Invoice Details</h3>
            <p>Please wait while we fetch your invoice information...</p>
          </div>
        </div>

        <!-- Error State -->
        <div class="error-section" *ngIf="errorMessage && !isLoading">
          <div class="error-card">
            <div class="error-icon">
              <mat-icon>error</mat-icon>
            </div>
            <h3>Unable to Load Invoice</h3>
            <p>{{ errorMessage }}</p>
            <button mat-raised-button class="retry-btn" (click)="retryLoadInvoice()">
              <mat-icon>refresh</mat-icon>
              <span>Retry</span>
            </button>
          </div>
        </div>

        <!-- Invoice Content -->
        <div class="invoice-sections" *ngIf="invoiceData && !isLoading">
          <!-- Invoice Header -->
          <div class="invoice-header-section">
            <div class="invoice-header-card">
              <div class="invoice-header-content">
                <div class="invoice-info">
                  <div class="invoice-number">
                    <h2>Invoice #{{ invoiceData.invoiceNumber }}</h2>
                    <span class="invoice-status">PAID</span>
                  </div>
                  <div class="invoice-dates">
                    <div class="date-item">
                      <span class="date-label">Issue Date</span>
                      <span class="date-value">{{ invoiceData.issueDate | date:'mediumDate' }}</span>
                    </div>
                    <div class="date-item">
                      <span class="date-label">Due Date</span>
                      <span class="date-value">{{ invoiceData.dueDate | date:'mediumDate' }}</span>
                    </div>
                  </div>
                </div>
                <div class="company-info">
                  <div class="company-logo">
                    <mat-icon>local_shipping</mat-icon>
                    <span>Express Parcel</span>
                  </div>
                  <div class="company-details">
                    <p>Express Parcel Solutions Pvt Ltd</p>
                    <p>No. 45, Brigade Road, MG Road</p>
                    <p>Bangalore, Karnataka 560001</p>
                    <p>Phone: +91 80 4567 8900</p>
                    <p>Email: billing&#64;expressparcel.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer & Receiver Information -->
          <div class="customer-receiver-section">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-header">
                  <mat-icon>person</mat-icon>
                  <h3>Customer Information</h3>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">Name</span>
                    <span class="info-value">{{ invoiceData.customerName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">{{ invoiceData.customerEmail }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">{{ invoiceData.customerPhone }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Address</span>
                    <span class="info-value">{{ invoiceData.customerAddress }}</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-header">
                  <mat-icon>location_on</mat-icon>
                  <h3>Receiver Information</h3>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">Name</span>
                    <span class="info-value">{{ invoiceData.receiverName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">{{ invoiceData.receiverMobile }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Address</span>
                    <span class="info-value">{{ invoiceData.receiverAddress }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">PIN Code</span>
                    <span class="info-value">{{ invoiceData.receiverPin || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="payment-info-section">
            <div class="payment-info-card">
              <div class="payment-info-header">
                <mat-icon>payment</mat-icon>
                <h3>Payment Information</h3>
              </div>
              <div class="payment-info-content">
               <div class="payment-info-item">
                  <span class="payment-info-label">Payment ID</span>
                  <span class="payment-info-value">{{ invoiceData.paymentId }}</span>
                </div>
                <div class="payment-info-item">
                  <span class="payment-info-label">Transaction ID</span>
                  <span class="payment-info-value">{{ invoiceData.transactionId }}</span>
                </div>
                 <div class="payment-info-item">
                   <span class="payment-info-label">Booking ID</span>
                   <span class="payment-info-value">{{ invoiceData.bookingId }}</span>
                 </div>
                <div class="payment-info-item">
                  <span class="payment-info-label">Payment Time</span>
                  <span class="payment-info-value">{{ invoiceData.paymentTime | date:'medium' }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- continue with more sections inside invoice-sections -->

          <!-- Parcel Details -->
          <div class="parcel-details-section">
            <div class="parcel-card">
              <div class="parcel-header">
                <mat-icon>inventory</mat-icon>
                <h3>Parcel Details</h3>
              </div>
              <div class="parcel-grid three-rows">
                <div class="parcel-row">
                  <div class="parcel-item"><span class="parcel-label">Weight</span><span class="parcel-value">{{ invoiceData.parcelWeight }}g</span></div>
                  <div class="parcel-item"><span class="parcel-label">Contents</span><span class="parcel-value">{{ invoiceData.parcelContents }}</span></div>
                </div>
                <div class="parcel-row">
                  <div class="parcel-item"><span class="parcel-label">Delivery Type</span><span class="parcel-value">{{ invoiceData.deliveryType }}</span></div>
                  <div class="parcel-item"><span class="parcel-label">Packing Preference</span><span class="parcel-value">{{ invoiceData.packingPreference }}</span></div>
                </div>
                <div class="parcel-row">
                  <div class="parcel-item"><span class="parcel-label">Pickup Time</span><span class="parcel-value">{{ invoiceData.pickupTime | date:'medium' }}</span></div>
                  <div class="parcel-item"><span class="parcel-label">Drop-off Time</span><span class="parcel-value">{{ invoiceData.dropoffTime | date:'medium' }}</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Service Timeline -->
          <div class="timeline-section">
            <div class="timeline-card">
              <div class="timeline-header">
                <mat-icon>schedule</mat-icon>
                <h3>Service Timeline</h3>
              </div>
              <div class="timeline-grid">
                <div class="timeline-item">
                  <div class="timeline-icon">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <h4>Pickup Time</h4>
                    <p>{{ invoiceData.pickupTime ? (invoiceData.pickupTime | date:'medium') : 'Scheduled' }}</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-icon">
                    <mat-icon>local_shipping</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <h4>In Transit</h4>
                    <p>Package is being transported</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-icon">
                    <mat-icon>location_on</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <h4>Drop-off Time</h4>
                    <p>{{ invoiceData.dropoffTime ? (invoiceData.dropoffTime | date:'medium') : 'Scheduled' }}</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-icon">
                    <mat-icon>payment</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <h4>Payment Time</h4>
                    <p>{{ invoiceData.paymentTime ? (invoiceData.paymentTime | date:'medium') : (transactionDate | date:'medium') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="payment-summary-section">
            <div class="payment-summary-card">
              <div class="payment-summary-header">
                <mat-icon>payment</mat-icon>
                <h3>Payment Summary</h3>
              </div>
                <div class="payment-details">
                  <div class="payment-item">
                    <span class="payment-label">Amount Paid</span>
                    <span class="payment-value">₹{{ totalAmount | number:'1.2-2' }}</span>
                  </div>
                <div class="payment-item">
                  <span class="payment-label">Payment Type</span>
                  <span class="payment-value">Credit/Debit Card</span>
                </div>
                <div class="payment-item">
                  <span class="payment-label">Payment ID</span>
                  <span class="payment-value">{{ invoiceData.paymentId }}</span>
                </div>
                <div class="payment-item">
                  <span class="payment-label">Transaction ID</span>
                  <span class="payment-value">{{ invoiceData.transactionId }}</span>
                </div>
                <div class="payment-item">
                  <span class="payment-label">Payment Time</span>
                  <span class="payment-value">{{ invoiceData.paymentTime | date:'medium' }}</span>
                </div>
                  <div class="payment-item total">
                    <span class="payment-label">Total Amount</span>
                    <span class="payment-value">₹{{ totalAmount | number:'1.2-2' }}</span>
                  </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="actions-section">
            <div class="actions-card">
              <div class="actions-header">
                <h3>Invoice Actions</h3>
                <p>Download or share your invoice</p>
              </div>
              <div class="actions-grid">
                <button mat-raised-button class="action-btn primary-btn" (click)="downloadInvoice()">
                  <mat-icon>download</mat-icon>
                  <span>Download PDF</span>
                </button>
                <button mat-stroked-button class="action-btn secondary-btn" (click)="shareInvoice()">
                  <mat-icon>share</mat-icon>
                  <span>Share Invoice</span>
                </button>
                <button mat-stroked-button class="action-btn secondary-btn" (click)="goToDashboard()">
                  <mat-icon>dashboard</mat-icon>
                  <span>Go to Dashboard</span>
                </button>
                <button mat-stroked-button class="action-btn secondary-btn" (click)="trackPackage()">
                  <mat-icon>location_on</mat-icon>
                  <span>Track Package</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .invoice-container::before {
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

    .invoice-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .invoice-header {
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

    .invoice-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .invoice-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .loading-section,
    .error-section {
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .loading-card,
    .error-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
      text-align: center;
    }

    .loading-card h3,
    .error-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 1rem 0 0.5rem;
    }

    .loading-card p,
    .error-card p {
      color: var(--text-secondary);
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    .error-icon {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, var(--error-color) 0%, var(--error-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .error-icon mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--text-inverse);
    }

    .retry-btn {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 auto;
    }

    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .invoice-sections {
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .invoice-header-section {
      margin-bottom: 2rem;
    }

    .invoice-header-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .invoice-header-content {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2rem;
      align-items: start;
    }

    .invoice-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .invoice-number {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .invoice-number h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .invoice-status {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark) 100%);
      color: var(--text-inverse);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .invoice-dates {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .date-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .date-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .date-value {
      font-size: 1rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .company-info {
      text-align: right;
    }

    .company-logo {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .company-logo mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--primary-color);
    }

    .company-logo span {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .company-details p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0.25rem 0;
    }

    .customer-receiver-section {
      margin-bottom: 2rem;
    }

    .payment-info-section {
      margin-bottom: 2rem;
    }

    .payment-info-card {
      background: var(--background-card);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }

    .payment-info-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-light);
    }

    .payment-info-header mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .payment-info-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .payment-info-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .payment-info-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .payment-info-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 600;
      text-align: right;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .info-card {
      background: var(--background-card);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-light);
    }

    .info-header mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .info-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .info-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .info-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 600;
      text-align: right;
    }

    .parcel-details-section {
      margin-bottom: 2rem;
    }

    .parcel-card {
      background: var(--background-card);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }

    .parcel-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-light);
    }

    .parcel-header mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .parcel-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .parcel-grid {
      display: grid;
      gap: 1rem;
    }
    .parcel-grid.three-rows { grid-template-rows: repeat(3, auto); }
    .parcel-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }

    .parcel-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .parcel-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .parcel-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .timeline-section {
      margin-bottom: 2rem;
    }

    .timeline-card {
      background: var(--background-card);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }

    .timeline-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-light);
    }

    .timeline-header mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .timeline-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .timeline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .timeline-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
      border-color: var(--primary-color);
    }

    .timeline-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .timeline-icon mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: var(--text-inverse);
    }

    .timeline-content h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .timeline-content p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .payment-summary-section {
      margin-bottom: 2rem;
    }

    .payment-summary-card {
      background: var(--background-card);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }

    .payment-summary-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-light);
    }

    .payment-summary-header mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .payment-summary-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .payment-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .payment-item.total {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      border-color: var(--primary-color);
    }

    .payment-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .payment-item.total .payment-label {
      color: var(--text-primary);
      font-weight: 600;
    }

    .payment-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .payment-item.total .payment-value {
      color: var(--text-inverse);
      font-size: 1rem;
    }

    .actions-section {
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .actions-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .actions-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .actions-header h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .actions-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all var(--transition-fast);
      min-height: 3rem;
    }

    .primary-btn {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      border: none;
      box-shadow: var(--shadow-sm);
    }

    .primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .secondary-btn {
      background: var(--background-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-light);
    }

    .secondary-btn:hover {
      border-color: var(--primary-color);
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    @media (max-width: 768px) {
      .invoice-container {
        padding: 100px 1rem 2rem;
      }

      .invoice-title {
        font-size: 2rem;
      }

      .invoice-header-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .company-info {
        text-align: left;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .parcel-grid,
      .timeline-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
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
export class InvoiceComponent implements OnInit {
  invoiceData: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  transactionId: string = '';
  transactionDate: Date = new Date();
  // Totals
  totalAmount = 0;
  paidAmount: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const bookingId = params['bookingId'];
      this.transactionId = params['transactionId'] || 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
      // If backend provided a paymentId via navigation, keep it in demo invoice too
      const navPaymentId = params['paymentId'];
      // Capture amount paid from payment page if present
      const amountParam = params['amount'];
      this.paidAmount = amountParam ? parseFloat(amountParam) : null;
      
      if (bookingId) {
        this.loadInvoiceData(bookingId);
      } else {
        this.errorMessage = 'No booking ID found';
      }
    });
  }

  loadInvoiceData(bookingId: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService.generateInvoice(bookingId).subscribe({
      next: (response) => {
        if (response.success) {
          this.invoiceData = response.invoiceData;
          // Populate any missing UI fields from booking/details
          this.populateExtraDetails(bookingId);
          this.computeTotals();
        } else {
          // For demo purposes, create invoice data from query params
          this.createDemoInvoiceData(bookingId);
        }
      },
      error: (error) => {
        // For demo purposes, create invoice data from query params
        this.createDemoInvoiceData(bookingId);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private populateExtraDetails(bookingId: string) {
    try {
      // Derive issue/due dates if backend doesn't provide them
      const paymentTime = this.invoiceData?.paymentTime ? new Date(this.invoiceData.paymentTime) : new Date();
      this.invoiceData.issueDate = this.invoiceData.issueDate || paymentTime;
      this.invoiceData.dueDate = this.invoiceData.dueDate || new Date(paymentTime.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Fetch booking to enrich with customer and receiver details
      this.bookingService.getBookingById(bookingId).subscribe({
        next: (booking: any) => {
          // Receiver PIN might be missing in some payloads; backfill from booking if available
          if ((!this.invoiceData.receiverPin || this.invoiceData.receiverPin === '' || this.invoiceData.receiverPin === 'N/A') && booking?.receiverPin) {
            this.invoiceData.receiverPin = booking.receiverPin;
          }

          // Customer details (if booking has embedded customer)
          const customer = booking?.customer;
          if (customer) {
            this.invoiceData.customerName = customer.customerName;
            this.invoiceData.customerEmail = customer.email;
            this.invoiceData.customerPhone = customer.mobileNumber;
            this.invoiceData.customerAddress = customer.address;
          } else {
            // Fallback from local storage if booking lacks customer object
            try {
              const raw = localStorage.getItem('customer_user');
              if (raw) {
                const u = JSON.parse(raw);
                this.invoiceData.customerName = this.invoiceData.customerName || u?.customerName;
                this.invoiceData.customerEmail = this.invoiceData.customerEmail || u?.email;
                this.invoiceData.customerPhone = this.invoiceData.customerPhone || u?.mobileNumber;
                this.invoiceData.customerAddress = this.invoiceData.customerAddress || u?.address;
              }
            } catch {}
          }
          this.computeTotals();
        },
        error: () => {
          // If booking fetch fails, we still keep derived dates and continue
          this.computeTotals();
        }
      });
    } catch {}
  }

  private computeTotals() {
    const base = Number(this.invoiceData?.serviceCost ?? 0);
    // Prefer the amount passed from payment page to ensure match
    this.totalAmount = this.paidAmount != null && !isNaN(this.paidAmount) ? +(+this.paidAmount).toFixed(2) : +base.toFixed(2);
  }

  createDemoInvoiceData(bookingId: string) {
    const params = this.route.snapshot.queryParams;
    
    this.invoiceData = {
      bookingId: bookingId,
      paymentId: this.route.snapshot.queryParams['paymentId'] || ('PAY' + Math.random().toString(36).substr(2, 9).toUpperCase()),
      transactionId: this.transactionId,
      invoiceNumber: 'INV' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      receiverName: params['receiverName'] || 'Receiver Name',
      receiverAddress: params['receiverAddress'] || 'Receiver Address',
      receiverPin: params['receiverPin'] || '123456',
      receiverMobile: '9876543210',
      parcelWeight: '2500',
      parcelContents: 'Electronics and Documents',
      deliveryType: 'Express Delivery',
      packingPreference: 'Premium Packing',
      pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      dropoffTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      serviceCost: parseFloat(params['amount'] || '1500.00'),
      paymentTime: new Date(),
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+91 9876543210',
      customerAddress: '123 Main Street, City, State 12345',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
  }

  retryLoadInvoice() {
    this.errorMessage = '';
    const bookingId = this.route.snapshot.queryParams['bookingId'];
    if (bookingId) {
      this.loadInvoiceData(bookingId);
    }
  }

  downloadInvoice() {
    if (!this.invoiceData?.invoiceNumber) {
      this.snackBar.open('Invoice data not available', 'Close', { duration: 3000 });
      return;
    }

    this.snackBar.open('Generating PDF invoice...', 'Close', { duration: 2000 });

    this.paymentService.downloadInvoicePdf(this.invoiceData.bookingId).subscribe({
      next: (response: any) => {
        try {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice_${this.invoiceData.invoiceNumber}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.snackBar.open('Invoice downloaded successfully!', 'Close', { duration: 3000 });
        } catch (error) {
          console.error('Error creating download link:', error);
          this.snackBar.open('Error creating download link', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Download error:', error);
        let errorMessage = 'Failed to download invoice';
        
        if (error.message) {
          if (error.message.includes('Invoice not found')) {
            errorMessage = 'Invoice not found for this booking';
          } else if (error.message.includes('Server error')) {
            errorMessage = 'Server error while generating PDF. Please try again.';
          } else if (error.message.includes('Status:')) {
            errorMessage = `Download failed: ${error.message}`;
          }
        }
        
        this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
      }
    });
  }

  shareInvoice() {
    if (!this.invoiceData?.invoiceNumber) {
      this.snackBar.open('Invoice data not available', 'Close', { duration: 3000 });
      return;
    }

    // Implement share functionality
    this.snackBar.open('Share functionality coming soon', 'Close', { duration: 3000 });
  }

  goToDashboard() {
    this.router.navigate(['/customer/dashboard']);
  }

  trackPackage() {
    const bookingId = this.invoiceData?.bookingId || this.route.snapshot.queryParams['bookingId'];
    this.router.navigate(['/customer/tracking'], { queryParams: { bookingId } });
  }
}