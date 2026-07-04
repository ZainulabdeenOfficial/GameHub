import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen" [style.background-color]="'var(--bg-primary)'" [style.color]="'var(--text-primary)'">
      <!-- Header -->
      <header class="sticky top-0 z-50 backdrop-blur-sm" [style.background-color]="'var(--header-bg)'" [style.border-color]="'var(--border-color)'" style="border-bottom-width: 1px;">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="logo.png" alt="GameHub" class="h-8 w-8 rounded-lg object-cover">
            <span class="text-xl font-bold" style="color: #6366f1;">GameHub</span>
          </a>
          <div class="flex items-center gap-3">
            <button (click)="themeService.toggle()" class="p-2 rounded-lg transition-colors" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-secondary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              <svg *ngIf="themeService.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg *ngIf="!themeService.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>
            <a routerLink="/login" class="text-sm font-medium transition-colors" [style.color]="'var(--text-secondary)'">Sign In</a>
            <a routerLink="/register" class="px-4 py-2 bg-indigo-600 rounded-full text-sm font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">Get Started</a>
          </div>
        </div>
      </header>

      <!-- Registration Form -->
      <div class="flex items-center justify-center p-4 py-16">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold" [style.color]="'var(--text-primary)'">Create your account</h1>
            <p class="mt-2" [style.color]="'var(--text-secondary)'">Join GameHub today</p>
          </div>
          <div class="rounded-2xl p-8 border shadow-xl" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <input type="text" [(ngModel)]="model.fullName" name="fullName" required placeholder="Full name"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <div>
                <input type="email" [(ngModel)]="model.email" name="email" required placeholder="Email address"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <div>
                <input type="password" [(ngModel)]="model.password" name="password" required placeholder="Password"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
                <p class="text-xs mt-1" [style.color]="'var(--text-muted)'">Min 8 characters, must include uppercase, lowercase &amp; a digit</p>
              </div>
              <div>
                <input type="password" [(ngModel)]="model.confirmPassword" name="confirmPassword" required placeholder="Confirm password"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <p *ngIf="error()" class="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{{error()}}</p>
              <button type="submit" [disabled]="loading()"
                class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50">
                {{loading() ? 'Creating account...' : 'Create Account'}}
              </button>
            </form>
            <p class="text-center mt-6" [style.color]="'var(--text-secondary)'">
              Already have an account? <a routerLink="/login" class="text-indigo-400 hover:text-indigo-300">Sign in</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="border-t py-12" [style.border-color]="'var(--border-color)'">
        <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <img src="logo.png" alt="GameHub" class="h-8 w-8 rounded-lg object-cover">
              <h3 class="text-xl font-bold" style="color: #6366f1;">GameHub</h3>
            </div>
            <p class="text-sm leading-relaxed" [style.color]="'var(--text-muted)'">Discover and download premium games. GameHub offers thousands of titles across every genre imaginable.</p>
          </div>
          <div>
            <h4 class="font-medium mb-3" [style.color]="'var(--text-primary)'">Quick Links</h4>
            <ul class="space-y-2 text-sm" [style.color]="'var(--text-secondary)'">
              <li><a routerLink="/" fragment="games" class="hover:text-indigo-400 transition-colors">Browse Games</a></li>
              <li><a routerLink="/" fragment="categories" class="hover:text-indigo-400 transition-colors">Categories</a></li>
              <li><a routerLink="/" class="hover:text-indigo-400 transition-colors">New Releases</a></li>
              <li><a routerLink="/" class="hover:text-indigo-400 transition-colors">Popular</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-3" [style.color]="'var(--text-primary)'">Support</h4>
            <ul class="space-y-2 text-sm" [style.color]="'var(--text-secondary)'">
              <li><a routerLink="/help" class="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a routerLink="/contact" class="hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li><a routerLink="/returns" class="hover:text-indigo-400 transition-colors">Returns</a></li>
              <li><a routerLink="/faq" class="hover:text-indigo-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-3" [style.color]="'var(--text-primary)'">Legal</h4>
            <ul class="space-y-2 text-sm" [style.color]="'var(--text-secondary)'">
              <li><a routerLink="/privacy-policy" class="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a routerLink="/terms-of-service" class="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a routerLink="/refund-policy" class="hover:text-indigo-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm mt-8 pt-8 border-t" [style.color]="'var(--text-muted)'" [style.border-color]="'var(--border-color)'">
          <p>&copy; {{currentYear}} GameHub. All rights reserved.</p>
          <div class="flex gap-6 mt-2 md:mt-0">
            <a routerLink="/privacy-policy" class="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a routerLink="/terms-of-service" class="hover:text-indigo-400 transition-colors">Terms of Service</a>
            <a routerLink="/refund-policy" class="hover:text-indigo-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class RegisterComponent {
  model = { email: '', password: '', confirmPassword: '', fullName: '' };
  loading = signal(false);
  error = signal('');
  currentYear = new Date().getFullYear();
  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}
  onSubmit() {
    this.error.set('');
    if (this.model.password !== this.model.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
    if (this.model.password.length < 8) {
      this.error.set('Password must be at least 8 characters with uppercase, lowercase & a digit');
      return;
    }
    this.loading.set(true);
    this.authService.register(this.model).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/']);
        } else {
          this.error.set(res.message || 'Registration failed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.message || 'Registration failed. Please try again.');
      }
    });
  }
}
