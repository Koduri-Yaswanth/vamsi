import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Express Parcel</h1>
          <p class="hero-subtitle">
            Fast, reliable, and secure parcel delivery services at your fingertips
          </p>
          <div class="hero-buttons">
            <button mat-raised-button color="primary" (click)="navigateToRegister()" class="hero-button">
              <mat-icon>person_add</mat-icon>
              Get Started
            </button>
            <button mat-stroked-button color="primary" (click)="navigateToLogin()" class="hero-button">
              <mat-icon>login</mat-icon>
              Login
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="delivery-illustration">
            <mat-icon class="delivery-icon">local_shipping</mat-icon>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">Our Services</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">schedule</mat-icon>
              <mat-card-title>Express Delivery</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Fast and reliable delivery within 24 hours to your doorstep.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">track_changes</mat-icon>
              <mat-card-title>Real-time Tracking</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Track your parcels in real-time with our advanced tracking system.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">security</mat-icon>
              <mat-card-title>Secure Handling</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Your parcels are handled with utmost care and security.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">payment</mat-icon>
              <mat-card-title>Easy Payment</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Multiple payment options for your convenience.</p>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Register & Login</h3>
            <p>Create your account and login to access our services</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Book Your Parcel</h3>
            <p>Fill in the details and book your parcel for delivery</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Track & Monitor</h3>
            <p>Track your parcel's journey in real-time</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Receive Delivery</h3>
            <p>Get your parcel delivered safely to your doorstep</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust us with their deliveries</p>
          <button mat-raised-button color="accent" (click)="navigateToRegister()" class="cta-button">
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .hero-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 80px 24px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 60vh;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .hero-button {
      padding: 12px 24px;
      font-size: 1.1rem;
    }

    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .delivery-illustration {
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .delivery-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: white;
    }

    .features-section {
      padding: 80px 24px;
      background: white;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 60px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      text-align: center;
      padding: 32px;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .how-it-works-section {
      padding: 80px 24px;
      background: #f8f9fa;
    }

    .steps-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .step {
      text-align: center;
      padding: 32px;
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 auto 20px;
    }

    .step h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .step p {
      color: #666;
      line-height: 1.6;
    }

    .cta-section {
      padding: 80px 24px;
      background: var(--primary-color);
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 600;
      color: white;
      margin-bottom: 20px;
    }

    .cta-content p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 40px;
    }

    .cta-button {
      padding: 16px 32px;
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 40px 16px;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-buttons {
        justify-content: center;
      }

      .delivery-illustration {
        width: 200px;
        height: 200px;
        margin-top: 40px;
      }

      .delivery-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .steps-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
} 