import { Post, User } from '@/types';

export const DEMO_STORAGE_USER_KEY = 'growthflow_demo_user';
export const DEMO_STORAGE_POSTS_KEY = 'growthflow_demo_posts';
export const DEMO_SESSION_COOKIE = 'growthflow-demo-session';

export function createAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

export function getDemoUser(): User {
  return {
    id: 'demo-user-123',
    name: 'Sarah Jenkins',
    email: 'sarah@growthflow.io',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    companyName: 'GrowthFlow AI',
  };
}

export function createDemoSeedPosts(): Post[] {
  const now = new Date();

  const createFutureDate = (daysAhead: number, hoursOffset: number) => {
    const date = new Date(now);
    date.setDate(now.getDate() + daysAhead);
    date.setHours(hoursOffset, 0, 0, 0);
    return date.toISOString();
  };

  const createPastDate = (daysAgo: number, hoursOffset: number) => {
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    date.setHours(hoursOffset, 0, 0, 0);
    return date.toISOString();
  };

  return [
    {
      id: 'seed-1',
      content: 'Excited to announce the private beta launch of GrowthFlow AI! 🚀\n\nWe are redefining how B2B teams handle operational leverage. No more scattered spreadsheets or endless sync meetings.\n\nBuilt on a high-velocity Next.js stack with optimized workflow orchestration, we are scaling content execution speeds by 10x.\n\nWant early access? Drop a comment below! 👇',
      platforms: ['linkedin', 'twitter'],
      status: 'scheduled',
      scheduledDate: createFutureDate(2, 10),
      topic: 'Product Launch',
      industry: 'tech',
      tone: 'Professional',
      createdAt: createPastDate(1, 9),
      updatedAt: createPastDate(1, 9),
    },
    {
      id: 'seed-2',
      content: 'Unpopular opinion: high team headcount is a cost, not a badge of honor.\n\nMost startup teams do not have a hiring problem. They have a leverage problem.\n\nInvest in async documentation, automated handoffs, and cleaner operating loops before you add more people.',
      platforms: ['linkedin'],
      status: 'published',
      scheduledDate: createPastDate(2, 14),
      topic: 'Team Scaling',
      industry: 'productivity',
      tone: 'Authoritative',
      createdAt: createPastDate(3, 10),
      updatedAt: createPastDate(2, 14),
    },
    {
      id: 'seed-3',
      content: '🧵 1/5: The hidden cost of ignoring cash flow unit economics is killing modern SaaS startups.\n\nProduct momentum does not fix a broken cash model. Here is a 3-step capital-efficiency playbook to extend your runway by 6+ months: 👇',
      threadTweets: [
        '🧵 1/5: The hidden cost of ignoring cash flow unit economics is killing modern SaaS startups.\n\nProduct momentum does not fix a broken cash model. Here is a 3-step capital-efficiency playbook to extend your runway by 6+ months: 👇',
        '2/5: Start with gross margin reality.\n\nIf support, infra, and services are silently eating margin, your pricing story is fiction.',
        '3/5: Make renewals part of product planning.\n\nRetention is the cleanest growth lever when capital is tight.',
        '4/5: Tie every acquisition channel to payback speed.\n\nFast CAC recovery buys optionality.',
        '5/5: Cash discipline is not defensive. It is strategic.\n\nThe more efficient your system, the longer you can compound.',
      ],
      platforms: ['twitter'],
      status: 'published',
      scheduledDate: createPastDate(4, 11),
      topic: 'Cash Flow',
      industry: 'finance',
      tone: 'Professional',
      createdAt: createPastDate(5, 8),
      updatedAt: createPastDate(4, 11),
    },
    {
      id: 'seed-4',
      content: 'Your calendar is a strategy document.\n\nIf every hour is fragmented, your team is not operating at capacity. Protect deep work like a core asset.',
      platforms: ['twitter'],
      status: 'draft',
      scheduledDate: createFutureDate(4, 11),
      topic: 'Productivity Hacks',
      industry: 'productivity',
      tone: 'Witty',
      createdAt: createPastDate(1, 8),
      updatedAt: createPastDate(1, 8),
    },
    {
      id: 'seed-5',
      content: 'Operational leverage > hard hustle. 📊\n\nToo many founders measure progress by exhaustion. Strong systems create growth without constant fire drills.\n\nSwipe left for the system breakdown. ➡️\n\n#SaaS #Automation #GrowthMindset #SystemsDesign',
      platforms: ['instagram'],
      status: 'scheduled',
      scheduledDate: createFutureDate(1, 16),
      topic: 'Systems Over Hustle',
      industry: 'marketing',
      tone: 'Inspiring',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
}

export function loadDemoUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(DEMO_STORAGE_USER_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function persistDemoUser(user: User) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DEMO_STORAGE_USER_KEY, JSON.stringify(user));
}

export function loadDemoPosts(): Post[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(DEMO_STORAGE_POSTS_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as Post[];
  } catch {
    return [];
  }
}

export function persistDemoPosts(posts: Post[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DEMO_STORAGE_POSTS_KEY, JSON.stringify(posts));
}

export function seedDemoPosts() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.localStorage.getItem(DEMO_STORAGE_POSTS_KEY)) {
    persistDemoPosts(createDemoSeedPosts());
  }
}

export function clearDemoStorage() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(DEMO_STORAGE_USER_KEY);
  window.localStorage.removeItem(DEMO_STORAGE_POSTS_KEY);
}

export async function setDemoSessionCookie() {
  await fetch('/api/demo-session', { method: 'POST' });
}

export async function removeDemoSessionCookie() {
  await fetch('/api/demo-session', { method: 'DELETE' });
}
