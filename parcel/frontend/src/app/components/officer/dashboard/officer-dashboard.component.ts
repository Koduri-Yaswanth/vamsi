import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="officer" theme="officer"></app-navbar>

    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="welcome-content">
          <div class="welcome-badge">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Officer Dashboard</span>
          </div>
          <h1 class="welcome-title">{{ currentUser?.officerName || currentUser?.name || 'Officer' }}</h1>
          <p class="welcome-subtitle">Officer ID: {{ currentUser?.uniqueId || currentUser?.id || currentUser?.officerId }}</p>
          
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="quick-actions-section">
        <div class="section-header">
          <h2 class="section-title">Quick Actions</h2>
          <p class="section-subtitle">Manage courier operations efficiently</p>
        </div>
        
        <div class="actions-grid">
          <div class="action-card primary" routerLink="/officer/booking">
            <div class="action-icon">
              <mat-icon>add_shopping_cart</mat-icon>
            </div>
            <div class="action-content">
              <h3>Create Booking</h3>
              <p>Create booking on behalf of customer with full details</p>
            </div>
            <div class="action-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>
          </div>

          <div class="action-card primary" routerLink="/officer/tracking">
            <div class="action-icon">
              <mat-icon>track_changes</mat-icon>
            </div>
            <div class="action-content">
              <h3>Track Package</h3>
              <p>Track shipments and packages with real-time updates</p>
            </div>
            <div class="action-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>
          </div>

          <div class="action-card secondary" routerLink="/officer/feedback">
            <div class="action-icon">
              <mat-icon>rate_review</mat-icon>
            </div>
            <div class="action-content">
              <h3>View Feedback</h3>
              <p>Monitor customer satisfaction and service quality</p>
            </div>
            <div class="action-arrow">
              <mat-icon>arrow_forward</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Tools Section -->
      <div class="management-tools-section">
        <div class="section-header">
          <h2 class="section-title">Management Tools</h2>
          <p class="section-subtitle">Access all operational management features</p>
        </div>
        
        <div class="tools-grid">
          <div class="tool-card" routerLink="/officer/delivery-status">
            <div class="tool-icon">
              <mat-icon>update</mat-icon>
            </div>
            <div class="tool-content">
              <h3>Update Status</h3>
              <p>Update delivery status and tracking information</p>
            </div>
          </div>

          <div class="tool-card" routerLink="/officer/pickup-scheduling">
            <div class="tool-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="tool-content">
              <h3>Schedule Pickup</h3>
              <p>Schedule and manage pickup appointments</p>
            </div>
          </div>
          
          <div class="tool-card" routerLink="/officer/all-bookings">
            <div class="tool-icon">
              <mat-icon>list</mat-icon>
            </div>
            <div class="tool-content">
              <h3>All Bookings</h3>
              <p>View and manage all customer bookings</p>
            </div>
          </div>

          <div class="tool-card" routerLink="/officer/cancel-booking">
            <div class="tool-icon">
              <mat-icon>cancel</mat-icon>
            </div>
            <div class="tool-content">
              <h3>Cancel Booking</h3>
              <p>Cancel or modify existing bookings</p>
            </div>
          </div>

          <div class="tool-card" routerLink="/officer/feedback">
            <div class="tool-icon">
              <mat-icon>rate_review</mat-icon>
            </div>
            <div class="tool-content">
              <h3>View Feedback</h3>
              <p>Monitor customer feedback and ratings</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Operations Section -->
      <div class="recent-operations-section">
        <div class="section-header">
          <h2 class="section-title">Recent Operations</h2>
          <p class="section-subtitle">Latest courier management activities</p>
        </div>
        
        <div class="operations-list">
          <div class="operation-item">
            <div class="operation-icon">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <div class="operation-content">
              <h4>Booking Created</h4>
              <p>New booking created for customer John Doe</p>
              <span class="operation-time">30 minutes ago</span>
            </div>
          </div>
          
          <div class="operation-item">
            <div class="operation-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="operation-content">
              <h4>Pickup Scheduled</h4>
              <p>Pickup scheduled for tomorrow at 10:00 AM</p>
              <span class="operation-time">2 hours ago</span>
            </div>
          </div>
          
          <div class="operation-item">
            <div class="operation-icon">
              <mat-icon>update</mat-icon>
            </div>
            <div class="operation-content">
              <h4>Status Updated</h4>
              <p>Package status updated to "In Transit"</p>
              <span class="operation-time">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .dashboard-container::before {
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

    /* Header Section */
    .header-section {
      margin-bottom: 4rem;
      position: relative;
      z-index: 2;
    }

    .welcome-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .welcome-badge {
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

    .welcome-badge:hover {
      background: rgba(8, 145, 178, 0.15);
      transform: translateY(-1px);
    }

    .welcome-badge mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .welcome-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .welcome-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 3rem;
      line-height: 1.5;
    }

    .welcome-stats {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-top: 3rem;
    }

    .stat-item {
      text-align: center;
      padding: 2rem;
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-fast);
      min-width: 150px;
    }

    .stat-item:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      display: block;
    }

    .stat-label {
      font-size: 0.95rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Quick Actions Section */
    .quick-actions-section {
      margin-bottom: 4rem;
      position: relative;
      z-index: 2;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .action-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 3rem;
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .action-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      transform: scaleX(0);
      transition: transform var(--transition-normal);
    }

    .action-card:hover {
      transform: translateY(-10px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-color);
    }

    .action-card:hover::before {
      transform: scaleX(1);
    }

    .action-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .action-card:hover .action-icon {
      transform: scale(1.1);
    }

    .action-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: var(--text-inverse);
    }

    .action-content {
      flex: 1;
    }

    .action-content h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .action-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      font-size: 1.05rem;
    }

    .action-arrow {
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }

    .action-card:hover .action-arrow {
      color: var(--primary-color);
      transform: translateX(5px);
    }

    /* Management Tools Section */
    .management-tools-section {
      margin-bottom: 4rem;
      position: relative;
      z-index: 2;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .tool-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      transition: all var(--transition-normal);
      cursor: pointer;
      text-align: center;
    }

    .tool-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .tool-icon {
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

    .tool-card:hover .tool-icon {
      transform: scale(1.1);
    }

    .tool-icon mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--text-inverse);
    }

    .tool-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .tool-content p {
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
      font-size: 0.95rem;
    }

    /* Recent Operations Section */
    .recent-operations-section {
      position: relative;
      z-index: 2;
    }

    .operations-list {
      max-width: 800px;
      margin: 0 auto;
    }

    .operation-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 2rem;
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      margin-bottom: 1.5rem;
      transition: all var(--transition-fast);
    }

    .operation-item:hover {
      transform: translateX(5px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .operation-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }

    .operation-item:hover .operation-icon {
      transform: scale(1.1);
    }

    .operation-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--text-inverse);
    }

    .operation-content {
      flex: 1;
    }

    .operation-content h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .operation-content p {
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .operation-time {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .dashboard-container {
        padding: 100px 2rem 2rem;
      }

      .welcome-title {
        font-size: 3rem;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .tools-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .welcome-stats {
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .welcome-title {
        font-size: 2.5rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .action-card {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .tools-grid {
        grid-template-columns: 1fr;
      }

      .welcome-stats {
        flex-direction: column;
        gap: 1rem;
      }

      .stat-item {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .dashboard-container {
        padding: 70px 1rem 1rem;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .action-card {
        padding: 2rem;
      }

      .tool-card {
        padding: 2rem;
      }

      .operation-item {
        padding: 1.5rem;
      }
    }
  `]
})
export class OfficerDashboardComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get officer user specifically
    this.currentUser = this.authService.getCurrentUserByRole('OFFICER');
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logoutByRole('OFFICER');
    this.router.navigate(['/']);
  }
}