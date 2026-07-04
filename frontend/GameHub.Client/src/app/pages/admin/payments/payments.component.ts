import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-900 rounded-xl border border-gray-800">
      <div class="p-5 border-b border-gray-800">
        <h2 class="text-xl font-bold text-white">Payment Transactions</h2>
      </div>
      <div class="p-5">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-gray-800">
                <th class="text-left py-3 px-2">Transaction ID</th>
                <th class="text-left py-3 px-2">Order</th>
                <th class="text-left py-3 px-2">Customer</th>
                <th class="text-left py-3 px-2">Amount</th>
                <th class="text-left py-3 px-2">Method</th>
                <th class="text-left py-3 px-2">Status</th>
                <th class="text-left py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                <td colspan="7" class="text-center py-10 text-gray-500">Payment data will appear here once orders are placed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PaymentsComponent {}
