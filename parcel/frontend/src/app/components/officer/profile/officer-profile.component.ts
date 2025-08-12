import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatExpansionModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="profile-container">
      <div class="profile-content">
        <!-- Header Section -->
        <div class="profile-header">
          <div class="header-badge">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Officer Profile</span>
          </div>
          <h1 class="profile-title">Officer Profile</h1>
          <p class="profile-subtitle">View and manage your officer account information</p>
        </div>

        <!-- Officer Info Section -->
        <div class="officer-info-section" *ngIf="userInfo">
          <div class="info-card">
            <div class="info-header">
              <mat-icon>admin_panel_settings</mat-icon>
              <h2>Personal Information</h2>
            </div>
            
              <div class="info-grid">
                <div class="info-item">
                <div class="info-icon">
                  <mat-icon>badge</mat-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Officer ID</span>
                  <span class="info-value">{{ userInfo.uniqueId || userInfo.id }}</span>
                </div>
              </div>

                <div class="info-item">
                <div class="info-icon">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Full Name</span>
                  <span class="info-value">{{ userInfo.officerName || userInfo.customerName }}</span>
                </div>
              </div>

                <div class="info-item">
                <div class="info-icon">
                  <mat-icon>email</mat-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Email Address</span>
                  <span class="info-value">{{ userInfo.email }}</span>
                </div>
              </div>

                <div class="info-item">
                <div class="info-icon">
                  <mat-icon>phone</mat-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Mobile Number</span>
                  <span class="info-value">{{ userInfo.countryCode }} {{ userInfo.mobileNumber }}</span>
                </div>
              </div>

                <div class="info-item">
                <div class="info-icon">
                  <mat-icon>location_on</mat-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Address</span>
                  <span class="info-value">{{ userInfo.address }}</span>
                </div>
              </div>

                <div class="info-item">
                <div class="info-icon">
                  <mat-icon>admin_panel_settings</mat-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Account Role</span>
                  <span class="info-value">{{ userInfo.role }}</span>
                </div>
              </div>
                </div>
              </div>
            </div>

            <!-- Change Password Section -->
        <div class="password-section">
          <div class="password-card">
            <div class="password-header">
                  <mat-icon>lock</mat-icon>
              <h2>Change Password</h2>
              <p>Update your account password for enhanced security</p>
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="password-form">
                  <div class="form-field-container">
                    <label class="field-label">Current Password</label>
                    <mat-form-field appearance="outline" class="form-field">
                  <input matInput type="password" formControlName="currentPassword" placeholder="Enter your current password">
                      <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                        Current password is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">New Password</label>
                    <mat-form-field appearance="outline" class="form-field">
                  <input matInput type="password" formControlName="newPassword" placeholder="Enter your new password">
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                        New password is required
                      </mat-error>
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                        Password must be at least 6 characters
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-field-container">
                    <label class="field-label">Confirm New Password</label>
                    <mat-form-field appearance="outline" class="form-field">
                  <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm your new password">
                      <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                    Please confirm your new password
                      </mat-error>
                  <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                        Passwords do not match
                      </mat-error>
                    </mat-form-field>
                  </div>

              <div class="password-actions">
                    <button mat-raised-button type="submit" 
                            [disabled]="passwordForm.invalid || isLoading"
                        class="update-button">
                      <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">update</mat-icon>
                      <span *ngIf="!isLoading">Update Password</span>
                    </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Officer Statistics Section -->
        <div class="stats-section">
          <div class="stats-header">
            <h2>Officer Statistics</h2>
            <p>Your courier management activity overview</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">156</div>
                <div class="stat-label">Total Bookings</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">134</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">22</div>
                <div class="stat-label">In Progress</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>star</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">4.9</div>
                <div class="stat-label">Rating</div>
              </div>
            </div>
                  </div>
                </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .profile-container::before {
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

    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .profile-header {
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

    .profile-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .profile-subtitle {
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

    .info-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: var(--background-secondary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .info-item:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .info-icon {
      width: 3.5rem;
      height: 3.5rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .info-icon mat-icon {
      color: var(--text-inverse);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .info-content {
      flex: 1;
    }

    .info-label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      display: block;
      font-size: 1.125rem;
      color: var(--text-primary);
      font-weight: 600;
      line-height: 1.4;
    }

    /* Password Section */
    .password-section {
      margin-bottom: 3rem;
    }

    .password-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
    }

    .password-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .password-header mat-icon {
      color: var(--primary-color);
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 1rem;
    }

    .password-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .password-header p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
    }

    .password-form {
      max-width: 500px;
      margin: 0 auto;
    }

    .form-field-container {
      margin-bottom: 2rem;
    }

    .field-label {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
      display: block;
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

    .password-actions {
      display: flex;
      justify-content: center;
      margin-top: 3rem;
    }

    .update-button {
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

    .update-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .update-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .stats-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .stats-header p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      text-align: center;
      transition: all var(--transition-fast);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .stat-icon {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-dark) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      transition: all var(--transition-fast);
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.1);
    }

    .stat-icon mat-icon {
      color: var(--text-inverse);
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .stat-content {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      display: block;
    }

    .stat-label {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .profile-container {
        padding: 100px 2rem 2rem;
      }

      .profile-title {
        font-size: 2.5rem;
      }

      .info-card,
      .password-card {
        padding: 2rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .profile-title {
        font-size: 2rem;
      }

      .info-card,
      .password-card {
        padding: 1.5rem;
      }

      .info-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .profile-container {
        padding: 70px 1rem 1rem;
      }

      .profile-title {
        font-size: 1.75rem;
      }

      .info-card,
      .password-card {
        padding: 1rem;
      }

      .stat-card {
        padding: 2rem;
      }
    }
  `]
})
export class OfficerProfileComponent implements OnInit {
  userInfo: any = null;
  passwordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.userInfo = this.authService.getCurrentUserByRole('OFFICER');
    if (!this.userInfo) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const passwordData = this.passwordForm.value;

      console.log('Changing password...');

      this.authService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open('Password updated successfully', 'Close', { duration: 3000 });
            this.passwordForm.reset();
          } else {
            this.snackBar.open(response.message || 'Failed to update password', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error changing password:', error);
          this.snackBar.open('Failed to update password. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 