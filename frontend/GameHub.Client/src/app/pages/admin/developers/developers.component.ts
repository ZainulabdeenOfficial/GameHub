import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../core/services/game.service';
import { Developer } from '../../../core/models/auth.model';

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Developer Management</h2>
        <button (click)="showForm.set(true); editingId.set(''); resetForm()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Add New Developer</button>
      </div>

      <div *ngIf="showForm()" class="p-5 border-b border-gray-800 bg-gray-800/30">
        <h3 class="text-lg font-semibold text-white mb-4">{{editingId() ? 'Edit Developer' : 'Create New Developer'}}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Name *</label>
            <input type="text" [(ngModel)]="form.name" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Logo URL</label>
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="form.logoUrl" placeholder="https://example.com/logo.png" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Upload
                <input type="file" accept="image/*" (change)="onLogoUpload($event)" class="hidden">
              </label>
            </div>
            <p *ngIf="uploading()" class="text-indigo-400 text-xs mt-1">Uploading...</p>
            <div *ngIf="form.logoUrl" class="mt-2 w-16 h-16 bg-gray-800 rounded-lg overflow-hidden"><img [src]="form.logoUrl" class="w-full h-full object-cover"></div>
          </div>
          <div>
            <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.isActive" class="rounded bg-gray-800 border-gray-600">
              <span class="text-sm">Active</span>
            </label>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="saveDeveloper()" [disabled]="saving()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">{{saving() ? 'Saving...' : editingId() ? 'Update Developer' : 'Create Developer'}}</button>
          <button (click)="cancelForm()" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">Cancel</button>
        </div>
        <p *ngIf="error()" class="text-red-400 text-sm mt-2">{{error()}}</p>
      </div>

      <div class="p-5">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Developer</th>
                <th class="text-left py-3 px-2">Slug</th>
                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let dev of developers()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-4 px-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                      <img *ngIf="dev.logoUrl" [src]="dev.logoUrl" class="w-full h-full object-cover rounded-lg">
                      <svg *ngIf="!dev.logoUrl" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <p class="text-white font-medium">{{dev.name}}</p>
                  </div>
                </td>
                <td class="py-4 px-2 text-gray-400">{{dev.slug}}</td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="dev.isActive ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'">{{dev.isActive ? 'Active' : 'Inactive'}}</span>
                </td>
                <td class="py-4 px-2">
                  <div class="flex gap-2">
                    <button (click)="editDeveloper(dev)" class="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button (click)="deleteDeveloper(dev.id)" class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="developers().length === 0">
                <td colspan="4" class="text-center py-10 text-gray-500">No developers found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DevelopersComponent implements OnInit {
  developers = signal<Developer[]>([]);
  showForm = signal(false);
  editingId = signal('');
  saving = signal(false);
  uploading = signal(false);
  error = signal('');
  form: any = { name: '', logoUrl: '', isActive: true };

  constructor(private gameService: GameService) {}

  ngOnInit() { this.loadDevelopers(); }

  resetForm() { this.form = { name: '', logoUrl: '', isActive: true }; this.error.set(''); }

  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.gameService.uploadImage(file).subscribe({
      next: res => { this.form.logoUrl = res.data; this.uploading.set(false); },
      error: () => this.uploading.set(false)
    });
  }

  loadDevelopers() { this.gameService.getDevelopers().subscribe(res => this.developers.set(res.data || [])); }

  saveDeveloper() {
    if (!this.form.name) { this.error.set('Developer name is required'); return; }
    this.saving.set(true);
    this.error.set('');
    const request = this.editingId()
      ? this.gameService.updateDeveloper(this.editingId(), this.form)
      : this.gameService.createDeveloper(this.form);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.editingId.set('');
        this.loadDevelopers();
        this.resetForm();
      },
      error: (err) => { this.saving.set(false); this.error.set(err.error?.message || 'Failed to save developer'); }
    });
  }

  editDeveloper(dev: any) {
    this.form = { name: dev.name, logoUrl: dev.logoUrl || '', isActive: dev.isActive };
    this.editingId.set(dev.id);
    this.showForm.set(true);
    this.error.set('');
  }

  deleteDeveloper(id: string) {
    if (!confirm('Deactivate this developer?')) return;
    this.gameService.deleteDeveloper(id).subscribe({ next: () => this.loadDevelopers() });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set('');
    this.resetForm();
  }
}
