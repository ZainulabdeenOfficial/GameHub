import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../core/services/game.service';
import { Category } from '../../../core/models/auth.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Category Management</h2>
        <button (click)="showForm.set(true); editingId.set(''); resetForm()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Add New Category</button>
      </div>

      <div *ngIf="showForm()" class="p-5 border-b border-gray-800 bg-gray-800/30">
        <h3 class="text-lg font-semibold text-white mb-4">{{editingId() ? 'Edit Category' : 'Create New Category'}}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-gray-400 text-sm block mb-1">Name *</label>
            <input type="text" [(ngModel)]="form.name" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Display Order</label>
            <input type="number" [(ngModel)]="form.displayOrder" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Description</label>
            <textarea [(ngModel)]="form.description" rows="2" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="text-gray-400 text-sm block mb-1">Image URL</label>
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="form.imageUrl" placeholder="https://example.com/category.jpg" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
              <label class="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-all text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Upload
                <input type="file" accept="image/*" (change)="onImageUpload($event)" class="hidden">
              </label>
            </div>
            <p *ngIf="uploading()" class="text-indigo-400 text-xs mt-1">Uploading...</p>
            <div *ngIf="form.imageUrl" class="mt-2 w-24 h-16 bg-gray-800 rounded-lg overflow-hidden"><img [src]="form.imageUrl" class="w-full h-full object-cover"></div>
          </div>
          <div>
            <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.isActive" class="rounded bg-gray-800 border-gray-600">
              <span class="text-sm">Active</span>
            </label>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="saveCategory()" [disabled]="saving()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">{{saving() ? 'Saving...' : editingId() ? 'Update Category' : 'Create Category'}}</button>
          <button (click)="cancelForm()" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">Cancel</button>
        </div>
      </div>
      <p *ngIf="error()" class="text-red-400 text-sm mt-2 px-5">{{error()}}</p>

      <div class="p-5">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Name</th>
                <th class="text-left py-3 px-2">Image</th>
                <th class="text-left py-3 px-2">Slug</th>
                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Display Order</th>
                <th class="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cat of categories()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-4 px-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                      <img *ngIf="cat.imageUrl" [src]="cat.imageUrl" class="w-full h-full object-cover rounded-lg">
                      <svg *ngIf="!cat.imageUrl" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    </div>
                    <div>
                      <p class="text-white font-medium">{{cat.name}}</p>
                      <p class="text-gray-500 text-xs">{{cat.description || 'No description'}}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <div *ngIf="cat.imageUrl" class="w-16 h-10 bg-gray-800 rounded overflow-hidden"><img [src]="cat.imageUrl" class="w-full h-full object-cover"></div>
                  <span *ngIf="!cat.imageUrl" class="text-gray-500 text-xs">No image</span>
                </td>
                <td class="py-4 px-2 text-gray-400">{{cat.slug}}</td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="cat.isActive ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'">{{cat.isActive ? 'Active' : 'Inactive'}}</span>
                </td>
                <td class="py-4 px-2 text-gray-400">{{cat.displayOrder}}</td>
                <td class="py-4 px-2">
                  <div class="flex gap-2">
                    <button (click)="editCategory(cat)" class="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button (click)="deleteCategory(cat.id)" class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="categories().length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500">No categories found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  showForm = signal(false);
  editingId = signal('');
  saving = signal(false);
  uploading = signal(false);
  error = signal('');
  form: any = { name: '', description: '', imageUrl: '', displayOrder: 0, isActive: true };

  constructor(private gameService: GameService) {}

  ngOnInit() { this.loadCategories(); }

  resetForm() { this.form = { name: '', description: '', imageUrl: '', displayOrder: 0, isActive: true }; this.error.set(''); }

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

  loadCategories() { this.gameService.getCategories().subscribe(res => this.categories.set(res.data || [])); }

  saveCategory() {
    if (!this.form.name) { this.error.set('Category name is required'); return; }
    this.saving.set(true);
    this.error.set('');
    const request = this.editingId()
      ? this.gameService.updateCategory(this.editingId(), this.form)
      : this.gameService.createCategory(this.form);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.editingId.set('');
        this.loadCategories();
        this.resetForm();
      },
      error: (err) => { this.saving.set(false); this.error.set(err.error?.message || 'Failed to save category'); }
    });
  }

  editCategory(cat: any) {
    this.form = { name: cat.name, description: cat.description || '', imageUrl: cat.imageUrl || '', displayOrder: cat.displayOrder, isActive: cat.isActive };
    this.editingId.set(cat.id);
    this.showForm.set(true);
    this.error.set('');
  }

  deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    this.gameService.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => this.error.set(err.error?.message || 'Failed to delete category')
    });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set('');
    this.resetForm();
  }
}
