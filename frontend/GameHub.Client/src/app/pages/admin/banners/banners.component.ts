import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GameService } from '../../../core/services/game.service';
import { BannerDto, GameListDto } from '../../../core/models/auth.model';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Banner Management</h2>
        <button (click)="showForm.set(true); editingId.set(''); resetForm()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Add New Banner</button>
      </div>

      <div *ngIf="showForm()" class="p-5 border-b border-gray-800 bg-gray-800/30">
        <h3 class="text-lg font-semibold text-white mb-4">{{editingId() ? 'Edit Banner' : 'Create New Banner'}}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-gray-400 text-sm block mb-1">Title *</label>
            <input type="text" [(ngModel)]="form.title" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Subtitle</label>
            <input type="text" [(ngModel)]="form.subtitle" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Sort Order</label>
            <input type="number" [(ngModel)]="form.sortOrder" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Active</label>
            <select [(ngModel)]="form.isActive" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option [value]="true">Yes</option>
              <option [value]="false">No</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Button Text</label>
            <input type="text" [(ngModel)]="form.buttonText" placeholder="Learn More" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Link URL</label>
            <input type="text" [(ngModel)]="form.linkUrl" placeholder="https://..." class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Linked Game</label>
            <select [(ngModel)]="form.gameId" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option value="" class="bg-gray-800">None (use link URL)</option>
              <option *ngFor="let g of games()" [value]="g.id" class="bg-gray-800">{{g.name}}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Background Color</label>
            <input type="text" [(ngModel)]="form.backgroundColor" placeholder="#1e1b4b" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Media Type</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 text-white cursor-pointer">
                <input type="radio" name="mediaType" [value]="'image'" (change)="mediaType = 'image'; form.youtubeUrl = null" [checked]="mediaType === 'image'" class="text-indigo-500">
                <span>Image</span>
              </label>
              <label class="flex items-center gap-2 text-white cursor-pointer">
                <input type="radio" name="mediaType" [value]="'video'" (change)="mediaType = 'video'; form.imageUrl = null" [checked]="mediaType === 'video'" class="text-indigo-500">
                <span>YouTube Video</span>
              </label>
            </div>
          </div>
          <div class="md:col-span-2" *ngIf="mediaType === 'image'">
            <label class="text-gray-400 text-sm block mb-1">Image URL</label>
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="form.imageUrl" placeholder="https://example.com/banner.jpg" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Upload
                <input type="file" accept="image/*" (change)="onImageUpload($event)" class="hidden">
              </label>
            </div>
            <p *ngIf="uploading()" class="text-indigo-400 text-xs mt-1">Uploading...</p>
            <div *ngIf="form.imageUrl" class="mt-2 w-full h-32 bg-gray-800 rounded-lg overflow-hidden"><img [src]="form.imageUrl" class="w-full h-full object-cover"></div>
          </div>
          <div class="md:col-span-2" *ngIf="mediaType === 'video'">
            <label class="text-gray-400 text-sm block mb-1">YouTube Video URL</label>
            <input type="text" [(ngModel)]="form.youtubeUrl" placeholder="https://youtube.com/watch?v=..." class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
            <p class="text-gray-500 text-xs mt-1">Video will auto-play on the home page</p>
            <div class="mt-2 w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <iframe *ngIf="form.youtubeUrl" [src]="getSafeYoutubeUrl(form.youtubeUrl)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="saveBanner()" [disabled]="saving()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">{{saving() ? 'Saving...' : editingId() ? 'Update Banner' : 'Create Banner'}}</button>
          <button (click)="cancelForm()" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">Cancel</button>
        </div>
        <p *ngIf="error()" class="text-red-400 text-sm mt-2">{{error()}}</p>
      </div>

      <div class="p-5">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Preview</th>
                <th class="text-left py-3 px-2">Title</th>
                <th class="text-left py-3 px-2">Order</th>
                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Game</th>
                <th class="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let banner of banners()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-4 px-2">
                  <div class="w-24 h-14 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <ng-container *ngIf="banner.youtubeUrl; else bannerImg">
                      <svg class="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </ng-container>
                    <ng-template #bannerImg>
                      <img *ngIf="banner.imageUrl" [src]="banner.imageUrl" class="w-full h-full object-cover">
                      <span *ngIf="!banner.imageUrl" class="text-gray-500 text-xs">No media</span>
                    </ng-template>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <p class="text-white font-medium">{{banner.title}}</p>
                  <p class="text-gray-500 text-xs">{{banner.subtitle}}</p>
                </td>
                <td class="py-4 px-2 text-gray-400">{{banner.sortOrder}}</td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="banner.isActive ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'">
                    {{banner.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td class="py-4 px-2 text-gray-400">{{banner.gameName || '-'}}</td>
                <td class="py-4 px-2">
                  <div class="flex gap-2">
                    <button (click)="editBanner(banner)" class="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button (click)="deleteBanner(banner.id)" class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="banners().length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500">No banners found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BannersComponent implements OnInit {
  banners = signal<BannerDto[]>([]);
  games = signal<GameListDto[]>([]);
  showForm = signal(false);
  editingId = signal('');
  saving = signal(false);
  uploading = signal(false);
  error = signal('');

  form: any = {
    title: '', subtitle: '', imageUrl: null, youtubeUrl: null, gameId: '', linkUrl: '',
    buttonText: '', backgroundColor: '', sortOrder: 0, isActive: true
  };
  mediaType: 'image' | 'video' = 'image';

  private youtubeCache = new Map<string, SafeResourceUrl>();

  constructor(private gameService: GameService, private sanitizer: DomSanitizer) {}

  getSafeYoutubeUrl(url: string): SafeResourceUrl {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const id = match ? match[1] : url;
    const cached = this.youtubeCache.get(id);
    if (cached) return cached;
    const safe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`);
    this.youtubeCache.set(id, safe);
    return safe;
  }

  ngOnInit() {
    this.loadBanners();
    this.gameService.getAll({ pageSize: 100 }).subscribe(res => this.games.set(res.data?.data || []));
  }

  resetForm() {
    this.form = { title: '', subtitle: '', imageUrl: null, youtubeUrl: null, gameId: '', linkUrl: '', buttonText: '', backgroundColor: '', sortOrder: 0, isActive: true };
    this.mediaType = 'image';
    this.error.set('');
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.gameService.uploadImage(file).subscribe({
      next: res => { this.form.imageUrl = res.data; this.uploading.set(false); },
      error: () => this.uploading.set(false)
    });
  }

  loadBanners() {
    this.gameService.getAllBanners().subscribe(res => this.banners.set(res.data || []));
  }

  saveBanner() {
    if (!this.form.title) {
      this.error.set('Title is required');
      return;
    }
    if (!this.form.imageUrl && !this.form.youtubeUrl) {
      this.error.set('Either Image URL or YouTube URL is required');
      return;
    }
    this.saving.set(true);
    this.error.set('');

    const payload: any = { ...this.form };
    payload.imageUrl = this.form.imageUrl || null;
    payload.gameId = this.form.gameId || null;
    payload.linkUrl = this.form.linkUrl || null;
    payload.buttonText = this.form.buttonText || null;
    payload.backgroundColor = this.form.backgroundColor || null;
    payload.youtubeUrl = this.form.youtubeUrl || null;
    payload.sortOrder = Number(this.form.sortOrder);

    const request = this.editingId()
      ? this.gameService.updateBanner(this.editingId(), payload)
      : this.gameService.createBanner(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.editingId.set('');
        this.loadBanners();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to save banner');
      }
    });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set('');
    this.resetForm();
  }

  editBanner(banner: BannerDto) {
    this.mediaType = banner.youtubeUrl ? 'video' : 'image';
    this.form = {
      title: banner.title, subtitle: banner.subtitle || '', imageUrl: banner.imageUrl || null,
      youtubeUrl: banner.youtubeUrl || null, gameId: banner.gameId || '', linkUrl: banner.linkUrl || '',
      buttonText: banner.buttonText || '', backgroundColor: banner.backgroundColor || '',
      sortOrder: banner.sortOrder, isActive: banner.isActive
    };
    this.editingId.set(banner.id);
    this.showForm.set(true);
    this.error.set('');
  }

  deleteBanner(id: string) {
    if (!confirm('Delete this banner?')) return;
    this.gameService.deleteBanner(id).subscribe({ next: () => this.loadBanners() });
  }
}
