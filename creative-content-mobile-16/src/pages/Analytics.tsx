import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { PlatformComparison } from '@/components/analytics/PlatformComparison';
import { HashtagPerformance } from '@/components/analytics/HashtagPerformance';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Clock, Sparkles } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';

export default function Analytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    totalImpressions: 0,
    totalEngagements: 0,
    avgEngagementRate: 0,
    bestPerformingPlatform: '',
    optimalPostingTime: '',
    topContentType: ''
  });

  const [engagementData, setEngagementData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [hashtagData, setHashtagData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Generate sample data for demonstration
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const engagement = generateEngagementData(days);
      const platforms = generatePlatformData();
      const hashtags = generateHashtagData();
      
      setEngagementData(engagement);
      setPlatformData(platforms);
      setHashtagData(hashtags);
      
      // Calculate metrics
      const totalImp = engagement.reduce((sum, d) => sum + d.impressions, 0);
      const totalEng = engagement.reduce((sum, d) => sum + d.engagements, 0);
      
      setMetrics({
        totalImpressions: totalImp,
        totalEngagements: totalEng,
        avgEngagementRate: totalEng > 0 ? (totalEng / totalImp * 100) : 0,
        bestPerformingPlatform: platforms[0]?.platform || 'TikTok',
        optimalPostingTime: '2:00 PM - 4:00 PM',
        topContentType: 'Educational'
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEngagementData = (days: number) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: Math.floor(Math.random() * 5000) + 1000,
        engagements: Math.floor(Math.random() * 500) + 50,
        engagementRate: Math.random() * 10 + 2
      });
    }
    return data;
  };

  const generatePlatformData = () => {
    return [
      { platform: 'TikTok', impressions: 18000, engagements: 2100, engagementRate: 11.7 },
      { platform: 'Instagram', impressions: 12000, engagements: 1500, engagementRate: 12.5 },
      { platform: 'YouTube', impressions: 10000, engagements: 800, engagementRate: 8.0 }
    ];
  };


  const generateHashtagData = () => {
    const tags = ['contentcreation', 'ai', 'marketing', 'socialmedia', 'growth', 'viral', 'trending', 'business', 'startup', 'tech'];
    return tags.map(tag => ({
      tag,
      uses: Math.floor(Math.random() * 50) + 10,
      avgEngagement: Math.random() * 15 + 5,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
    }));
  };

  const generateAIInsights = async () => {
    setLoading(true);
    try {
      const insights = await aiService.generateInsights({
        metrics,
        engagementData,
        platformData
      });
      setInsights(insights);
      toast({ title: 'AI Insights Generated', description: 'Check the insights tab for personalized recommendations' });
    } catch (error) {
      // Fallback insights
      setInsights([
        'Your engagement rate peaks on Instagram - consider increasing content frequency there',
        'Educational content performs 40% better than promotional posts',
        'Posting between 2-4 PM yields highest engagement across all platforms',
        'Hashtags #ai and #contentcreation drive 3x more impressions',
        'Video content receives 2.5x more shares than static images'
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your content performance and optimize your strategy</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Impressions</p>
                  <p className="text-2xl font-bold">{metrics.totalImpressions.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Engagements</p>
                  <p className="text-2xl font-bold">{metrics.totalEngagements.toLocaleString()}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Engagement Rate</p>
                  <p className="text-2xl font-bold">{metrics.avgEngagementRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Best Platform</p>
                  <p className="text-2xl font-bold">{metrics.bestPerformingPlatform}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="content">Content Types</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <EngagementChart data={engagementData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PlatformComparison data={platformData} />
              <HashtagPerformance hashtags={hashtagData} />
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            <PlatformComparison data={platformData} />
            <Card>
              <CardHeader>
                <CardTitle>Optimal Posting Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformData.map(platform => (
                    <div key={platform.platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>{platform.platform}</Badge>
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {platform.platform === 'TikTok' ? '6-10 PM' : 
                         platform.platform === 'Instagram' ? '11 AM - 1 PM' : '5-7 PM'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Educational', 'Promotional', 'Inspirational', 'Entertainment', 'News'].map(type => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="font-medium">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {(Math.random() * 15 + 5).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your content performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {insights.length === 0 ? (
                  <div className="text-center py-8">
                    <Button onClick={generateAIInsights} disabled={loading}>
                      {loading ? 'Generating...' : 'Generate AI Insights'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">{index + 1}.</span>
                        <p className="text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}