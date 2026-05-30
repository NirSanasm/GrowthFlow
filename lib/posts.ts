import { Post } from '@/types';

interface PostRecord {
  id: string;
  content: string;
  thread_tweets: string[] | null;
  platforms: string[];
  status: string;
  scheduled_date: string;
  topic: string;
  industry: string;
  tone: string;
  media_url: string | null;
  created_at: string;
  updated_at: string;
}

export function mapPostRecord(record: PostRecord): Post {
  return {
    id: record.id,
    content: record.content,
    threadTweets: record.thread_tweets ?? undefined,
    platforms: record.platforms as Post['platforms'],
    status: record.status as Post['status'],
    scheduledDate: record.scheduled_date,
    topic: record.topic,
    industry: record.industry,
    tone: record.tone,
    mediaUrl: record.media_url ?? undefined,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function mapPostInsert(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    content: post.content,
    thread_tweets: post.threadTweets ?? null,
    platforms: post.platforms,
    status: post.status,
    scheduled_date: post.scheduledDate,
    topic: post.topic,
    industry: post.industry,
    tone: post.tone,
    media_url: post.mediaUrl ?? null,
  };
}
