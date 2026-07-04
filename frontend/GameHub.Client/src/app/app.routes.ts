import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'games', loadComponent: () => import('./pages/admin/games/games.component').then(m => m.GamesComponent) },
      { path: 'categories', loadComponent: () => import('./pages/admin/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'customers', loadComponent: () => import('./pages/admin/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'banners', loadComponent: () => import('./pages/admin/banners/banners.component').then(m => m.BannersComponent) },
      { path: 'developers', loadComponent: () => import('./pages/admin/developers/developers.component').then(m => m.DevelopersComponent) },
      { path: 'publishers', loadComponent: () => import('./pages/admin/publishers/publishers.component').then(m => m.PublishersComponent) },
      { path: 'admins', loadComponent: () => import('./pages/admin/admins/admins.component').then(m => m.AdminsComponent) },
    ]
  },
  { path: 'games/:id', loadComponent: () => import('./pages/game-detail/game-detail.component').then(m => m.GameDetailComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./pages/static/static-pages.component').then(m => m.PrivacyPolicyComponent) },
  { path: 'terms-of-service', loadComponent: () => import('./pages/static/static-pages.component').then(m => m.TermsOfServiceComponent) },
  { path: 'refund-policy', loadComponent: () => import('./pages/static/static-pages.component').then(m => m.RefundPolicyComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'help', loadComponent: () => import('./pages/help/help.component').then(m => m.HelpComponent) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
  { path: 'returns', loadComponent: () => import('./pages/returns/returns.component').then(m => m.ReturnsComponent) },
  { path: '**', redirectTo: '' }
];
