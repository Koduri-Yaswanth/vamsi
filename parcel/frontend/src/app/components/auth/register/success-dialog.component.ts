import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  template: `
    <div class="success-dialog">
      <div class="success-icon">
        <mat-icon>check_circle</mat-icon>
      </div>
      <h2 class="dialog-title">🎉 Registration Successful!</h2>
      <p class="dialog-subtitle">Your account has been created successfully. Welcome to our courier service!</p>
      
      <div class="user-info">
        <div class="info-header">
          <mat-icon>person</mat-icon>
          <span>Account Details</span>
        </div>
        <div class="info-item">
          <span class="info-label">Full Name:</span>
          <span class="info-value">{{ data.customerName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email Address:</span>
          <span class="info-value">{{ data.email }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Role:</span>
          <span class="info-value role-badge">{{ data.role }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Unique ID:</span>
          <span class="info-value id-value">{{ data.uniqueId || data.id }}</span>
        </div>
      </div>
      
      <div class="success-message">
        <mat-icon>info</mat-icon>
        <p>Please save your Unique ID for future logins. You can now proceed to login with your credentials.</p>
      </div>
      
      <div class="dialog-actions">
        <button mat-raised-button class="btn-primary" (click)="closeDialog()">
          <mat-icon>login</mat-icon>
          Proceed to Login
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      padding: 2rem;
      text-align: center;
      background: white;
      border-radius: 16px;
      max-width: 500px;
    }

    .success-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      }
    }

    .success-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: white;
    }

    .dialog-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .dialog-subtitle {
      color: #64748b;
      margin-bottom: 2rem;
      font-size: 1rem;
      line-height: 1.5;
    }

    .user-info {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: left;
      border: 2px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e2e8f0;
      font-weight: 600;
      color: #374151;
      font-size: 1rem;
    }

    .info-header mat-icon {
      color: #0891b2;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .info-item:last-child {
      border-bottom: none;
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
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .id-value {
      background: #f1f5f9;
      color: #0891b2;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-weight: 700;
      border: 1px solid #cbd5e1;
    }

    .success-message {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      text-align: left;
    }

    .success-message mat-icon {
      color: #059669;
      margin-top: 0.1rem;
    }

    .success-message p {
      margin: 0;
      color: #065f46;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .dialog-actions {
      display: flex;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border: none;
      padding: 0.875rem 1.75rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4);
    }
  `],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  standalone: true
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
