import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SuccessDialogComponent } from './success-dialog.component';

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-page">
      <!-- Left Side -->
      <div class="register-left">
        <div class="brand-section">
          <div class="brand-logo">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <h1 class="brand-title">Join Express Parcel</h1>
          <p class="brand-subtitle">Start your journey with us today</p>
        </div>

        <div class="benefits-section">
          <h2>Why register with us?</h2>
          <div class="benefit-list">
            <div class="benefit-item">
              <mat-icon>rocket_launch</mat-icon>
              <div class="benefit-content">
                <h4>Quick Setup</h4>
                <p>Get started in minutes with our simple registration process</p>
              </div>
            </div>
            <div class="benefit-item">
              <mat-icon>security</mat-icon>
              <div class="benefit-content">
                <h4>Secure Platform</h4>
                <p>Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            <div class="benefit-item">
              <mat-icon>headset_mic</mat-icon>
              <div class="benefit-content">
                <h4>24/7 Support</h4>
                <p>Get help whenever you need it with our dedicated team</p>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">500K+</div>
            <div class="stat-label">Packages Delivered</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">99.8%</div>
            <div class="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <!-- Right Side -->
      <div class="register-right">
        <div class="register-container">
          <div class="register-header">
            <h2 class="register-title">Create Your Account</h2>
            <p class="register-subtitle">Join thousands of satisfied customers</p>
          </div>

          <div class="register-card">
            <form [formGroup]="registerForm" (ngSubmit)="register()" class="register-form">
              <!-- Role Selection -->
              <div class="form-section">
                <label class="field-label">Select Role</label>
                <mat-form-field class="form-field" appearance="outline">
                  <mat-select formControlName="role" placeholder="Choose your role">
                    <mat-option value="CUSTOMER">Customer</mat-option>
                    <mat-option value="OFFICER">Officer</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>person</mat-icon>
                </mat-form-field>
              </div>

              <!-- Name (dynamic label based on role) -->
              <div class="form-section">
                <label class="field-label">{{ getRoleTitle() }} Name</label>
                <mat-form-field class="form-field" appearance="outline">
                  <input matInput formControlName="customerName" placeholder="Enter your full name">
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="registerForm.get('customerName')?.hasError('required')">
                    {{ getRoleTitle() }} name is required
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('customerName')?.hasError('minlength')">
                    Name must be at least 3 characters
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('customerName')?.hasError('invalidName')">
                    Please enter a valid name (avoid terms like 'nothing', 'something', 'nobody')
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Email -->
              <div class="form-section">
                <label class="field-label">Email Address</label>
                <mat-form-field class="form-field" appearance="outline">
                  <input matInput formControlName="email" placeholder="Enter your email" type="email">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Country Code and Phone Number in same line -->
              <div class="form-section">
                <label class="field-label">Mobile Number</label>
                <div class="phone-group">
                  <mat-form-field class="country-code-field" appearance="outline">
                    <input matInput formControlName="countryCode" placeholder="+91" value="+91" readonly>
                    <mat-icon matSuffix>flag</mat-icon>
                  </mat-form-field>
                  <mat-form-field class="phone-number-field" appearance="outline">
                    <input matInput formControlName="mobileNumber" placeholder="Enter mobile number">
                    <mat-icon matSuffix>phone</mat-icon>
                    <mat-error *ngIf="registerForm.get('mobileNumber')?.hasError('required')">
                      Mobile number is required
                    </mat-error>
                     <mat-error *ngIf="registerForm.get('mobileNumber')?.hasError('pattern')">
                       Mobile number must be 10 digits and start with 6-9
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <!-- Address -->
              <div class="form-section">
                <label class="field-label">Address</label>
                <mat-form-field class="form-field" appearance="outline">
                  <textarea matInput formControlName="address" placeholder="Enter your complete address" rows="3"></textarea>
                  <mat-icon matSuffix>location_on</mat-icon>
                  <mat-error *ngIf="registerForm.get('address')?.hasError('required')">
                    Address is required
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('address')?.hasError('minlength')">
                    Address must be at least 10 characters
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Password -->
              <div class="form-section">
                <label class="field-label">Password</label>
                <mat-form-field class="form-field" appearance="outline">
                  <input matInput formControlName="password" placeholder="Enter your password" type="password">
                  <mat-icon matSuffix>lock</mat-icon>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                    Password must be at least 6 characters
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Confirm Password -->
              <div class="form-section">
                <label class="field-label">Confirm Password</label>
                <mat-form-field class="form-field" appearance="outline">
                  <input matInput formControlName="confirmPassword" placeholder="Confirm your password" type="password">
                  <mat-icon matSuffix>lock</mat-icon>
                  <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                    Confirm password is required
                  </mat-error>
                </mat-form-field>
                <div *ngIf="registerForm.get('confirmPassword')?.value && !passwordsMatch" class="password-mismatch">
                  Passwords do not match
                </div>
                <div *ngIf="registerForm.get('confirmPassword')?.value && passwordsMatch" class="password-match">
                  Passwords match
                </div>
              </div>

              <!-- Preferences -->
              <div class="form-section">
                <label class="field-label">Get Updates Via</label>
                <mat-form-field class="form-field" appearance="outline">
                  <mat-select formControlName="preferences" placeholder="Choose your preference">
                    <mat-option value="EMAIL">Email</mat-option>
                    <mat-option value="SMS">SMS</mat-option>
                    <mat-option value="BOTH">Both</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>notifications</mat-icon>
                  <mat-error *ngIf="registerForm.get('preferences')?.hasError('required')">
                    Please select a preference
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="register-button" [disabled]="!registerForm.valid || !passwordsMatch || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!isLoading">person_add</mat-icon>
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>

            <div style="text-align: center; margin-top: 1.5rem;">
              <span style="color: #64748b;">Already have an account? </span>
              <a routerLink="/login" class="login-link-text">Sign in here</a>
              <br>
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
    .register-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
      gap: 0;
    }

    /* Left Side Styles */
    .register-left {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      height: 100vh;
      position: sticky;
      top: 0;
    }

    .register-left::before {
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
      margin-bottom: 2rem;
      position: relative;
      z-index: 2;
    }

    .brand-logo {
      width: 4rem;
      height: 4rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
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
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: white;
    }

    .brand-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.4;
    }

    .benefits-section {
      flex: 1;
      position: relative;
      z-index: 2;
      margin-bottom: 1rem;
    }

    .benefits-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: white;
      text-align: center;
    }

    .benefit-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .benefit-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(6px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .benefit-item mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: white;
      flex-shrink: 0;
    }

    .benefit-content h4 {
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 0.2rem 0;
      color: white;
    }

    .benefit-content p {
      font-size: 0.75rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.3;
    }

    .stats-section {
      display: flex;
      justify-content: space-around;
      position: relative;
      z-index: 2;
      gap: 0.75rem;
    }

    .stat-item {
      text-align: center;
      flex: 1;
      padding: 1rem 0.5rem;
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
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.2rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-label {
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* Right Side Styles */
    .register-right {
      background: white;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2rem;
      min-height: 100vh;
      overflow-y: auto;
    }

    .register-container {
      width: 100%;
      max-width: 480px;
      margin-top: 1rem;
    }

    .register-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .register-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .register-subtitle {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0;
    }

    .register-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .field-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.1rem;
    }

    .form-field {
      width: 100%;
    }

    .phone-group {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .country-code-field {
      flex: 0 0 100px;
    }

    .country-code-field input {
      color: #1e293b !important;
      font-weight: 600;
    }

    .phone-number-field {
      flex: 1;
    }

    .password-match {
      color: #10b981;
      font-size: 0.75rem;
      margin-top: 0.2rem;
    }

    .password-mismatch {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.2rem;
    }

    .register-button {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .register-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4);
    }

    .register-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-link-text {
      color: #0891b2;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .login-link-text:hover {
      color: #0e7490;
      text-decoration: underline;
    }

    .home-button {
      margin-top: 1rem;
      width: 100%;
      color: #64748b;
      border-color: #cbd5e1;
      transition: all 0.3s ease;
    }

    .home-button:hover {
      color: #0891b2;
      border-color: #0891b2;
      background: rgba(8, 145, 178, 0.05);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .register-page {
        grid-template-columns: 1fr;
      }

      .register-left {
        padding: 2rem 1.5rem;
        height: auto;
        position: relative;
      }

      .register-right {
        padding: 1.5rem;
        min-height: auto;
      }

      .register-container {
        max-width: 100%;
        margin-top: 0;
      }
    }

    @media (max-width: 768px) {
      .register-left {
        padding: 1.5rem 1rem;
      }

      .register-right {
        padding: 1rem;
      }

      .register-card {
        padding: 1.5rem;
      }

      .brand-title {
        font-size: 1.5rem;
      }

      .register-title {
        font-size: 1.5rem;
      }

      .benefit-list {
        gap: 0.5rem;
      }

      .benefit-item {
        padding: 0.75rem;
      }

      .stats-section {
        flex-direction: column;
        gap: 0.5rem;
      }

      .stat-item {
        padding: 0.75rem 0.5rem;
      }

      .phone-group {
        flex-direction: column;
        gap: 0.5rem;
      }

      .country-code-field {
        flex: 1;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  passwordsMatch = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      role: ['CUSTOMER', Validators.required],
      customerName: ['', [Validators.required, Validators.minLength(3), this.validHumanNameValidator()]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      preferences: ['EMAIL', Validators.required],
    });
  }

  ngOnInit() {
    // Watch for password changes to check if they match
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });
  }

  checkPasswordsMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    this.passwordsMatch = password === confirmPassword && password !== '';
  }

  getRoleTitle(): string {
    const role = this.registerForm.get('role')?.value;
    return role === 'OFFICER' ? 'Officer' : 'Customer';
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
      // Minimum length after trimming handled by minlength, but also guard here for whitespace-only
      if (value.length < 3) {
        return { invalidName: true };
      }
      // Must contain at least one alphabetic character
      if (!/[A-Za-z]/.test(value)) {
        return { invalidName: true };
      }
      // Forbid obvious placeholder words (case-insensitive exact match)
      const lower = value.toLowerCase();
      if (forbiddenTerms.includes(lower)) {
        return { invalidName: true };
      }
      return null;
    };
  }

  register() {
    console.log('Register method called');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Passwords match:', this.passwordsMatch);
    console.log('Form values:', this.registerForm.value);
    
    if (this.registerForm.valid && this.passwordsMatch) {
      this.isLoading = true;
      console.log('Starting registration...');
      
      const registerRequest = {
        customerName: this.registerForm.value.customerName,
        email: this.registerForm.value.email,
        countryCode: this.registerForm.value.countryCode,
        mobileNumber: this.registerForm.value.mobileNumber,
        address: this.registerForm.value.address,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
        preferences: this.registerForm.value.preferences,
        role: this.registerForm.value.role
      };
      
      console.log('Register request:', registerRequest);
      
      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading = false;
          
          if (response.success) {
            // Show success dialog with user details
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              width: '500px',
              data: {
                customerName: response.customerName,
                email: response.email,
                role: response.role,
                uniqueId: response.uniqueId,
                id: response.id
              },
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(() => {
              // After acknowledging, send user to login page to sign in with new ID
              this.router.navigate(['/login']);
            });
          } else {
            console.error('Registration failed:', response.message);
            this.snackBar.open(response.message || 'Registration failed. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          
          let errorMessage = 'Registration failed. Please try again.';
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
      console.log('Form validation failed');
      console.log('Form errors:', this.registerForm.errors);
      console.log('Password match:', this.passwordsMatch);
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      
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