import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Customer Authentication Guard
 * 
 * This guard protects routes that are specifically for customers only.
 * It ensures that only authenticated customers can access customer-specific
 * features like booking parcels, viewing their dashboard, etc.
 * 
 * Key Concepts:
 * - Guard: Angular feature that controls access to routes
 * - inject(): Modern Angular function to inject dependencies
 * - Router: Angular service for navigation
 * - AuthService: Service that handles authentication logic
 * 
 * How it works:
 * 1. When a user tries to access a customer-only route
 * 2. This guard checks if they are authenticated as a customer
 * 3. If authenticated as customer, allows access to the route
 * 4. If not authenticated as customer, redirects to login page
 * 
 * Usage in routing:
 * { path: 'customer/dashboard', component: CustomerDashboardComponent, canActivate: [CustomerGuard] }
 * 
 * Difference from AuthGuard:
 * - AuthGuard allows both customers and officers
 * - CustomerGuard only allows customers
 */
export const CustomerGuard = () => {
  // Inject required services
  const authService = inject(AuthService);  // Service to check authentication status
  const router = inject(Router);            // Service to navigate to different routes

  // Check if user is authenticated specifically as a customer
  if (authService.isCustomerAuthenticated()) {
    // User is authenticated as customer - allow access to the route
    return true;
  } else {
    // User is not authenticated as customer - redirect to login page
    router.navigate(['/login']);
    return false;  // Deny access to the route
  }
}; 