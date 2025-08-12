// Import statements for Angular application startup
import { bootstrapApplication } from '@angular/platform-browser'; // Function that starts the Angular application
import { appConfig } from './app/app.config'; // Our application configuration (routing, HTTP, animations)
import { AppComponent } from './app/app.component'; // The root component that starts our application

/**
 * Main Entry Point - Application Bootstrap
 * 
 * This is the very first file that runs when your Angular application starts.
 * Think of this as the "ignition key" that turns on your entire application.
 * 
 * What is bootstrapApplication?
 * - bootstrapApplication is a function that starts your Angular application
 * - It's like "turning on the engine" of your application
 * - It creates the application context and loads your root component
 * - Without this call, your application would never start
 * 
 * How Angular Application Startup Works:
 * 
 * 1. Browser Loads the Page:
 *    - User visits your website (e.g., localhost:4200)
 *    - Browser loads the HTML file (index.html)
 *    - HTML file references this main.ts file
 * 
 * 2. main.ts Executes:
 *    - This file runs and calls bootstrapApplication()
 *    - Angular creates the application context
 *    - Angular reads the appConfig to know what services to provide
 * 
 * 3. Root Component Loads:
 *    - AppComponent (the root component) is created and displayed
 *    - AppComponent contains the <router-outlet> for navigation
 *    - The router loads the appropriate page component based on the URL
 * 
 * 4. Application is Ready:
 *    - User can now interact with your application
 *    - Navigation between pages works
 *    - All services (routing, HTTP, animations) are available
 * 
 * Parameters Explained:
 * 
 * - AppComponent: The root component that serves as the main container
 *   (This component will be displayed first and hold all other components)
 * 
 * - appConfig: Configuration object that tells Angular what services to provide
 *   (Includes routing, HTTP client, animations, and other functionality)
 * 
 * Error Handling:
 * - .catch() handles any errors that occur during application startup
 * - If something goes wrong, the error is logged to the browser console
 * - This helps developers debug startup issues
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Log any startup errors to the console

/**
 * What Happens After bootstrapApplication() is Called:
 * 
 * 1. Angular Initialization:
 *    - Creates the application context
 *    - Sets up dependency injection
 *    - Initializes all configured services
 * 
 * 2. Component Creation:
 *    - Creates an instance of AppComponent
 *    - Renders the AppComponent template
 *    - Applies the AppComponent styles
 * 
 * 3. Service Setup:
 *    - Router service is created and configured with our routes
 *    - HTTP client is initialized for API communication
 *    - Animation system is set up for smooth transitions
 * 
 * 4. First Page Load:
 *    - Router determines which page to show first
 *    - Loads the appropriate component (usually landing page)
 *    - Displays it in the <router-outlet>
 * 
 * 5. User Interaction:
 *    - Application is now fully functional
 *    - User can navigate between pages
 *    - User can interact with forms and buttons
 *    - User can make API calls to the backend
 * 
 * This bootstrap process transforms a static HTML page into a dynamic,
 * interactive Angular application that can handle complex user interactions,
 * navigation, and data management for our courier service system.
 */ 