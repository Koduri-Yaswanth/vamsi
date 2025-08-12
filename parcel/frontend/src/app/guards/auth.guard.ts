import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Authentication Guard
 * 
 * This guard protects routes that require authentication. It checks if a user
 * is logged in (either as a customer or officer) before allowing access to
 * protected routes.
 * 
 * Key Concepts:
 * - Guard: Angular feature that controls access to routes
 * - inject(): Modern Angular function to inject dependencies
 * - Router: Angular service for navigation
 * - AuthService: Service that handles authentication logic
 * 
 * How it works:
 * 1. When a user tries to access a protected route
 * 2. This guard checks if they are authenticated
 * 3. If authenticated, allows access to the route
 * 4. If not authenticated, redirects to login page
 * 
 * Usage in routing:
 * { path: 'protected-route', component: ProtectedComponent, canActivate: [AuthGuard] }
 */
export const AuthGuard = () => {
  // Inject required services
  const authService = inject(AuthService);  // Service to check authentication status
  const router = inject(Router);            // Service to navigate to different routes

  // Check if user is authenticated as either customer or officer
  if (authService.isCustomerAuthenticated() || authService.isOfficerAuthenticated()) {
    // User is authenticated - allow access to the route
    return true;
  } else {
    // User is not authenticated - redirect to login page
    router.navigate(['/login']);
    return false;  // Deny access to the route
  }
}; 