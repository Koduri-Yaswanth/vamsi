import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback, FeedbackPage } from '../../../models/feedback.model';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="feedback-container">
      <div class="feedback-content">
        <!-- Header Section -->
        <div class="feedback-header">
          <div class="header-badge">
            <mat-icon>rate_review</mat-icon>
            <span>Customer Feedback Management</span>
          </div>
          <h1 class="feedback-title">View Customer Feedback</h1>
          <p class="feedback-subtitle">Monitor and analyze customer satisfaction and service quality</p>
        </div>

        <!-- Statistics Cards -->
        <div class="statistics-section" *ngIf="statistics">
          <div class="stats-grid">
            <div class="stat-card total">
              <div class="stat-icon">
                <mat-icon>rate_review</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{ statistics.totalFeedbacks }}</h3>
                <p>Total Feedbacks</p>
              </div>
            </div>
            
            <div class="stat-card average">
              <div class="stat-icon">
                <mat-icon>star</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{ statistics.averageRating | number:'1.1-1' }}</h3>
                <p>Average Rating</p>
              </div>
            </div>
            
            <div class="stat-card excellent">
              <div class="stat-icon">
                <mat-icon>star_rate</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{ statistics.fiveStarFeedbacks }}</h3>
                <p>5-Star Reviews</p>
              </div>
            </div>
            
            <div class="stat-card good">
              <div class="stat-icon">
                <mat-icon>star_half</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{ statistics.fourStarFeedbacks }}</h3>
                <p>4-Star Reviews</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filter Section -->
        <div class="search-section">
          <mat-card class="search-card">
            <mat-card-content>
              <div class="search-content">
                <div class="search-input">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Search Feedback</mat-label>
                    <input matInput 
                           [(ngModel)]="searchFilter" 
                           placeholder="Search by customer name, booking ID, or feedback description..."
                           (keyup.enter)="applyFilter()">
                    <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>
                </div>
                <div class="search-actions">
                  <button mat-raised-button 
                          class="search-btn" 
                          (click)="applyFilter()"
                          [disabled]="isLoading">
                    <mat-icon>search</mat-icon>
                    Search
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Feedback Table Section -->
        <div class="table-section">
          <mat-card class="table-card">
            <mat-card-header>
              <mat-card-title>Customer Feedback Details</mat-card-title>
              <mat-card-subtitle>
                {{ totalElements }} feedback entries found
                <span *ngIf="searchFilter"> for "{{ searchFilter }}"</span>
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <!-- Loading State -->
              <div class="loading-section" *ngIf="isLoading">
                <div class="loading-content">
                  <mat-spinner diameter="40"></mat-spinner>
                  <p>Loading feedback data...</p>
                </div>
              </div>

              <!-- Feedback Table -->
              <div class="table-container" *ngIf="!isLoading">
                <table mat-table [dataSource]="feedbacks" class="feedback-table">
                  <!-- Order ID Column -->
                  <ng-container matColumnDef="orderId">
                    <th mat-header-cell *matHeaderCellDef>Order ID</th>
                    <td mat-cell *matCellDef="let feedback">
                      <div class="order-id-cell">
                        <span class="order-id">{{ feedback.booking?.bookingId || 'N/A' }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Customer Name Column -->
                  <ng-container matColumnDef="customerName">
                    <th mat-header-cell *matHeaderCellDef>Customer Name</th>
                    <td mat-cell *matCellDef="let feedback">
                      <div class="customer-cell">
                        <div class="customer-info">
                          <span class="customer-name">{{ feedback.customer?.customerName || 'N/A' }}</span>
                          <span class="customer-email" *ngIf="feedback.customer?.email">
                            {{ feedback.customer.email }}
                          </span>
                        </div>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Feedback Description Column -->
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef>Feedback Description</th>
                    <td mat-cell *matCellDef="let feedback">
                      <div class="description-cell">
                        <p class="feedback-text">{{ feedback.feedbackDescription }}</p>
                        <button mat-button 
                                class="expand-btn" 
                                (click)="toggleDescription(feedback)"
                                *ngIf="feedback.feedbackDescription.length > 100">
                          {{ feedback.showFullDescription ? 'Show Less' : 'Show More' }}
                        </button>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Rating Column -->
                  <ng-container matColumnDef="rating">
                    <th mat-header-cell *matHeaderCellDef>Rating</th>
                    <td mat-cell *matCellDef="let feedback">
                      <div class="rating-display">
                        <div class="stars">
                          <mat-icon *ngFor="let star of getStars(feedback.rating)" 
                                   class="star-icon filled">
                            star
                          </mat-icon>
                          <mat-icon *ngFor="let star of getEmptyStars(feedback.rating)" 
                                   class="star-icon empty">
                            star_border
                          </mat-icon>
                        </div>
                        <span class="rating-text">{{ feedback.rating }}/5</span>
                        <div class="rating-badge" [ngClass]="getRatingClass(feedback.rating)">
                          {{ getRatingLabel(feedback.rating) }}
                        </div>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Date & Time Column -->
                  <ng-container matColumnDef="dateTime">
                    <th mat-header-cell *matHeaderCellDef>Date & Time</th>
                    <td mat-cell *matCellDef="let feedback">
                      <div class="datetime-cell">
                        <div class="date">{{ feedback.createdAt | date:'mediumDate' }}</div>
                        <div class="time">{{ feedback.createdAt | date:'shortTime' }}</div>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let feedback">
                      <div class="actions-cell">
                        <button mat-button 
                                class="action-btn view-btn" 
                                (click)="viewFeedbackDetails(feedback)"
                                matTooltip="View full feedback details">
                          <mat-icon>visibility</mat-icon>
                          View
                        </button>
                        <button mat-button 
                                class="action-btn respond-btn" 
                                (click)="respondToFeedback(feedback)"
                                matTooltip="Respond to customer feedback">
                          <mat-icon>reply</mat-icon>
                          Respond
                        </button>
                      </div>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>

                <!-- Pagination -->
                <mat-paginator 
                  [length]="totalElements"
                  [pageSize]="pageSize"
                  [pageIndex]="currentPage"
                  [pageSizeOptions]="[5, 10, 25, 50]"
                  (page)="onPageChange($event)"
                  showFirstLastButtons>
                </mat-paginator>
              </div>

              <!-- Empty State -->
              <div class="empty-state" *ngIf="!isLoading && feedbacks.length === 0">
                <div class="empty-content">
                  <mat-icon class="empty-icon">rate_review</mat-icon>
                  <h3>No Feedback Found</h3>
                  <p *ngIf="searchFilter">
                    No feedback matches your search for "{{ searchFilter }}".
                    <br>Try adjusting your search terms.
                  </p>
                  <p *ngIf="!searchFilter">
                    No customer feedback has been submitted yet.
                    <br>Feedback will appear here once customers rate their experience.
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem 0;
      margin-top: 80px;
    }

    .feedback-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .feedback-header {
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
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1rem;
      box-shadow: 0 2px 10px rgba(8, 145, 178, 0.3);
    }

    .header-badge mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .feedback-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #1e293b 0%, #0891b2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .feedback-subtitle {
      font-size: 1.125rem;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .statistics-section {
      margin-bottom: 2rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .stat-card.total { border-left: 4px solid #0891b2; }
    .stat-card.average { border-left: 4px solid #f59e0b; }
    .stat-card.excellent { border-left: 4px solid #10b981; }
    .stat-card.good { border-left: 4px solid #3b82f6; }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card.total .stat-icon { background: rgba(8, 145, 178, 0.1); color: #0891b2; }
    .stat-card.average .stat-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .stat-card.excellent .stat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .stat-card.good .stat-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

    .stat-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    .stat-content p {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .search-section {
      margin-bottom: 2rem;
      animation: fadeInUp 0.8s ease-out 0.3s both;
    }

    .search-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .search-content {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }

    .search-input {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .search-actions {
      display: flex;
      gap: 0.5rem;
    }

    .search-btn {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(8, 145, 178, 0.3);
    }

    .search-btn:hover {
      background: #0891b2;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(8, 145, 178, 0.3);
    }

    .table-section {
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .table-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .table-card ::ng-deep .mat-mdc-card-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .table-card ::ng-deep .mat-mdc-card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .table-card ::ng-deep .mat-mdc-card-subtitle {
      color: #64748b;
      font-size: 0.875rem;
    }

    .loading-section {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;
    }

    .loading-content {
      text-align: center;
    }

    .loading-content p {
      margin-top: 1rem;
      color: #64748b;
    }

    .table-container {
      margin-top: 1rem;
    }

    .feedback-table {
      width: 100%;
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
    }

    .feedback-table ::ng-deep .mat-mdc-header-row {
      background: #0891b2;
      border-bottom: 2px solid #0e7490;
    }

    .feedback-table ::ng-deep .mat-mdc-header-cell {
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .feedback-table ::ng-deep .mat-mdc-row {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .feedback-table ::ng-deep .mat-mdc-row:hover {
      background: #f1f5f9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .feedback-table ::ng-deep .mat-mdc-cell {
      padding: 1rem;
      font-size: 0.875rem;
      color: #1e293b;
    }

    .order-id-cell .order-id {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #0891b2;
      background: rgba(8, 145, 178, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .customer-cell .customer-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .customer-name {
      font-weight: 600;
      color: #1e293b;
    }

    .customer-email {
      font-size: 0.75rem;
      color: #64748b;
    }

    .description-cell .feedback-text {
      margin: 0 0 0.5rem 0;
      line-height: 1.5;
      max-height: 3rem;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .description-cell.expanded .feedback-text {
      max-height: none;
    }

    .expand-btn {
      font-size: 0.75rem;
      color: #0891b2;
      padding: 0;
      min-width: auto;
      line-height: 1;
    }

    .rating-display {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .star-icon.filled {
      color: #fbbf24;
    }

    .star-icon.empty {
      color: #d1d5db;
    }

    .rating-text {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .rating-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rating-badge.excellent {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .rating-badge.good {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
    }

    .rating-badge.average {
      background: rgba(245, 158, 11, 0.1);
      color: #d97706;
    }

    .rating-badge.poor {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }

    .datetime-cell {
      text-align: center;
    }

    .datetime-cell .date {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .datetime-cell .time {
      font-size: 0.75rem;
      color: #64748b;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .action-btn {
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      min-width: auto;
    }

    .action-btn mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      margin-right: 0.25rem;
    }

    .view-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
    }

    .view-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .respond-btn {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border: none;
    }

    .respond-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(8, 145, 178, 0.4);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-content .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #cbd5e1;
      margin-bottom: 1rem;
    }

    .empty-content h3 {
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .empty-content p {
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .refresh-btn {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .refresh-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(8, 145, 178, 0.4);
    }

    .feedback-table ::ng-deep .mat-mdc-paginator {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .feedback-container {
        padding: 80px 1rem 2rem;
      }

      .feedback-content {
        padding: 0 1rem;
      }

      .feedback-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .search-content {
        flex-direction: column;
        align-items: stretch;
      }

      .search-actions {
        justify-content: center;
      }

      .feedback-table ::ng-deep .mat-mdc-cell {
        padding: 0.75rem 0.5rem;
        font-size: 0.8rem;
      }

      .actions-cell {
        flex-direction: column;
        gap: 0.25rem;
      }

      .action-btn {
        font-size: 0.7rem;
        padding: 0.4rem 0.6rem;
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
export class OfficerFeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  displayedColumns: string[] = ['orderId', 'customerName', 'description', 'rating', 'dateTime', 'actions'];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  isLoading = false;
  searchFilter = '';
  statistics: any = null;

  constructor(
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFeedbacks();
    this.loadStatistics();
  }

  loadFeedbacks() {
    this.isLoading = true;
    this.feedbackService.getOfficerFeedbacks(this.currentPage, this.pageSize, this.searchFilter).subscribe({
      next: (response: FeedbackPage) => {
        console.log('Feedback response received:', response);
        this.feedbacks = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.currentPage = response.number || 0; // Use 'number' instead of 'currentPage'
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks with pagination, trying fallback method:', error);
        // Try fallback method without pagination
        this.loadFeedbacksFallback();
      }
    });
  }

  loadFeedbacksFallback() {
    this.feedbackService.getAllFeedbackSimple().subscribe({
      next: (feedbacks: Feedback[]) => {
        this.feedbacks = feedbacks;
        this.totalElements = feedbacks.length;
        this.currentPage = 0;
        this.isLoading = false;
        this.snackBar.open('Loaded feedback using fallback method', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error loading feedbacks with fallback method:', error);
        this.snackBar.open('Failed to load feedbacks', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadStatistics() {
    this.feedbackService.getFeedbackStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  applyFilter() {
    if (this.searchFilter && this.searchFilter.trim()) {
      this.currentPage = 0;
      this.loadFeedbacks();
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  getRatingClass(rating: number): string {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 3.5) return 'good';
    if (rating >= 2.5) return 'average';
    return 'poor';
  }

  getRatingLabel(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    return 'Poor';
  }

  toggleDescription(feedback: Feedback) {
    feedback.showFullDescription = !feedback.showFullDescription;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFeedbacks();
  }

  viewFeedbackDetails(feedback: Feedback) {
    console.log('Viewing feedback details:', feedback);
    this.snackBar.open(`Viewing feedback for booking ${feedback.booking?.bookingId}`, 'Close', { duration: 2000 });
    // TODO: Implement detailed feedback view modal
  }

  respondToFeedback(feedback: Feedback) {
    console.log('Responding to feedback:', feedback);
    this.snackBar.open(`Responding to feedback for booking ${feedback.booking?.bookingId}`, 'Close', { duration: 2000 });
    // TODO: Implement feedback response functionality
  }
} 