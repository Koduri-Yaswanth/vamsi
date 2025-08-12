import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Officer Authentication Guard
 * 
 * This guard protects routes that are specifically for officers only.
 * It ensures that only authenticated officers can access officer-specific
 * features like managing bookings, updating delivery status, etc.
 * 
 * Key Concepts:
 * - Guard: Angular feature that controls access to routes
 * - inject(): Modern Angular function to inject dependencies
 * - Router: Angular service for navigation
 * - AuthService: Service that handles authentication logic
 * 
 * How it works:
 * 1. When a user tries to access an officer-only route
 * 2. This guard checks if they are authenticated as an officer
 * 3. If authenticated as officer, allows access to the route
 * 4. If not authenticated as officer, redirects to login page
 * 
 * Usage in routing:
 * { path: 'officer/dashboard', component: OfficerDashboardComponent, canActivate: [OfficerGuard] }
 * 
 * Difference from other guards:
 * - AuthGuard allows both customers and officers
 * - CustomerGuard only allows customers
 * - OfficerGuard only allows officers
 */
export const OfficerGuard = () => {
  // Inject required services
  const authService = inject(AuthService);  // Service to check authentication status
  const router = inject(Router);            // Service to navigate to different routes

  // Check if user is authenticated specifically as an officer
  if (authService.isOfficerAuthenticated()) {
    // User is authenticated as officer - allow access to the route
    return true;
  } else {
    // User is not authenticated as officer - redirect to login page
    router.navigate(['/login']);
    return false;  // Deny access to the route
  }
}; 