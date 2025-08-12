import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="success-container">
      <div class="success-content">
        <!-- Header Section -->
        <div class="success-header">
          <div class="header-badge">
            <mat-icon>check_circle</mat-icon>
            <span>Payment Successful</span>
          </div>
          <h1 class="success-title">Payment Completed!</h1>
          <p class="success-subtitle">Your payment has been processed successfully</p>
        </div>

        <!-- Success Card Section -->
        <div class="success-card-section">
          <div class="success-card">
          <div class="success-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          
            <div class="success-details">
              <h2 class="success-message">Payment Successful</h2>
              <p class="success-description">Your courier service booking has been confirmed and payment processed.</p>
              
              <div class="transaction-details">
                <div class="detail-item">
                  <span class="detail-label">Transaction ID</span>
                  <span class="detail-value">{{ transactionId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Payment ID</span>
                  <span class="detail-value">{{ paymentId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value amount">₹{{ amount }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Booking ID</span>
                  <span class="detail-value">{{ bookingId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Payment Date</span>
                  <span class="detail-value">{{ paymentDate | date:'medium' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">{{ paymentMethod }}</span>
                </div>
              </div>
            </div>
          </div>
            </div>

        <!-- Next Steps Section -->
        <div class="next-steps-section">
          <div class="steps-card">
            <div class="steps-header">
              <h3>What's Next?</h3>
              <p>Here's what happens after your payment</p>
            </div>

            <div class="steps-grid">
              <div class="step-item">
                <div class="step-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="step-content">
                  <h4>Booking Confirmation</h4>
                  <p>Your booking is now confirmed and being processed by our team</p>
                </div>
              </div>

              <div class="step-item">
                <div class="step-icon">
                  <mat-icon>local_shipping</mat-icon>
                </div>
                <div class="step-content">
                  <h4>Pickup Scheduling</h4>
                  <p>We'll contact you within 24 hours to schedule your package pickup</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-icon">
                  <mat-icon>location_on</mat-icon>
                </div>
                <div class="step-content">
                  <h4>Real-time Tracking</h4>
                  <p>Track your package in real-time using your booking ID</p>
                </div>
              </div>

              <div class="step-item">
                <div class="step-icon">
                  <mat-icon>email</mat-icon>
                </div>
                <div class="step-content">
                  <h4>Email Confirmation</h4>
                  <p>You'll receive a detailed confirmation email shortly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons Section -->
        <div class="actions-section">
          <div class="actions-card">
            <div class="actions-header">
              <h3>Quick Actions</h3>
              <p>What would you like to do next?</p>
            </div>
            
            <div class="actions-grid">
              <button mat-raised-button class="action-btn primary-btn" (click)="goToDashboard()">
                <mat-icon>dashboard</mat-icon>
                <span>Go to Dashboard</span>
              </button>
              
              <button mat-stroked-button class="action-btn secondary-btn" (click)="trackPackage()">
                <mat-icon>location_on</mat-icon>
                <span>Track Package</span>
              </button>
              
              <button mat-stroked-button class="action-btn secondary-btn" (click)="viewInvoice()">
                <mat-icon>receipt</mat-icon>
                <span>View Invoice</span>
              </button>
              
              <button mat-stroked-button class="action-btn secondary-btn" (click)="makeNewBooking()">
                <mat-icon>add_shopping_cart</mat-icon>
                <span>New Booking</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Support Section -->
        <div class="support-section">
          <div class="support-card">
            <div class="support-header">
              <h3>Need Help?</h3>
              <p>Our support team is here to assist you</p>
            </div>
            
            <div class="support-grid">
              <div class="support-item">
                <div class="support-icon">
                  <mat-icon>phone</mat-icon>
                </div>
                <div class="support-content">
                  <h4>Call Support</h4>
                  <p>+1 (555) 123-4567</p>
                  <span class="support-status">Available 24/7</span>
                </div>
              </div>

              <div class="support-item">
                <div class="support-icon">
                  <mat-icon>email</mat-icon>
                </div>
                <div class="support-content">
                  <h4>Email Support</h4>
                  <p>support&#64;courierservice.com</p>
                  <span class="support-status">Response within 2 hours</span>
                </div>
              </div>

              <div class="support-item">
                <div class="support-icon">
                  <mat-icon>chat</mat-icon>
                </div>
                <div class="support-content">
                  <h4>Live Chat</h4>
                  <p>Available Now</p>
                  <span class="support-status">Instant help</span>
                </div>
              </div>
            </div>
          </div>
            </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .success-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, var(--success-light) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, var(--primary-light) 0%, transparent 50%);
      opacity: 0.1;
      pointer-events: none;
    }

    .success-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .success-header {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark) 100%);
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

    .success-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--success-color) 0%, var(--primary-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .success-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .success-card-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .success-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .success-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--success-light) 0%, transparent 100%);
      opacity: 0.05;
    }

    .success-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      box-shadow: var(--shadow-md);
      animation: pulse 2s infinite;
    }

    .success-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: var(--text-inverse);
    }

    .success-details {
      position: relative;
      z-index: 1;
    }

    .success-message {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .success-description {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .transaction-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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

    .detail-value.amount {
      color: var(--success-color);
      font-size: 1.125rem;
    }

    .next-steps-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .steps-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .steps-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .steps-header h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .steps-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .step-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .step-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .step-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-inverse);
    }

    .step-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .step-content p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    .actions-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.6s both;
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

    .support-section {
      animation: fadeInUp 0.8s ease-out 0.8s both;
    }

    .support-card {
      background: var(--background-card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }

    .support-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .support-header h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .support-header p {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .support-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .support-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .support-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--accent-color);
    }

    .support-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .support-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-inverse);
    }

    .support-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .support-content p {
      color: var(--text-primary);
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .support-status {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .success-container {
        padding: 100px 1rem 2rem;
      }

      .success-title {
        font-size: 2rem;
      }

      .success-card {
        padding: 2rem;
      }

      .steps-grid,
      .actions-grid,
      .support-grid {
        grid-template-columns: 1fr;
      }
      
      .transaction-details {
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

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  transactionId: string = '';
  paymentId: string = '';
  amount: number = 0;
  bookingId: string = '';
  paymentDate: Date = new Date();
  paymentMethod: string = 'Credit Card';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get payment details from route params
    this.route.queryParams.subscribe(params => {
      this.transactionId = params['transactionId'] || 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.paymentId = params['paymentId'] || 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.amount = parseFloat(params['amount']) || 1500.00;
      this.bookingId = params['bookingId'] || 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.paymentDate = new Date();
      this.paymentMethod = params['paymentMethod'] || 'Credit Card';
    });
  }

  goToDashboard() {
    this.router.navigate(['/customer/dashboard']);
  }

  trackPackage() {
    this.router.navigate(['/customer/tracking'], { queryParams: { bookingId: this.bookingId } });
  }

  viewInvoice() {
    this.router.navigate(['/customer/invoice'], { queryParams: { bookingId: this.bookingId } });
  }

  makeNewBooking() {
    this.router.navigate(['/customer/booking']);
  }
} 