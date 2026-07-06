import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GameService } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { GameListDto, GameStats, HeroBannerDto, BannerDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
            <div class="relative hidden md:block">
              <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search games..." class="w-64 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" [style.background-color]="'var(--bg-input)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              <svg class="absolute right-3 top-2.5 w-4 h-4" [style.color]="'var(--text-muted)'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <button (click)="themeService.toggle()" class="p-2 rounded-lg transition-colors" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-secondary)'" [style.border-color]="'var(--border-color)'" style="border-width: 1px;">
              <svg *ngIf="themeService.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg *ngIf="!themeService.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>
            <a *ngIf="authService.isAdmin()" routerLink="/admin" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">Admin Panel</a>
            <ng-container *ngIf="authService.isAuthenticated(); else guestBtns">
              <a [routerLink]="authService.isAdmin() ? '/admin' : '/'" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-600/10" style="color: #818cf8;">{{authService.user()?.fullName || 'Dashboard'}}</a>
              <button (click)="authService.logout()" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600/10 transition-colors" style="color: #f87171;">Logout</button>
            </ng-container>
            <ng-template #guestBtns>
              <a routerLink="/login" class="text-sm font-medium transition-colors" [style.color]="'var(--text-secondary)'" style="hover:color:var(--text-primary);">Sign In</a>
              <a routerLink="/register" class="px-4 py-2 bg-indigo-600 rounded-full text-sm font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">Get Started</a>
            </ng-template>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="relative overflow-hidden" [style.background-color]="'var(--bg-primary)'">
        <div class="absolute inset-0 opacity-30" style="background: radial-gradient(ellipse at top, rgba(99,102,241,0.3), transparent 70%);"></div>
        <!-- Hero Banners -->
        <div *ngIf="heroBanners().length > 0" class="relative">
          <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div class="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span *ngIf="heroBanners()[currentIndex()].badge" class="px-3 py-1 rounded-full text-xs font-medium" [style.background-color]="'var(--badge-bg)'" style="color: #818cf8;">{{heroBanners()[currentIndex()].badge}}</span>
                  <span class="text-sm" [style.color]="'var(--text-muted)'">{{currentIndex() + 1}} / {{heroBanners().length}}</span>
                </div>
                <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight" [style.color]="'var(--text-primary)'">{{heroBanners()[currentIndex()].title}}</h1>
                <p *ngIf="heroBanners()[currentIndex()].subtitle" class="text-lg" [style.color]="'var(--text-secondary)'">{{heroBanners()[currentIndex()].subtitle}}</p>
                <p *ngIf="heroBanners()[currentIndex()].description" class="text-sm mt-2" [style.color]="'var(--text-muted)'">{{heroBanners()[currentIndex()].description}}</p>
                <div class="flex gap-4 mt-8">
                  <ng-container *ngIf="heroBanners()[currentIndex()].primaryButtonUrl">
                    <a *ngIf="isExternalUrl(heroBanners()[currentIndex()].primaryButtonUrl!)" [href]="heroBanners()[currentIndex()].primaryButtonUrl" target="_blank" class="px-8 py-3 bg-indigo-600 rounded-full text-lg font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">{{heroBanners()[currentIndex()].primaryButtonText || 'View'}}</a>
                    <a *ngIf="!isExternalUrl(heroBanners()[currentIndex()].primaryButtonUrl!)" [routerLink]="heroBanners()[currentIndex()].primaryButtonUrl" class="px-8 py-3 bg-indigo-600 rounded-full text-lg font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">{{heroBanners()[currentIndex()].primaryButtonText || 'View'}}</a>
                  </ng-container>
                  <ng-container *ngIf="heroBanners()[currentIndex()].secondaryButtonUrl">
                    <a *ngIf="isExternalUrl(heroBanners()[currentIndex()].secondaryButtonUrl!)" [href]="heroBanners()[currentIndex()].secondaryButtonUrl" target="_blank" class="px-8 py-3 rounded-full text-lg font-medium transition-all border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'">{{heroBanners()[currentIndex()].secondaryButtonText || 'Learn More'}}</a>
                    <a *ngIf="!isExternalUrl(heroBanners()[currentIndex()].secondaryButtonUrl!)" [routerLink]="heroBanners()[currentIndex()].secondaryButtonUrl" class="px-8 py-3 rounded-full text-lg font-medium transition-all border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'">{{heroBanners()[currentIndex()].secondaryButtonText || 'Learn More'}}</a>
                  </ng-container>
                </div>
              </div>
              <div class="hidden md:block relative">
                <div class="rounded-2xl overflow-hidden border shadow-2xl" [style.border-color]="'var(--border-color)'">
                  <ng-container *ngIf="getYoutubeVideoId(heroBanners()[currentIndex()].youtubeUrl); else bannerImage">
                    <iframe [src]="getSafeYoutubeUrl(heroBanners()[currentIndex()].youtubeUrl)" class="w-full aspect-[4/3]" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </ng-container>
                  <ng-template #bannerImage>
                    <img [src]="heroBanners()[currentIndex()].imageUrl || 'logo.png'" [alt]="heroBanners()[currentIndex()].title" class="w-full aspect-[4/3] object-cover">
                  </ng-template>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <button *ngFor="let b of heroBanners(); let i = index" (click)="goToSlide(i)" class="h-2 rounded-full transition-all duration-300" [ngClass]="currentIndex() === i ? 'bg-indigo-500 w-8' : 'w-2 bg-gray-600 hover:bg-gray-500'"></button>
          </div>
          <button (click)="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all backdrop-blur-sm border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
          <button (click)="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all backdrop-blur-sm border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
        </div>

        <!-- Featured Games Carousel (fallback when no hero banners) -->
        <div *ngIf="heroBanners().length === 0 && carouselGames().length > 0" class="relative">
          <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div class="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="px-3 py-1 rounded-full text-xs font-medium" [style.background-color]="'var(--badge-bg)'" style="color: #818cf8;">FEATURED</span>
                  <span class="text-sm" [style.color]="'var(--text-muted)'">{{currentIndex() + 1}} / {{carouselGames().length}}</span>
                </div>
                <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight" [style.color]="'var(--text-primary)'">{{carouselGames()[currentIndex()].name}}</h1>
                <p class="text-lg" [style.color]="'var(--text-secondary)'">Rating: ★ {{carouselGames()[currentIndex()].averageRating.toFixed(1)}} | {{carouselGames()[currentIndex()].totalDownloads.toLocaleString()}} downloads</p>
                <div class="flex gap-4 mt-8">
                  <a [routerLink]="['/games', carouselGames()[currentIndex()].id]" class="px-8 py-3 bg-indigo-600 rounded-full text-lg font-medium text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">View Game</a>
                  <a routerLink="/games/{{carouselGames()[currentIndex()].id}}" class="px-8 py-3 rounded-full text-lg font-medium transition-all border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'">Learn More</a>
                </div>
              </div>
              <div class="hidden md:block relative">
                <div class="rounded-2xl overflow-hidden border shadow-2xl" [style.border-color]="'var(--border-color)'">
                  <div class="relative">
                    <img [src]="carouselGames()[currentIndex()].thumbnailUrl || 'logo.png'" [alt]="carouselGames()[currentIndex()].name" class="w-full aspect-[4/3] object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                      <div class="flex items-center justify-end">
                        <div class="flex items-center gap-1 text-yellow-400"><span>★</span><span class="text-white">{{carouselGames()[currentIndex()].averageRating.toFixed(1)}}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <button *ngFor="let g of carouselGames(); let i = index" (click)="goToSlide(i)" class="h-2 rounded-full transition-all duration-300" [ngClass]="currentIndex() === i ? 'bg-indigo-500 w-8' : 'w-2 bg-gray-600 hover:bg-gray-500'"></button>
          </div>
          <button (click)="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all backdrop-blur-sm border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
          <button (click)="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all backdrop-blur-sm border" [style.background-color]="'var(--bg-tertiary)'" [style.color]="'var(--text-primary)'" [style.border-color]="'var(--border-color)'"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
        </div>

      </section>

      <!-- Regular Banners Carousel (from /admin/banners) -->
      <section *ngIf="regularBanners().length > 0" class="relative max-w-7xl mx-auto px-4 py-8">
        <div class="relative rounded-2xl overflow-hidden border shadow-2xl" [style.border-color]="'var(--border-color)'" [style.background-color]="'var(--bg-card)'">
          <div class="relative">
            <ng-container *ngIf="getYoutubeVideoId(regularBanners()[bannerIndex()].youtubeUrl); else bannerRegularImg">
              <iframe [src]="getSafeYoutubeUrl(regularBanners()[bannerIndex()].youtubeUrl)" class="w-full aspect-[21/9]" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </ng-container>
            <ng-template #bannerRegularImg>
              <img [src]="regularBanners()[bannerIndex()].imageUrl || 'logo.png'" [alt]="regularBanners()[bannerIndex()].title" class="w-full aspect-[21/9] object-cover">
            </ng-template>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-12">
            <h2 class="text-2xl md:text-4xl font-bold text-white mb-2">{{regularBanners()[bannerIndex()].title}}</h2>
            <p *ngIf="regularBanners()[bannerIndex()].subtitle" class="text-lg text-gray-300 mb-4">{{regularBanners()[bannerIndex()].subtitle}}</p>
            <div class="flex gap-4">
              <ng-container *ngIf="regularBanners()[bannerIndex()].linkUrl">
                <a *ngIf="isExternalUrl(regularBanners()[bannerIndex()].linkUrl!)" [href]="regularBanners()[bannerIndex()].linkUrl" target="_blank" class="px-6 py-2.5 bg-indigo-600 rounded-full text-sm font-medium text-white hover:bg-indigo-700 transition-all">{{regularBanners()[bannerIndex()].buttonText || 'View'}}</a>
                <a *ngIf="!isExternalUrl(regularBanners()[bannerIndex()].linkUrl!)" [routerLink]="regularBanners()[bannerIndex()].linkUrl" class="px-6 py-2.5 bg-indigo-600 rounded-full text-sm font-medium text-white hover:bg-indigo-700 transition-all">{{regularBanners()[bannerIndex()].buttonText || 'View'}}</a>
              </ng-container>
            </div>
          </div>
          <div class="absolute bottom-4 right-4 z-20 flex gap-2">
            <button *ngFor="let b of regularBanners(); let i = index" (click)="bannerIndex.set(i)" class="h-2 rounded-full transition-all duration-300" [ngClass]="bannerIndex() === i ? 'bg-indigo-500 w-8' : 'w-2 bg-gray-500 hover:bg-gray-400'"></button>
          </div>
          <button (click)="prevRegularBanner()" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
          <button (click)="nextRegularBanner()" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
        </div>
      </section>

      <!-- Stats Bar -->
      <div class="relative -mt-8 z-10 max-w-7xl mx-auto px-4 mb-8">
        <div class="grid grid-cols-3 gap-4">
          <div class="rounded-xl p-4 text-center backdrop-blur-sm border shadow-lg" style="background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.2);">
            <p class="text-2xl font-bold" style="color: #818cf8;">{{stats()?.totalGames || 0}}</p>
            <p class="text-xs" [style.color]="'var(--text-muted)'">Games</p>
          </div>
          <div class="rounded-xl p-4 text-center backdrop-blur-sm border shadow-lg" style="background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.2);">
            <p class="text-2xl font-bold" style="color: #22c55e;">{{stats()?.totalDownloads || 0}}</p>
            <p class="text-xs" [style.color]="'var(--text-muted)'">Downloads</p>
          </div>
          <div class="rounded-xl p-4 text-center backdrop-blur-sm border shadow-lg" style="background: rgba(234,179,8,0.1); border-color: rgba(234,179,8,0.2);">
            <p class="text-2xl font-bold" style="color: #eab308;">{{stats()?.totalReviews || 0}}</p>
            <p class="text-xs" [style.color]="'var(--text-muted)'">Reviews</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button *ngFor="let tab of tabs" (click)="selectTab(tab.key)" class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all" [ngClass]="activeTab() === tab.key ? 'text-white' : ''" [style.background-color]="activeTab() === tab.key ? '#6366f1' : 'var(--bg-tertiary)'" [style.color]="activeTab() !== tab.key ? 'var(--text-secondary)' : ''">{{tab.label}}</button>
        </div>
      </div>

      <!-- Games Section -->
      <section class="max-w-7xl mx-auto px-4 py-6" id="games">
        <!-- Search Results -->
        <div *ngIf="searchTerm && searchResults().length > 0" class="mb-8">
          <h2 class="text-2xl font-bold mb-6" [style.color]="'var(--text-primary)'">Results for "{{searchTerm}}"</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            <a *ngFor="let game of searchResults()" [routerLink]="['/games', game.id]" class="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              <div class="aspect-[3/4] overflow-hidden relative" [style.background-color]="'var(--bg-tertiary)'">
                <img *ngIf="game.thumbnailUrl" [src]="game.thumbnailUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div *ngIf="!game.thumbnailUrl" class="w-full h-full flex items-center justify-center" [style.color]="'var(--text-muted)'"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              </div>
              <div class="p-3"><p class="text-sm font-medium truncate" [style.color]="'var(--text-primary)'">{{game.name}}</p><div class="flex items-center justify-between mt-1"><div class="flex items-center gap-1 text-xs" [style.color]="'var(--text-muted)'"><span class="text-yellow-400">★</span><span>{{game.averageRating.toFixed(1)}}</span></div></div></div>
            </a>
          </div>
        </div>

        <!-- Search Empty -->
        <div *ngIf="searchTerm && searchResults().length === 0 && !isSearching()" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto mb-4" [style.color]="'var(--text-muted)'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <p class="text-lg font-medium" [style.color]="'var(--text-primary)'">No games found for "{{searchTerm}}"</p>
          <p class="text-sm mt-1" [style.color]="'var(--text-muted)'">Try adjusting your search terms</p>
        </div>

        <!-- Loading Skeleton -->
        <div *ngIf="isLoading()">
          <div *ngFor="let section of [1,2,3]" class="mb-10">
            <div class="h-8 w-48 rounded-lg mb-6 animate-pulse" [style.background-color]="'var(--bg-tertiary)'"></div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              <div *ngFor="let i of [1,2,3,4,5,6]" class="rounded-xl border overflow-hidden animate-pulse" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
                <div class="aspect-[3/4]" [style.background-color]="'var(--bg-tertiary)'"></div>
                <div class="p-3 space-y-2"><div class="h-4 w-full rounded" [style.background-color]="'var(--bg-tertiary)'"></div><div class="h-4 w-2/3 rounded" [style.background-color]="'var(--bg-tertiary)'"></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div *ngIf="!searchTerm || searchResults().length === 0">
          <ng-container *ngIf="!isLoading()">
            <div *ngIf="activeTab() === 'all' || activeTab() === 'featured'">
              <div *ngIf="featured().length > 0" class="mb-10">
                <h2 class="text-2xl font-bold mb-6" [style.color]="'var(--text-primary)'">Featured Games</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  <a *ngFor="let game of featured()" [routerLink]="['/games', game.id]" class="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
                    <div class="aspect-[3/4] overflow-hidden relative" [style.background-color]="'var(--bg-tertiary)'">
                      <img *ngIf="game.thumbnailUrl" [src]="game.thumbnailUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div *ngIf="!game.thumbnailUrl" class="w-full h-full flex items-center justify-center" [style.color]="'var(--text-muted)'"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"><span class="w-full py-2.5 bg-indigo-600 rounded-lg text-sm font-medium text-center text-white shadow-lg">View Details</span></div>
                    </div>
                    <div class="p-3"><p class="text-sm font-medium truncate" [style.color]="'var(--text-primary)'">{{game.name}}</p><div class="flex items-center justify-between mt-1"><div class="flex items-center gap-1 text-xs" [style.color]="'var(--text-muted)'"><span class="text-yellow-400">★</span><span>{{game.averageRating.toFixed(1)}}</span></div></div></div>
                  </a>
                </div>
              </div>
            </div>

            <div *ngIf="activeTab() === 'all' || activeTab() === 'trending'">
              <div *ngIf="trending().length > 0" class="mb-10">
                <h2 class="text-2xl font-bold mb-6" [style.color]="'var(--text-primary)'">Trending Now <span class="px-2 py-0.5 rounded-full text-xs font-medium align-middle ml-2" style="background: rgba(239,68,68,0.2); color: #f87171;">HOT</span></h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  <a *ngFor="let game of trending()" [routerLink]="['/games', game.id]" class="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
                    <div class="aspect-[3/4] overflow-hidden relative" [style.background-color]="'var(--bg-tertiary)'">
                      <img *ngIf="game.thumbnailUrl" [src]="game.thumbnailUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div *ngIf="!game.thumbnailUrl" class="w-full h-full flex items-center justify-center" [style.color]="'var(--text-muted)'"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                      <div class="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg" style="background: linear-gradient(135deg, #ef4444, #dc2626);">TRENDING</div>
                    </div>
                    <div class="p-3"><p class="text-sm font-medium truncate" [style.color]="'var(--text-primary)'">{{game.name}}</p><div class="flex items-center justify-between mt-1"><div class="flex items-center gap-1 text-xs" [style.color]="'var(--text-muted)'"><span class="text-yellow-400">★</span><span>{{game.averageRating.toFixed(1)}}</span></div></div></div>
                  </a>
                </div>
              </div>
            </div>

            <div *ngIf="activeTab() === 'all' || activeTab() === 'latest'">
              <div *ngIf="latest().length > 0" class="mb-10">
                <h2 class="text-2xl font-bold mb-6" [style.color]="'var(--text-primary)'">Latest Releases</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  <a *ngFor="let game of latest()" [routerLink]="['/games', game.id]" class="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
                    <div class="aspect-[3/4] overflow-hidden relative" [style.background-color]="'var(--bg-tertiary)'">
                      <img *ngIf="game.thumbnailUrl" [src]="game.thumbnailUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div *ngIf="!game.thumbnailUrl" class="w-full h-full flex items-center justify-center" [style.color]="'var(--text-muted)'"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                      <div class="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">NEW</div>
                    </div>
                    <div class="p-3"><p class="text-sm font-medium truncate" [style.color]="'var(--text-primary)'">{{game.name}}</p><div class="flex items-center justify-between mt-1"><div class="flex items-center gap-1 text-xs" [style.color]="'var(--text-muted)'"><span class="text-yellow-400">★</span><span>{{game.averageRating.toFixed(1)}}</span></div></div></div>
                  </a>
                </div>
              </div>
            </div>

            <!-- Category Games -->
            <div *ngIf="activeTab() !== 'trending' && activeTab() !== 'latest' && activeTab() !== 'all' && activeTab() !== 'featured'">
              <div *ngIf="categoryGames().length > 0" class="mb-10">
                <h2 class="text-2xl font-bold mb-6" [style.color]="'var(--text-primary)'">{{getTabLabel()}}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  <a *ngFor="let game of categoryGames()" [routerLink]="['/games', game.id]" class="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
                    <div class="aspect-[3/4] overflow-hidden relative" [style.background-color]="'var(--bg-tertiary)'">
                      <img *ngIf="game.thumbnailUrl" [src]="game.thumbnailUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      <div *ngIf="!game.thumbnailUrl" class="w-full h-full flex items-center justify-center" [style.color]="'var(--text-muted)'"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                    </div>
                    <div class="p-3"><p class="text-sm font-medium truncate" [style.color]="'var(--text-primary)'">{{game.name}}</p><div class="flex items-center justify-between mt-1"><div class="flex items-center gap-1 text-xs" [style.color]="'var(--text-muted)'"><span class="text-yellow-400">★</span><span>{{game.averageRating.toFixed(1)}}</span></div></div></div>
                  </a>
                </div>
              </div>
              <div *ngIf="categoryGames().length === 0" class="text-center py-16">
                <svg class="w-16 h-16 mx-auto mb-4" [style.color]="'var(--text-muted)'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                <p class="text-lg font-medium" [style.color]="'var(--text-primary)'">No games in this category yet</p>
                <p class="text-sm mt-1" [style.color]="'var(--text-muted)'">Check back later for new releases</p>
              </div>
            </div>
          </ng-container>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="py-16" id="categories" style="background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08));">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h2 class="text-2xl font-bold mb-4" [style.color]="'var(--text-primary)'">Browse by Category</h2>
          <p class="mb-8" [style.color]="'var(--text-secondary)'">Find the perfect game from our curated categories</p>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a *ngFor="let cat of categories()" (click)="filterByCategory(cat)" class="group rounded-xl p-6 border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg" [style.background-color]="'var(--bg-card)'" [style.border-color]="'var(--border-color)'">
              <div *ngIf="cat.imageUrl" class="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-3"><img [src]="cat.imageUrl" class="w-full h-full object-cover"></div>
              <div *ngIf="!cat.imageUrl" class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));"><svg class="w-6 h-6" style="color: #818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              <p class="text-sm font-medium" [style.color]="'var(--text-primary)'">{{cat.name}}</p>
            </a>
          </div>
        </div>
      </section>

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
export class HomeComponent implements OnInit {
  featured = signal<GameListDto[]>([]);
  trending = signal<GameListDto[]>([]);
  latest = signal<GameListDto[]>([]);

  carouselGames = signal<GameListDto[]>([]);
  categories = signal<any[]>([]);
  stats = signal<GameStats | null>(null);
  searchResults = signal<GameListDto[]>([]);
  categoryGames = signal<GameListDto[]>([]);
  searchTerm = '';
  currentIndex = signal(0);
  activeTab = signal('all');
  isLoading = signal(true);
  isSearching = signal(false);
  currentYear = new Date().getFullYear();
  private autoSlideInterval: any;

  tabs: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'trending', label: 'Trending' },
    { key: 'latest', label: 'Latest' },

  ];

  heroBanners = signal<HeroBannerDto[]>([]);
  regularBanners = signal<BannerDto[]>([]);
  bannerIndex = signal(0);

  private youtubeCache = new Map<string, SafeResourceUrl>();

  constructor(
    private gameService: GameService,
    public authService: AuthService,
    public themeService: ThemeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.gameService.getPublishedHeroBanners().subscribe(res => {
      const banners = res.data || [];
      this.heroBanners.set(banners);
      if (banners.length > 0) {
        this.carouselGames.set(this.featured());
      }
      this.checkLoading();
    });
    this.gameService.getActiveBanners().subscribe(res => {
      const banners = res.data || [];
      this.regularBanners.set(banners.filter(b => b.isActive));
      this.checkLoading();
    });
    this.gameService.getFeatured().subscribe(res => {
      const games = res.data || [];
      this.featured.set(games);
      if (this.heroBanners().length === 0) {
        this.carouselGames.set(games.filter(g => g.thumbnailUrl || g.averageRating > 0).slice(0, 8));
      }
      this.checkLoading();
    });
    this.gameService.getTrending().subscribe(res => {
      this.trending.set(res.data || []);
      this.checkLoading();
    });
    this.gameService.getLatest(12).subscribe(res => {
      this.latest.set(res.data || []);
      this.checkLoading();
    });
    this.gameService.getCategories().subscribe(res => {
      this.categories.set(res.data || []);
      for (const cat of (res.data || [])) {
        if (!this.tabs.find(t => t.key === cat.id)) {
          this.tabs.push({ key: cat.id, label: cat.name });
        }
      }
      this.checkLoading();
    });
    this.gameService.getStats().subscribe({
      next: res => { this.stats.set(res.data); this.checkLoading(); },
      error: () => this.checkLoading()
    });
    this.startAutoSlide();
  }

  private loadedCount = 0;
  private readonly totalCalls = 7;

  private checkLoading() {
    this.loadedCount++;
    if (this.loadedCount >= this.totalCalls) {
      this.isLoading.set(false);
    }
  }

  private startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      if (this.carouselGames().length > 1) {
        this.currentIndex.update(i => (i + 1) % this.carouselGames().length);
      }
    }, 5000);
  }

  prevSlide() {
    this.currentIndex.update(i => i === 0 ? this.carouselGames().length - 1 : i - 1);
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  nextSlide() {
    this.currentIndex.update(i => (i + 1) % this.carouselGames().length);
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  onSearch() {
    if (this.searchTerm.length > 1) {
      this.isSearching.set(true);
      this.gameService.search(this.searchTerm).subscribe(res => {
        this.searchResults.set(res.data || []);
        this.isSearching.set(false);
      });
    } else {
      this.searchResults.set([]);
      this.isSearching.set(false);
    }
  }

  selectTab(key: string) {
    this.activeTab.set(key);
    this.searchTerm = '';
    this.searchResults.set([]);
    if (key !== 'all' && key !== 'trending' && key !== 'latest' && key !== 'featured') {
      const cat = this.categories().find(c => c.id === key);
      if (cat) this.filterByCategory(cat);
    }
  }

  filterByCategory(cat: any) {
    this.activeTab.set(cat.id);
    this.searchTerm = '';
    this.searchResults.set([]);
    this.isLoading.set(true);
    this.gameService.getAll({ categoryId: cat.id, pageSize: 50 }).subscribe({
      next: res => { this.categoryGames.set(res.data?.data || []); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  prevRegularBanner() {
    this.bannerIndex.update(i => i === 0 ? this.regularBanners().length - 1 : i - 1);
  }

  nextRegularBanner() {
    this.bannerIndex.update(i => (i + 1) % this.regularBanners().length);
  }

  getTabLabel(): string {
    const tab = this.tabs.find(t => t.key === this.activeTab());
    return tab ? tab.label : '';
  }

  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:');
  }

  getYoutubeVideoId(url: string | null): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  getSafeYoutubeUrl(url: string | null): SafeResourceUrl | null {
    const id = this.getYoutubeVideoId(url);
    if (!id) return null;
    const cached = this.youtubeCache.get(id);
    if (cached) return cached;
    const safe = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`
    );
    this.youtubeCache.set(id, safe);
    return safe;
  }
}
