import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Game, ReviewDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen" style="background-color: var(--bg-primary); color: var(--text-primary);">
      <header class="sticky top-0 z-50" [style.border-color]="'var(--border-color)'" [style.background-color]="'var(--bg-secondary)'">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a routerLink="/" class="text-2xl font-bold" style="color: #6366f1;">GameHub</a>
          <div class="flex items-center gap-4">
            <button (click)="themeService.toggle()" class="p-2 rounded-lg" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-secondary)'">
              <svg *ngIf="themeService.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg *ngIf="!themeService.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>
            <a routerLink="/" class="text-sm font-medium transition-colors" style="color: var(--text-secondary);">Back to Store</a>
            <ng-container *ngIf="authService.isAuthenticated(); else guestBtns">
              <a routerLink="/admin" style="color: #818cf8;">{{authService.user()?.fullName || 'Dashboard'}}</a>
              <button (click)="authService.logout()" style="color: #f87171;">Logout</button>
            </ng-container>
            <ng-template #guestBtns>
              <a routerLink="/login" style="color: var(--text-secondary);">Sign In</a>
              <a routerLink="/register" class="px-4 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all text-white">Get Started</a>
            </ng-template>
          </div>
        </div>
      </header>

      <div *ngIf="loading()" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <div *ngIf="error()" class="max-w-7xl mx-auto px-4 py-20 text-center">
        <p class="text-red-400 text-xl">{{error()}}</p>
        <a routerLink="/" class="inline-block mt-4 text-indigo-400 hover:text-indigo-300">Back to Home</a>
      </div>

      <div *ngIf="game() && !loading()" class="animate-fade-in">
        <div class="relative h-72 md:h-96 overflow-hidden" [style.background]="'linear-gradient(135deg, rgba(79,70,229,0.4), rgba(139,92,246,0.4))'">
          <img *ngIf="game()!.bannerUrl" [src]="game()!.bannerUrl" class="w-full h-full object-cover opacity-40">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-8">
            <div class="flex items-end gap-6">
              <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl border flex-shrink-0" [style.background-color]="'var(--bg-tertiary)'" [style.border-color]="'var(--border-color)'">
                <img *ngIf="game()!.thumbnailUrl" [src]="game()!.thumbnailUrl" class="w-full h-full object-cover">
                <div *ngIf="!game()!.thumbnailUrl" class="w-full h-full flex items-center justify-center" style="color: var(--text-muted);"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              </div>
              <div>
                <h1 class="text-3xl md:text-5xl font-bold text-white">{{game()!.name}}</h1>
                <p class="text-gray-400 mt-2 text-lg">{{game()!.shortDescription}}</p>
                <div class="flex items-center gap-4 mt-3">
                  <div class="flex items-center gap-1"><span class="text-yellow-400">★</span><span class="font-medium text-white">{{game()!.averageRating.toFixed(1)}}</span><span class="text-gray-500 text-sm">({{game()!.totalReviews}} reviews)</span></div>
                  <span class="text-gray-600">|</span>
                  <span class="text-gray-400">{{platformLabel(game()!.platform)}}</span>
                  <span class="text-gray-600">|</span>
                  <span class="text-gray-400">{{game()!.gameSize}} GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="rounded-2xl border p-6 animate-slide-up" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              <h2 class="text-xl font-semibold mb-4" style="color: var(--text-primary);">About This Game</h2>
              <p class="leading-relaxed whitespace-pre-line" style="color: var(--text-secondary);">{{game()!.description}}</p>
              <div *ngIf="game()!.genres" class="flex gap-2 flex-wrap mt-4">
                <span *ngFor="let genre of game()!.genres.split(',')" class="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-sm">{{genre.trim()}}</span>
              </div>
            </div>

            <div class="rounded-2xl border p-6 animate-slide-up" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              <h2 class="text-xl font-semibold mb-4" style="color: var(--text-primary);">Game Details</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Category</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.categoryName || 'N/A'}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Platform</p><p class="font-medium" style="color: var(--text-primary);">{{platformLabel(game()!.platform)}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Rating</p><p class="font-medium" style="color: var(--text-primary);">★ {{game()!.averageRating.toFixed(1)}} / 5</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Downloads</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.totalDownloads.toLocaleString()}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Developer</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.developerName || 'N/A'}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Publisher</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.publisherName || 'N/A'}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Release Date</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.releaseDate | date:'mediumDate'}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Size</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.gameSize}} GB</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Version</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.version}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Age Rating</p><p class="font-medium" style="color: var(--text-primary);">{{ageRatingLabel(game()!.ageRating)}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Languages</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.languages}}</p></div>
                <div class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'"><p class="text-xs uppercase tracking-wider mb-1" style="color: var(--text-muted);">Reviews</p><p class="font-medium" style="color: var(--text-primary);">{{game()!.totalReviews}}</p></div>
              </div>
            </div>

            <div *ngIf="game()!.minimumRequirements || game()!.recommendedRequirements" class="rounded-2xl border p-6" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              <h2 class="text-xl font-semibold mb-4" style="color: var(--text-primary);">System Requirements</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div *ngIf="game()!.minimumRequirements" class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'">
                  <h3 class="font-medium text-sm mb-2" style="color: var(--text-muted);">MINIMUM</h3>
                  <pre class="text-sm whitespace-pre-wrap font-sans" style="color: var(--text-secondary);">{{game()!.minimumRequirements}}</pre>
                </div>
                <div *ngIf="game()!.recommendedRequirements" class="p-4 rounded-xl" [style.background-color]="'var(--bg-secondary)'">
                  <h3 class="font-medium text-sm mb-2" style="color: var(--text-muted);">RECOMMENDED</h3>
                  <pre class="text-sm whitespace-pre-wrap font-sans" style="color: var(--text-secondary);">{{game()!.recommendedRequirements}}</pre>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border p-6" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              <h2 class="text-xl font-semibold mb-4" style="color: var(--text-primary);">Screenshots</h2>
              <div *ngIf="game()!.screenshots && game()!.screenshots.length > 0; else noScreenshots" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div *ngFor="let ss of game()!.screenshots" class="aspect-video rounded-xl overflow-hidden" [style.background-color]="'var(--bg-tertiary)'">
                  <img *ngIf="ss.url" [src]="ss.url" class="w-full h-full object-cover">
                </div>
              </div>
              <ng-template #noScreenshots><p class="text-sm" style="color: var(--text-muted);">No screenshots available</p></ng-template>
            </div>

            <div class="rounded-2xl border p-6" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'" id="reviews">
              <h2 class="text-xl font-semibold mb-4" style="color: var(--text-primary);">Reviews & Ratings</h2>

              <div *ngIf="authService.isAuthenticated() && !userReviewed()" class="rounded-xl p-5 mb-6" [style.background-color]="'var(--bg-secondary)'">
                <h3 class="font-medium mb-3" style="color: var(--text-primary);">Write a Review</h3>
                <div class="flex items-center gap-1 mb-3">
                  <span *ngFor="let star of [1,2,3,4,5]" (click)="newRating = star" class="cursor-pointer text-2xl transition-all hover:scale-110" [class.text-yellow-400]="star <= newRating" [class.text-gray-600]="star > newRating">★</span>
                  <span class="text-sm ml-2" style="color: var(--text-muted);">{{newRating > 0 ? newRating + ' / 5' : 'Click to rate'}}</span>
                </div>
                <textarea [(ngModel)]="newComment" rows="3" placeholder="Share your thoughts about this game..." class="w-full px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;"></textarea>
                <button (click)="submitReview()" [disabled]="submittingReview() || newRating === 0 || !newComment.trim()" class="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 text-sm font-medium text-white">{{submittingReview() ? 'Submitting...' : 'Submit Review'}}</button>
                <p *ngIf="reviewError()" class="text-red-400 text-sm mt-2">{{reviewError()}}</p>
                <p *ngIf="reviewSuccess()" class="text-green-400 text-sm mt-2">Review submitted successfully!</p>
              </div>

              <div *ngIf="!authService.isAuthenticated()" class="rounded-xl p-5 mb-6 text-center" [style.background-color]="'var(--bg-secondary)'">
                <p style="color: var(--text-secondary);"><a routerLink="/login" class="text-indigo-400 hover:text-indigo-300">Sign in</a> to write a review</p>
              </div>

              <div *ngIf="reviews().length === 0" class="text-center py-8"><p style="color: var(--text-muted);">No reviews yet. Be the first to review!</p></div>

              <div *ngFor="let review of reviews()" class="border-b last:border-0 py-4 animate-slide-in-right" [style.border-color]="'var(--border-color)'">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">{{review.userName.charAt(0).toUpperCase()}}</div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-sm" style="color: var(--text-primary);">{{review.userName}}</span>
                      <span class="text-xs" style="color: var(--text-muted);">{{review.createdAt | date:'mediumDate'}}</span>
                    </div>
                    <div class="flex items-center gap-0.5 my-1">
                      <span *ngFor="let s of [1,2,3,4,5]" class="text-sm" [class.text-yellow-400]="s <= review.rating" [class.text-gray-600]="s > review.rating">★</span>
                    </div>
                    <p class="text-sm" style="color: var(--text-secondary);">{{review.comment}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="rounded-2xl border p-6 sticky top-24" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              
              <button (click)="downloadGame()" class="w-full mt-6 py-3 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Download Now
              </button>

              <div *ngIf="game()!.steamLink || game()!.epicLink" class="mt-6 pt-6 border-t" [style.border-color]="'var(--border-color)'">
                <p class="text-xs uppercase tracking-wider mb-3" style="color: var(--text-muted);">Also available on</p>
                <div class="flex gap-2">
                  <a *ngIf="game()!.steamLink" [href]="game()!.steamLink" target="_blank" class="flex-1 px-3 py-2 rounded-lg text-center text-sm transition-all" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-secondary)'">Steam</a>
                  <a *ngIf="game()!.epicLink" [href]="game()!.epicLink" target="_blank" class="flex-1 px-3 py-2 rounded-lg text-center text-sm transition-all" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-secondary)'">Epic</a>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t space-y-3 text-sm" [style.border-color]="'var(--border-color)'" style="color: var(--text-secondary);">
                <p class="flex items-center gap-2"><svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Instant download</p>
                <p class="flex items-center gap-2"><svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> 24/7 support</p>
                <p class="flex items-center gap-2"><svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> {{game()!.totalDownloads.toLocaleString()}} downloads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GameDetailComponent implements OnInit {
  game = signal<Game | null>(null);
  reviews = signal<ReviewDto[]>([]);
  loading = signal(true);
  error = signal('');
  newRating = 0;
  newComment = '';
  submittingReview = signal(false);
  reviewError = signal('');
  reviewSuccess = signal(false);

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    public authService: AuthService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set('Game not found'); this.loading.set(false); return; }
    this.gameService.getById(id).subscribe({
      next: res => { this.game.set(res.data); this.loading.set(false); this.loadReviews(); },
      error: () => { this.error.set('Failed to load game details'); this.loading.set(false); }
    });
  }

  loadReviews() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.gameService.getGameReviews(id).subscribe(res => this.reviews.set(res.data || []));
  }

  userReviewed(): boolean {
    const userId = this.authService.user()?.userId;
    if (!userId || !this.reviews().length) return false;
    return this.reviews().some(r => r.userId === userId);
  }

  submitReview() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || this.newRating === 0 || !this.newComment.trim()) return;
    this.submittingReview.set(true);
    this.reviewError.set('');
    this.reviewSuccess.set(false);
    this.gameService.createReview({ gameId: id, rating: this.newRating, comment: this.newComment.trim() }).subscribe({
      next: () => {
        this.submittingReview.set(false);
        this.reviewSuccess.set(true);
        this.newComment = '';
        this.newRating = 0;
        this.loadReviews();
        this.gameService.getById(id).subscribe(res => this.game.set(res.data));
      },
      error: (err) => {
        this.submittingReview.set(false);
        this.reviewError.set(err.error?.message || 'Failed to submit review');
      }
    });
  }

  downloadGame() {
    const g = this.game();
    if (!g) return;
    this.gameService.downloadGame(g.id).subscribe(res => {
      const url = res.data || g.downloadLink || g.steamLink || '#';
      window.open(url, '_blank');
      g.totalDownloads++;
    });
  }

  platformLabel(p: number): string {
    return ['Windows', 'macOS', 'Linux', 'PlayStation', 'Xbox', 'Nintendo', 'Android', 'iOS', 'Web'][p] || 'Unknown';
  }

  ageRatingLabel(r: number): string {
    return ['E (Everyone)', 'E10+', 'T (Teen)', 'M (Mature)', 'Adults Only', 'Rating Pending', 'PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18'][r] || 'Unknown';
  }
}
