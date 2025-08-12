import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-page">
      <!-- Left Side - Brand & Features -->
      <div class="login-left">
        <div class="brand-section">
          <div class="brand-logo">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <h1 class="brand-title">Express Parcel</h1>
          <p class="brand-subtitle">Delivering excellence worldwide</p>
        </div>
        
        <div class="features-section">
          <h2>Why choose our platform?</h2>
          <div class="feature-list">
            <div class="feature-item">
              <mat-icon>track_changes</mat-icon>
              <div class="feature-content">
                <h4>Real-time Tracking</h4>
                <p>Track your packages with live GPS updates</p>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>security</mat-icon>
              <div class="feature-content">
                <h4>Secure Delivery</h4>
                <p>100% insured and secure handling</p>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>schedule</mat-icon>
              <div class="feature-content">
                <h4>24/7 Support</h4>
                <p>Round-the-clock customer assistance</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">50K+</div>
            <div class="stat-label">Happy Customers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1M+</div>
            <div class="stat-label">Packages Delivered</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-right">
        <div class="login-container">
          <div class="login-header">
            <h2 class="login-title">Welcome Back</h2>
            <p class="login-subtitle">Sign in to your account to continue</p>
          </div>

          <div class="login-card">
            <mat-tab-group class="login-tabs">
              <mat-tab label="Customer Login">
                <form [formGroup]="loginForm" (ngSubmit)="login()" class="login-form">
                  <div class="form-section">
                    <label class="field-label">Customer ID</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="uniqueId" placeholder="Enter your Customer ID (e.g., CUST123456789)" type="text">
                      <mat-icon matSuffix>person</mat-icon>
                      <mat-error *ngIf="loginForm.get('uniqueId')?.hasError('required')">
                        Customer ID is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-section">
                    <label class="field-label">Password</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="password" placeholder="Enter your password" type="password">
                      <mat-icon matSuffix>lock</mat-icon>
                      <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                        Password is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button type="submit" 
                            [disabled]="!loginForm.valid || isLoading"
                            class="login-button">
                      <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                      <span *ngIf="!isLoading">Sign In as Customer</span>
                    </button>
                  </div>
                </form>
              </mat-tab>

              <mat-tab label="Officer Login">
                <form [formGroup]="officerLoginForm" (ngSubmit)="officerLogin()" class="login-form">
                  <div class="form-section">
                    <label class="field-label">Officer ID</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="uniqueId" placeholder="Enter your Officer ID (e.g., OFF123456789)" type="text">
                      <mat-icon matSuffix>badge</mat-icon>
                      <mat-error *ngIf="officerLoginForm.get('uniqueId')?.hasError('required')">
                        Officer ID is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-section">
                    <label class="field-label">Password</label>
                    <mat-form-field appearance="outline" class="form-field">
                      <input matInput formControlName="password" placeholder="Enter your password" type="password">
                      <mat-icon matSuffix>lock</mat-icon>
                      <mat-error *ngIf="officerLoginForm.get('password')?.hasError('required')">
                        Password is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button type="submit" 
                            [disabled]="!officerLoginForm.valid || isLoading"
                            class="login-button">
                      <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                      <span *ngIf="!isLoading">Sign In as Officer</span>
                    </button>
                  </div>
                </form>
              </mat-tab>
            </mat-tab-group>

            <div class="login-footer">
              <p>Don't have an account? <a routerLink="/register" class="register-link">Sign up here</a></p>
              <button mat-stroked-button (click)="navigateToHome()" class="home-button">
                <mat-icon>home</mat-icon>
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      gap: 0;
    }

    /* Left Side Styles */
    .login-left {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .login-left::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .brand-section {
      text-align: center;
      margin-bottom: 2.5rem;
      position: relative;
      z-index: 2;
    }

    .brand-logo {
      width: 4.5rem;
      height: 4.5rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .brand-logo:hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.25);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .brand-logo mat-icon {
      font-size: 2.25rem;
      width: 2.25rem;
      height: 2.25rem;
      color: white;
    }

    .brand-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: white;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.5;
    }

    .features-section {
      flex: 1;
      position: relative;
      z-index: 2;
      margin-bottom: 1.5rem;
    }

    .features-section h2 {
      font-size: 1.375rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: white;
      text-align: center;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1.25rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(6px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .feature-item mat-icon {
      font-size: 1.375rem;
      width: 1.375rem;
      height: 1.375rem;
      color: white;
      flex-shrink: 0;
    }

    .feature-content h4 {
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: white;
    }

    .feature-content p {
      font-size: 0.8rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.4;
    }

    .stats-section {
      display: flex;
      justify-content: space-around;
      position: relative;
      z-index: 2;
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      flex: 1;
      padding: 1.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .stat-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .stat-item:nth-child(1) {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
      border-color: rgba(16, 185, 129, 0.3);
    }

    .stat-item:nth-child(2) {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .stat-item:nth-child(3) {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%);
      border-color: rgba(245, 158, 11, 0.3);
    }

    .stat-number {
      font-size: 1.375rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.25rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-label {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* Right Side Styles */
    .login-right {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      background: var(--background-primary);
    }

    .login-container {
      width: 100%;
      max-width: 500px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .login-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .login-subtitle {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin: 0;
      line-height: 1.6;
    }

    .login-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
    }

    .login-tabs {
      background: transparent;
    }

    .login-tabs ::ng-deep .mat-mdc-tab-header {
      background: var(--background-secondary);
      border-bottom: 1px solid var(--border-light);
    }

    .login-tabs ::ng-deep .mat-mdc-tab-label {
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.025em;
      padding: 1.5rem 2rem;
      font-size: 1rem;
    }

    .login-tabs ::ng-deep .mat-mdc-tab-label.mat-mdc-tab-label-active {
      color: var(--primary-color);
    }

    .login-tabs ::ng-deep .mat-mdc-ink-bar {
      background: var(--primary-color);
      height: 3px;
    }

    .login-form {
      padding: 3rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .field-label {
      display: block;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .form-field {
      width: 100%;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-medium);
      transition: all var(--transition-fast);
      padding: 0.5rem 0;
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper:hover {
      border-color: var(--primary-color);
      background: var(--background-primary);
    }

    .form-field ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--focused {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .form-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      background: transparent;
    }

    .form-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .form-actions {
      margin-top: 3rem;
    }

    .login-button {
      width: 100%;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--text-inverse);
      border: none;
      padding: 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 1.125rem;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      letter-spacing: 0.025em;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-footer {
      padding: 2rem 3rem;
      text-align: center;
      border-top: 1px solid var(--border-light);
      background: var(--background-secondary);
    }

    .login-footer p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
    }

    .register-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      transition: color var(--transition-fast);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      margin-left: 0.25rem;
    }

    .register-link:hover {
      color: var(--primary-dark);
      background: rgba(8, 145, 178, 0.1);
    }

    .home-button {
      margin-top: 1rem;
      width: 100%;
      color: var(--text-secondary);
      border-color: var(--border-medium);
      transition: all var(--transition-fast);
    }

    .home-button:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(8, 145, 178, 0.05);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .login-page {
        grid-template-columns: 1fr;
        min-height: auto;
      }

      .login-left {
        padding: 4rem 3rem;
        min-height: 60vh;
      }

      .brand-title {
        font-size: 2.5rem;
      }

      .features-section h2 {
        font-size: 1.5rem;
      }

      .feature-list {
        gap: 1.5rem;
      }

      .feature-item {
        padding: 1.5rem;
      }

      .stats-section {
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .login-left {
        padding: 3rem 2rem;
        min-height: 50vh;
      }

      .login-right {
        padding: 2rem 1.5rem;
      }

      .login-container {
        max-width: 100%;
      }

      .login-title {
        font-size: 2rem;
      }

      .login-form {
        padding: 2rem;
      }

      .stats-section {
        flex-direction: column;
        gap: 1rem;
      }

      .stat-item {
        text-align: center;
      }

      .brand-title {
        font-size: 2rem;
      }

      .feature-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .login-left {
        padding: 2rem 1.5rem;
        min-height: 40vh;
      }

      .brand-title {
        font-size: 1.75rem;
      }

      .feature-item {
        padding: 1rem;
      }

      .login-form {
        padding: 1.5rem;
      }

      .login-footer {
        padding: 1.5rem 2rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  officerLoginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Simplified validation - only require fields to be filled
    this.loginForm = this.fb.group({
      uniqueId: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.officerLoginForm = this.fb.group({
      uniqueId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginRequest = {
        email: this.loginForm.value.uniqueId, // Backend expects 'email' field but we're sending uniqueId
        password: this.loginForm.value.password
      };
      
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Store authentication data in localStorage
            if (response.role === 'CUSTOMER') {
              localStorage.setItem('customer_token', response.token || '');
              localStorage.setItem('customer_user', JSON.stringify(response));
            } else if (response.role === 'OFFICER') {
              localStorage.setItem('officer_token', response.token || '');
              localStorage.setItem('officer_user', JSON.stringify(response));
            }
            
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            
            if (response.role === 'CUSTOMER') {
              this.router.navigate(['/customer/dashboard']);
            } else if (response.role === 'OFFICER') {
              this.router.navigate(['/officer/dashboard']);
            }
          } else {
            this.snackBar.open(response.message || 'Login failed', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  officerLogin() {
    if (this.officerLoginForm.valid) {
      this.isLoading = true;
      const loginRequest = {
        email: this.officerLoginForm.value.uniqueId, // Backend expects 'email' field but we're sending uniqueId
        password: this.officerLoginForm.value.password
      };
      
      this.authService.officerLogin(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Store authentication data in localStorage
            localStorage.setItem('officer_token', response.token || '');
            localStorage.setItem('officer_user', JSON.stringify(response));
            
            this.snackBar.open('Officer login successful!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/officer/dashboard']);
          } else {
            this.snackBar.open(response.message || 'Officer login failed', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Officer login error:', error);
          this.snackBar.open('Officer login failed. Please check your credentials.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  navigateToHome() {
    this.router.navigate(['/landing']);
  }
} 