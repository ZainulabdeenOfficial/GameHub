import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-forgot-password',
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

      <!-- Forgot Password Form -->
      <div class="flex items-center justify-center p-4 py-16">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold" [style.color]="'var(--text-primary)'">Reset your password</h1>
            <p class="mt-2" [style.color]="'var(--text-secondary)'">{{step() === 1 ? 'Enter your email to receive a verification code' : step() === 2 ? 'Enter the code sent to your email' : 'Choose your new password'}}</p>
          </div>

          <div *ngIf="success()" class="rounded-2xl p-8 border shadow-xl text-center" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background: rgba(34,197,94,0.2);">
              <svg class="w-8 h-8" style="color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 class="text-xl font-bold mb-2" [style.color]="'var(--text-primary)'">Password reset successful</h2>
            <p class="mb-6" [style.color]="'var(--text-secondary)'">{{success()}}</p>
            <a routerLink="/login" class="inline-block px-8 py-3 bg-indigo-600 rounded-full text-lg font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">Sign in with new password</a>
          </div>

          <!-- Step 1: Email -->
          <div *ngIf="step() === 1 && !success()" class="rounded-2xl p-8 border shadow-xl" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
            <form (ngSubmit)="sendCode()" class="space-y-5">
              <div>
                <input type="email" [(ngModel)]="email" name="email" required placeholder="Email address"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <p *ngIf="error()" class="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{{error()}}</p>
              <button type="submit" [disabled]="loading()"
                class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50">
                {{loading() ? 'Sending code...' : 'Send Verification Code'}}
              </button>
            </form>
            <p class="text-center mt-6" [style.color]="'var(--text-secondary)'">
              Remember your password? <a routerLink="/login" class="text-indigo-400 hover:text-indigo-300">Sign in</a>
            </p>
          </div>

          <!-- Step 2: Verify Code -->
          <div *ngIf="step() === 2 && !success()" class="rounded-2xl p-8 border shadow-xl" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
            <p class="text-sm mb-6" [style.color]="'var(--text-muted)'">A verification code was sent to your email. Please enter the 6-digit code below.</p>
            <form (ngSubmit)="verifyCode()" class="space-y-5">
              <div>
                <input type="text" [(ngModel)]="code" name="code" required placeholder="Enter 6-digit code" maxlength="6"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-center text-2xl tracking-widest" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <p *ngIf="error()" class="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{{error()}}</p>
              <button type="submit" [disabled]="loading()"
                class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50">
                {{loading() ? 'Verifying...' : 'Verify Code'}}
              </button>
            </form>
            <div class="text-center mt-4">
              <button (click)="step.set(1); error.set('')" class="text-sm text-indigo-400 hover:text-indigo-300">Change email</button>
            </div>
          </div>

          <!-- Step 3: New Password -->
          <div *ngIf="step() === 3 && !success()" class="rounded-2xl p-8 border shadow-xl" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
            <form (ngSubmit)="resetPassword()" class="space-y-5">
              <div>
                <input type="password" [(ngModel)]="password" name="password" required placeholder="New password"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <div>
                <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required placeholder="Confirm new password"
                  class="w-full px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              </div>
              <p *ngIf="error()" class="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{{error()}}</p>
              <button type="submit" [disabled]="loading()"
                class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50">
                {{loading() ? 'Resetting...' : 'Reset Password'}}
              </button>
            </form>
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
export class ForgotPasswordComponent {
  step = signal(1);
  email = '';
  code = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  success = signal('');
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  sendCode() {
    this.error.set('');
    if (!this.email) {
      this.error.set('Please enter your email address');
      return;
    }
    this.loading.set(true);
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.step.set(2);
        } else {
          this.error.set(res.message || 'Failed to send verification code');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.message || 'Failed to send verification code. Please try again.');
      }
    });
  }

  verifyCode() {
    this.error.set('');
    if (!this.code || this.code.length < 6) {
      this.error.set('Please enter the 6-digit verification code');
      return;
    }
    this.loading.set(true);
    this.authService.verifyResetCode(this.email, this.code).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.step.set(3);
        } else {
          this.error.set(res.message || 'Invalid verification code');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.message || 'Invalid verification code. Please try again.');
      }
    });
  }

  resetPassword() {
    this.error.set('');
    if (!this.password || this.password.length < 8) {
      this.error.set('Password must be at least 8 characters');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
    this.loading.set(true);
    this.authService.resetPassword(this.email, this.code, this.password, this.confirmPassword).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set('Your password has been reset successfully.');
        } else {
          this.error.set(res.message || 'Failed to reset password');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.message || 'Failed to reset password. Please try again.');
      }
    });
  }
}
