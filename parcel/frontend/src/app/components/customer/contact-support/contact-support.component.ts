import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NavbarComponent
  ],
  template: `
    <!-- Navigation -->
    <app-navbar type="customer" theme="customer"></app-navbar>

    <div class="contact-support-container">
      <div class="contact-support-content">
        <!-- Header Section -->
        <div class="contact-header">
          <div class="header-badge">
            <mat-icon>support_agent</mat-icon>
            <span>Customer Support</span>
          </div>
          <h1 class="contact-title">Contact Support</h1>
          <p class="contact-subtitle">Get help and support for your courier services anytime, anywhere</p>
        </div>

        <!-- Support Methods Section -->
        <div class="support-methods-section">
          <div class="methods-grid">
            <!-- Phone Support -->
            <div class="support-card">
              <div class="card-icon">
                <mat-icon>phone</mat-icon>
              </div>
              <div class="card-content">
                <h3>Phone Support</h3>
                <p>Speak directly with our support team</p>
                <div class="contact-info">
                  <span class="contact-number">+91 80 4567 8900</span>
                  <span class="contact-status">24/7 Available</span>
                </div>
                </div>
              </div>
              
            <!-- Email Support -->
            <div class="support-card">
              <div class="card-icon">
                <mat-icon>email</mat-icon>
              </div>
              <div class="card-content">
                <h3>Email Support</h3>
                <p>Send us a detailed message</p>
                <div class="contact-info">
                  <span class="contact-email">support&#64;expressparcel.in</span>
                  <span class="contact-status">Response within 2 hours</span>
                </div>
                </div>
              </div>
              
            <!-- Live Chat -->
            <div class="support-card">
              <div class="card-icon">
                <mat-icon>chat</mat-icon>
              </div>
              <div class="card-content">
                <h3>Live Chat</h3>
                <p>Get instant help via chat</p>
                <div class="contact-info">
                  <span class="contact-status">Available Now</span>
                  <span class="contact-status">Average wait: 2 minutes</span>
                </div>
              </div>
            </div>

            <!-- FAQ -->
            <div class="support-card">
              <div class="card-icon">
                <mat-icon>help</mat-icon>
              </div>
              <div class="card-content">
                <h3>FAQ Section</h3>
                <p>Find quick answers to common questions</p>
                <div class="contact-info">
                  <span class="contact-status">Self-Service</span>
                  <span class="contact-status">Instant Answers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Topics Section -->
        <div class="support-topics-section">
          <div class="topics-card">
            <div class="topics-header">
              <h2>Common Support Topics</h2>
              <p>We can help you with the following areas</p>
            </div>
            
            <div class="topics-grid">
              <div class="topic-item">
                <div class="topic-icon">
                  <mat-icon>local_shipping</mat-icon>
                </div>
                <div class="topic-content">
                  <h4>Booking & Shipping</h4>
                  <p>Assistance with booking creation, modifications, and shipping options</p>
                </div>
              </div>

              <div class="topic-item">
                <div class="topic-icon">
                  <mat-icon>location_on</mat-icon>
                </div>
                <div class="topic-content">
                  <h4>Tracking & Delivery</h4>
                  <p>Real-time package tracking and delivery status updates</p>
                </div>
              </div>

              <div class="topic-item">
                <div class="topic-icon">
                  <mat-icon>payment</mat-icon>
                </div>
                <div class="topic-content">
                  <h4>Payment & Billing</h4>
                  <p>Payment processing, billing inquiries, and refund requests</p>
                </div>
              </div>

              <div class="topic-item">
                <div class="topic-icon">
                  <mat-icon>cancel</mat-icon>
                </div>
                <div class="topic-content">
                  <h4>Cancellations</h4>
                  <p>Booking cancellations, refunds, and policy information</p>
                </div>
              </div>

              <div class="topic-item">
                <div class="topic-icon">
                  <mat-icon>computer</mat-icon>
                </div>
                <div class="topic-content">
                  <h4>Technical Support</h4>
                  <p>Application issues, login problems, and technical assistance</p>
                </div>
              </div>

              <div class="topic-item">
                <div class="topic-icon">
                  <mat-icon>info</mat-icon>
                </div>
                <div class="topic-content">
                  <h4>General Information</h4>
                  <p>Service information, policies, and general inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Hours Section -->
        <div class="support-hours-section">
          <div class="hours-card">
            <div class="hours-header">
              <mat-icon>schedule</mat-icon>
              <h3>Support Hours</h3>
            </div>
            <div class="hours-content">
              <div class="hours-item">
                <span class="hours-label">Phone Support:</span>
                <span class="hours-value">24/7 Available</span>
              </div>
              <div class="hours-item">
                <span class="hours-label">Email Support:</span>
                <span class="hours-value">24/7 (Response within 2 hours)</span>
              </div>
              <div class="hours-item">
                <span class="hours-label">Live Chat:</span>
                <span class="hours-value">6 AM - 10 PM EST</span>
              </div>
              <div class="hours-item">
                <span class="hours-label">FAQ:</span>
                <span class="hours-value">Always Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-support-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 50%, var(--background-tertiary) 100%);
      padding: 120px 3rem 3rem;
      position: relative;
    }

    .contact-support-container::before {
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

    .contact-support-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Header Section */
    .contact-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-badge {
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

    .header-badge:hover {
      background: rgba(8, 145, 178, 0.15);
      transform: translateY(-1px);
    }

    .header-badge mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .contact-title {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .contact-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Support Methods Section */
    .support-methods-section {
      margin-bottom: 3rem;
    }

    .methods-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .support-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      text-align: center;
      transition: all var(--transition-fast);
    }

    .support-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .card-icon {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      transition: all var(--transition-fast);
    }

    .support-card:hover .card-icon {
      transform: scale(1.1);
    }

    .card-icon mat-icon {
      color: var(--text-inverse);
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .card-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .card-content p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .contact-number,
    .contact-email {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--primary-color);
    }

    .contact-status {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Support Topics Section */
    .support-topics-section {
      margin-bottom: 3rem;
    }

    .topics-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
    }

    .topics-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .topics-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .topics-header p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .topic-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 2rem;
      background: var(--background-secondary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);
    }

    .topic-item:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .topic-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-dark) 100%);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .topic-icon mat-icon {
      color: var(--text-inverse);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .topic-content h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .topic-content p {
      color: var(--text-secondary);
      line-height: 1.5;
      font-size: 0.95rem;
    }

    /* Support Hours Section */
    .support-hours-section {
      margin-bottom: 3rem;
    }

    .hours-card {
      background: var(--background-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .hours-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .hours-header mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .hours-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .hours-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .hours-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--background-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
    }

    .hours-label {
      font-weight: 600;
      color: var(--text-primary);
    }

    .hours-value {
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .contact-support-container {
        padding: 100px 2rem 2rem;
      }

      .contact-title {
        font-size: 2.5rem;
      }

      .topics-card {
        padding: 2rem;
      }

      .topics-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .contact-support-container {
        padding: 80px 1.5rem 1.5rem;
      }

      .contact-title {
        font-size: 2rem;
      }

      .methods-grid {
        grid-template-columns: 1fr;
      }

      .support-card {
        padding: 2rem;
      }

      .topic-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .hours-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .contact-support-container {
        padding: 70px 1rem 1rem;
      }

      .contact-title {
        font-size: 1.75rem;
      }

      .support-card {
        padding: 1.5rem;
      }

      .topics-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class ContactSupportComponent {
  constructor() {}
} 