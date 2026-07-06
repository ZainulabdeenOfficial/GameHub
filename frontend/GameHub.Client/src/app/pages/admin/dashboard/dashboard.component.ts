import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { DashboardData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-12">
        <div class="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
        <p class="text-gray-400 mt-3">Loading dashboard...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading() && !data()" class="text-center py-12">
        <svg class="w-12 h-12 mx-auto text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-gray-400">Failed to load dashboard data. Make sure you have the required permissions.</p>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="data()">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-5 text-white">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-green-200 text-sm">Total Games</p>
                <h3 class="text-2xl font-bold mt-1">{{data()?.totalGames || 0}}</h3>
              </div>
              <div class="p-3 bg-white/10 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-5 text-white">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-blue-200 text-sm">Total Downloads</p>
                <h3 class="text-2xl font-bold mt-1">{{data()?.totalDownloads || 0}}</h3>
              </div>
              <div class="p-3 bg-white/10 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg></div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-5 text-white">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-orange-200 text-sm">Total Reviews</p>
                <h3 class="text-2xl font-bold mt-1">{{data()?.totalReviews || 0}}</h3>
              </div>
              <div class="p-3 bg-white/10 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-purple-200 text-sm">Total Users</p>
                <h3 class="text-2xl font-bold mt-1">{{data()?.totalUsers || 0}}</h3>
                <p class="text-purple-200 text-xs mt-2">{{data()?.activeUsers || 0}} active this week</p>
              </div>
              <div class="p-3 bg-white/10 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 class="text-white font-semibold mb-4">Recent Stats</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Active Users</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.activeUsers || 0}}</p>
              </div>
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">New Users</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.newUsers || 0}}</p>
              </div>
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Reviews</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.totalReviews || 0}}</p>
              </div>
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Downloads</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.totalDownloads || 0}}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 class="text-white font-semibold mb-4">Platform Overview</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Total Games</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.totalGames || 0}}</p>
              </div>
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Active Users</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.activeUsers || 0}}</p>
              </div>
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Total Reviews</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.totalReviews || 0}}</p>
              </div>
              <div class="bg-gray-800/50 p-4 rounded-lg">
                <p class="text-gray-400 text-sm">Total Downloads</p>
                <p class="text-2xl font-bold text-white mt-1">{{data()?.totalDownloads || 0}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  data = signal<DashboardData | null>(null);
  isLoading = signal(true);

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getDashboard().subscribe({
      next: res => { this.data.set(res.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }
}
