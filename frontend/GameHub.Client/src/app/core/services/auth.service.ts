import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, ApiResponse } from '../models/auth.model';
import { API_URL, API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  private userSignal = signal<AuthResponse | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  user = this.userSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  isAdmin = computed(() => {
    const roles = this.userSignal()?.roles;
    if (!roles || !Array.isArray(roles)) return false;
    return roles.some(r => r === 'Admin' || r === 'SuperAdmin');
  });

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${API_URL}${API_ENDPOINTS.auth.login}`, request).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${API_URL}${API_ENDPOINTS.auth.register}`, request).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API_URL}${API_ENDPOINTS.auth.forgotPassword}`, { email });
  }

  verifyResetCode(email: string, code: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API_URL}${API_ENDPOINTS.auth.verifyResetCode}`, { email, code });
  }

  resetPassword(email: string, code: string, password: string, confirmPassword: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API_URL}${API_ENDPOINTS.auth.resetPassword}`, { email, code, password, confirmPassword });
  }

  logout(): void {
    const userId = this.userSignal()?.userId;
    if (userId) {
      this.http.post(`${API_URL}${API_ENDPOINTS.auth.logout}`, {}).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const accessToken = localStorage.getItem(this.TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    return this.http.post<ApiResponse<AuthResponse>>(`${API_URL}${API_ENDPOINTS.auth.refreshToken}`, { accessToken, refreshToken }).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  private setSession(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.accessToken);
    localStorage.setItem(this.REFRESH_KEY, auth.refreshToken);
    this.userSignal.set(auth);
    this.isAuthenticatedSignal.set(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rawRoles = payload.role ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const roles: string[] = !rawRoles ? [] : Array.isArray(rawRoles) ? rawRoles : [rawRoles];
        const userId = payload.sub ?? payload.nameidentifier ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '';
        const email = payload.email ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? '';
        const fullName = payload.unique_name ?? payload.name ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? null;
        const user: AuthResponse = {
          userId,
          email,
          fullName,
          profilePictureUrl: null,
          accessToken: token,
          refreshToken: localStorage.getItem(this.REFRESH_KEY) || '',
          expiresAt: new Date(payload.exp * 1000),
          roles,
        };
        if (user.expiresAt > new Date()) {
          this.userSignal.set(user);
          this.isAuthenticatedSignal.set(true);
        }
      } catch {
        this.clearSession();
      }
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshTokenValue(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }
}
