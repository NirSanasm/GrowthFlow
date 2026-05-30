import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { mapPostRecord } from '@/lib/posts';
import { isPostStatus, isSocialPlatform } from '@/types';

interface RouteContext {
  params: {
    id: string;
  };
}

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

async function requireUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.content === 'string') {
    updates.content = body.content.trim();
  }

  if (Array.isArray(body.threadTweets)) {
    updates.thread_tweets = body.threadTweets.filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    );
  }

  if (Array.isArray(body.platforms)) {
    const platforms = body.platforms
      .filter((value): value is string => typeof value === 'string')
      .filter(isSocialPlatform);
    if (!platforms.length) {
      return NextResponse.json({ error: 'At least one platform is required.' }, { status: 400 });
    }
    updates.platforms = platforms;
  }

  if (typeof body.status === 'string') {
    if (!isPostStatus(body.status)) {
      return NextResponse.json({ error: 'Invalid post status.' }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (typeof body.scheduledDate === 'string') {
    const scheduledDate = new Date(body.scheduledDate);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduled date.' }, { status: 400 });
    }
    updates.scheduled_date = scheduledDate.toISOString();
  }

  if (typeof body.topic === 'string') {
    updates.topic = body.topic.trim();
  }

  if (typeof body.industry === 'string') {
    updates.industry = body.industry.trim();
  }

  if (typeof body.tone === 'string') {
    updates.tone = body.tone.trim();
  }

  if (typeof body.mediaUrl === 'string') {
    updates.media_url = body.mediaUrl.trim() || null;
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)
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

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    if (isMissingTableError(error, 'posts')) {
      return missingTableResponse('posts');
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
