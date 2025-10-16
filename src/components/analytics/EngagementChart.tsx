import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EngagementData {
  date: string;
  impressions: number;
  engagements: number;
  engagementRate: number;
}

interface EngagementChartProps {
  data: EngagementData[];
  title?: string;
}

export function EngagementChart({ data, title = "Engagement Trends" }: EngagementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="impressions" 
              stroke="#8b5cf6" 
              name="Impressions"
              strokeWidth={2}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="engagements" 
              stroke="#3b82f6" 
              name="Engagements"
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="engagementRate" 
              stroke="#10b981" 
              name="Engagement Rate (%)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}