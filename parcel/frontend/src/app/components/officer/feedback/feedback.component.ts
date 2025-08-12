import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-feedback',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
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
            <span>Customer Feedback</span>
          </div>
          <h1 class="feedback-title">View Customer Feedback</h1>
          <p class="feedback-subtitle">View and manage all customer feedback and ratings</p>
        </div>

        <!-- Statistics Section -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>rate_review</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ feedbackList.length }}</div>
                <div class="stat-label">Total Feedback</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>star</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getAverageRating() }}</div>
                <div class="stat-label">Average Rating</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>thumb_up</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getPositiveFeedbackCount() }}</div>
                <div class="stat-label">Positive Reviews</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getRecentFeedbackCount() }}</div>
                <div class="stat-label">This Month</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback Table Section -->
        <div class="feedback-table-section">
          <div class="table-card">
            <div class="table-header">
              <h2>Customer Feedback</h2>
              <p>Complete list of all customer feedback and ratings</p>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="feedbackList" class="feedback-table">
                <!-- Customer Name Column -->
                <ng-container matColumnDef="customerName">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>person</mat-icon>
                      <span>Customer Name</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let feedback" class="table-cell">
                    <div class="customer-info">
                      <div class="customer-avatar">
                        <mat-icon>person</mat-icon>
                      </div>
                      <span class="customer-name">{{ feedback.customerName }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Booking ID Column -->
                <ng-container matColumnDef="bookingId">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>receipt</mat-icon>
                      <span>Booking ID</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let feedback" class="table-cell">
                    <div class="booking-id">
                      <span class="id-text">{{ feedback.bookingId }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Rating Column -->
                <ng-container matColumnDef="rating">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>star</mat-icon>
                      <span>Rating</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let feedback" class="table-cell">
                    <div class="rating-display">
                      <div class="stars-container">
                        <mat-icon *ngFor="let star of getStars(feedback.rating)" class="star-icon filled">
                          star
                        </mat-icon>
                        <mat-icon *ngFor="let star of getEmptyStars(feedback.rating)" class="star-icon empty">
                          star_border
                        </mat-icon>
                      </div>
                      <span class="rating-text">{{ feedback.rating }}/5</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Description Column -->
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>description</mat-icon>
                      <span>Description</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let feedback" class="table-cell">
                    <div class="description-cell">
                      <p class="description-text">{{ feedback.description }}</p>
                    </div>
                  </td>
                </ng-container>

                <!-- Date Column -->
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>schedule</mat-icon>
                      <span>Date</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let feedback" class="table-cell">
                    <div class="date-display">
                      <span class="date-text">{{ feedback.createdAt | date:'mediumDate' }}</span>
                      <span class="time-text">{{ feedback.createdAt | date:'shortTime' }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="table-header-cell">
                    <div class="header-content">
                      <mat-icon>settings</mat-icon>
                      <span>Actions</span>
                    </div>
                  </th>
                  <td mat-cell *matCellDef="let feedback" class="table-cell">
                    <div class="action-buttons">
                      <button mat-button class="action-btn view-btn" (click)="viewFeedback(feedback)">
                        <mat-icon>visibility</mat-icon>
                        <span>View</span>
                      </button>
                      <button mat-button class="action-btn respond-btn" (click)="respondToFeedback(feedback)">
                        <mat-icon>reply</mat-icon>
                        <span>Respond</span>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns" class="table-header-row"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
              </table>

              <mat-paginator 
                [length]="totalElements"
                [pageSize]="pageSize"
                [pageIndex]="currentPage"
                [pageSizeOptions]="[5, 10, 25, 50]"
                (page)="onPageChange($event)"
                class="feedback-paginator">
              </mat-paginator>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem 0;
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
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
    }

    .feedback-title {
      font-size: 3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .feedback-subtitle {
      font-size: 1.125rem;
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }

    .stats-section {
      margin-bottom: 3rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .feedback-table-section {
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .table-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .table-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .table-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .table-header p {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
    }

    .table-container {
      overflow-x: auto;
    }

    .feedback-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .table-header-row {
      background: #f8fafc;
    }

    .table-header-cell {
      padding: 1.5rem 1rem;
      border-bottom: 2px solid #e2e8f0;
      font-weight: 600;
      color: #374151;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-content mat-icon {
      color: #0891b2;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .table-row {
      transition: all 0.3s ease;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .table-cell {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .customer-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      border-radius: 50%;
    }

    .customer-avatar mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .customer-name {
      font-weight: 600;
      color: #1e293b;
    }

    .booking-id {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #0891b2;
      background: #f0f9ff;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .stars-container {
      display: flex;
      gap: 0.125rem;
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

    .description-cell {
      max-width: 300px;
    }

    .description-text {
      margin: 0;
      color: #4b5563;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .date-display {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .date-text {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .time-text {
      color: #64748b;
      font-size: 0.75rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .view-btn {
      background: #f0f9ff;
      color: #0891b2;
      border: 1px solid #bae6fd;
    }

    .view-btn:hover {
      background: #e0f2fe;
      border-color: #0891b2;
    }

    .respond-btn {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .respond-btn:hover {
      background: #dcfce7;
      border-color: #16a34a;
    }

    .feedback-paginator {
      margin-top: 2rem;
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
      .feedback-content {
        padding: 0 1rem;
      }

      .feedback-title {
        font-size: 2rem;
      }

      .table-card {
        padding: 2rem 1.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .stat-card {
        padding: 1.5rem;
      }

      .action-buttons {
        flex-direction: column;
        gap: 0.25rem;
      }

      .action-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class FeedbackComponent implements OnInit {
  feedbackList: any[] = [];
  displayedColumns: string[] = ['customerName', 'bookingId', 'rating', 'description', 'date', 'actions'];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadFeedback();
  }

  loadFeedback() {
    // Mock data for demonstration
    this.feedbackList = [
      {
        customerName: 'John Doe',
        bookingId: 'BK001234',
        rating: 5,
        description: 'Excellent service! The package was delivered on time and in perfect condition. Highly recommend this courier service.',
        createdAt: new Date('2024-01-15T10:30:00')
      },
      {
        customerName: 'Jane Smith',
        bookingId: 'BK001235',
        rating: 4,
        description: 'Good service overall. Package arrived safely but was slightly delayed. Staff was very helpful.',
        createdAt: new Date('2024-01-14T14:20:00')
      },
      {
        customerName: 'Mike Johnson',
        bookingId: 'BK001236',
        rating: 5,
        description: 'Outstanding courier service! Fast delivery, professional staff, and great tracking system.',
        createdAt: new Date('2024-01-13T09:15:00')
      },
      {
        customerName: 'Sarah Wilson',
        bookingId: 'BK001237',
        rating: 3,
        description: 'Service was okay. Delivery took longer than expected, but package arrived safely.',
        createdAt: new Date('2024-01-12T16:45:00')
      },
      {
        customerName: 'David Brown',
        bookingId: 'BK001238',
        rating: 5,
        description: 'Amazing experience! The courier was very professional and the delivery was super fast.',
        createdAt: new Date('2024-01-11T11:30:00')
      }
    ];
    this.totalElements = this.feedbackList.length;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFeedback();
  }

  viewFeedback(feedback: any) {
    this.snackBar.open(`Viewing feedback for booking ${feedback.bookingId}`, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  respondToFeedback(feedback: any) {
    this.snackBar.open(`Responding to feedback for booking ${feedback.bookingId}`, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  getAverageRating(): string {
    if (this.feedbackList.length === 0) return '0.0';
    const total = this.feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / this.feedbackList.length).toFixed(1);
  }

  getPositiveFeedbackCount(): number {
    return this.feedbackList.filter(feedback => feedback.rating >= 4).length;
  }

  getRecentFeedbackCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.feedbackList.filter(feedback => new Date(feedback.createdAt) >= oneMonthAgo).length;
  }
} 