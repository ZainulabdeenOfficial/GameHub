export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string | null;
  profilePictureUrl: string | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
  statusCode: number;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categoryName: string;
  platform: number;
  publisherId: string | null;
  publisherName: string;
  developerId: string | null;
  developerName: string;
  releaseDate: Date;
  ageRating: number;
  languages: string;
  genres: string;
  gameSize: number;
  version: string;
  status: number;
  isFeatured: boolean;
  isPopular: boolean;
  isTrending: boolean;
  isEditorsChoice: boolean;
  totalDownloads: number;
  totalViews: number;
  averageRating: number;
  totalReviews: number;
  thumbnailUrl: string | null;
  bannerUrl: string | null;
  minimumRequirements: string | null;
  recommendedRequirements: string | null;
  downloadLink: string | null;
  steamLink: string | null;
  epicLink: string | null;
  trailerUrl: string | null;
  createdAt: Date;
  images: GameImage[];
  screenshots: Screenshot[];
}

export interface GameListDto {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  averageRating: number;
  status: number;
  isFeatured: boolean;
  isTrending: boolean;
  totalDownloads: number;
}

export interface GameImage {
  id: string;
  url: string;
  publicId: string | null;
  altText: string | null;
  displayOrder: number;
  isThumbnail: boolean;
}

export interface Screenshot {
  id: string;
  url: string;
  publicId: string | null;
  caption: string | null;
  displayOrder: number;
}

export interface GameStats {
  totalGames: number;
  totalDownloads: number;
  totalReviews: number;
  totalUsers: number;
}

export interface DashboardData {
  totalUsers: number;
  totalGames: number;
  activeUsers: number;
  newUsers: number;
  totalReviews: number;
  totalDownloads: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  parentCategoryId: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface ReviewDto {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userProfilePicture: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
  likes: number;
}

export interface CreateReviewRequest {
  gameId: string;
  rating: number;
  comment: string;
}

export interface Publisher {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
}

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
}

export interface BannerDto {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  gameId: string | null;
  gameName: string | null;
  gameSlug: string | null;
  linkUrl: string | null;
  buttonText: string | null;
  backgroundColor: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBannerRequest {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  youtubeUrl?: string | null;
  gameId?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  backgroundColor?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface UpdateBannerRequest {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  youtubeUrl?: string | null;
  gameId?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  backgroundColor?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface HeroBannerDto {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  badge: string | null;
  discountPercentage: number | null;
  primaryButtonText: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  gameId: string | null;
  gameName: string | null;
  gameSlug: string | null;
  categoryName: string | null;
  platformName: string | null;
  overlayOpacity: number;
  overlayColor: string;
  textColor: string;
  fontFamily: string | null;
  fontSize: string | null;
  fontWeight: string | null;
  buttonStyle: string;
  buttonColor: string;
  buttonHoverColor: string;
  horizontalAlignment: string;
  verticalAlignment: string;
  backgroundType: string;
  imageUrl: string | null;
  videoUrl: string | null;
  youtubeUrl: string | null;
  mp4Url: string | null;
  webMUrl: string | null;
  solidColor: string;
  gradientStart: string | null;
  gradientEnd: string | null;
  gradientDirection: string | null;
  animatedBackground: boolean;
  lottieUrl: string | null;
  threeJsEnabled: boolean;
  particleEnabled: boolean;
  particleType: string | null;
  backgroundLayers: string | null;
  floatingObjects: boolean;
  floatingControllers: boolean;
  floatingCds: boolean;
  floatingCubes: boolean;
  textAnimation: string;
  autoplayEnabled: boolean;
  infiniteLoopEnabled: boolean;
  carouselTransitionSpeed: number;
  carouselAnimationType: string;
  pauseOnHover: boolean;
  sortOrder: number;
  priority: number;
  isPublished: boolean;
  isFeatured: boolean;
  isArchived: boolean;
  publishStartDate: string | null;
  publishEndDate: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  bgColor: string | null;
  heroHeight: string | null;
  heroWidth: string | null;
  cssBorderRadius: string | null;
  cssShadow: string | null;
  cssSpacing: string | null;
  cssPadding: string | null;
  cssMargins: string | null;
  animationDuration: number;
  transitionSpeed: number;
  desktopSettings: string | null;
  tabletSettings: string | null;
  mobileSettings: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ReorderBannerRequest {
  id: string;
  sortOrder: number;
}
