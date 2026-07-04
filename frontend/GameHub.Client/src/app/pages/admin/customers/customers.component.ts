import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';

interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  isBlocked: boolean;
  roles: string[];
  createdAt: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Customer Management</h2>
      </div>
      <div class="p-5">
        <div class="relative mb-4">
          <input type="text" placeholder="Search customers..." class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Customer</th>
                <th class="text-left py-3 px-2">Email</th>
                <th class="text-left py-3 px-2">Roles</th>
                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Joined</th>
                <th class="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users()" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td class="py-4 px-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <p class="text-white font-medium">{{user.fullName || 'N/A'}}</p>
                  </div>
                </td>
                <td class="py-4 px-2 text-gray-400">{{user.email}}</td>
                <td class="py-4 px-2">
                  <div class="flex gap-1 flex-wrap">
                    <span *ngFor="let role of user.roles" class="px-2 py-0.5 rounded-full text-xs bg-indigo-900/50 text-indigo-400">{{role}}</span>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <span class="px-2 py-1 rounded-full text-xs" [ngClass]="{
                    'bg-green-900/50 text-green-400': !user.isBlocked && user.isActive,
                    'bg-red-900/50 text-red-400': user.isBlocked,
                    'bg-gray-800 text-gray-400': !user.isActive && !user.isBlocked
                  }">
                    {{user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}}
                  </span>
                </td>
                <td class="py-4 px-2 text-gray-400">{{user.createdAt | date:'mediumDate'}}</td>
                <td class="py-4 px-2">
                  <button class="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all" [title]="user.isBlocked ? 'Unblock' : 'Block'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="users().length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500">No customers found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  users = signal<AdminUser[]>([]);
  constructor(private gameService: GameService) {}
  ngOnInit() {
    this.gameService.getUsers().subscribe({
      next: res => this.users.set(res.data || []),
      error: () => this.users.set([])
    });
  }
}
