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
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-payment',
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

    <div class="payment-container">
      <div class="payment-content">
        <!-- Header Section -->
        <div class="payment-header">
          <div class="header-badge">
            <mat-icon>payment</mat-icon>
            <span>Payment Processing</span>
          </div>
          <h1 class="payment-title">Process Customer Payment</h1>
          <p class="payment-subtitle">Process payment for customer booking on their behalf</p>
        </div>

        <!-- Payment Form Section -->
        <div class="payment-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Payment Information</h2>
              <p>Enter payment details to process the customer's booking payment</p>
            </div>

            <!-- Booking Summary -->
            <div class="booking-summary-section" *ngIf="bookingDetails">
              <div class="summary-card">
                <div class="summary-header">
                  <mat-icon>receipt</mat-icon>
            <h3>Booking Summary</h3>
                </div>
            <div class="summary-grid">
              <div class="summary-item">
                    <span class="summary-label">Booking ID</span>
                    <span class="summary-value">{{ bookingDetails.bookingId }}</span>
              </div>
              <div class="summary-item">
                    <span class="summary-label">Total Amount</span>
                    <span class="summary-value amount">₹{{ bookingDetails.totalAmount }}</span>
              </div>
              <div class="summary-item">
                    <span class="summary-label">Customer</span>
                    <span class="summary-value">{{ bookingDetails.customerName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Demo Cards Section -->
            <div class="demo-cards-section">
              <div class="demo-header">
                <h3>Demo Payment Cards</h3>
                <p>Click to auto-fill payment details for testing</p>
              </div>
              <div class="demo-cards-grid">
                <div class="demo-card success-card" (click)="fillDemoCard('success')">
                  <div class="demo-card-header">
                    <mat-icon>check_circle</mat-icon>
                    <span>Success Card</span>
                  </div>
                  <div class="demo-card-number">4242 4242 4242 4242</div>
                  <div class="demo-card-details">
                    <span>MM/YY: 12/25</span>
                    <span>CVV: 123</span>
            </div>
          </div>

                <div class="demo-card error-card" (click)="fillDemoCard('error')">
                  <div class="demo-card-header">
                    <mat-icon>error</mat-icon>
                    <span>Error Card</span>
                  </div>
                  <div class="demo-card-number">4000 0000 0000 0002</div>
                  <div class="demo-card-details">
                    <span>MM/YY: 12/25</span>
                    <span>CVV: 456</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Form -->
          <form [formGroup]="paymentForm" (ngSubmit)="processPayment()" class="payment-form">
            <div class="form-section">
                <div class="section-header">
                  <mat-icon>credit_card</mat-icon>
              <h3>Card Information</h3>
                </div>
                
                <div class="form-grid">
                  <div class="form-field-container full-width">
                    <label class="field-label">Card Number</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="cardNumber" 
                             placeholder="1234 5678 9012 3456"
                             maxlength="19" 
                             (input)="formatCardNumber($event)">
                      <mat-icon matSuffix>credit_card</mat-icon>
                  <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('required')">
                    Card number is required
                  </mat-error>
                  <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('invalidCard')">
                    Please enter a valid card number
                  </mat-error>
                </mat-form-field>
              </div>

                  <div class="form-field-container">
                    <label class="field-label">Expiry Date</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="expiryDate" 
                             placeholder="MM/YY" 
                             maxlength="5">
                      <mat-icon matSuffix>schedule</mat-icon>
                  <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('required')">
                    Expiry date is required
                  </mat-error>
                  <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('invalidExpiry')">
                    Please enter a valid expiry date (MM/YY)
                  </mat-error>
                </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">CVV</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput [type]="showCVV ? 'text' : 'password'" 
                             formControlName="cvv" 
                             placeholder="123" 
                             maxlength="4">
                      <button mat-icon-button matSuffix 
                              (click)="toggleCVVVisibility()" 
                              [attr.aria-label]="'Hide CVV'" 
                              [attr.aria-pressed]="showCVV">
                    <mat-icon>{{ showCVV ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="paymentForm.get('cvv')?.hasError('required')">
                    CVV is required
                  </mat-error>
                  <mat-error *ngIf="paymentForm.get('cvv')?.hasError('pattern')">
                    CVV must be 3-4 digits
                  </mat-error>
                </mat-form-field>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-header">
                  <mat-icon>person</mat-icon>
                  <h3>Cardholder Information</h3>
              </div>

                <div class="form-grid">
                  <div class="form-field-container">
                    <label class="field-label">Cardholder Name</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="cardholderName" 
                             placeholder="Enter cardholder name">
                      <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="paymentForm.get('cardholderName')?.hasError('required')">
                    Cardholder name is required
                  </mat-error>
                </mat-form-field>
            </div>

                  <div class="form-field-container">
                    <label class="field-label">Payment Type</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-select formControlName="paymentType" placeholder="Select payment type">
                        <mat-option value="credit">Credit Card</mat-option>
                        <mat-option value="debit">Debit Card</mat-option>
                      </mat-select>
                      <mat-icon matSuffix>account_balance</mat-icon>
                      <mat-error *ngIf="paymentForm.get('paymentType')?.hasError('required')">
                        Payment type is required
                  </mat-error>
                </mat-form-field>
                  </div>
              </div>
            </div>

              <!-- Form Actions -->
              <div class="form-actions">
              <button mat-raised-button type="submit" 
                      [disabled]="paymentForm.invalid || isLoading"
                        class="submit-button">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">payment</mat-icon>
                  <span *ngIf="!isLoading">Process Payment</span>
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem 0;
    }

    .payment-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .payment-header {
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

    .payment-title {
      font-size: 3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .payment-subtitle {
      font-size: 1.125rem;
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }

    .payment-form-section {
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

    .booking-summary-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .summary-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid #bae6fd;
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .summary-header mat-icon {
      color: #0891b2;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .summary-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-label {
      color: #64748b;
      font-weight: 500;
    }

    .summary-value {
      color: #1e293b;
      font-weight: 600;
    }

    .summary-value.amount {
      color: #0891b2;
      font-size: 1.125rem;
    }

    .demo-cards-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .demo-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .demo-header p {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
    }

    .demo-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .demo-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 2px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .demo-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .demo-card.success-card {
      border-color: #10b981;
    }

    .demo-card.success-card:hover {
      border-color: #059669;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
    }

    .demo-card.error-card {
      border-color: #ef4444;
    }

    .demo-card.error-card:hover {
      border-color: #dc2626;
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
    }

    .demo-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .demo-card-header mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .success-card .demo-card-header mat-icon {
      color: #10b981;
    }

    .error-card .demo-card-header mat-icon {
      color: #ef4444;
    }

    .demo-card-header span {
      font-weight: 600;
      color: #1e293b;
    }

    .demo-card-number {
      font-family: 'Courier New', monospace;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }

    .demo-card-details {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #64748b;
    }

    .form-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .section-header mat-icon {
      color: #0891b2;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
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
      .payment-content {
        padding: 0 1rem;
      }

      .payment-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 2rem 1.5rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .demo-cards-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .submit-button {
        width: 100%;
        padding: 1rem 2rem;
      }
    }
  `]
})
export class OfficerPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  isLoading = false;
  bookingDetails: any = null;
  showCVV = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.cardNumberValidator()]],
      expiryDate: ['', [Validators.required, this.expiryDateValidator()]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      cardholderName: ['', Validators.required],
      paymentType: ['credit', Validators.required]
    });
  }

  ngOnInit() {
    // Get booking details from query parameters (like customer payment)
    this.route.queryParams.subscribe(params => {
      this.bookingDetails = {
        bookingId: params['bookingId'],
        totalAmount: params['amount'],
        customerName: params['customerName'],
        receiverName: params['receiverName'],
        receiverAddress: params['receiverAddress']
      };

      if (!this.bookingDetails.bookingId) {
        this.snackBar.open('No booking details found. Please create a booking first.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/officer/booking']);
      }
    });
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    event.target.value = value;
    this.paymentForm.patchValue({ cardNumber: value });
  }

  toggleCVVVisibility() {
    this.showCVV = !this.showCVV;
  }

  fillDemoCard(type: 'success' | 'error') {
    if (type === 'success') {
      this.paymentForm.patchValue({
        cardNumber: '4242 4242 4242 4242',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'Demo User',
        paymentType: 'credit'
      });
    } else {
      this.paymentForm.patchValue({
        cardNumber: '4000 0000 0000 0002',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'Demo User',
        paymentType: 'credit'
      });
    }
  }

  cardNumberValidator() {
    return (control: any) => {
      const value = control.value.replace(/\s/g, '');
      if (!value) return null;
      
      // Basic Luhn algorithm check
      let sum = 0;
      let isEven = false;
      
      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i));
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0 ? null : { invalidCard: true };
    };
  }

  expiryDateValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) return null;
      
      const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!pattern.test(value)) {
        return { invalidExpiry: true };
      }
      
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const cardYear = parseInt(year);
      const cardMonth = parseInt(month);
      
      if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
        return { invalidExpiry: true };
      }
      
      return null;
    };
  }

  processPayment() {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      
      const paymentData = {
        ...this.paymentForm.value,
        cardNumber: this.paymentForm.value.cardNumber, // Keep spaces as backend expects them
        bookingId: this.bookingDetails?.bookingId,
        amount: this.bookingDetails?.totalAmount
      };

      this.paymentService.processPayment(paymentData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Payment successful:', response);
          
          this.snackBar.open('Payment processed successfully! Redirecting to invoice...', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          
          // Generate transaction ID
          const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
          
          this.router.navigate(['/officer/invoice'], {
            queryParams: {
              bookingId: this.bookingDetails?.bookingId,
              transactionId: transactionId,
              amount: this.bookingDetails?.totalAmount,
              customerName: this.bookingDetails?.customerName,
              receiverName: this.bookingDetails?.receiverName,
              receiverAddress: this.bookingDetails?.receiverAddress
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Payment processing failed. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
} 