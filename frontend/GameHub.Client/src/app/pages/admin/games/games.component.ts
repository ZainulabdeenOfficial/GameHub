import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../core/services/game.service';
import { GameListDto, Category, Publisher, Developer, Screenshot } from '../../../core/models/auth.model';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Game Management</h2>
        <button (click)="showForm.set(true)" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Add New Game</button>
      </div>

      <div *ngIf="showForm()" class="p-5 border-b border-gray-800 bg-gray-800/30">
        <h3 class="text-lg font-semibold text-white mb-4">{{editingId() ? 'Edit Game' : 'Create New Game'}}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-gray-400 text-sm block mb-1">Name *</label>
            <input type="text" [(ngModel)]="form.name" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Platform</label>
            <select [(ngModel)]="form.platform" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option [value]="0">Windows</option>
              <option [value]="1">macOS</option>
              <option [value]="2">Linux</option>
              <option [value]="3">PlayStation</option>
              <option [value]="4">Xbox</option>
              <option [value]="5">Nintendo</option>
              <option [value]="6">Android</option>
              <option [value]="7">iOS</option>
              <option [value]="8">Web</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Category *</label>
            <select [(ngModel)]="form.categoryId" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option value="" class="bg-gray-800">Select category</option>
              <option *ngFor="let cat of categories()" [value]="cat.id" class="bg-gray-800">{{cat.name}}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Publisher</label>
            <select [(ngModel)]="form.publisherId" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option value="" class="bg-gray-800">None</option>
              <option *ngFor="let p of publishers()" [value]="p.id" class="bg-gray-800">{{p.name}}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Developer</label>
            <select [(ngModel)]="form.developerId" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option value="" class="bg-gray-800">None</option>
              <option *ngFor="let d of developers()" [value]="d.id" class="bg-gray-800">{{d.name}}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Status</label>
            <select [(ngModel)]="form.status" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option [value]="0">Draft</option>
              <option [value]="1">Published</option>
              <option [value]="2">Archived</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Short Description *</label>
            <input type="text" [(ngModel)]="form.shortDescription" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Description *</label>
            <textarea [(ngModel)]="form.description" rows="3" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"></textarea>
          </div>

          <div class="md:col-span-2 border-t border-gray-700 pt-4">
            <h4 class="text-white font-medium mb-3">Additional Info</h4>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Release Date</label>
            <input type="date" [(ngModel)]="form.releaseDate" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Age Rating</label>
            <select [(ngModel)]="form.ageRating" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
              <option [value]="0">E (Everyone)</option>
              <option [value]="1">E10+</option>
              <option [value]="2">T (Teen)</option>
              <option [value]="3">M (Mature)</option>
              <option [value]="9">PEGI 16</option>
              <option [value]="10">PEGI 18</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Genres</label>
            <input type="text" [(ngModel)]="form.genres" placeholder="Action,RPG,OpenWorld" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Languages</label>
            <input type="text" [(ngModel)]="form.languages" placeholder="English,French" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Game Size (GB)</label>
            <input type="number" [(ngModel)]="form.gameSize" step="0.1" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Version</label>
            <input type="text" [(ngModel)]="form.version" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
          </div>

          <div class="md:col-span-2 border-t border-gray-700 pt-4">
            <h4 class="text-white font-medium mb-3">Game Images</h4>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Thumbnail URL</label>
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="form.thumbnailUrl" placeholder="https://example.com/image.jpg" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Upload
                <input type="file" accept="image/*" (change)="onThumbnailUpload($event)" class="hidden">
              </label>
            </div>
            <p *ngIf="uploadingThumbnail()" class="text-indigo-400 text-xs mt-1">Uploading...</p>
            <div *ngIf="form.thumbnailUrl" class="mt-2 w-32 h-20 bg-gray-800 rounded-lg overflow-hidden"><img [src]="form.thumbnailUrl" class="w-full h-full object-cover"></div>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Banner URL</label>
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="form.bannerUrl" placeholder="https://example.com/banner.jpg" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Upload
                <input type="file" accept="image/*" (change)="onBannerUpload($event)" class="hidden">
              </label>
            </div>
            <p *ngIf="uploadingBanner()" class="text-indigo-400 text-xs mt-1">Uploading...</p>
            <div *ngIf="form.bannerUrl" class="mt-2 w-full h-24 bg-gray-800 rounded-lg overflow-hidden"><img [src]="form.bannerUrl" class="w-full h-full object-cover"></div>
          </div>

          <div class="md:col-span-2 border-t border-gray-700 pt-4">
            <h4 class="text-white font-medium mb-3">Screenshots</h4>
            <p class="text-gray-500 text-xs mb-3">Add screenshots to showcase the game. First screenshot will be used as the cover.</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div *ngFor="let ss of screenshots(); let i = index" class="relative group aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <img [src]="ss.url" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button (click)="removeScreenshot(i)" class="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  <span class="text-white text-xs bg-gray-900/80 px-2 py-0.5 rounded">{{i + 1}}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <input type="url" [(ngModel)]="newScreenshotUrl" placeholder="https://example.com/screenshot.jpg" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <button (click)="addScreenshotByUrl()" [disabled]="!newScreenshotUrl() || addingScreenshotByUrl()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50">
                {{addingScreenshotByUrl() ? 'Adding...' : 'Add by URL'}}
              </button>
            </div>
            <div *ngIf="newScreenshotUrl()" class="mt-2 w-48 h-28 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
              <img [src]="newScreenshotUrl()" class="w-full h-full object-cover" (error)="$event.target.style.display='none'">
              <svg class="w-8 h-8 text-gray-600 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <p *ngIf="screenshotByUrlError()" class="text-red-400 text-xs mt-1">{{screenshotByUrlError()}}</p>
          </div>

          <div class="md:col-span-2 border-t border-gray-700 pt-4">
            <h4 class="text-white font-medium mb-3">System Requirements</h4>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Minimum Requirements</label>
            <textarea [(ngModel)]="form.minimumRequirements" rows="4" placeholder="OS: Windows 10&#10;Processor: Intel Core i5&#10;Memory: 8 GB RAM&#10;Graphics: NVIDIA GTX 960&#10;Storage: 10 GB" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Recommended Requirements</label>
            <textarea [(ngModel)]="form.recommendedRequirements" rows="4" placeholder="OS: Windows 11&#10;Processor: Intel Core i7&#10;Memory: 16 GB RAM&#10;Graphics: NVIDIA RTX 2060&#10;Storage: 20 GB" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"></textarea>
          </div>

          <div class="md:col-span-2 border-t border-gray-700 pt-4">
            <h4 class="text-white font-medium mb-3">Download & Store Links</h4>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Download URL</label>
            <div class="flex gap-2">
              <input type="url" [(ngModel)]="form.downloadLink" placeholder="https://example.com/game-setup.exe" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm flex items-center gap-1 whitespace-nowrap">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                Upload File
                <input type="file" (change)="onGameFileUpload($event)" class="hidden">
              </label>
            </div>
            <p *ngIf="uploadingFile()" class="text-indigo-400 text-xs mt-1">Uploading...</p>
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Steam Link</label>
            <input type="text" [(ngModel)]="form.steamLink" placeholder="https://store.steampowered.com/app/..." class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Epic Games Link</label>
            <input type="text" [(ngModel)]="form.epicLink" placeholder="https://store.epicgames.com/p/..." class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Trailer URL</label>
            <input type="text" [(ngModel)]="form.trailerUrl" placeholder="https://www.youtube.com/watch?v=..." class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>

          <div class="md:col-span-2 border-t border-gray-700 pt-4">
            <h4 class="text-white font-medium mb-3">Flags</h4>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.isFeatured" class="rounded bg-gray-800 border-gray-600"> Featured</label>
              <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.isPopular" class="rounded bg-gray-800 border-gray-600"> Popular</label>
              <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.isTrending" class="rounded bg-gray-800 border-gray-600"> Trending</label>
              <label class="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" [(ngModel)]="form.isEditorsChoice" class="rounded bg-gray-800 border-gray-600"> Editor's Choice</label>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="saveGame()" [disabled]="saving()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">{{saving() ? 'Saving...' : editingId() ? 'Update Game' : 'Create Game'}}</button>
          <button (click)="cancelForm()" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">Cancel</button>
        </div>
        <p *ngIf="error()" class="text-red-400 text-sm mt-2">{{error()}}</p>
      </div>

      <div class="p-5">
        <div class="relative mb-4">
          <input type="text" placeholder="Search games..." (input)="onSearch($event)" class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Game</th>

                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Downloads</th>
                <th class="text-left py-3 px-2">Rating</th>
                <th class="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let game of games()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-4 px-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img *ngIf="game.thumbnailUrl" [src]="game.thumbnailUrl" class="w-full h-full object-cover">
                      <div *ngIf="!game.thumbnailUrl" class="w-full h-full flex items-center justify-center text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                    </div>
                    <div>
                      <p class="text-white font-medium">{{game.name}}</p>
                      <p class="text-gray-500 text-xs">{{game.slug}}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="{
                    'bg-green-900/50 text-green-400': game.status === 1,
                    'bg-yellow-900/50 text-yellow-400': game.status === 0,
                    'bg-gray-800 text-gray-400': game.status === 2
                  }">{{game.status === 1 ? 'Published' : game.status === 0 ? 'Draft' : 'Archived'}}</span>
                </td>
                <td class="py-4 px-2 text-gray-400">{{game.totalDownloads}}</td>
                <td class="py-4 px-2">
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-400">★</span>
                    <span class="text-gray-300">{{game.averageRating.toFixed(1)}}</span>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <div class="flex gap-2">
                    <button (click)="editGame(game.id)" class="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button (click)="deleteGame(game.id)" class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="games().length === 0">
                <td colspan="5" class="text-center py-10 text-gray-500">No games found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GamesComponent implements OnInit {
  games = signal<GameListDto[]>([]);
  categories = signal<Category[]>([]);
  publishers = signal<Publisher[]>([]);
  developers = signal<Developer[]>([]);
  showForm = signal(false);
  editingId = signal('');
  saving = signal(false);
  uploadingThumbnail = signal(false);
  uploadingBanner = signal(false);
  uploadingFile = signal(false);
  uploadingScreenshot = signal(false);
  screenshots = signal<Screenshot[]>([]);
  error = signal('');
  newScreenshotUrl = signal('');
  addingScreenshotByUrl = signal(false);
  screenshotByUrlError = signal('');

  form: any = this.emptyForm();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadGames();
    this.gameService.getCategories().subscribe(res => this.categories.set(res.data || []));
    this.gameService.getPublishers().subscribe(res => this.publishers.set(res.data || []));
    this.gameService.getDevelopers().subscribe(res => this.developers.set(res.data || []));
  }

  addScreenshotByUrl() {
    if (!this.newScreenshotUrl()) return;
    if (!this.editingId()) { this.screenshotByUrlError.set('Save the game first, then add screenshots'); return; }
    this.addingScreenshotByUrl.set(true);
    this.screenshotByUrlError.set('');
    const uploadedUrl = this.newScreenshotUrl();
    this.gameService.uploadImageFromUrl(uploadedUrl).subscribe({
      next: res => {
        const serverUrl = res.data;
        this.gameService.addScreenshot(this.editingId(), { url: serverUrl, caption: '', fileSize: 0, contentType: 'image/jpeg' }).subscribe({
          next: () => {
            this.addingScreenshotByUrl.set(false);
            this.screenshots.update(list => [...list, { id: '', url: serverUrl, publicId: null, caption: '', displayOrder: list.length }]);
            this.newScreenshotUrl.set('');
            this.screenshotByUrlError.set('');
          },
          error: err => { this.addingScreenshotByUrl.set(false); this.screenshotByUrlError.set(err.error?.message || 'Failed to save screenshot'); }
        });
      },
      error: err => { this.addingScreenshotByUrl.set(false); this.screenshotByUrlError.set(err.error?.message || 'Failed to upload from URL'); }
    });
  }

  private emptyForm() {
    return {
      name: '', description: '', shortDescription: '',
      categoryId: '', platform: 0, publisherId: '', developerId: '',
      releaseDate: new Date().toISOString().split('T')[0], ageRating: 2,
      languages: 'English', genres: 'Action', gameSize: 1, version: '1.0',
      minimumRequirements: null, recommendedRequirements: null,
      downloadLink: null, steamLink: null, epicLink: null, trailerUrl: null,
      thumbnailUrl: null, bannerUrl: null, status: 0,
      isFeatured: false, isPopular: false, isTrending: false, isEditorsChoice: false
    };
  }

  onThumbnailUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploadingThumbnail.set(true);
    this.gameService.uploadImage(file).subscribe({
      next: res => { this.form.thumbnailUrl = res.data; this.uploadingThumbnail.set(false); },
      error: () => this.uploadingThumbnail.set(false)
    });
  }

  onBannerUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploadingBanner.set(true);
    this.gameService.uploadImage(file).subscribe({
      next: res => { this.form.bannerUrl = res.data; this.uploadingBanner.set(false); },
      error: () => this.uploadingBanner.set(false)
    });
  }

  onGameFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploadingFile.set(true);
    this.gameService.uploadFile(file).subscribe({
      next: res => { this.form.downloadLink = res.data; this.uploadingFile.set(false); },
      error: () => this.uploadingFile.set(false)
    });
  }

  onScreenshotUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !this.editingId()) return;
    this.uploadingScreenshot.set(true);
    this.error.set('');
    this.gameService.uploadImage(file).subscribe({
      next: res => {
        this.uploadingScreenshot.set(false);
        this.gameService.addScreenshot(this.editingId(), { url: res.data, caption: '', fileSize: file.size, contentType: file.type }).subscribe({
          next: ss => {
            this.screenshots.update(list => [...list, ss.data]);
            this.error.set('');
          },
          error: () => this.error.set('Failed to save screenshot')
        });
      },
      error: () => { this.uploadingScreenshot.set(false); this.error.set('Failed to upload screenshot'); }
    });
  }

  removeScreenshot(index: number) {
    const ss = this.screenshots()[index];
    if (!ss) return;
    if (!confirm('Remove this screenshot?')) return;
    this.gameService.deleteScreenshot(this.editingId(), ss.id).subscribe({
      next: () => this.screenshots.update(list => list.filter((_, i) => i !== index)),
      error: () => this.error.set('Failed to delete screenshot')
    });
  }

  loadGames() {
    this.gameService.getAll({ pageSize: 50 }).subscribe(res => this.games.set(res.data?.data || []));
  }

  saveGame() {
    if (!this.form.name || !this.form.description || !this.form.shortDescription || !this.form.categoryId) {
      this.error.set('Please fill in all required fields');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const payload: any = { ...this.form };
    payload.releaseDate = new Date(this.form.releaseDate).toISOString();
    payload.platform = Number(this.form.platform);
    payload.ageRating = Number(this.form.ageRating);
    payload.status = Number(this.form.status);
    payload.gameSize = Number(this.form.gameSize);
    payload.publisherId = this.form.publisherId || null;
    payload.developerId = this.form.developerId || null;
    delete payload.gameFileName;

    const request = this.editingId() ? this.gameService.update(this.editingId(), payload) : this.gameService.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.editingId.set('');
        this.form = this.emptyForm();
        this.screenshots.set([]);
        this.loadGames();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to save game');
      }
    });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set('');
    this.form = this.emptyForm();
    this.screenshots.set([]);
    this.error.set('');
  }

  editGame(id: string) {
    this.gameService.getById(id).subscribe({
      next: (res) => {
        const g = res.data;
        this.form = {
          name: g.name, description: g.description, shortDescription: g.shortDescription,
          categoryId: g.categoryId,
          platform: g.platform, publisherId: g.publisherId || '', developerId: g.developerId || '',
          releaseDate: new Date(g.releaseDate).toISOString().split('T')[0],
          ageRating: g.ageRating, languages: g.languages, genres: g.genres,
          gameSize: g.gameSize, version: g.version, status: g.status,
          minimumRequirements: g.minimumRequirements, recommendedRequirements: g.recommendedRequirements,
          downloadLink: g.downloadLink, steamLink: g.steamLink, epicLink: g.epicLink,
          trailerUrl: g.trailerUrl, thumbnailUrl: g.thumbnailUrl, bannerUrl: g.bannerUrl,
          isFeatured: g.isFeatured, isPopular: g.isPopular, isTrending: g.isTrending, isEditorsChoice: g.isEditorsChoice
        };
        this.editingId.set(g.id);
        this.screenshots.set(g.screenshots || []);
        this.showForm.set(true);
        this.error.set('');
      },
      error: () => this.error.set('Failed to load game data')
    });
  }

  deleteGame(id: string) {
    if (!confirm('Delete this game?')) return;
    this.gameService.delete(id).subscribe({ next: () => this.loadGames() });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    if (term.length > 2) {
      this.gameService.search(term).subscribe(res => this.games.set(res.data || []));
    } else if (term.length === 0) {
      this.loadGames();
    }
  }
}
