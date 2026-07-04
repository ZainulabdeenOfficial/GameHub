import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Game, GameListDto, DashboardData, Category, ReviewDto, CreateReviewRequest, Publisher, Developer, BannerDto, CreateBannerRequest, UpdateBannerRequest, GameStats, HeroBannerDto, ReorderBannerRequest, Screenshot } from '../models/auth.model';
import { API_URL, API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<GameStats>> {
    return this.http.get<ApiResponse<GameStats>>(`${API_URL}${API_ENDPOINTS.games.stats}`);
  }

  getAll(filter?: any): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(key => {
        if (filter[key] !== null && filter[key] !== undefined) {
          params = params.set(key, filter[key]);
        }
      });
    }
    return this.http.get<ApiResponse<any>>(`${API_URL}${API_ENDPOINTS.games.base}`, { params });
  }

  getById(id: string): Observable<ApiResponse<Game>> {
    return this.http.get<ApiResponse<Game>>(`${API_URL}${API_ENDPOINTS.games.base}/${id}`);
  }

  getFeatured(): Observable<ApiResponse<GameListDto[]>> {
    return this.http.get<ApiResponse<GameListDto[]>>(`${API_URL}${API_ENDPOINTS.games.featured}`);
  }

  getTrending(): Observable<ApiResponse<GameListDto[]>> {
    return this.http.get<ApiResponse<GameListDto[]>>(`${API_URL}${API_ENDPOINTS.games.trending}`);
  }

  getLatest(count: number = 10): Observable<ApiResponse<GameListDto[]>> {
    return this.http.get<ApiResponse<GameListDto[]>>(`${API_URL}${API_ENDPOINTS.games.latest}?count=${count}`);
  }

  search(term: string): Observable<ApiResponse<GameListDto[]>> {
    return this.http.get<ApiResponse<GameListDto[]>>(`${API_URL}${API_ENDPOINTS.games.search}?term=${term}`);
  }

  create(game: any): Observable<ApiResponse<Game>> {
    return this.http.post<ApiResponse<Game>>(`${API_URL}${API_ENDPOINTS.games.base}`, game);
  }

  update(id: string, game: any): Observable<ApiResponse<Game>> {
    return this.http.put<ApiResponse<Game>>(`${API_URL}${API_ENDPOINTS.games.base}/${id}`, game);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.games.base}/${id}`);
  }

  bulkDelete(ids: string[]): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.games.bulkDelete}`, ids);
  }

  duplicate(id: string): Observable<ApiResponse<Game>> {
    return this.http.post<ApiResponse<Game>>(`${API_URL}${API_ENDPOINTS.games.duplicate(id)}`, {});
  }

  changeStatus(id: string, status: string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.games.status(id)}`, JSON.stringify(status));
  }

  getDashboard(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(`${API_URL}${API_ENDPOINTS.admin.dashboard}`);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${API_URL}${API_ENDPOINTS.categories}`);
  }

  getUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${API_URL}${API_ENDPOINTS.admin.users}`);
  }

  createCategory(data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${API_URL}${API_ENDPOINTS.categories}`, data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${API_URL}${API_ENDPOINTS.categories}/${id}`, data);
  }

  deleteCategory(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.categories}/${id}`);
  }

  uploadImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${API_URL}${API_ENDPOINTS.upload.image}`, formData);
  }

  uploadImageFromUrl(url: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${API_URL}${API_ENDPOINTS.upload.imageUrl}`, { url });
  }

  uploadFile(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${API_URL}${API_ENDPOINTS.upload.file}`, formData);
  }

  getGameReviews(gameId: string): Observable<ApiResponse<ReviewDto[]>> {
    return this.http.get<ApiResponse<ReviewDto[]>>(`${API_URL}${API_ENDPOINTS.reviews.byGame(gameId)}`);
  }

  createReview(request: CreateReviewRequest): Observable<ApiResponse<ReviewDto>> {
    return this.http.post<ApiResponse<ReviewDto>>(`${API_URL}${API_ENDPOINTS.reviews.base}`, request);
  }

  getPublishers(): Observable<ApiResponse<Publisher[]>> {
    return this.http.get<ApiResponse<Publisher[]>>(`${API_URL}${API_ENDPOINTS.publishers}`);
  }

  getDevelopers(): Observable<ApiResponse<Developer[]>> {
    return this.http.get<ApiResponse<Developer[]>>(`${API_URL}${API_ENDPOINTS.developers}`);
  }

  getActiveBanners(): Observable<ApiResponse<BannerDto[]>> {
    return this.http.get<ApiResponse<BannerDto[]>>(`${API_URL}${API_ENDPOINTS.banners.active}`);
  }

  getAllBanners(): Observable<ApiResponse<BannerDto[]>> {
    return this.http.get<ApiResponse<BannerDto[]>>(`${API_URL}${API_ENDPOINTS.banners.base}`);
  }

  getBannerById(id: string): Observable<ApiResponse<BannerDto>> {
    return this.http.get<ApiResponse<BannerDto>>(`${API_URL}${API_ENDPOINTS.banners.base}/${id}`);
  }

  createBanner(request: CreateBannerRequest): Observable<ApiResponse<BannerDto>> {
    return this.http.post<ApiResponse<BannerDto>>(`${API_URL}${API_ENDPOINTS.banners.base}`, request);
  }

  updateBanner(id: string, request: UpdateBannerRequest): Observable<ApiResponse<BannerDto>> {
    return this.http.put<ApiResponse<BannerDto>>(`${API_URL}${API_ENDPOINTS.banners.base}/${id}`, request);
  }

  deleteBanner(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.banners.base}/${id}`);
  }

  sendContactMessage(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API_URL}${API_ENDPOINTS.contactMessages}`, data);
  }

  // ========== HERO BANNERS ==========
  getHeroBanners(): Observable<ApiResponse<HeroBannerDto[]>> {
    return this.http.get<ApiResponse<HeroBannerDto[]>>(`${API_URL}${API_ENDPOINTS.heroBanners.base}`);
  }

  getPublishedHeroBanners(): Observable<ApiResponse<HeroBannerDto[]>> {
    return this.http.get<ApiResponse<HeroBannerDto[]>>(`${API_URL}${API_ENDPOINTS.heroBanners.published}`);
  }

  getFeaturedHeroBanners(): Observable<ApiResponse<HeroBannerDto[]>> {
    return this.http.get<ApiResponse<HeroBannerDto[]>>(`${API_URL}${API_ENDPOINTS.heroBanners.featured}`);
  }

  getHeroBannerById(id: string): Observable<ApiResponse<HeroBannerDto>> {
    return this.http.get<ApiResponse<HeroBannerDto>>(`${API_URL}${API_ENDPOINTS.heroBanners.base}/${id}`);
  }

  createHeroBanner(request: any): Observable<ApiResponse<HeroBannerDto>> {
    return this.http.post<ApiResponse<HeroBannerDto>>(`${API_URL}${API_ENDPOINTS.heroBanners.base}`, request);
  }

  updateHeroBanner(id: string, request: any): Observable<ApiResponse<HeroBannerDto>> {
    return this.http.put<ApiResponse<HeroBannerDto>>(`${API_URL}${API_ENDPOINTS.heroBanners.base}/${id}`, request);
  }

  deleteHeroBanner(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.heroBanners.base}/${id}`);
  }

  duplicateHeroBanner(id: string): Observable<ApiResponse<HeroBannerDto>> {
    return this.http.post<ApiResponse<HeroBannerDto>>(`${API_URL}${API_ENDPOINTS.heroBanners.duplicate(id)}`, {});
  }

  reorderHeroBanners(items: ReorderBannerRequest[]): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.heroBanners.reorder}`, items);
  }

  togglePublishHeroBanner(id: string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.heroBanners.togglePublish(id)}`, {});
  }

  toggleFeaturedHeroBanner(id: string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.heroBanners.toggleFeatured(id)}`, {});
  }

  archiveHeroBanner(id: string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.heroBanners.archive(id)}`, {});
  }

  // ========== SCREENSHOTS ==========
  getScreenshots(gameId: string): Observable<ApiResponse<Screenshot[]>> {
    return this.http.get<ApiResponse<Screenshot[]>>(`${API_URL}${API_ENDPOINTS.screenshots.byGame(gameId)}`);
  }

  addScreenshot(gameId: string, data: any): Observable<ApiResponse<Screenshot>> {
    return this.http.post<ApiResponse<Screenshot>>(`${API_URL}${API_ENDPOINTS.screenshots.byGame(gameId)}`, data);
  }

  updateScreenshot(gameId: string, screenshotId: string, data: any): Observable<ApiResponse<Screenshot>> {
    return this.http.put<ApiResponse<Screenshot>>(`${API_URL}${API_ENDPOINTS.screenshots.item(gameId, screenshotId)}`, data);
  }

  deleteScreenshot(gameId: string, screenshotId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.screenshots.item(gameId, screenshotId)}`);
  }

  reorderScreenshots(gameId: string, items: { id: string; displayOrder: number }[]): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.screenshots.reorder(gameId)}`, items);
  }

  // ========== DEVELOPERS ==========
  createDeveloper(data: Partial<Developer>): Observable<ApiResponse<Developer>> {
    return this.http.post<ApiResponse<Developer>>(`${API_URL}${API_ENDPOINTS.developers}`, data);
  }

  updateDeveloper(id: string, data: Partial<Developer>): Observable<ApiResponse<Developer>> {
    return this.http.put<ApiResponse<Developer>>(`${API_URL}${API_ENDPOINTS.developers}/${id}`, data);
  }

  deleteDeveloper(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.developers}/${id}`);
  }

  getDeveloperById(id: string): Observable<ApiResponse<Developer>> {
    return this.http.get<ApiResponse<Developer>>(`${API_URL}${API_ENDPOINTS.developers}/${id}`);
  }

  // ========== PUBLISHERS ==========
  createPublisher(data: Partial<Publisher>): Observable<ApiResponse<Publisher>> {
    return this.http.post<ApiResponse<Publisher>>(`${API_URL}${API_ENDPOINTS.publishers}`, data);
  }

  updatePublisher(id: string, data: Partial<Publisher>): Observable<ApiResponse<Publisher>> {
    return this.http.put<ApiResponse<Publisher>>(`${API_URL}${API_ENDPOINTS.publishers}/${id}`, data);
  }

  deletePublisher(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${API_URL}${API_ENDPOINTS.publishers}/${id}`);
  }

  getPublisherById(id: string): Observable<ApiResponse<Publisher>> {
    return this.http.get<ApiResponse<Publisher>>(`${API_URL}${API_ENDPOINTS.publishers}/${id}`);
  }

  downloadGame(id: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${API_URL}/games/${id}/download`, {});
  }

  getAdmins(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${API_URL}/admin/admins`);
  }

  createAdmin(data: { email: string; password: string; fullName: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API_URL}/admin/admins`, data);
  }

  deleteAdmin(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${API_URL}/admin/admins/${id}`);
  }
}
