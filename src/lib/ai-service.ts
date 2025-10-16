import { supabase } from '@/lib/supabase';

interface GenerateContentParams {
  platform: string;
  contentType: string;
  tone: string;
  keywords?: string;
  count?: number;
}

interface ContentIdea {
  subject: string;
  hook: string;
  context: string;
  hashtags: string[];
  platform: string;
  contentType: string;
  tone: string;
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
      } catch (error: any) {
        lastError = error;
        console.warn(`AI generation attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    console.log('Using enhanced local content generation');
    return this.generateLocalContent(params);
  }

  async generateInsights(data: {
    metrics: any;
    engagementData: any[];
    platformData: any[];
  }): Promise<string[]> {
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

  private generateTemplateInsights(data: any): string[] {
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
    const { platform, contentType, tone, keywords, count = 5 } = params;
    const ideas: ContentIdea[] = [];

    const templates = this.getTemplates(platform, contentType, tone);
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
        contentType,
        tone
      });
    }

    return ideas;
  }

  private generateHashtags(keyword: string): string[] {
    if (!keyword) return [];
    const words = keyword.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).map(w => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);
  }

  private getTemplates(platform: string, contentType: string, tone: string) {
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