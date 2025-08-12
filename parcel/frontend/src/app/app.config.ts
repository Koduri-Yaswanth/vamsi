// Import statements for Angular core configuration and functionality
import { ApplicationConfig } from '@angular/core'; // Core configuration interface for Angular applications
import { provideRouter } from '@angular/router'; // Function that provides routing functionality to the application
import { provideAnimations } from '@angular/platform-browser/animations'; // Function that provides animation support
import { provideHttpClient } from '@angular/common/http'; // Function that provides HTTP client for making API calls

// Import our custom routes configuration
import { routes } from './app.routes';

/**
 * Application Configuration
 * 
 * This file configures the core services and functionality that our Angular application needs.
 * Think of this as the "settings" file that tells Angular what features to enable.
 * 
 * What is ApplicationConfig?
 * - ApplicationConfig is an Angular interface that defines what services and features
 *   your application will have access to
 * - It's like a "shopping list" of functionality that Angular should provide
 * - Without these providers, your application won't be able to use routing, HTTP calls, or animations
 * 
 * What are Providers?
 * - Providers are functions that "provide" (give) functionality to your application
 * - They're like "factories" that create and configure services
 * - When you add a provider, Angular knows how to create and manage that service
 * - Think of it as telling Angular: "Hey, I want to use routing, so please set it up for me"
 * 
 * Key Providers in This Application:
 * 
 * 1. provideRouter(routes):
 *    - Enables routing functionality throughout the application
 *    - Makes it possible to navigate between different pages
 *    - Without this, you couldn't use <router-outlet> or navigate to different URLs
 *    - The 'routes' parameter tells the router what URLs exist and what components to show
 * 
 * 2. provideAnimations():
 *    - Enables Angular animations and transitions
 *    - Makes it possible to animate elements when they appear/disappear
 *    - Provides smooth transitions between pages and components
 *    - Enables Material Design animations (like buttons that ripple when clicked)
 * 
 * 3. provideHttpClient():
 *    - Enables HTTP communication with backend servers
 *    - Makes it possible to send GET, POST, PUT, DELETE requests to APIs
 *    - Essential for features like user login, booking creation, payment processing
 *    - Without this, your frontend couldn't talk to your backend
 * 
 * How This Configuration Works:
 * 1. When the application starts, Angular reads this configuration
 * 2. Angular creates instances of all the services specified in providers
 * 3. These services become available throughout your entire application
 * 4. Components can now use routing, make HTTP calls, and show animations
 * 
 * Alternative Approaches:
 * - In older Angular versions, this configuration was done in modules (NgModule)
 * - Modern Angular uses standalone components and this configuration approach
 * - This approach is simpler and more straightforward for beginners
 */
export const appConfig: ApplicationConfig = {
  // The providers array contains all the services and functionality we want Angular to provide
  providers: [
    // Enable routing with our custom routes
    provideRouter(routes),
    
    // Enable animations and transitions
    provideAnimations(),
    
    // Enable HTTP client for API communication
    provideHttpClient()
  ]
};

/**
 * What Happens When This Configuration is Applied:
 * 
 * 1. Application Startup:
 *    - Angular reads this configuration file
 *    - Creates the router service with our routes
 *    - Sets up the animation system
 *    - Initializes the HTTP client
 * 
 * 2. Service Availability:
 *    - All components can now use Router for navigation
 *    - All components can now use HttpClient for API calls
 *    - All components can now use animations
 * 
 * 3. Component Usage:
 *    - Components can inject Router to navigate between pages
 *    - Components can inject HttpClient to make API calls
 *    - Components can use animation triggers and transitions
 * 
 * This configuration makes our courier management system fully functional with:
 * - Multi-page navigation (dashboard, booking, payment, etc.)
 * - Backend communication (user authentication, booking creation, etc.)
 * - Smooth user experience with animations and transitions
 */ 