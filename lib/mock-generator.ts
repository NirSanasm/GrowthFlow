import { SocialPlatform } from '@/types';

interface GenerationParams {
  topic: string;
  industry: string;
  tone: string;
  platform: SocialPlatform;
  isThread?: boolean;
}

export function simulateAIGenerator({ topic, industry, tone, platform, isThread }: GenerationParams): { content: string; thread?: string[] } {
  const sanitizedTopic = topic.trim() || 'Modern scaling strategies';

  const industryKeywords: Record<string, string[]> = {
    tech: ['SaaS scaling', 'technical debt', 'AI automation', 'developer velocity', 'CI/CD performance'],
    marketing: ['inbound funnel conversion', 'organic brand authority', 'retention optimization', 'copywriting frameworks', 'acquisition pipelines'],
    finance: ['SaaS unit economics', 'capital allocation', 'runway preservation', 'LTV:CAC scaling', 'cash-flow optimization'],
    productivity: ['deep work blocks', 'asynchronous communication', 'cognitive bandwidth', 'meeting minimization', 'workflow automations'],
  };

  const keywords = industryKeywords[industry.toLowerCase()] || ['high-impact execution', 'strategic clarity', 'operational growth'];
  const primaryKw = keywords[0];
  const secondaryKw = keywords[1];

  const toneAdjectives: Record<string, string> = {
    professional: 'structured, data-driven, and strategic',
    witty: 'clever, sharp, and conversational',
    authoritative: 'bold, contrarian, and experienced',
    inspiring: 'optimistic, encouraging, and visionary',
  };

  const selectedTone = toneAdjectives[tone.toLowerCase()] || 'highly impactful';

  // PLATFORM: TWITTER/X THREADS
  if (platform === 'twitter' && isThread) {
    return {
      content: `🧵 1/5: The hidden cost of ignoring ${primaryKw} is killing modern startups.\n\nMost teams solve growth by adding head count. They should be adding operational leverage.\n\nHere is how we optimized our pipeline and reclaimed 14+ hours every week:`,
      thread: [
        `🧵 1/5: The hidden cost of ignoring ${primaryKw} is killing modern startups.\n\nMost teams solve growth by adding head count. They should be adding operational leverage.\n\nHere is how we optimized our pipeline and reclaimed 14+ hours every week:`,
        `2/5: 1. Attack coordination friction.\n\nWe cut down meeting times by 60% by switching to rigid async documentation. If a decision doesn't require active debate, it is written down. \n\nNo document = no meeting. Simple.`,
        `3/5: 2. Align metrics to velocity, not activity.\n\nWe tied our day-to-day team efforts directly to our core ${secondaryKw} metrics. \n\nActivity is noise. Output that affects the bottom line is the only thing that gets celebrated.`,
        `4/5: 3. Automate repetitive decision loops.\n\nEvery process that requires more than three manual steps is audited for automation. We cut our deployment loops from 40 minutes to a single command. Speed is a compounding advantage.`,
        `5/5: This framework is how we build high-margin, hyper-efficient products in a crowded landscape.\n\nWant to dive deeper into our playbook? \n\nDrop a comment below and I'll send you our private scaling map! 🚀`
      ]
    };
  }

  // PLATFORM: TWITTER/X SINGLE TWEET
  if (platform === 'twitter') {
    if (tone.toLowerCase() === 'authoritative') {
      return {
        content: `Unpopular opinion: Scaling isn't about hiring. It's about maximizing throughput per desk.\n\nIf your solution to bottlenecks is "hire more people", you aren't scaling—you are just multiplying coordination friction. Prioritize ${primaryKw} instead.`
      };
    }
    if (tone.toLowerCase() === 'witty') {
      return {
        content: `Meetings are just emails dressed up in suits trying to steal your afternoon.\n\nReplace them with structured async docs. Your developers will code, your managers will align, and your ${primaryKw} will double. Thank me later. ☕`
      };
    }
    if (tone.toLowerCase() === 'inspiring') {
      return {
        content: `The best systems don't constrain people—they unlock them.\n\nWhen you invest in robust ${primaryKw}, you aren't just saving hours. You are building an environment where your team can do their life's best work. Elevate your foundations. ✨`
      };
    }
    return {
      content: `How we optimized our core systems to drive ${primaryKw}:\n\n1. Replaced status meetings with async write-ups\n2. Streamlined ${secondaryKw} via clean automation\n3. Standardized internal feedback loops\n\nEfficiency doesn't happen by accident. It is designed. 📈`
    };
  }

  // PLATFORM: LINKEDIN
  if (platform === 'linkedin') {
    const hooks: Record<string, string> = {
      professional: `Let's discuss the actual economics of ${primaryKw} in the enterprise space.\n\nMany organizations focus on acquisition, yet bleed margin through coordination drag. Real growth comes from systemic leverage.`,
      authoritative: `Stop building massive teams to solve simple bottlenecks. \n\nI see founders boasting about team headcount. Honestly? High headcount is a cost, not a trophy. The true metric of success is leverage—specifically, high ${primaryKw} per developer.`,
      witty: `I used to think "synergy" was just a word executives used when they forgot their coffee.\n\nThen I saw a 10-person team out-produce a 50-person department simply by streamlining their ${primaryKw} framework. It is not about the hours you grind; it is about the loops you eliminate.`,
      inspiring: `The most successful founders I know share a quiet obsession:\n\nThey don't just build great products. They build the systems that build great products. \n\nBy focusing on ${primaryKw}, they create workspaces where engineers focus on creative problem-solving instead of administrative overhead.`,
    };

    const activeHook = hooks[tone.toLowerCase()] || hooks.professional;

    return {
      content: `${activeHook}\n\nHere is a 3-step blueprint to optimize your ${secondaryKw} workflow:\n\n1️⃣ **Document, then automate**: Never automate a broken process. Map it manually first, then let software handle the repetitive loops.\n2️⃣ **Define clear ownership boundaries**: Committee decisions breed mediocrity. Assign single-owner accountability to every core product vector.\n3️⃣ **Eliminate synchronization points**: Shift your default communication to async. Let meetings be a last resort for complex brainstorming, not status tracking.\n\nBy embedding these into our team culture, we unlocked a 40% jump in output and gave our team their focus back.\n\nWhat is your biggest operational bottleneck right now? Let's discuss in the comments below 👇\n\n#BusinessStrategy #Productivity #TechLeadership #SaaS`
    };
  }

  // PLATFORM: INSTAGRAM
  return {
    content: `Systemic leverage > Raw hustle. 📊\n\nToo many people measure productivity by how busy they look. True leaders measure it by the leverage they create.\n\nBy focusing on robust ${primaryKw} and automated ${secondaryKw}, we built a setup that does the work of a team twice our size—without the burnout.\n\nSwipe left to see our full system breakdown! ➡️\n\n-\n#StartupSystems #FounderLife #Automation #SaaS #GrowthMindset #${industry.toUpperCase()}`
  };
}
