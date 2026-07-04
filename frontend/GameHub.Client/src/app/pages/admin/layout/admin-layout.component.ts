import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-950">
      <app-sidebar></app-sidebar>
      <div class="ml-64 p-6">
        <header class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-400">{{authService.user()?.fullName || authService.user()?.email}}</span>
            <button (click)="authService.logout()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
              Logout
            </button>
          </div>
        </header>
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}
}
