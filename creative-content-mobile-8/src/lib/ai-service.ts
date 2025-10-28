import { supabase } from '@/lib/supabase';

interface GenerateContentParams {
  platform: string;
  niche: string;
  contentType: string;
  keywords?: string;
  count?: number;
  followUpAnswers?: { [key: number]: string };
}

interface ContentIdea {
  subject: string;
  hook: string;
  context: string;
  hashtags: string[];
  platform: string;
  niche: string;
  contentType: string;
}

interface ContentFramework {
  hook: string;
  setup: string;
  value: string;
  climax: string;
  cta: string;
}

interface ContentIdeaWithFramework {
  idea: string;
  framework: ContentFramework;
}

interface AnalyticsMetrics {
  avgEngagementRate: number;
  bestPerformingPlatform: string;
}

interface EngagementDataPoint {
  date: string;
  engagement: number;
}

interface PlatformDataPoint {
  platform: string;
  value: number;
}

interface InsightsData {
  metrics: AnalyticsMetrics;
  engagementData: EngagementDataPoint[];
  platformData: PlatformDataPoint[];
}


class AIService {
  private maxRetries = 3;
  private retryDelay = 1000;
  private apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

  async generateContentIdeas(params: GenerateContentParams): Promise<ContentIdea[]> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-content-ideas', {
          body: params
        });

        if (error) throw error;
        if (data?.ideas) return data.ideas;
        
        throw new Error('Invalid response from AI service');
      } catch (error: unknown) {
        lastError = error as Error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`AI generation attempt ${attempt} failed:`, errorMessage);
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    console.log('Using enhanced local content generation');
    return this.generateLocalContent(params);
  }

  async generateContentFrameworks(params: {
    platform: string;
    niche: string;
    contentType: string;
    keywords?: string;
  }): Promise<ContentIdeaWithFramework[]> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-follow-up-questions', {
        body: params
      });

      if (error) throw error;
      if (data?.ideas) return data.ideas;
      
      throw new Error('Invalid framework response');
    } catch (error) {
      console.warn('AI framework generation failed, using templates:', error);
      return this.getDefaultFrameworks(params);
    }
  }

  private getDefaultFrameworks(params: {
    platform: string;
    niche: string;
    contentType: string;
    keywords?: string;
  }): ContentIdeaWithFramework[] {
    const { platform, niche, contentType, keywords } = params;
    const keywordText = keywords || niche.toLowerCase();
    
    const frameworks: ContentIdeaWithFramework[] = [
      {
        idea: `The Hidden Truth About ${keywordText}`,
        framework: {
          hook: "What if everything you know about this is wrong? (3 sec pause)",
          setup: "Most people believe X, but new research shows Y",
          value: "Here's the data that changes everything...",
          climax: "This one simple shift can transform your results",
          cta: "Save this for later and follow for more insights"
        }
      },
      {
        idea: `5 ${keywordText} Mistakes You're Making Right Now`,
        framework: {
          hook: "Stop! You're probably making mistake #1 right now",
          setup: "I see this everywhere and it's costing you",
          value: "Here are the 5 mistakes and how to fix each one",
          climax: "Fix these and watch your results skyrocket",
          cta: "Which mistake surprised you most? Comment below"
        }
      },
      {
        idea: `My ${keywordText} Transformation Story`,
        framework: {
          hook: "6 months ago I couldn't even... (show before)",
          setup: "I tried everything but nothing worked until...",
          value: "The exact steps I took to get these results",
          climax: "Now look at where I am (show after)",
          cta: "DM me 'START' for the full guide"
        }
      },
      {
        idea: `The $10 vs $1000 ${keywordText} Challenge`,
        framework: {
          hook: "Can you spot the difference? (visual comparison)",
          setup: "I tested both extremes to find out",
          value: "Breaking down what actually matters",
          climax: "The winner might surprise you",
          cta: "What would you choose? Let me know"
        }
      },
      {
        idea: `Why ${keywordText} Will Change in 2025`,
        framework: {
          hook: "This trend is about to explode (show graph)",
          setup: "3 major shifts happening right now",
          value: "How to position yourself ahead of the curve",
          climax: "Early adopters will win big",
          cta: "Follow for more 2025 predictions"
        }
      },
      {
        idea: `The Psychology Behind ${keywordText}`,
        framework: {
          hook: "Your brain is wired to fail at this (brain visual)",
          setup: "Science explains why this is so hard",
          value: "3 psychological hacks to overcome it",
          climax: "Once you know this, everything changes",
          cta: "Share this with someone who needs it"
        }
      },
      {
        idea: `${keywordText} Myths Debunked`,
        framework: {
          hook: "Myth #1: (state common belief) WRONG!",
          setup: "Let's bust the top 3 myths holding you back",
          value: "The truth backed by real evidence",
          climax: "Stop believing these and start succeeding",
          cta: "What myth were you believing? Tell me"
        }
      },
      {
        idea: `30-Day ${keywordText} Challenge Results`,
        framework: {
          hook: "Day 1 vs Day 30 (dramatic comparison)",
          setup: "I committed to this for 30 days straight",
          value: "Daily routine, struggles, and breakthroughs",
          climax: "The final results exceeded expectations",
          cta: "Join me for the next 30-day challenge"
        }
      },
      {
        idea: `The Lazy Person's Guide to ${keywordText}`,
        framework: {
          hook: "Too busy? Too tired? This is for you",
          setup: "Minimum effort, maximum results approach",
          value: "3 shortcuts that actually work",
          climax: "10 minutes a day is all you need",
          cta: "Save this for when you need motivation"
        }
      },
      {
        idea: `${keywordText} Success Formula`,
        framework: {
          hook: "The exact formula top performers use",
          setup: "I analyzed 100+ successful people",
          value: "The pattern I found will blow your mind",
          climax: "Copy this formula for instant improvement",
          cta: "Try it and report back your results"
        }
      }
    ];
    
    return frameworks;
  }
  async generateInsights(data: InsightsData): Promise<string[]> {
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-insights', {
        body: data
      });

      if (error) throw error;
      if (result?.insights) return result.insights;
      
      throw new Error('Invalid insights response');
    } catch (error) {
      console.warn('AI insights generation failed, using templates:', error);
      return this.generateTemplateInsights(data);
    }
  }


  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateTemplateInsights(data: InsightsData): string[] {
    const insights = [];
    
    if (data.metrics.avgEngagementRate > 10) {
      insights.push('Your engagement rate is exceptional! Keep using the same content strategy and posting times.');
    } else if (data.metrics.avgEngagementRate > 5) {
      insights.push('Your engagement is good but could improve. Try more interactive content like polls or questions.');
    } else {
      insights.push('Focus on creating more engaging hooks and using trending hashtags to boost visibility.');
    }

    if (data.metrics.bestPerformingPlatform === 'TikTok') {
      insights.push('TikTok is your strongest platform. Consider creating more short-form video content.');
    } else if (data.metrics.bestPerformingPlatform === 'LinkedIn') {
      insights.push('LinkedIn drives your best engagement. Share more professional insights and industry news.');
    } else {
      insights.push(`${data.metrics.bestPerformingPlatform} is performing well. Increase your posting frequency there.`);
    }

    insights.push('Your optimal posting window appears to be early afternoon. Schedule content for 2-4 PM.');
    insights.push('Educational content gets 40% more engagement than promotional posts. Prioritize value-driven content.');
    insights.push('Videos and carousel posts receive 2.5x more shares. Diversify your content formats.');

    return insights;
  }

  private generateLocalContent(params: GenerateContentParams): ContentIdea[] {
    const { platform, niche, contentType, keywords, count = 5 } = params;
    const ideas: ContentIdea[] = [];

    const templates = this.getTemplates(platform, niche, contentType);
    const keywordList = keywords ? keywords.split(',').map(k => k.trim()) : [];

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const keyword = keywordList[i % keywordList.length] || 'content';
      
      ideas.push({
        subject: template.subject.replace(/\{keyword\}/g, keyword),
        hook: template.hook.replace(/\{keyword\}/g, keyword),
        context: template.context.replace(/\{keyword\}/g, keyword),
        hashtags: [...template.hashtags, ...this.generateHashtags(keyword)],
        platform,
        niche,
        contentType
      });
    }

    return ideas;
  }

  private generateHashtags(keyword: string): string[] {
    if (!keyword) return [];
    const words = keyword.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);
  }

  private getTemplates(platform: string, niche: string, contentType: string) {
    const allTemplates = [
      {
        subject: "5 Data-Driven Insights About {keyword}",
        hook: "New research reveals surprising trends that will change how you think",
        context: "Perfect for professionals seeking evidence-based strategies",
        hashtags: ["#DataDriven", "#Research", "#Insights"]
      },
      {
        subject: "The Complete Guide to {keyword} in 2024",
        hook: "Everything you need to know, backed by expert analysis",
        context: "Comprehensive breakdown for those ready to master this topic",
        hashtags: ["#Guide2024", "#ExpertTips", "#Learning"]
      },
      {
        subject: "Transform Your {keyword} Strategy Today",
        hook: "Industry leaders are using this approach to achieve 10x results",
        context: "Showcase your solution's unique value proposition",
        hashtags: ["#BusinessGrowth", "#Strategy", "#Results"]
      },
      {
        subject: "Mind-Blowing Facts About {keyword}",
        hook: "You won't believe what we discovered 🤯",
        context: "Fun, shareable content that educates while entertaining",
        hashtags: ["#DidYouKnow", "#MindBlown", "#Facts"]
      },
      {
        subject: "Your {keyword} Journey Starts Now ✨",
        hook: "Real stories of transformation and growth",
        context: "Inspire your audience with authentic success stories",
        hashtags: ["#Inspiration", "#Journey", "#Growth"]
      }
    ];

    return allTemplates;
  }
}

export const aiService = new AIService();
export type { ContentIdeaWithFramework, ContentFramework };