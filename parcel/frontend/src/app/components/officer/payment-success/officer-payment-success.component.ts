import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-officer-payment-success',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="success-container">
      <mat-card class="success-card">
        <div class="success-icon">
          <mat-icon>check_circle</mat-icon>
        </div>
        
        <mat-card-header>
          <mat-card-title>Payment Successful! (Officer)</mat-card-title>
          <mat-card-subtitle>Booking has been confirmed</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Basic Payment Info (always shown) -->
          <div class="payment-details">
            <h3>Payment Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Payment ID:</strong> {{ paymentId }}
              </div>
              <div class="detail-item">
                <strong>Transaction ID:</strong> {{ transactionId }}
              </div>
              <div class="detail-item">
                <strong>Amount Paid:</strong> ₹{{ amount | number:'1.2-2' }}
              </div>
              <div class="detail-item">
                <strong>Booking ID:</strong> {{ bookingId }}
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Loading invoice details...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="errorMessage" class="error-container">
            <p class="error-message">{{ errorMessage }}</p>
          </div>

          <!-- Invoice Details (when loaded) -->
          <div class="payment-details" *ngIf="invoiceData && !isLoading">
            <h3>Invoice Details</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Invoice Number:</strong> {{ invoiceData.invoiceNumber }}
              </div>
            </div>

            <h3>Receiver Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Name:</strong> {{ invoiceData.receiverName }}
              </div>
              <div class="detail-item">
                <strong>Address:</strong> {{ invoiceData.receiverAddress }}
              </div>
              <div class="detail-item">
                <strong>PIN Code:</strong> {{ invoiceData.receiverPin }}
              </div>
              <div class="detail-item">
                <strong>Mobile:</strong> {{ invoiceData.receiverMobile }}
              </div>
            </div>

            <h3>Parcel Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Weight:</strong> {{ invoiceData.parcelWeight }}g
              </div>
              <div class="detail-item">
                <strong>Contents:</strong> {{ invoiceData.parcelContents }}
              </div>
              <div class="detail-item">
                <strong>Delivery Type:</strong> {{ invoiceData.deliveryType }}
              </div>
              <div class="detail-item">
                <strong>Packing Preference:</strong> {{ invoiceData.packingPreference }}
              </div>
            </div>

            <h3>Timing Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Pickup Time:</strong> {{ invoiceData.pickupTime ? (invoiceData.pickupTime | date:'medium') : 'Scheduled' }}
              </div>
              <div class="detail-item">
                <strong>Drop-off Time:</strong> {{ invoiceData.dropoffTime ? (invoiceData.dropoffTime | date:'medium') : 'Scheduled' }}
              </div>
              <div class="detail-item">
                <strong>Payment Time:</strong> {{ invoiceData.paymentTime ? (invoiceData.paymentTime | date:'medium') : (transactionDate | date:'medium') }}
              </div>
            </div>

            <h3>Payment Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Service Cost:</strong> ₹{{ invoiceData.serviceCost | number:'1.2-2' }}
              </div>
              <div class="detail-item">
                <strong>Payment Type:</strong> Credit/Debit Card
              </div>
              <div class="detail-item">
                <strong>Status:</strong> PAID
              </div>
            </div>
          </div>

          <div class="next-steps">
            <h3>Next Steps</h3>
            <ul>
              <li>Customer will receive a confirmation email shortly</li>
              <li>Track the package using the booking ID</li>
              <li>Schedule pickup with the customer</li>
            </ul>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goToDashboard()">
            Go to Dashboard
          </button>
          <button mat-stroked-button (click)="downloadInvoice()" [disabled]="!bookingId || isLoading">
            <mat-icon>download</mat-icon>
            Download Invoice
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      background: linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%);
      padding: 80px 20px 20px;
      position: relative;
    }

    .success-container::before {
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

    .success-card {
      width: 100%;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .success-card ::ng-deep .mat-mdc-card-header {
      margin-bottom: 30px;
    }

    .success-card ::ng-deep .mat-mdc-card-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .success-card ::ng-deep .mat-mdc-card-subtitle {
      font-size: 1.1rem;
      color: #a0a0a0;
      margin: 0;
    }

    .success-icon {
      margin-bottom: 30px;
    }

    .success-icon mat-icon {
      font-size: 4em;
      color: #4caf50;
      width: 4em;
      height: 4em;
      filter: drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3));
    }

    .payment-details {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 107, 53, 0.1);
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
      text-align: left;
    }

    .payment-details h3 {
      color: #ff6b35;
      border-bottom: 2px solid rgba(255, 107, 53, 0.3);
      padding-bottom: 8px;
      margin-bottom: 20px;
      margin-top: 20px;
      font-size: 1.3rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .payment-details h3:first-child {
      margin-top: 0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      transition: all 0.3s ease;
    }

    .detail-item:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .next-steps {
      margin: 30px 0;
      text-align: left;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 107, 53, 0.1);
      border-radius: 12px;
      padding: 24px;
    }

    .next-steps h3 {
      color: #ff6b35;
      margin-bottom: 15px;
      font-size: 1.3rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .next-steps ul {
      padding-left: 20px;
      margin: 0;
    }

    .next-steps li {
      margin: 10px 0;
      color: #e0e0e0;
      line-height: 1.6;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
    }

    mat-card-actions button {
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    mat-card-actions button[color="primary"] {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: #fff;
      border: none;
      box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
    }

    mat-card-actions button[color="primary"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(255, 107, 53, 0.4);
    }

    mat-card-actions button.mat-stroked-button {
      border: 2px solid rgba(255, 107, 53, 0.5);
      color: #ff6b35;
      background: rgba(255, 107, 53, 0.1);
    }

    mat-card-actions button.mat-stroked-button:hover {
      background: rgba(255, 107, 53, 0.2);
      border-color: #ff6b35;
      transform: translateY(-2px);
    }

    .loading-container, .error-container {
      text-align: center;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin: 20px 0;
    }

    .error-message {
      color: #ff6b6b;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .success-container {
        padding: 60px 20px 20px;
      }

      .success-card {
        padding: 30px 20px;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
      
      .detail-item {
        flex-direction: column;
        gap: 5px;
      }

      mat-card-actions {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .success-card {
        padding: 20px 15px;
      }
    }
  `]
})
export class OfficerPaymentSuccessComponent implements OnInit {
  paymentId: string = '';
  transactionId: string = '';
  amount: number = 0;
  transactionDate: Date = new Date();
  invoiceData: any = null;
  bookingId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('OfficerPaymentSuccessComponent initialized');
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      this.paymentId = params['paymentId'] || '';
      this.transactionId = params['transactionId'] || '';
      this.amount = parseFloat(params['amount']) || 0;
      this.bookingId = params['bookingId'] || '';
      
      console.log('Booking ID from params:', this.bookingId);
      
      if (this.bookingId) {
        this.loadInvoiceData();
      } else {
        console.error('No booking ID found in query params');
        this.errorMessage = 'No booking ID found';
      }
    });
  }

  loadInvoiceData() {
    console.log('Loading invoice data for booking ID:', this.bookingId);
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous errors
    
    this.paymentService.getInvoiceDetails(this.bookingId).subscribe({
      next: (response: any) => {
        console.log('Invoice response:', response);
        if (response.success) {
          this.invoiceData = response.invoiceData;
          console.log('Invoice data loaded:', this.invoiceData);
          
          // Debug: Check if pickup and dropoff times exist
          if (this.invoiceData) {
            console.log('Pickup time:', this.invoiceData.pickupTime);
            console.log('Dropoff time:', this.invoiceData.dropoffTime);
            console.log('Payment time:', this.invoiceData.paymentTime);
          }
        } else {
          console.error('Invoice loading failed:', response.message);
          this.snackBar.open(response.message || 'Failed to load invoice', 'Close', { duration: 3000 });
          this.errorMessage = response.message || 'Failed to load invoice';
        }
      },
      error: (error) => {
        console.error('Invoice loading error:', error);
        this.snackBar.open('Failed to load invoice', 'Close', { duration: 3000 });
        this.errorMessage = 'Failed to load invoice';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/officer/dashboard']);
  }

  downloadInvoice() {
    console.log('Downloading invoice for booking ID:', this.bookingId);
    
    if (!this.bookingId) {
      this.snackBar.open('Booking ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.paymentService.downloadInvoicePdf(this.bookingId).subscribe({
      next: (response: any) => {
        console.log('PDF download response received');
        // Create blob and download
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_${this.bookingId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Invoice downloaded successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('PDF download error:', error);
        this.snackBar.open('Failed to download invoice', 'Close', { duration: 3000 });
      }
    });
  }
} 