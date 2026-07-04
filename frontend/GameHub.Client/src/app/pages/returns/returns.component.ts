import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen" style="background-color: var(--bg-primary); color: var(--text-primary);">
      <header class="sticky top-0 z-50" style="border-bottom: 1px solid var(--border-color); background-color: var(--bg-secondary);">
        <div class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="logo.png" alt="GameHub" class="h-8 w-8 rounded-lg">
            <span class="text-xl font-bold" style="color: #6366f1;">GameHub</span>
          </a>
          <a routerLink="/" style="color: var(--text-secondary);">Back to Home</a>
        </div>
      </header>
      <div class="max-w-3xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-6">Returns & Refund Policy</h1>
        <div class="prose prose-sm max-w-none space-y-6" style="color: var(--text-secondary);">
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">30-Day Return Window</h2>
            <p>If you are not satisfied with your purchase, you may request a return within 30 days of the original purchase date.</p>
          </div>
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">Eligibility</h2>
            <p>To be eligible for a return, the game must not have been downloaded or installed. Digital products that have been accessed are not eligible for a refund.</p>
          </div>
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">How to Request a Return</h2>
            <p>Visit our <a routerLink="/contact" class="text-indigo-400">Contact Us</a> page and submit a return request with your order details. Our support team will review your request within 2-3 business days.</p>
          </div>
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-3" style="color: var(--text-primary);">Refund Processing</h2>
            <p>Once your return is approved, the refund will be processed to your original payment method within 5-10 business days.</p>
          </div>
        </div>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; {{currentYear}} GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class ReturnsComponent {
  currentYear = new Date().getFullYear();
}
