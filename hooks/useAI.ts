import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { simulateAIGenerator } from '@/lib/mock-generator';
import { GeneratedContentResult, SocialPlatform } from '@/types';

async function requestGeneratedContent(payload: {
  topic: string;
  industry: string;
  tone: string;
  platform: SocialPlatform;
  isThread?: boolean;
}): Promise<GeneratedContentResult> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || 'Failed to generate content.');
  }

  return body.result as GeneratedContentResult;
}

export function useAI() {
  const { authMode } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [streamedTweets, setStreamedTweets] = useState<string[]>([]);

  const generateContent = async (params: {
    topic: string;
    industry: string;
    tone: string;
    platform: SocialPlatform;
    isThread?: boolean;
  }) => {
    setGenerating(true);
    setStreamedText('');
    setStreamedTweets([]);

    try {
      const result =
        authMode === 'authenticated'
          ? await requestGeneratedContent(params)
          : simulateAIGenerator(params);

      if (params.platform === 'twitter' && params.isThread && result.thread?.length) {
        const totalTweets = result.thread;
        const progressTweets: string[] = Array(totalTweets.length).fill('');
        setStreamedTweets(progressTweets);

        for (let tweetIndex = 0; tweetIndex < totalTweets.length; tweetIndex += 1) {
          const tweet = totalTweets[tweetIndex];
          let currentString = '';

          for (let charIndex = 0; charIndex < tweet.length; charIndex += 1) {
            currentString += tweet[charIndex];
            progressTweets[tweetIndex] = currentString;
            setStreamedTweets([...progressTweets]);
            await new Promise((resolve) => setTimeout(resolve, 7));
          }

          await new Promise((resolve) => setTimeout(resolve, 90));
        }
      } else {
        let currentString = '';

        for (let i = 0; i < result.content.length; i += 1) {
          currentString += result.content[i];
          setStreamedText(currentString);
          await new Promise((resolve) => setTimeout(resolve, 8));
        }
      }

      return result;
    } finally {
      setGenerating(false);
    }
  };

  return { generating, streamedText, streamedTweets, generateContent };
}
