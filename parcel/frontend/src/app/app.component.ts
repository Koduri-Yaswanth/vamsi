// Import statements - these bring in functionality from Angular and other libraries
import { Component } from '@angular/core'; // Core Angular decorator that marks a class as a component
import { CommonModule } from '@angular/common'; // Provides common Angular directives like *ngIf, *ngFor
import { RouterOutlet } from '@angular/router'; // Component that displays the current route's content
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Material Design notification component

/**
 * Main Application Component
 * 
 * This is the root component of our Angular application. It serves as the main
 * container for the entire application and provides the basic structure.
 * Think of this as the "main page" that holds everything else.
 * 
 * What is Angular?
 * - Angular is a framework for building web applications
 * - It uses TypeScript (a superset of JavaScript with additional features)
 * - It follows a component-based architecture (UI is broken into reusable pieces)
 * - It provides two-way data binding (changes in UI automatically update data and vice versa)
 * 
 * Key Concepts:
 * - @Component: Angular decorator that marks this class as a component
 *   (A decorator is like a label that tells Angular "this class is special")
 * - selector: The HTML tag name used to include this component in templates
 *   (When you write <app-root></app-root> in HTML, this component will be displayed)
 * - standalone: Modern Angular feature that makes components self-contained
 *   (Older Angular versions required modules, but standalone components are simpler)
 * - imports: Other modules/components this component depends on
 * - template: The HTML template for this component (inline in this case)
 * - styles: CSS styles specific to this component
 * 
 * Component Responsibilities:
 * 1. Provide the main application container
 * 2. Include the router outlet for navigation (this is how users move between pages)
 * 3. Apply global styling (gradient background)
 * 4. Import necessary modules for the application
 * 
 * How Angular Works:
 * - When you visit the website, Angular loads this component first
 * - The router outlet inside this component then loads the appropriate page component
 * - For example, if you visit /login, the router will load the login component inside this app-root
 * - This creates a single-page application (SPA) where the page doesn't reload when navigating
 */
@Component({
  // HTML tag name: <app-root></app-root>
  // This means anywhere in your HTML, you can write <app-root> and this component will appear
  selector: 'app-root',
  
  // Standalone component (doesn't need to be declared in a module)
  // This is a newer Angular feature that makes components simpler to use
  standalone: true,
  
  // Import required modules and components
  // These are like "tools" that this component needs to work properly
  imports: [
    CommonModule,        // Provides common directives like *ngIf, *ngFor
                        // *ngIf="condition" - only shows content if condition is true
                        // *ngFor="let item of items" - repeats content for each item in a list
    RouterOutlet,        // Displays the current route's component
                        // This is like a "placeholder" that gets filled with different content
                        // based on which page the user is visiting
    MatSnackBarModule    // Material Design notification component
                        // Shows pop-up messages to users (like "Login successful!" or "Error occurred")
  ],
  
  // Inline HTML template
  // This is the HTML that will be displayed when this component is rendered
  // The <router-outlet> is where different page components will be displayed
  template: `
    <div class="app-container">
      <!-- Router outlet displays the component for the current route -->
      <!-- Think of this as a "window" that shows different pages -->
      <!-- When you navigate to /login, the login component appears here -->
      <!-- When you navigate to /dashboard, the dashboard component appears here -->
      <router-outlet></router-outlet>
    </div>
  `,
  
  // Inline CSS styles
  // These styles only apply to this component (they don't affect other components)
  styles: [`
    .app-container {
      min-height: 100vh;  /* Full viewport height - makes the background cover the entire screen */
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* Beautiful gradient background */
      /* This creates a diagonal gradient from blue to purple across the entire page */
    }
  `]
})
export class AppComponent {
  /**
   * Application title
   * Used for browser tab title and other display purposes
   * This is a simple property that stores the name of the application
   */
  title = 'Express Parcel';
  
  /**
   * What happens when this component is created:
   * 1. Angular creates an instance of this class
   * 2. The template is rendered to HTML
   * 3. The styles are applied
   * 4. The component is displayed in the browser
   * 5. The router outlet is ready to display other components
   * 
   * This component doesn't have much logic because its main job is to:
   * - Hold the router outlet (which handles navigation)
   * - Provide the overall page structure
   * - Apply the background styling
   */
} 