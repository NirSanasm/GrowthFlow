export const SOCIAL_PLATFORMS = ['linkedin', 'twitter', 'instagram'] as const;
export const POST_STATUSES = ['draft', 'scheduled', 'published'] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type PostStatus = (typeof POST_STATUSES)[number];
export type AuthMode = 'guest' | 'demo' | 'authenticated';

export interface Post {
  id: string;
  content: string;          // Combined content or main caption
  threadTweets?: string[];  // Separate tweets if Twitter thread mode is active
  platforms: SocialPlatform[];
  status: PostStatus;
  scheduledDate: string;    // ISO 8601 string
  topic: string;
  industry: string;
  tone: string;
  mediaUrl?: string;        // Mock media attachments (optional)
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  companyName?: string;
}

export interface AnalyticsSummary {
  totalImpressions: number;
  engagementRate: number;
  scheduledCount: number;
  publishedCount: number;
  weeklyGrowth: number;
}

export interface GeneratedContentResult {
  content: string;
  thread?: string[];
}

export interface AuthSignUpResult {
  needsEmailVerification: boolean;
}

export function isSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(value as SocialPlatform);
}

export function isPostStatus(value: string): value is PostStatus {
  return POST_STATUSES.includes(value as PostStatus);
}
