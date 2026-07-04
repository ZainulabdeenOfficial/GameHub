import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
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
        <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p class="mb-4" style="color: var(--text-secondary);">Last updated: July 2026</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p style="color: var(--text-secondary);">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This includes your name, email address, and payment information.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p style="color: var(--text-secondary);">We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">3. Data Security</h2>
          <p style="color: var(--text-secondary);">We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">4. Contact Us</h2>
          <p style="color: var(--text-secondary);">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@gamehub.com" class="text-indigo-400">privacy@gamehub.com</a>.</p>
        </section>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; 2026 GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class PrivacyPolicyComponent {}

@Component({
  selector: 'app-terms-of-service',
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
        <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
        <p class="mb-4" style="color: var(--text-secondary);">Last updated: July 2026</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p style="color: var(--text-secondary);">By accessing or using GameHub, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">2. User Accounts</h2>
          <p style="color: var(--text-secondary);">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">3. Purchases</h2>
          <p style="color: var(--text-secondary);">All purchases are final. Digital goods are delivered instantly upon purchase. Refunds are handled in accordance with our Refund Policy.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">4. Prohibited Conduct</h2>
          <p style="color: var(--text-secondary);">You agree not to engage in any activity that interferes with or disrupts our services, including transmitting malware, hacking, or violating any applicable laws.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">5. Contact</h2>
          <p style="color: var(--text-secondary);">For questions about these terms, contact us at <a href="mailto:legal@gamehub.com" class="text-indigo-400">legal@gamehub.com</a>.</p>
        </section>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; 2026 GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class TermsOfServiceComponent {}

@Component({
  selector: 'app-refund-policy',
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
        <h1 class="text-3xl font-bold mb-6">Refund Policy</h1>
        <p class="mb-4" style="color: var(--text-secondary);">Last updated: July 2026</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">1. Digital Goods</h2>
          <p style="color: var(--text-secondary);">Due to the digital nature of our products, all sales are final once the download has been initiated. We encourage you to review game requirements before purchasing.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">2. Technical Issues</h2>
          <p style="color: var(--text-secondary);">If you experience technical issues that prevent you from accessing a purchased game, please contact our support team within 14 days of purchase for assistance.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">3. Billing Errors</h2>
          <p style="color: var(--text-secondary);">If you believe you have been charged incorrectly, please contact us within 30 days of the transaction. We will investigate and correct any billing errors.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">4. Contact for Refunds</h2>
          <p style="color: var(--text-secondary);">To request a refund or report an issue, email <a href="mailto:support@gamehub.com" class="text-indigo-400">support@gamehub.com</a> with your order details.</p>
        </section>
      </div>
      <footer class="border-t py-8 text-center text-sm" style="border-color: var(--border-color); color: var(--text-muted);">
        <p>&copy; 2026 GameHub. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class RefundPolicyComponent {}
