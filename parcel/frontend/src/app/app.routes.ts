// Import statements for Angular routing functionality
import { Routes } from '@angular/router'; // Core routing class that defines how URLs map to components
import { CustomerGuard } from './guards/customer.guard'; // Service that checks if user can access customer pages
import { OfficerGuard } from './guards/officer.guard'; // Service that checks if user can access officer pages

/**
 * Application Routing Configuration
 * 
 * This file defines all the routes (URLs) in our application and maps them to components.
 * Think of routes as the "addresses" that users can visit in your application.
 * 
 * What is Routing?
 * - Routing is how users navigate between different pages in your application
 * - In a traditional website, each page has a different URL (like example.com/login, example.com/dashboard)
 * - In Angular (a Single Page Application), all pages are loaded in the same HTML file
 * - The router changes which component is displayed based on the URL
 * - This creates a smooth, fast user experience without page reloads
 * 
 * Route Structure:
 * - path: The URL path (what users type in the browser address bar)
 * - loadComponent: The component to display when this route is visited
 * - canActivate: Guards that check if the user is allowed to access this route
 * 
 * Route Guards:
 * - Guards are like "security checkpoints" that run before a route is accessed
 * - CustomerGuard: Checks if the user is logged in as a customer
 * - OfficerGuard: Checks if the user is logged in as an officer
 * - If a guard returns false, the user is redirected to login
 * 
 * Lazy Loading:
 * - loadComponent: () => import(...) means the component is loaded only when needed
 * - This improves initial page load time by not loading all components at once
 * - Components are downloaded from the server only when the user visits that page
 */
export const routes: Routes = [
  // Default route - redirects to landing page when user visits the root URL
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  
  // Public routes - anyone can access these without logging in
  { path: 'landing', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  
  // Customer routes - only logged-in customers can access these
  // Each route loads a different component for different customer functionality
  { path: 'customer/dashboard', loadComponent: () => import('./components/customer/dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent), canActivate: [CustomerGuard] },
  { path: 'customer/booking', loadComponent: () => import('./components/customer/booking/booking.component').then(m => m.BookingComponent), canActivate: [CustomerGuard] },
  { path: 'customer/payment', loadComponent: () => import('./components/customer/payment/payment.component').then(m => m.PaymentComponent), canActivate: [CustomerGuard] },
  { path: 'customer/payment-success', loadComponent: () => import('./components/customer/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent), canActivate: [CustomerGuard] },
  { path: 'customer/invoice', loadComponent: () => import('./components/customer/invoice/invoice.component').then(m => m.InvoiceComponent), canActivate: [CustomerGuard] },
  { path: 'customer/tracking', loadComponent: () => import('./components/customer/tracking/tracking.component').then(m => m.TrackingComponent), canActivate: [CustomerGuard] },
  { path: 'customer/previous-bookings', loadComponent: () => import('./components/customer/previous-bookings/previous-bookings.component').then(m => m.PreviousBookingsComponent), canActivate: [CustomerGuard] },
  { path: 'customer/cancel-booking', loadComponent: () => import('./components/customer/cancel-booking/cancel-booking.component').then(m => m.CancelBookingComponent), canActivate: [CustomerGuard] },
  { path: 'customer/feedback', loadComponent: () => import('./components/customer/feedback/feedback.component').then(m => m.FeedbackComponent), canActivate: [CustomerGuard] },
  { path: 'customer/profile', loadComponent: () => import('./components/customer/profile/customer-profile.component').then(m => m.CustomerProfileComponent), canActivate: [CustomerGuard] },
  { path: 'customer/contact-support', loadComponent: () => import('./components/customer/contact-support/contact-support.component').then(m => m.ContactSupportComponent), canActivate: [CustomerGuard] },
  
  // Officer routes - only logged-in officers can access these
  // Officers have administrative privileges and can manage all bookings
  { path: 'officer/dashboard', loadComponent: () => import('./components/officer/dashboard/officer-dashboard.component').then(m => m.OfficerDashboardComponent), canActivate: [OfficerGuard] },
  { path: 'officer/tracking', loadComponent: () => import('./components/officer/tracking/officer-tracking.component').then(m => m.OfficerTrackingComponent), canActivate: [OfficerGuard] },
  { path: 'officer/delivery-status', loadComponent: () => import('./components/officer/delivery-status/delivery-status.component').then(m => m.DeliveryStatusComponent), canActivate: [OfficerGuard] },
  { path: 'officer/pickup-scheduling', loadComponent: () => import('./components/officer/pickup-scheduling/pickup-scheduling.component').then(m => m.PickupSchedulingComponent), canActivate: [OfficerGuard] },
  { path: 'officer/all-bookings', loadComponent: () => import('./components/officer/all-bookings/all-bookings.component').then(m => m.AllBookingsComponent), canActivate: [OfficerGuard] },
  { path: 'officer/booking', loadComponent: () => import('./components/officer/booking/officer-booking.component').then(m => m.OfficerBookingComponent), canActivate: [OfficerGuard] },
  { path: 'officer/payment', loadComponent: () => import('./components/officer/payment/officer-payment.component').then(m => m.OfficerPaymentComponent), canActivate: [OfficerGuard] },
  { path: 'officer/payment-success', loadComponent: () => import('./components/officer/payment-success/officer-payment-success.component').then(m => m.OfficerPaymentSuccessComponent), canActivate: [OfficerGuard] },
  { path: 'officer/invoice', loadComponent: () => import('./components/officer/invoice/officer-invoice.component').then(m => m.OfficerInvoiceComponent), canActivate: [OfficerGuard] },
  { path: 'officer/cancel-booking', loadComponent: () => import('./components/officer/cancel-booking/officer-cancel-booking.component').then(m => m.OfficerCancelBookingComponent), canActivate: [OfficerGuard] },
  { path: 'officer/feedback', loadComponent: () => import('./components/officer/feedback/officer-feedback.component').then(m => m.OfficerFeedbackComponent), canActivate: [OfficerGuard] },
  { path: 'officer/profile', loadComponent: () => import('./components/officer/profile/officer-profile.component').then(m => m.OfficerProfileComponent), canActivate: [OfficerGuard] },
];

/**
 * How Routing Works in This Application:
 * 
 * 1. User Types a URL:
 *    - User types: http://localhost:4200/customer/dashboard
 *    - Angular router looks at the URL path: /customer/dashboard
 * 
 * 2. Route Matching:
 *    - Router finds the matching route in this array
 *    - Matches: { path: 'customer/dashboard', ... }
 * 
 * 3. Guard Check:
 *    - Router runs CustomerGuard.canActivate() method
 *    - Guard checks if user is logged in as a customer
 *    - If yes: proceed to step 4
 *    - If no: redirect to login page
 * 
 * 4. Component Loading:
 *    - Router calls loadComponent function
 *    - CustomerDashboardComponent is downloaded from server
 *    - Component is displayed in the <router-outlet> in app.component.html
 * 
 * 5. Navigation:
 *    - User can now see the customer dashboard
 *    - URL in browser shows /customer/dashboard
 *    - No page reload occurred - it's all the same Angular application
 * 
 * Benefits of This Approach:
 * - Fast navigation between pages
 * - Better user experience
 * - Secure access control with guards
 * - Efficient loading with lazy loading
 * - Single page application (SPA) architecture
 */ 