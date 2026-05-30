import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { mapPostRecord } from '@/lib/posts';
import { isPostStatus, isSocialPlatform, Post } from '@/types';

function isMissingTableError(error: { code?: string; message?: string } | null, tableName: string) {
  return (
    error?.code === 'PGRST205' &&
    typeof error.message === 'string' &&
    error.message.includes(`'public.${tableName}'`)
  );
}

function missingTableResponse(tableName: string) {
  return NextResponse.json(
    {
      error: `Supabase table public.${tableName} is missing. Run supabase/migrations/20260530000000_init.sql in the Supabase SQL editor, then retry.`,
    },
    { status: 500 },
  );
}

function parseCreateBody(body: Record<string, unknown>): Omit<Post, 'id' | 'createdAt' | 'updatedAt'> | null {
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const scheduledDate = typeof body.scheduled_date === 'string' ? body.scheduled_date : '';
  const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
  const industry = typeof body.industry === 'string' ? body.industry.trim() : '';
  const tone = typeof body.tone === 'string' ? body.tone.trim() : '';
  const mediaUrl =
    typeof body.media_url === 'string' && body.media_url.trim().length > 0
      ? body.media_url.trim()
      : undefined;

  if (!content || !scheduledDate || !topic || !industry || !tone) {
    return null;
  }

  const platforms = Array.isArray(body.platforms)
    ? body.platforms.filter((value): value is string => typeof value === 'string').filter(isSocialPlatform)
    : [];
  const threadTweets = Array.isArray(body.thread_tweets)
    ? body.thread_tweets.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : undefined;
  const status = typeof body.status === 'string' && isPostStatus(body.status) ? body.status : 'draft';

  if (!platforms.length || Number.isNaN(new Date(scheduledDate).getTime())) {
    return null;
  }

  return {
    content,
    threadTweets,
    platforms,
    status,
    scheduledDate: new Date(scheduledDate).toISOString(),
    topic,
    industry,
    tone,
    mediaUrl,
  };
}

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('scheduled_date', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    if (isMissingTableError(error, 'posts')) {
      return missingTableResponse('posts');
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    posts: (data ?? []).map(mapPostRecord),
  });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = parseCreateBody(body);
  if (!parsed) {
    return NextResponse.json({ error: 'Missing or invalid post fields.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: parsed.content,
      thread_tweets: parsed.threadTweets ?? null,
      platforms: parsed.platforms,
      status: parsed.status,
      scheduled_date: parsed.scheduledDate,
      topic: parsed.topic,
      industry: parsed.industry,
      tone: parsed.tone,
      media_url: parsed.mediaUrl ?? null,
    })
    .select('*')
    .single();

  if (error) {
    if (isMissingTableError(error, 'posts')) {
      return missingTableResponse('posts');
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    post: mapPostRecord(data),
  });
}
