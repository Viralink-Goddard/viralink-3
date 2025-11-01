import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Hash } from 'lucide-react';

interface HashtagData {
  tag: string;
  uses: number;
  avgEngagement: number;
  trend: 'up' | 'down' | 'stable';
}

interface HashtagPerformanceProps {
  hashtags: HashtagData[];
}

export function HashtagPerformance({ hashtags }: HashtagPerformanceProps) {
  const sortedHashtags = [...hashtags].sort((a, b) => b.avgEngagement - a.avgEngagement);
  const topHashtags = sortedHashtags.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Top Performing Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topHashtags.map((hashtag, index) => (
            <div key={hashtag.tag} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                <Badge variant="secondary" className="font-mono">
                  #{hashtag.tag}
                </Badge>
                <span className="text-xs text-gray-500">
                  {hashtag.uses} uses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {hashtag.avgEngagement.toFixed(1)}%
                </span>
                {hashtag.trend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}