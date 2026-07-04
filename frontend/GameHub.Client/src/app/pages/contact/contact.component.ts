import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
      <div class="max-w-2xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
        <p class="mb-8" style="color: var(--text-secondary);">Have a question or issue? Send us a message and we'll get back to you.</p>
        
        <form (ngSubmit)="submitForm()" class="space-y-4">
          <div>
            <label class="text-sm block mb-1" style="color: var(--text-secondary);">Name *</label>
            <input type="text" [(ngModel)]="form.name" name="name" required class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-indigo-500" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'">
          </div>
          <div>
            <label class="text-sm block mb-1" style="color: var(--text-secondary);">Email *</label>
            <input type="email" [(ngModel)]="form.email" name="email" required class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-indigo-500" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'">
          </div>
          <div>
            <label class="text-sm block mb-1" style="color: var(--text-secondary);">Subject *</label>
            <input type="text" [(ngModel)]="form.subject" name="subject" required class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-indigo-500" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'">
          </div>
          <div>
            <label class="text-sm block mb-1" style="color: var(--text-secondary);">Message *</label>
            <textarea [(ngModel)]="form.message" name="message" rows="5" required class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-indigo-500" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'"></textarea>
          </div>
          <button type="submit" [disabled]="sending()" class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">{{sending() ? 'Sending...' : 'Send Message'}}</button>
          <p *ngIf="success()" class="text-green-400 text-sm">Message sent successfully! We'll get back to you soon.</p>
          <p *ngIf="error()" class="text-red-400 text-sm">{{error()}}</p>
        </form>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; {{currentYear}} GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  sending = signal(false);
  success = signal(false);
  error = signal('');
  currentYear = new Date().getFullYear();

  constructor(private gameService: GameService) {}

  submitForm() {
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) return;
    this.sending.set(true);
    this.success.set(false);
    this.error.set('');
    this.gameService.sendContactMessage(this.form).subscribe({
      next: () => { this.sending.set(false); this.success.set(true); this.form = { name: '', email: '', subject: '', message: '' }; },
      error: (err) => { this.sending.set(false); this.error.set(err.error?.message || 'Failed to send message'); }
    });
  }
}
