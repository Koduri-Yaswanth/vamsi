import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <nav class="navbar" [class.navbar-landing]="type === 'landing'">
      <div class="navbar-container">
        <!-- Brand Section -->
        <div class="brand-section">
          <div class="brand-logo">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <div class="brand-text">
            <h1 class="brand-title">{{ getBrandTitle() }}</h1>
            <p class="brand-subtitle" *ngIf="type === 'landing'">Delivering excellence worldwide</p>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="nav-links" *ngIf="type === 'landing'">
          <a (click)="scrollToFeatures()" class="nav-link">
            <mat-icon>star</mat-icon>
            <span>Features</span>
          </a>
          <a (click)="scrollToServices()" class="nav-link">
            <mat-icon>local_shipping</mat-icon>
            <span>Services</span>
          </a>
          <a (click)="scrollToAbout()" class="nav-link">
            <mat-icon>info</mat-icon>
            <span>About</span>
          </a>
          <a (click)="scrollToContact()" class="nav-link">
            <mat-icon>contact_support</mat-icon>
            <span>Contact</span>
          </a>
      </div>
      
        <!-- Customer Navigation -->
        <div class="nav-links" *ngIf="type === 'customer'">
          <a routerLink="/customer/dashboard" class="nav-link">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/customer/booking" class="nav-link">
            <mat-icon>add_shopping_cart</mat-icon>
            <span>New Booking</span>
          </a>
          <a routerLink="/customer/tracking" class="nav-link">
            <mat-icon>location_on</mat-icon>
            <span>Track Package</span>
          </a>
          <a routerLink="/customer/previous-bookings" class="nav-link">
            <mat-icon>history</mat-icon>
            <span>My Bookings</span>
          </a>
        </div>

        <!-- Officer Navigation -->
        <div class="nav-links" *ngIf="type === 'officer'">
          <a routerLink="/officer/dashboard" class="nav-link">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/officer/booking" class="nav-link">
            <mat-icon>add_shopping_cart</mat-icon>
            <span>Create Booking</span>
          </a>
          <a routerLink="/officer/all-bookings" class="nav-link">
            <mat-icon>list</mat-icon>
            <span>All Bookings</span>
          </a>
          <a routerLink="/officer/tracking" class="nav-link">
            <mat-icon>location_on</mat-icon>
            <span>Track Package</span>
          </a>
          <a routerLink="/officer/pickup-scheduling" class="nav-link">
            <mat-icon>schedule</mat-icon>
            <span>Schedule Pickup</span>
          </a>
          <a routerLink="/officer/delivery-status" class="nav-link">
            <mat-icon>update</mat-icon>
            <span>Update Status</span>
          </a>
        </div>

        <!-- Auth Buttons -->
        <div class="auth-buttons" *ngIf="type === 'landing'">
          <button mat-stroked-button class="btn-secondary" (click)="navigateToLogin()">
            <mat-icon>login</mat-icon>
            Sign In
          </button>
          <button mat-raised-button class="btn-primary" (click)="navigateToRegister()">
            <mat-icon>person_add</mat-icon>
            Sign Up
          </button>
        </div>

        <!-- User Menu -->
        <div class="user-menu" *ngIf="type !== 'landing'">
          <div class="user-info" *ngIf="currentUser">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-details">
              <div class="user-name">{{ currentUser.customerName || currentUser.officerName }}</div>
              <div class="user-role">{{ currentUser.role }}</div>
            </div>
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="menu-trigger">
              <mat-icon>expand_more</mat-icon>
            </button>
          </div>

          <mat-menu #userMenu="matMenu" class="user-dropdown">
            <button mat-menu-item (click)="navigateToProfile()">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item (click)="navigateToDashboard()">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </button>
            <div class="menu-divider"></div>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>

        <!-- Mobile Menu Toggle -->
        <button mat-icon-button class="mobile-menu-toggle" (click)="toggleMobileMenu()" *ngIf="type === 'landing'">
          <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" *ngIf="isMobileMenuOpen && type === 'landing'" (click)="closeMobileMenu()"></div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.mobile-menu-open]="isMobileMenuOpen && type === 'landing'">
        <div class="mobile-menu-header">
          <h3>Menu</h3>
          <button mat-icon-button (click)="closeMobileMenu()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="mobile-menu-links">
          <a (click)="scrollToFeatures(); closeMobileMenu()" class="mobile-nav-link">
            <mat-icon>star</mat-icon>
            <span>Features</span>
          </a>
          <a (click)="scrollToServices(); closeMobileMenu()" class="mobile-nav-link">
            <mat-icon>local_shipping</mat-icon>
            <span>Services</span>
          </a>
          <a (click)="scrollToAbout(); closeMobileMenu()" class="mobile-nav-link">
            <mat-icon>info</mat-icon>
            <span>About</span>
          </a>
          <a (click)="scrollToContact(); closeMobileMenu()" class="mobile-nav-link">
            <mat-icon>contact_support</mat-icon>
            <span>Contact</span>
          </a>
        </div>
        <div class="mobile-menu-actions">
          <button mat-stroked-button class="btn-secondary" (click)="navigateToLogin(); closeMobileMenu()">
            <mat-icon>login</mat-icon>
            Sign In
            </button>
          <button mat-raised-button class="btn-primary" (click)="navigateToRegister(); closeMobileMenu()">
            <mat-icon>person_add</mat-icon>
            Sign Up
            </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: all var(--transition-normal);
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }

    /* Brand Section */
    .brand-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .brand-logo {
      width: 2.5rem;
      height: 2.5rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-logo mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--text-inverse);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-inverse);
      margin: 0;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.2;
    }

    /* Navigation Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-inverse);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      transition: all var(--transition-fast);
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 2px 10px rgba(0,0,0,0.12);
    }

    .nav-link:hover {
      color: var(--text-inverse);
      background: rgba(255, 255, 255, 0.22);
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
    }

    .nav-link mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    /* Auth Buttons */
    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* User Menu */
    .user-menu {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 1rem;
      background: var(--background-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .user-info:hover {
      background: var(--background-primary);
      box-shadow: var(--shadow-sm);
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-inverse);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: capitalize;
      line-height: 1.2;
    }

    .menu-trigger {
      color: var(--text-secondary);
    }

    .menu-trigger:hover {
      color: var(--primary-color);
    }

    /* User Dropdown Menu */
    .user-dropdown {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .user-dropdown ::ng-deep .mat-mdc-menu-content {
      padding: 0.5rem 0;
    }

    .user-dropdown ::ng-deep .mat-mdc-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .user-dropdown ::ng-deep .mat-mdc-menu-item:hover {
      background: var(--background-accent);
      color: var(--primary-color);
    }

    .user-dropdown ::ng-deep .mat-mdc-menu-item mat-icon {
      color: inherit;
    }

    .menu-divider {
      height: 1px;
      background: var(--border-light);
      margin: 0.5rem 0;
    }

    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
      display: none;
      color: var(--text-primary);
    }

    /* Mobile Menu */
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      backdrop-filter: blur(4px);
    }

    .mobile-menu {
      position: fixed;
      top: 0;
      right: -100%;
      width: 300px;
      height: 100vh;
      background: var(--background-primary);
      border-left: 1px solid var(--border-light);
      z-index: 1001;
      transition: right var(--transition-normal);
      display: flex;
      flex-direction: column;
    }

    .mobile-menu-open {
      right: 0;
    }

    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .mobile-menu-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .mobile-menu-links {
      flex: 1;
      padding: 1rem 0;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .mobile-nav-link:hover {
      background: var(--background-accent);
      color: var(--primary-color);
    }

    .mobile-nav-link mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .mobile-menu-actions {
      padding: 1.5rem;
      border-top: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .nav-links {
        gap: 1rem;
      }

      .nav-link span {
        display: none;
      }

      .nav-link {
        padding: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .nav-links,
      .auth-buttons {
        display: none;
      }

      .mobile-menu-toggle {
        display: block;
      }

      .brand-subtitle {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .navbar-container {
        padding: 0 0.75rem;
      }

      .brand-title {
        font-size: 1.125rem;
      }

      .user-details {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  @Input() type: 'landing' | 'customer' | 'officer' | 'dashboard' = 'landing';
  @Input() theme: 'landing' | 'customer' | 'officer' | 'light' | 'dark' = 'light';
  
  currentUser: any;
  isMobileMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  getBrandTitle(): string {
    switch (this.type) {
      case 'customer':
        return 'Customer Portal';
      case 'officer':
        return 'Officer Portal';
      default:
        return 'Express Parcel';
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToProfile() {
    if (this.currentUser?.role === 'CUSTOMER') {
      this.router.navigate(['/customer/profile']);
    } else if (this.currentUser?.role === 'OFFICER') {
      this.router.navigate(['/officer/profile']);
    }
  }

  navigateToDashboard() {
    if (this.currentUser?.role === 'CUSTOMER') {
      this.router.navigate(['/customer/dashboard']);
    } else if (this.currentUser?.role === 'OFFICER') {
      this.router.navigate(['/officer/dashboard']);
    }
  }

  logout() {
      this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToServices() {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
} 