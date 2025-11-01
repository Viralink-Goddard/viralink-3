import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface ScheduledPost {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  content_text: string;
  content_type?: string;
  status: string;
}

interface Props {
  post: ScheduledPost;
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
}

const platformColors: Record<string, string> = {
  Twitter: 'bg-blue-500',
  Instagram: 'bg-pink-500',
  LinkedIn: 'bg-indigo-600',
  TikTok: 'bg-black',
  YouTube: 'bg-red-600',
  Facebook: 'bg-blue-700'
};

export default function ScheduledPostCard({ post, onEdit, onDelete }: Props) {
  return (
    <Card className="p-3 mb-2 hover:shadow-md transition-shadow cursor-move">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${platformColors[post.platform] || 'bg-gray-500'}`} />
            <Badge variant="outline" className="text-xs">{post.platform}</Badge>
            <span className="text-xs text-gray-500">{post.scheduled_time}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{post.content_text}</p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(post)}>
            <Edit className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(post.id)}>
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
