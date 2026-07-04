import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help',
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
      <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-6">Help Center</h1>
        <div class="space-y-6">
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-2">How do I download a game?</h2>
            <p style="color: var(--text-secondary);">Navigate to the game's detail page and click the "Download Now" button. Your download will start immediately.</p>
          </div>
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-2">How do I find games?</h2>
            <p style="color: var(--text-secondary);">Browse our categories on the home page or use the search bar to find specific games.</p>
          </div>
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-2">Are the games free?</h2>
            <p style="color: var(--text-secondary);">GameHub offers both free and premium games. Free games can be downloaded without any payment.</p>
          </div>
          <div class="p-6 rounded-xl border" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <h2 class="text-xl font-semibold mb-2">How do I report a problem?</h2>
            <p style="color: var(--text-secondary);">Visit our <a routerLink="/contact" class="text-indigo-400">Contact Us</a> page and send us a message. Our support team will respond promptly.</p>
          </div>
        </div>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; {{currentYear}} GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class HelpComponent {
  currentYear = new Date().getFullYear();
}
