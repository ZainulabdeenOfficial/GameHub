import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen" style="background-color: var(--bg-primary); color: var(--text-primary);">
      <header class="sticky top-0 z-50" style="border-bottom: 1px solid var(--border-color); background-color: var(--bg-secondary);">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="logo.png" alt="GameHub" class="h-8 w-8 rounded-lg">
            <span class="text-xl font-bold" style="color: #6366f1;">GameHub</span>
          </a>
          <a routerLink="/" style="color: var(--text-secondary);">Back to Store</a>
        </div>
      </header>
      <div class="max-w-4xl mx-auto px-4 py-20 text-center">
        <svg class="w-20 h-20 mx-auto mb-4" style="color: var(--text-muted);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
        <p class="text-xl mb-2">Shopping cart is no longer available</p>
        <p class="text-sm mb-6" style="color: var(--text-muted);">All games are now available for direct download.</p>
        <a routerLink="/" class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Browse Games</a>
      </div>
    </div>
  `
})
export class CartComponent {}
