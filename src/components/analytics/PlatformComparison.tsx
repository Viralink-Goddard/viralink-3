import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlatformData {
  platform: string;
  impressions: number;
  engagements: number;
  engagementRate: number;
}

interface PlatformComparisonProps {
  data: PlatformData[];
}

export function PlatformComparison({ data }: PlatformComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="impressions" fill="#8b5cf6" name="Impressions" />
            <Bar dataKey="engagements" fill="#3b82f6" name="Engagements" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}