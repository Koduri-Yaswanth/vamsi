import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="officer-dashboard-container">
      <h2>Officer Dashboard</h2>
      <p>Officer dashboard functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .officer-dashboard-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class DashboardComponent {}