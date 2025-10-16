import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import ScheduledPostCard from './ScheduledPostCard';

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
  posts: ScheduledPost[];
  onAddPost: (date: string) => void;
  onEditPost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
}

export default function CalendarView({ posts, onAddPost, onEditPost, onDeletePost }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const getPostsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.scheduled_date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{monthNames[month]} {year}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-sm text-gray-600 pb-2">{day}</div>
        ))}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayPosts = getPostsForDate(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          
          return (
            <Card key={day} className={`min-h-[120px] p-2 ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</span>
                <Button size="sm" variant="ghost" onClick={() => onAddPost(dateStr)} className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[80px] overflow-y-auto">
                {dayPosts.map(post => (
                  <ScheduledPostCard key={post.id} post={post} onEdit={onEditPost} onDelete={onDeletePost} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
