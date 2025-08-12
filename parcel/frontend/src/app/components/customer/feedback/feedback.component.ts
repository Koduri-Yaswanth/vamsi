import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackService } from '../../../services/feedback.service';
import { FeedbackResponse } from '../../../models/feedback.model';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-feedback',
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
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="feedback-container">
      <div class="feedback-content">
        <!-- Header Section -->
        <div class="feedback-header">
          <div class="header-badge">
            <mat-icon>rate_review</mat-icon>
            <span>Customer Feedback</span>
          </div>
          <h1 class="feedback-title">Share Your Experience</h1>
          <p class="feedback-subtitle">Help us improve our service by providing your valuable feedback</p>
        </div>

        <!-- Feedback Form Section -->
        <div class="feedback-form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>Submit Feedback</h2>
              <p>Tell us about your experience with our courier service</p>
            </div>

            <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()" class="feedback-form">
              <!-- Booking ID Section -->
            <div class="form-field-container">
              <label class="field-label">Booking ID</label>
                <mat-form-field appearance="outline" class="form-field">
                  <input matInput formControlName="bookingId" placeholder="Enter your booking ID">
                <mat-error *ngIf="feedbackForm.get('bookingId')?.hasError('required')">
                  Booking ID is required
                </mat-error>
              </mat-form-field>
            </div>

              <!-- Rating Section -->
              <div class="rating-section">
                <label class="field-label">Service Rating</label>
                <div class="rating-container">
                  <div class="rating-stars">
                    <button type="button" 
                            class="star-button" 
                            *ngFor="let star of [1,2,3,4,5]; let i = index"
                            [class.active]="(feedbackForm.get('rating')?.value || 0) >= star"
                            (click)="setRating(star)">
                      <mat-icon>{{ (feedbackForm.get('rating')?.value || 0) >= star ? 'star' : 'star_border' }}</mat-icon>
                    </button>
                  </div>
                  <div class="rating-text">
                    <span class="rating-value">{{ getRatingText(feedbackForm.get('rating')?.value) }}</span>
                  </div>
                </div>
                <mat-error *ngIf="feedbackForm.get('rating')?.hasError('required')" class="rating-error">
                  Please select a rating
                </mat-error>
              </div>

              <!-- Feedback Description Section -->
            <div class="form-field-container">
              <label class="field-label">Feedback Description</label>
                <mat-form-field appearance="outline" class="form-field">
                <textarea matInput formControlName="description" 
                            rows="6" 
                            placeholder="Share your experience with our service..."></textarea>
                <mat-error *ngIf="feedbackForm.get('description')?.hasError('required')">
                  Feedback description is required
                </mat-error>
                <mat-error *ngIf="feedbackForm.get('description')?.hasError('minlength')">
                  Feedback description must be at least 10 characters
                </mat-error>
                <mat-error *ngIf="feedbackForm.get('description')?.hasError('maxlength')">
                  Feedback description cannot exceed 500 characters
                </mat-error>
              </mat-form-field>
                <div class="char-counter">
                  {{ feedbackForm.get('description')?.value?.length || 0 }}/500 characters
            </div>
            </div>

              <!-- Submit Button -->
            <div class="form-actions">
                <button mat-raised-button type="submit" 
                        [disabled]="feedbackForm.invalid || isLoading"
                        class="submit-button">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">send</mat-icon>
                <span *ngIf="!isLoading">Submit Feedback</span>
              </button>
            </div>
          </form>
          </div>
        </div>

        <!-- Feedback Guidelines Section -->
        <div class="guidelines-section">
          <div class="guidelines-card">
            <div class="guidelines-header">
              <mat-icon>lightbulb</mat-icon>
              <h3>Feedback Guidelines</h3>
            </div>
            <div class="guidelines-content">
              <div class="guideline-item">
                <mat-icon>check_circle</mat-icon>
                <span>Be specific about your experience</span>
              </div>
              <div class="guideline-item">
                <mat-icon>check_circle</mat-icon>
                <span>Mention both positive and negative aspects</span>
              </div>
              <div class="guideline-item">
                <mat-icon>check_circle</mat-icon>
                <span>Include details about delivery time and service quality</span>
              </div>
              <div class="guideline-item">
                <mat-icon>check_circle</mat-icon>
                <span>Your feedback helps us improve our services</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .feedback-container::before {
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

    .feedback-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .feedback-header {
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

    .feedback-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .feedback-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Feedback Form Section */
    .feedback-form-section {
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

    .feedback-form {
      max-width: 600px;
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

    /* Rating Section */
    .rating-section {
      margin-bottom: 2rem;
    }

    .rating-container {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-top: 1rem;
    }

    .rating-stars {
      display: flex;
      gap: 0.5rem;
    }

    .star-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .star-button:hover {
      background: rgba(245, 158, 11, 0.1);
      transform: scale(1.1);
    }

    .star-button.active {
      background: rgba(245, 158, 11, 0.1);
    }

    .star-button mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--warning-color);
    }

    .rating-text {
      flex: 1;
    }

    .rating-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .rating-error {
      color: var(--error-color);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: block;
    }

    /* Character Counter */
    .char-counter {
      text-align: right;
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
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

    /* Guidelines Section */
    .guidelines-section {
      margin-top: 3rem;
    }

    .guidelines-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .guidelines-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .guidelines-header mat-icon {
      color: var(--warning-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .guidelines-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .guidelines-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .guideline-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .guideline-item mat-icon {
      color: var(--success-color);
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
    }

    .guideline-item span {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .feedback-container {
        padding: 100px 2rem 2rem;
      }

      .feedback-title {
        font-size: 2.5rem;
      }

      .form-card {
        padding: 2rem;
      }
    }

    @media (max-width: 768px) {
      .feedback-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .feedback-title {
        font-size: 2rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .rating-container {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .rating-stars {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .feedback-container {
        padding: 70px 1rem 1rem;
      }

      .feedback-title {
        font-size: 1.75rem;
      }

      .form-card {
        padding: 1rem;
      }

      .star-button mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `]
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      bookingId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      rating: ['', Validators.required]
    });
  }

  setRating(rating: number) {
    this.feedbackForm.patchValue({ rating });
  }

  getRatingText(rating: number): string {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Select Rating';
    }
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.isLoading = true;
      const feedbackData = this.feedbackForm.value;

      console.log('Submitting feedback:', feedbackData);

      this.feedbackService.addFeedback(feedbackData).subscribe({
        next: (response: FeedbackResponse) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open(response.message || 'Feedback submitted successfully', 'Close', { duration: 3000 });
            this.feedbackForm.reset();
          } else {
            this.snackBar.open(response.message || 'Feedback submission failed', 'Close', { duration: 3000 });
          }
          console.log('Feedback response:', response);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error submitting feedback:', error);
          
          let errorMessage = 'Failed to submit feedback. Please try again.';
          
          // Handle validation errors from backend
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Please check your input and try again.';
          }
          
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all fields correctly', 'Close', { duration: 3000 });
    }
  }
}