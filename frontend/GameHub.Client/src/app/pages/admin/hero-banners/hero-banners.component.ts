import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../core/services/game.service';
import { HeroBannerDto, GameListDto } from '../../../core/models/auth.model';

@Component({
  selector: 'app-hero-banners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white">Hero Banner Management</h2>
          <p class="text-gray-400 text-sm mt-1">Create and manage full-screen hero banners for the homepage</p>
        </div>
        <button (click)="startCreate()" class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          New Hero Banner
        </button>
      </div>

      <!-- Banner List -->
      <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-4 w-12">#</th>
                <th class="text-left py-3 px-4">Preview</th>
                <th class="text-left py-3 px-4">Title</th>
                <th class="text-left py-3 px-4">Badge</th>
                <th class="text-left py-3 px-4">Order</th>
                <th class="text-left py-3 px-4">Status</th>
                <th class="text-left py-3 px-4">Featured</th>
                <th class="text-left py-3 px-4">Scheduled</th>
                <th class="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of banners(); let i = index" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-3 px-4">
                  <div class="flex flex-col gap-0.5">
                    <button (click)="moveUp(i)" [disabled]="i === 0" class="text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg></button>
                    <button (click)="moveDown(i)" [disabled]="i === banners().length - 1" class="text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="w-24 h-14 rounded-lg overflow-hidden bg-gray-800">
                    <img *ngIf="b.imageUrl" [src]="b.imageUrl" class="w-full h-full object-cover">
                  </div>
                </td>
                <td class="py-3 px-4">
                  <p class="text-white font-medium">{{b.title}}</p>
                  <p class="text-gray-500 text-xs truncate max-w-[200px]">{{b.subtitle || 'No subtitle'}}</p>
                </td>
                <td class="py-3 px-4">
                  <span *ngIf="b.badge" class="px-2 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="{'bg-indigo-900/40 text-indigo-400': b.badge === 'NEW', 'bg-red-900/40 text-red-400': b.badge === 'HOT', 'bg-green-900/40 text-green-400': b.badge === 'SALE', 'bg-yellow-900/40 text-yellow-400': b.badge === 'FEATURED'}">
                    {{b.badge}}
                  </span>
                  <span *ngIf="!b.badge" class="text-gray-600">—</span>
                </td>
                <td class="py-3 px-4 text-gray-400">{{b.sortOrder}}</td>
                <td class="py-3 px-4">
                  <button (click)="togglePublish(b)" class="px-2 py-1 rounded-full text-xs font-medium transition-all" [ngClass]="b.isPublished ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'">
                    {{b.isPublished ? 'Published' : 'Draft'}}
                  </button>
                </td>
                <td class="py-3 px-4">
                  <button (click)="toggleFeatured(b)" class="px-2 py-1 rounded-full text-xs font-medium transition-all" [ngClass]="b.isFeatured ? 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-900/70' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'">
                    {{b.isFeatured ? 'Featured' : 'Regular'}}
                  </button>
                </td>
                <td class="py-3 px-4">
                  <span *ngIf="b.publishStartDate || b.publishEndDate" class="text-xs text-gray-400">
                    <span *ngIf="b.publishStartDate">{{b.publishStartDate | date:'shortDate'}}</span>
                    <span *ngIf="b.publishEndDate"> → {{b.publishEndDate | date:'shortDate'}}</span>
                  </span>
                  <span *ngIf="!b.publishStartDate && !b.publishEndDate" class="text-gray-600">Always</span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex gap-1.5">
                    <button (click)="editBanner(b)" class="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button (click)="duplicateBanner(b.id)" class="p-1.5 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40 transition-all" title="Duplicate"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
                    <button (click)="archiveBanner(b.id)" class="p-1.5 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/40 transition-all" title="Archive"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg></button>
                    <button (click)="deleteBanner(b.id)" class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all" title="Delete"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="banners().length === 0">
                <td colspan="9" class="text-center py-16 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p class="text-lg font-medium">No hero banners yet</p>
                  <p class="text-sm mt-1">Create your first banner to get started</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Editor Modal -->
      <div *ngIf="showEditor()" class="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto" [style.background-color]="'rgba(0,0,0,0.8)'">
        <div class="w-full max-w-7xl bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <!-- Editor Header -->
          <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
            <h3 class="text-xl font-bold text-white">{{editingId() ? 'Edit Hero Banner' : 'Create Hero Banner'}}</h3>
            <div class="flex gap-2">
              <button (click)="showPreview.set(!showPreview())" class="px-4 py-2 text-sm rounded-lg transition-all" [ngClass]="showPreview() ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'">
                {{showPreview() ? 'Hide Preview' : 'Show Preview'}}
              </button>
              <button (click)="closeEditor()" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row">
            <!-- Editor Form -->
            <div class="flex-1 p-6 overflow-y-auto max-h-[80vh] space-y-6">
              <!-- Basic Info -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Basic Content</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Title *</label>
                    <input type="text" [(ngModel)]="form.title" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Subtitle</label>
                    <input type="text" [(ngModel)]="form.subtitle" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-gray-400 text-sm block mb-1">Description</label>
                    <textarea [(ngModel)]="form.description" rows="2" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"></textarea>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Badge</label>
                    <select [(ngModel)]="form.badge" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="" class="bg-gray-800">None</option>
                      <option value="NEW" class="bg-gray-800">NEW</option>
                      <option value="SALE" class="bg-gray-800">SALE</option>
                      <option value="HOT" class="bg-gray-800">HOT</option>
                      <option value="FEATURED" class="bg-gray-800">FEATURED</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Discount %</label>
                    <input type="number" [(ngModel)]="form.discountPercentage" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </section>

              <!-- Background -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Background</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Type</label>
                    <select [(ngModel)]="form.backgroundType" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="image" class="bg-gray-800">Image</option>
                      <option value="video" class="bg-gray-800">Video</option>
                      <option value="youtube" class="bg-gray-800">YouTube</option>
                      <option value="mp4" class="bg-gray-800">MP4</option>
                      <option value="webm" class="bg-gray-800">WebM</option>
                      <option value="solid" class="bg-gray-800">Solid Color</option>
                      <option value="gradient" class="bg-gray-800">Gradient</option>
                      <option value="particle" class="bg-gray-800">Particle</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-gray-400 text-sm block mb-1">Image / Video URL</label>
                    <div class="flex gap-2">
                      <input type="text" [(ngModel)]="form.imageUrl" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                      <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm">Upload<input type="file" accept="image/*" (change)="onUpload($event)" class="hidden"></label>
                    </div>
                  </div>
                  <div *ngIf="form.backgroundType === 'video' || form.backgroundType === 'mp4'">
                    <label class="text-gray-400 text-sm block mb-1">MP4 URL</label>
                    <input type="text" [(ngModel)]="form.mp4Url" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div *ngIf="form.backgroundType === 'webm'">
                    <label class="text-gray-400 text-sm block mb-1">WebM URL</label>
                    <input type="text" [(ngModel)]="form.webMUrl" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div *ngIf="form.backgroundType === 'youtube'">
                    <label class="text-gray-400 text-sm block mb-1">YouTube URL</label>
                    <input type="text" [(ngModel)]="form.youtubeUrl" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div *ngIf="form.backgroundType === 'solid'">
                    <label class="text-gray-400 text-sm block mb-1">Solid Color</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.solidColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.solidColor" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                  <div *ngIf="form.backgroundType === 'gradient'">
                    <label class="text-gray-400 text-sm block mb-1">Gradient Start</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.gradientStart" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.gradientStart" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                  <div *ngIf="form.backgroundType === 'gradient'">
                    <label class="text-gray-400 text-sm block mb-1">Gradient End</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.gradientEnd" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.gradientEnd" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                  <div *ngIf="form.backgroundType === 'gradient'">
                    <label class="text-gray-400 text-sm block mb-1">Direction</label>
                    <select [(ngModel)]="form.gradientDirection" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="to-r" class="bg-gray-800">Left to Right</option>
                      <option value="to-b" class="bg-gray-800">Top to Bottom</option>
                      <option value="to-tr" class="bg-gray-800">Bottom-Left to Top-Right</option>
                      <option value="to-bl" class="bg-gray-800">Top-Right to Bottom-Left</option>
                    </select>
                  </div>
                </div>
                <div class="flex flex-wrap gap-6 mt-3">
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.animatedBackground" class="rounded bg-gray-800 border-gray-600"> Animated</label>
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.threeJsEnabled" class="rounded bg-gray-800 border-gray-600"> Three.js</label>
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.particleEnabled" class="rounded bg-gray-800 border-gray-600"> Particles</label>
                </div>
                <div *ngIf="form.particleEnabled" class="mt-2">
                  <label class="text-gray-400 text-sm block mb-1">Particle Type</label>
                  <select [(ngModel)]="form.particleType" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                    <option value="stars" class="bg-gray-800">Stars</option>
                    <option value="smoke" class="bg-gray-800">Smoke</option>
                    <option value="fire" class="bg-gray-800">Fire</option>
                    <option value="rain" class="bg-gray-800">Rain</option>
                    <option value="snow" class="bg-gray-800">Snow</option>
                    <option value="cyberGrid" class="bg-gray-800">Cyber Grid</option>
                    <option value="glowingLines" class="bg-gray-800">Glowing Lines</option>
                  </select>
                </div>
              </section>

              <!-- Buttons -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Buttons</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Primary Button Text</label>
                    <input type="text" [(ngModel)]="form.primaryButtonText" placeholder="Shop Now" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Primary Button URL</label>
                    <input type="text" [(ngModel)]="form.primaryButtonUrl" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Secondary Button Text</label>
                    <input type="text" [(ngModel)]="form.secondaryButtonText" placeholder="Learn More" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Secondary Button URL</label>
                    <input type="text" [(ngModel)]="form.secondaryButtonUrl" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Button Style</label>
                    <select [(ngModel)]="form.buttonStyle" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="rounded" class="bg-gray-800">Rounded</option>
                      <option value="square" class="bg-gray-800">Square</option>
                      <option value="glass" class="bg-gray-800">Glass</option>
                      <option value="gradient" class="bg-gray-800">Gradient</option>
                      <option value="neon" class="bg-gray-800">Neon</option>
                      <option value="glow" class="bg-gray-800">Glow</option>
                      <option value="shadow" class="bg-gray-800">Shadow</option>
                      <option value="outline" class="bg-gray-800">Outline</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Button Color</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.buttonColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.buttonColor" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Button Hover Color</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.buttonHoverColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.buttonHoverColor" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                </div>
              </section>

              <!-- Overlay & Alignment -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Overlay & Alignment</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Overlay Opacity (0-1)</label>
                    <input type="range" min="0" max="1" step="0.1" [(ngModel)]="form.overlayOpacity" class="w-full">
                    <span class="text-xs text-gray-500">{{form.overlayOpacity}}</span>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Overlay Color</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.overlayColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.overlayColor" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Text Color</label>
                    <div class="flex gap-2"><input type="color" [(ngModel)]="form.textColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.textColor" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"></div>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Horizontal Alignment</label>
                    <select [(ngModel)]="form.horizontalAlignment" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="left" class="bg-gray-800">Left</option>
                      <option value="center" class="bg-gray-800">Center</option>
                      <option value="right" class="bg-gray-800">Right</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Vertical Alignment</label>
                    <select [(ngModel)]="form.verticalAlignment" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="top" class="bg-gray-800">Top</option>
                      <option value="center" class="bg-gray-800">Center</option>
                      <option value="bottom" class="bg-gray-800">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Text Animation</label>
                    <select [(ngModel)]="form.textAnimation" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="fade" class="bg-gray-800">Fade</option>
                      <option value="slide" class="bg-gray-800">Slide</option>
                      <option value="zoom" class="bg-gray-800">Zoom</option>
                      <option value="bounce" class="bg-gray-800">Bounce</option>
                      <option value="rotate" class="bg-gray-800">Rotate</option>
                      <option value="flip" class="bg-gray-800">Flip</option>
                      <option value="typing" class="bg-gray-800">Typing Effect</option>
                      <option value="glow" class="bg-gray-800">Glow Effect</option>
                      <option value="gsap" class="bg-gray-800">GSAP Animation</option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- 3D Effects -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">3D Effects</h4>
                <div class="flex flex-wrap gap-6">
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.floatingObjects" class="rounded bg-gray-800 border-gray-600"> Floating Objects</label>
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.floatingControllers" class="rounded bg-gray-800 border-gray-600"> Floating Controllers</label>
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.floatingCds" class="rounded bg-gray-800 border-gray-600"> Floating CDs</label>
                  <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.floatingCubes" class="rounded bg-gray-800 border-gray-600"> Floating Cubes</label>
                </div>
              </section>

              <!-- Typography -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Typography</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Font Family</label>
                    <input type="text" [(ngModel)]="form.fontFamily" placeholder="Inter, sans-serif" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Font Size</label>
                    <input type="text" [(ngModel)]="form.fontSize" placeholder="3rem" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Font Weight</label>
                    <input type="text" [(ngModel)]="form.fontWeight" placeholder="700" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </section>

              <!-- Game Link -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Game Link</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Linked Game</label>
                    <select [(ngModel)]="form.gameId" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="" class="bg-gray-800">None</option>
                      <option *ngFor="let g of games()" [value]="g.id" class="bg-gray-800">{{g.name}}</option>
                    </select>
                  </div>
                  <div><label class="text-gray-400 text-sm block mb-1">Game Name</label><input type="text" [(ngModel)]="form.gameName" class="w-full px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Category</label><input type="text" [(ngModel)]="form.categoryName" class="w-full px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Platform</label><input type="text" [(ngModel)]="form.platformName" class="w-full px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div>
                </div>
              </section>

              <!-- Carousel Settings -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Carousel Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Transition Speed (ms)</label>
                    <input type="number" [(ngModel)]="form.carouselTransitionSpeed" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Animation Type</label>
                    <select [(ngModel)]="form.carouselAnimationType" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                      <option value="slide" class="bg-gray-800">Slide</option>
                      <option value="fade" class="bg-gray-800">Fade</option>
                      <option value="zoom" class="bg-gray-800">Zoom</option>
                    </select>
                  </div>
                  <div class="flex items-end gap-4 pb-2">
                    <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.autoplayEnabled" class="rounded bg-gray-800 border-gray-600"> Autoplay</label>
                    <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.infiniteLoopEnabled" class="rounded bg-gray-800 border-gray-600"> Infinite Loop</label>
                  </div>
                  <div class="flex items-end pb-2">
                    <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.pauseOnHover" class="rounded bg-gray-800 border-gray-600"> Pause on Hover</label>
                  </div>
                </div>
              </section>

              <!-- Scheduling & Status -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Scheduling & Status</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Sort Order</label>
                    <input type="number" [(ngModel)]="form.sortOrder" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Priority</label>
                    <input type="number" [(ngModel)]="form.priority" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Publish Start</label>
                    <input type="datetime-local" [(ngModel)]="form.publishStartDate" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm block mb-1">Publish End</label>
                    <input type="datetime-local" [(ngModel)]="form.publishEndDate" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div class="flex items-center gap-6 pt-4">
                    <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.isPublished" class="rounded bg-gray-800 border-gray-600"> Published</label>
                    <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.isFeatured" class="rounded bg-gray-800 border-gray-600"> Featured</label>
                  </div>
                </div>
              </section>

              <!-- Custom CSS -->
              <section>
                <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Customization</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label class="text-gray-400 text-sm block mb-1">Hero Height</label><input type="text" [(ngModel)]="form.heroHeight" placeholder="600px" class="w-full px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Border Radius</label><input type="text" [(ngModel)]="form.cssBorderRadius" placeholder="0px" class="w-full px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Shadow</label><input type="text" [(ngModel)]="form.cssShadow" placeholder="0 0 30px rgba(0,0,0,0.5)" class="w-full px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Primary Color</label><div class="flex gap-2"><input type="color" [(ngModel)]="form.primaryColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.primaryColor" class="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Secondary Color</label><div class="flex gap-2"><input type="color" [(ngModel)]="form.secondaryColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.secondaryColor" class="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div></div>
                  <div><label class="text-gray-400 text-sm block mb-1">Accent Color</label><div class="flex gap-2"><input type="color" [(ngModel)]="form.accentColor" class="h-10 w-10 rounded cursor-pointer"><input type="text" [(ngModel)]="form.accentColor" class="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 border border-gray-700"></div></div>
                </div>
              </section>

              <!-- Error & Save -->
              <p *ngIf="error()" class="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{{error()}}</p>
              <div class="flex gap-3 pt-2">
                <button (click)="saveBanner()" [disabled]="saving()" class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/25">
                  {{saving() ? 'Saving...' : editingId() ? 'Update Banner' : 'Create Banner'}}
                </button>
                <button (click)="closeEditor()" class="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all border border-gray-700">Cancel</button>
              </div>
            </div>

            <!-- Live Preview -->
            <div *ngIf="showPreview()" class="w-full lg:w-[500px] border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950 sticky top-0">
              <div class="p-3 border-b border-gray-800 bg-gray-900">
                <h4 class="text-sm font-semibold text-gray-300">Live Preview</h4>
              </div>
              <div class="relative overflow-hidden" [style.height]="form.heroHeight || '400px'"
                [style.background]="getBackgroundStyle()">
                <!-- Overlay -->
                <div class="absolute inset-0" [style.background]="'rgba(' + hexToRgb(form.overlayColor || '#000000') + ',' + (form.overlayOpacity ?? 0.4) + ')'"></div>
                <!-- Background Image -->
                <img *ngIf="form.backgroundType === 'image' && form.imageUrl" [src]="form.imageUrl" class="absolute inset-0 w-full h-full object-cover">
                <!-- Content -->
                <div class="absolute inset-0 flex items-center justify-center p-8" [ngClass]="{'items-start pt-12': form.verticalAlignment === 'top', 'items-center': form.verticalAlignment === 'center', 'items-end pb-12': form.verticalAlignment === 'bottom', 'text-left': form.horizontalAlignment === 'left', 'text-center': form.horizontalAlignment === 'center', 'text-right': form.horizontalAlignment === 'right'}">
                  <div class="max-w-lg" [style.text-align]="form.horizontalAlignment">
                    <span *ngIf="form.badge" class="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                      [style.background-color]="form.badge === 'NEW' ? 'rgba(99,102,241,0.2)' : form.badge === 'HOT' ? 'rgba(239,68,68,0.2)' : form.badge === 'SALE' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'"
                      [style.color]="form.badge === 'NEW' ? '#818cf8' : form.badge === 'HOT' ? '#f87171' : form.badge === 'SALE' ? '#4ade80' : '#facc15'">{{form.badge}}</span>
                    <h2 class="text-3xl font-bold mb-2" [style.color]="form.textColor || '#ffffff'" [style.font-family]="form.fontFamily" [style.font-size]="form.fontSize" [style.font-weight]="form.fontWeight">{{form.title || 'Banner Title'}}</h2>
                    <p class="text-lg mb-1" [style.color]="form.textColor || '#ffffff'" style="opacity: 0.8;">{{form.subtitle || 'Banner subtitle goes here'}}</p>
                    <p class="text-sm mb-4" [style.color]="form.textColor || '#ffffff'" style="opacity: 0.6;">{{form.description || 'Short description for the banner'}}</p>
                    <div class="flex gap-3 mt-4" [ngClass]="{'justify-start': form.horizontalAlignment === 'left', 'justify-center': form.horizontalAlignment === 'center', 'justify-end': form.horizontalAlignment === 'right'}">
                      <button *ngIf="form.primaryButtonText" class="px-6 py-2.5 font-medium transition-all" [style.background-color]="form.buttonColor || '#6366f1'" [style.color]="'#ffffff'" [style.border-radius]="form.buttonStyle === 'rounded' ? '9999px' : form.buttonStyle === 'square' ? '0' : '8px'" [style.box-shadow]="form.buttonStyle === 'glow' || form.buttonStyle === 'neon' ? '0 0 20px ' + (form.buttonColor || '#6366f1') : 'none'" [style.background]="form.buttonStyle === 'gradient' ? 'linear-gradient(135deg, ' + (form.buttonColor || '#6366f1') + ', ' + (form.buttonHoverColor || '#4f46e5') + ')' : ''" [style.backdrop-filter]="form.buttonStyle === 'glass' ? 'blur(10px)' : 'none'">{{form.primaryButtonText}}</button>
                      <button *ngIf="form.secondaryButtonText" class="px-6 py-2.5 font-medium transition-all border" [style.color]="form.textColor || '#ffffff'" [style.border-color]="form.textColor || '#ffffff'" [style.border-radius]="form.buttonStyle === 'rounded' ? '9999px' : form.buttonStyle === 'square' ? '0' : '8px'" [style.background]="form.buttonStyle === 'glass' ? 'rgba(255,255,255,0.1)' : 'transparent'" [style.backdrop-filter]="form.buttonStyle === 'glass' ? 'blur(10px)' : 'none'">{{form.secondaryButtonText}}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeroBannersComponent implements OnInit {
  banners = signal<HeroBannerDto[]>([]);
  games = signal<GameListDto[]>([]);
  showEditor = signal(false);
  showPreview = signal(true);
  editingId = signal('');
  saving = signal(false);
  uploading = signal(false);
  error = signal('');

  form: any = {
    title: '', subtitle: '', description: '', badge: '', discountPercentage: null,
    primaryButtonText: '', primaryButtonUrl: '',
    secondaryButtonText: '', secondaryButtonUrl: '',
    gameId: '', gameName: '', categoryName: '', platformName: '',
    overlayOpacity: 0.4, overlayColor: '#000000', textColor: '#ffffff',
    fontFamily: '', fontSize: '', fontWeight: '',
    buttonStyle: 'rounded', buttonColor: '#6366f1', buttonHoverColor: '#4f46e5',
    horizontalAlignment: 'center', verticalAlignment: 'center',
    backgroundType: 'image', imageUrl: '', videoUrl: '', youtubeUrl: '', mp4Url: '', webMUrl: '',
    solidColor: '#030712', gradientStart: '', gradientEnd: '', gradientDirection: 'to-r',
    animatedBackground: false, lottieUrl: '', threeJsEnabled: false,
    particleEnabled: false, particleType: 'stars', backgroundLayers: '',
    floatingObjects: false, floatingControllers: false, floatingCds: false, floatingCubes: false,
    textAnimation: 'fade',
    autoplayEnabled: true, infiniteLoopEnabled: true, carouselTransitionSpeed: 500,
    carouselAnimationType: 'slide', pauseOnHover: true,
    sortOrder: 0, priority: 0, isPublished: true, isFeatured: false, isArchived: false,
    publishStartDate: '', publishEndDate: '',
    primaryColor: '', secondaryColor: '', accentColor: '', bgColor: '',
    heroHeight: '600px', heroWidth: '', cssBorderRadius: '', cssShadow: '',
    cssSpacing: '', cssPadding: '', cssMargins: '',
    animationDuration: 300, transitionSpeed: 300,
    desktopSettings: '', tabletSettings: '', mobileSettings: ''
  };

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadBanners();
    this.gameService.getAll({ pageSize: 100 }).subscribe(res => this.games.set(res.data?.data || []));
  }

  loadBanners() {
    this.gameService.getHeroBanners().subscribe(res => this.banners.set(res.data || []));
  }

  resetForm() {
    this.form = {
      title: '', subtitle: '', description: '', badge: '', discountPercentage: null,
      primaryButtonText: '', primaryButtonUrl: '',
      secondaryButtonText: '', secondaryButtonUrl: '',
      gameId: '', gameName: '', categoryName: '', platformName: '',
      overlayOpacity: 0.4, overlayColor: '#000000', textColor: '#ffffff',
      fontFamily: '', fontSize: '', fontWeight: '',
      buttonStyle: 'rounded', buttonColor: '#6366f1', buttonHoverColor: '#4f46e5',
      horizontalAlignment: 'center', verticalAlignment: 'center',
      backgroundType: 'image', imageUrl: '', videoUrl: '', youtubeUrl: '', mp4Url: '', webMUrl: '',
      solidColor: '#030712', gradientStart: '', gradientEnd: '', gradientDirection: 'to-r',
      animatedBackground: false, lottieUrl: '', threeJsEnabled: false,
      particleEnabled: false, particleType: 'stars', backgroundLayers: '',
      floatingObjects: false, floatingControllers: false, floatingCds: false, floatingCubes: false,
      textAnimation: 'fade',
      autoplayEnabled: true, infiniteLoopEnabled: true, carouselTransitionSpeed: 500,
      carouselAnimationType: 'slide', pauseOnHover: true,
      sortOrder: 0, priority: 0, isPublished: true, isFeatured: false, isArchived: false,
      publishStartDate: '', publishEndDate: '',
      primaryColor: '', secondaryColor: '', accentColor: '', bgColor: '',
      heroHeight: '600px', heroWidth: '', cssBorderRadius: '', cssShadow: '',
      cssSpacing: '', cssPadding: '', cssMargins: '',
      animationDuration: 300, transitionSpeed: 300,
      desktopSettings: '', tabletSettings: '', mobileSettings: ''
    };
    this.error.set('');
  }

  startCreate() {
    this.editingId.set('');
    this.resetForm();
    this.showEditor.set(true);
    this.showPreview.set(true);
  }

  closeEditor() {
    this.showEditor.set(false);
    this.editingId.set('');
  }

  editBanner(b: HeroBannerDto) {
    this.form = {
      title: b.title, subtitle: b.subtitle || '', description: b.description || '',
      badge: b.badge || '', discountPercentage: b.discountPercentage,
      primaryButtonText: b.primaryButtonText || '', primaryButtonUrl: b.primaryButtonUrl || '',
      secondaryButtonText: b.secondaryButtonText || '', secondaryButtonUrl: b.secondaryButtonUrl || '',
      gameId: b.gameId || '', gameName: b.gameName || '', categoryName: b.categoryName || '', platformName: b.platformName || '',
      overlayOpacity: b.overlayOpacity, overlayColor: b.overlayColor, textColor: b.textColor,
      fontFamily: b.fontFamily || '', fontSize: b.fontSize || '', fontWeight: b.fontWeight || '',
      buttonStyle: b.buttonStyle, buttonColor: b.buttonColor, buttonHoverColor: b.buttonHoverColor,
      horizontalAlignment: b.horizontalAlignment, verticalAlignment: b.verticalAlignment,
      backgroundType: b.backgroundType, imageUrl: b.imageUrl || '', videoUrl: b.videoUrl || '',
      youtubeUrl: b.youtubeUrl || '', mp4Url: b.mp4Url || '', webMUrl: b.webMUrl || '',
      solidColor: b.solidColor, gradientStart: b.gradientStart || '', gradientEnd: b.gradientEnd || '',
      gradientDirection: b.gradientDirection || 'to-r',
      animatedBackground: b.animatedBackground, lottieUrl: b.lottieUrl || '',
      threeJsEnabled: b.threeJsEnabled, particleEnabled: b.particleEnabled,
      particleType: b.particleType || 'stars', backgroundLayers: b.backgroundLayers || '',
      floatingObjects: b.floatingObjects, floatingControllers: b.floatingControllers,
      floatingCds: b.floatingCds, floatingCubes: b.floatingCubes,
      textAnimation: b.textAnimation,
      autoplayEnabled: b.autoplayEnabled, infiniteLoopEnabled: b.infiniteLoopEnabled,
      carouselTransitionSpeed: b.carouselTransitionSpeed, carouselAnimationType: b.carouselAnimationType,
      pauseOnHover: b.pauseOnHover,
      sortOrder: b.sortOrder, priority: b.priority,
      isPublished: b.isPublished, isFeatured: b.isFeatured, isArchived: b.isArchived,
      publishStartDate: b.publishStartDate || '', publishEndDate: b.publishEndDate || '',
      primaryColor: b.primaryColor || '', secondaryColor: b.secondaryColor || '',
      accentColor: b.accentColor || '', bgColor: b.bgColor || '',
      heroHeight: b.heroHeight || '600px', heroWidth: b.heroWidth || '',
      cssBorderRadius: b.cssBorderRadius || '', cssShadow: b.cssShadow || '',
      cssSpacing: b.cssSpacing || '', cssPadding: b.cssPadding || '', cssMargins: b.cssMargins || '',
      animationDuration: b.animationDuration, transitionSpeed: b.transitionSpeed,
      desktopSettings: b.desktopSettings || '', tabletSettings: b.tabletSettings || '',
      mobileSettings: b.mobileSettings || ''
    };
    this.editingId.set(b.id);
    this.showEditor.set(true);
    this.showPreview.set(true);
    this.error.set('');
  }

  saveBanner() {
    if (!this.form.title) {
      this.error.set('Title is required');
      return;
    }
    this.saving.set(true);
    this.error.set('');

    const payload = { ...this.form };
    payload.gameId = payload.gameId || null;
    if (!payload.publishStartDate) payload.publishStartDate = null;
    if (!payload.publishEndDate) payload.publishEndDate = null;
    payload.sortOrder = Number(payload.sortOrder);
    payload.priority = Number(payload.priority);
    payload.carouselTransitionSpeed = Number(payload.carouselTransitionSpeed);
    payload.animationDuration = Number(payload.animationDuration);
    payload.transitionSpeed = Number(payload.transitionSpeed);

    const request = this.editingId()
      ? this.gameService.updateHeroBanner(this.editingId(), payload)
      : this.gameService.createHeroBanner(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeEditor();
        this.loadBanners();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to save banner');
      }
    });
  }

  deleteBanner(id: string) {
    if (!confirm('Delete this banner permanently?')) return;
    this.gameService.deleteHeroBanner(id).subscribe({ next: () => this.loadBanners() });
  }

  duplicateBanner(id: string) {
    this.gameService.duplicateHeroBanner(id).subscribe({ next: () => this.loadBanners() });
  }

  togglePublish(b: HeroBannerDto) {
    this.gameService.togglePublishHeroBanner(b.id).subscribe({ next: () => this.loadBanners() });
  }

  toggleFeatured(b: HeroBannerDto) {
    this.gameService.toggleFeaturedHeroBanner(b.id).subscribe({ next: () => this.loadBanners() });
  }

  archiveBanner(id: string) {
    this.gameService.archiveHeroBanner(id).subscribe({ next: () => this.loadBanners() });
  }

  moveUp(index: number) {
    if (index === 0) return;
    const arr = [...this.banners()];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    const reorder = arr.map((b, i) => ({ id: b.id, sortOrder: i }));
    this.gameService.reorderHeroBanners(reorder).subscribe({ next: () => this.loadBanners() });
  }

  moveDown(index: number) {
    if (index >= this.banners().length - 1) return;
    const arr = [...this.banners()];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    const reorder = arr.map((b, i) => ({ id: b.id, sortOrder: i }));
    this.gameService.reorderHeroBanners(reorder).subscribe({ next: () => this.loadBanners() });
  }

  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.gameService.uploadImage(file).subscribe({
      next: res => { this.form.imageUrl = res.data; this.uploading.set(false); },
      error: () => this.uploading.set(false)
    });
  }

  getBackgroundStyle(): string {
    if (this.form.backgroundType === 'solid') return this.form.solidColor;
    if (this.form.backgroundType === 'gradient' && this.form.gradientStart && this.form.gradientEnd) {
      const dir = this.form.gradientDirection === 'to-r' ? 'to right' :
                  this.form.gradientDirection === 'to-b' ? 'to bottom' :
                  this.form.gradientDirection === 'to-tr' ? 'to top right' :
                  this.form.gradientDirection === 'to-bl' ? 'to bottom left' : 'to right';
      return `linear-gradient(${dir}, ${this.form.gradientStart}, ${this.form.gradientEnd})`;
    }
    return '#030712';
  }

  hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  }
}
