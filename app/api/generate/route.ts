import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GeneratedContentResult, isSocialPlatform, SocialPlatform } from '@/types';

interface GenerateBody {
  topic?: unknown;
  industry?: unknown;
  tone?: unknown;
  platform?: unknown;
  isThread?: unknown;
}

function buildPrompt({
  topic,
  industry,
  tone,
  platform,
  isThread,
}: {
  topic: string;
  industry: string;
  tone: string;
  platform: SocialPlatform;
  isThread: boolean;
}) {
  return [
    `Topic: ${topic}`,
    `Industry: ${industry}`,
    `Tone: ${tone}`,
    `Platform: ${platform}`,
    `Thread mode: ${isThread ? 'yes' : 'no'}`,
    'Write conversion-oriented organic social content for a B2B or startup audience.',
    'Use plain text only. Preserve strong readability with line breaks.',
    'Avoid markdown, generic filler, and excessive hashtags.',
    isThread
      ? 'Return a sharp 5-part X thread. The content field must exactly match the first tweet.'
      : 'Return a single finished post optimized for the selected platform. The thread field must be an empty array.',
  ].join('\n');
}

function buildResponseSchema(isThread: boolean) {
  return {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'The full post text, or the first tweet when thread mode is enabled.',
      },
      thread: {
        type: 'array',
        description: isThread
          ? 'Exactly five tweets for the X thread, with the first item matching content.'
          : 'An empty array when thread mode is disabled.',
        items: {
          type: 'string',
        },
        minItems: isThread ? 5 : 0,
        maxItems: isThread ? 5 : 0,
      },
    },
    required: ['content', 'thread'],
    additionalProperties: false,
  };
}

function extractGeminiText(responseBody: Record<string, unknown>) {
  const candidates = Array.isArray(responseBody.candidates) ? responseBody.candidates : [];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }

    const content = (candidate as { content?: Record<string, unknown> }).content;
    const parts = Array.isArray(content?.parts) ? content.parts : [];

    for (const part of parts) {
      if (part && typeof part === 'object' && typeof (part as { text?: unknown }).text === 'string') {
        return (part as { text: string }).text;
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Create an account and sign in to use live AI generation. Demo mode keeps the mock generator.' },
      { status: 401 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as GenerateBody | null;
  const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
  const industry = typeof body?.industry === 'string' ? body.industry.trim() : '';
  const tone = typeof body?.tone === 'string' ? body.tone.trim() : '';
  const platform =
    typeof body?.platform === 'string' && isSocialPlatform(body.platform) ? body.platform : null;
  const isThread = body?.isThread === true;

  if (!topic || !industry || !tone || !platform) {
    return NextResponse.json({ error: 'Missing generator fields.' }, { status: 400 });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const upstreamResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [
          {
            text: 'You are a senior social strategist for SaaS and B2B brands. Produce sharp, credible platform-native copy that sounds current and specific.',
          },
        ],
      },
      contents: [
        {
          parts: [
            {
              text: buildPrompt({
                topic,
                industry,
                tone,
                platform,
                isThread,
              }),
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: buildResponseSchema(isThread),
      },
    }),
  });

  const responseBody = (await upstreamResponse.json().catch(() => null)) as Record<string, unknown> | null;

  if (!upstreamResponse.ok || !responseBody) {
    const errorMessage =
      (responseBody?.error as { message?: string } | undefined)?.message || 'Gemini request failed.';
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  const outputText = extractGeminiText(responseBody);
  if (!outputText) {
    return NextResponse.json({ error: 'Gemini returned an empty response.' }, { status: 502 });
  }

  let parsed: { content?: string; thread?: string[] } | null = null;
  try {
    parsed = JSON.parse(outputText) as { content?: string; thread?: string[] };
  } catch {
    return NextResponse.json({ error: 'Unable to parse Gemini response.' }, { status: 502 });
  }

  const result: GeneratedContentResult = {
    content: parsed.content?.trim() || '',
    thread: parsed.thread?.filter((item) => item.trim().length > 0) || undefined,
  };

  if (!result.content) {
    return NextResponse.json({ error: 'Gemini returned invalid post content.' }, { status: 502 });
  }

  if (!isThread) {
    delete result.thread;
  }

  return NextResponse.json({ result });
}
