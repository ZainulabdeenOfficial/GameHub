import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Admin Management</h2>
        <button (click)="showForm.set(true); editingId.set(''); resetForm()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Add Admin</button>
      </div>

      <div *ngIf="showForm()" class="p-5 border-b border-gray-800 bg-gray-800/30">
        <h3 class="text-lg font-semibold text-white mb-4">{{editingId() ? 'Edit Admin' : 'Create New Admin'}}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-gray-400 text-sm block mb-1">Full Name *</label>
            <input type="text" [(ngModel)]="form.fullName" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="text-gray-400 text-sm block mb-1">Email *</label>
            <input type="email" [(ngModel)]="form.email" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
          <div *ngIf="!editingId()">
            <label class="text-gray-400 text-sm block mb-1">Password *</label>
            <input type="password" [(ngModel)]="form.password" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="saveAdmin()" [disabled]="saving()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">{{saving() ? 'Saving...' : editingId() ? 'Update' : 'Create Admin'}}</button>
          <button (click)="cancelForm()" class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">Cancel</button>
        </div>
        <p *ngIf="error()" class="text-red-400 text-sm mt-2">{{error()}}</p>
      </div>

      <div class="p-5">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Name</th>
                <th class="text-left py-3 px-2">Email</th>
                <th class="text-left py-3 px-2">Roles</th>
                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let admin of admins()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-4 px-2 text-white">{{admin.fullName || admin.userName}}</td>
                <td class="py-4 px-2 text-gray-400">{{admin.email}}</td>
                <td class="py-4 px-2">
                  <span *ngFor="let r of admin.roles" class="px-2 py-1 rounded-full text-xs mr-1" [ngClass]="r === 'SuperAdmin' ? 'bg-purple-900/50 text-purple-400' : 'bg-indigo-900/50 text-indigo-400'">{{r}}</span>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="!admin.isBlocked && admin.isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'">
                    {{!admin.isBlocked && admin.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td class="py-4 px-2">
                  <div class="flex gap-2">
                    <button *ngIf="admin.roles.includes('Admin')" (click)="deleteAdmin(admin.id)" class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="admins().length === 0">
                <td colspan="5" class="text-center py-10 text-gray-500">No admins found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminsComponent implements OnInit {
  admins = signal<any[]>([]);
  showForm = signal(false);
  editingId = signal('');
  saving = signal(false);
  error = signal('');
  form = { email: '', password: '', fullName: '' };

  constructor(private gameService: GameService) {}

  ngOnInit() { this.loadAdmins(); }

  resetForm() { this.form = { email: '', password: '', fullName: '' }; this.error.set(''); }
  cancelForm() { this.showForm.set(false); this.editingId.set(''); this.resetForm(); }

  loadAdmins() {
    this.gameService.getAdmins().subscribe(res => this.admins.set(res.data || []));
  }

  saveAdmin() {
    if (!this.form.fullName || !this.form.email) {
      this.error.set('Name and email are required');
      return;
    }
    if (!this.editingId() && !this.form.password) {
      this.error.set('Password is required');
      return;
    }
    this.saving.set(true);
    this.error.set('');

    const request = this.gameService.createAdmin({
      email: this.form.email,
      password: this.form.password,
      fullName: this.form.fullName
    });

    request.subscribe({
      next: () => { this.saving.set(false); this.showForm.set(false); this.loadAdmins(); },
      error: (err) => { this.saving.set(false); this.error.set(err.error?.message || 'Failed to create admin'); }
    });
  }

  deleteAdmin(id: string) {
    if (!confirm('Delete this admin?')) return;
    this.gameService.deleteAdmin(id).subscribe({ next: () => this.loadAdmins() });
  }
}
