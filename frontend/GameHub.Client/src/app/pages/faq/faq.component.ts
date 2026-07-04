import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
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
        <h1 class="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        <div class="space-y-4">
          <div *ngFor="let faq of faqs; let i = index" class="rounded-xl border overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border-color);">
            <button (click)="toggle(i)" class="w-full px-6 py-4 flex justify-between items-center text-left font-medium transition-colors hover:bg-black/5" [style.color]="'var(--text-primary)'">
              {{faq.question}}
              <svg class="w-5 h-5 transition-transform" [class.rotate-180]="openIndex() === i" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div *ngIf="openIndex() === i" class="px-6 pb-4 text-sm leading-relaxed" style="color: var(--text-secondary);">
              {{faq.answer}}
            </div>
          </div>
        </div>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; {{currentYear}} GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class FaqComponent {
  openIndex = signal<number | null>(null);
  currentYear = new Date().getFullYear();

  faqs = [
    { question: 'How do I create an account?', answer: 'Click the "Get Started" button on the home page and fill in your details. You\'ll be up and running in minutes.' },
    { question: 'How do I download a game?', answer: 'Navigate to any game\'s detail page and click the "Download Now" button. Your download will begin immediately.' },
    { question: 'Are there free games available?', answer: 'Yes! GameHub offers a wide selection of free games alongside premium titles.' },
    { question: 'Can I get a refund?', answer: 'Refunds are handled on a case-by-case basis. Please visit our Returns page for more details.' },
    { question: 'How do I reset my password?', answer: 'On the login page, click "Forgot Password" and follow the instructions sent to your email.' },
    { question: 'How do I contact support?', answer: 'Visit our Contact Us page and submit a message. Our team typically responds within 24 hours.' },
    { question: 'Can I upload my own game?', answer: 'GameHub currently supports developer submissions through our admin panel. Contact us for more information.' },
    { question: 'Is my payment information secure?', answer: 'Absolutely. We use industry-standard encryption and never store your payment details.' },
  ];

  toggle(index: number) {
    this.openIndex.update(v => v === index ? null : index);
  }
}
