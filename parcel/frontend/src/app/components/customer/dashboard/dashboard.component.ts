import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Top Toolbar -->
      <mat-toolbar color="primary" class="dashboard-toolbar">
        <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="toolbar-title">Customer Dashboard</span>
        <span class="spacer"></span>
        <span class="user-info">
          <mat-icon>account_circle</mat-icon>
          {{ currentUser?.customerName }}
        </span>
        <button mat-icon-button (click)="logout()" matTooltip="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Side Navigation -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <mat-icon class="sidenav-icon">local_shipping</mat-icon>
            <h3>Express Parcel</h3>
          </div>
          
          <mat-nav-list>
            <a mat-list-item routerLink="/customer/dashboard" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Home</span>
            </a>
            
            <a mat-list-item routerLink="/customer/booking" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>add_shopping_cart</mat-icon>
              <span matListItemTitle>Booking Service</span>
            </a>
            
            <a mat-list-item routerLink="/customer/tracking" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>track_changes</mat-icon>
              <span matListItemTitle>Tracking</span>
            </a>
            
            <a mat-list-item routerLink="/customer/previous-bookings" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>Previous Booking</span>
            </a>
            
            <a mat-list-item routerLink="/customer/payment" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>payment</mat-icon>
              <span matListItemTitle>Pay Bill</span>
            </a>
            
            <a mat-list-item routerLink="/customer/invoice" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>receipt</mat-icon>
              <span matListItemTitle>Generate Invoice</span>
            </a>
            
            <a mat-list-item routerLink="/customer/cancel-booking" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>cancel</mat-icon>
              <span matListItemTitle>Cancel Booking</span>
            </a>
            
            <a mat-list-item routerLink="/customer/feedback" routerLinkActive="active" class="nav-item">
              <mat-icon matListItemIcon>feedback</mat-icon>
              <span matListItemTitle>Contact Support</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="sidenav-content">
          <div class="dashboard-content">
            <!-- Welcome Section -->
            <mat-card class="welcome-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="primary">waving_hand</mat-icon>
                <mat-card-title>Welcome, {{ currentUser?.customerName }}!</mat-card-title>
                <mat-card-subtitle>Your courier service dashboard</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Welcome to your customer dashboard. Here you can manage your parcel bookings, track deliveries, and access all our services.</p>
              </mat-card-content>
            </mat-card>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <h2>Quick Actions</h2>
              <div class="action-grid">
                <mat-card class="action-card" (click)="navigateTo('/customer/booking')">
                  <mat-card-content>
                    <mat-icon color="primary">add_shopping_cart</mat-icon>
                    <h3>Book a Service</h3>
                    <p>Create a new parcel booking</p>
                  </mat-card-content>
                </mat-card>

                <mat-card class="action-card" (click)="navigateTo('/customer/tracking')">
                  <mat-card-content>
                    <mat-icon color="primary">track_changes</mat-icon>
                    <h3>Track Parcel</h3>
                    <p>Track your parcel status</p>
                  </mat-card-content>
                </mat-card>

                <mat-card class="action-card" (click)="navigateTo('/customer/previous-bookings')">
                  <mat-card-content>
                    <mat-icon color="primary">history</mat-icon>
                    <h3>View History</h3>
                    <p>Check your booking history</p>
                  </mat-card-content>
                </mat-card>

                <mat-card class="action-card" (click)="navigateTo('/customer/payment')">
                  <mat-card-content>
                    <mat-icon color="primary">payment</mat-icon>
                    <h3>Make Payment</h3>
                    <p>Pay for your bookings</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>

            <!-- Recent Activity -->
            <mat-card class="activity-card">
              <mat-card-header>
                <mat-card-title>Recent Activity</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="activity-item">
                  <mat-icon color="primary">info</mat-icon>
                  <div class="activity-content">
                    <h4>Welcome to Express Parcel</h4>
                    <p>Your account has been successfully created. You can now start booking parcel services.</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .dashboard-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .toolbar-title {
      margin-left: 16px;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 16px;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .sidenav {
      width: 280px;
      background: white;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
      background: var(--primary-color);
      color: white;
    }

    .sidenav-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .sidenav-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      color: #333;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }

    .nav-item:hover {
      background-color: #f5f5f5;
    }

    .nav-item.active {
      background-color: var(--primary-color);
      color: white;
    }

    .nav-item mat-icon {
      margin-right: 16px;
    }

    .sidenav-content {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-card {
      margin-bottom: 32px;
    }

    .quick-actions {
      margin-bottom: 32px;
    }

    .quick-actions h2 {
      color: #333;
      margin-bottom: 24px;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .action-card {
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-align: center;
      padding: 24px;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .action-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .activity-card {
      margin-bottom: 32px;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 0;
    }

    .activity-item mat-icon {
      margin-top: 4px;
    }

    .activity-content h4 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .activity-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }

      .action-grid {
        grid-template-columns: 1fr;
      }

      .sidenav-content {
        padding: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logoutByRole('CUSTOMER');
    this.router.navigate(['/home']);
  }
} 