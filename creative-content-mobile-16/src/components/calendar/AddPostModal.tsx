import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ScheduledPost {
  id?: string;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  content_text: string;
  content_type?: string;
  status: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (post: Omit<ScheduledPost, 'id'>) => void;
  editPost?: ScheduledPost | null;
  selectedDate?: string;
}

export default function AddPostModal({ open, onClose, onSave, editPost, selectedDate }: Props) {
  const [formData, setFormData] = useState({
    scheduled_date: selectedDate || '',
    scheduled_time: '09:00',
    platform: 'TikTok',
    content_text: '',
    content_type: 'Educational',
    status: 'scheduled'
  });

  useEffect(() => {
    if (editPost) {
      setFormData({
        scheduled_date: editPost.scheduled_date,
        scheduled_time: editPost.scheduled_time,
        platform: editPost.platform,
        content_text: editPost.content_text,
        content_type: editPost.content_type || 'Educational',
        status: editPost.status
      });
    } else if (selectedDate) {
      setFormData(prev => ({ ...prev, scheduled_date: selectedDate }));
    }
  }, [editPost, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Edit' : 'Schedule'} Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={formData.scheduled_date} onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})} required />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={formData.scheduled_time} onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform</Label>
              <Select value={formData.platform} onValueChange={(v) => setFormData({...formData, platform: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Content Type</Label>
              <Select value={formData.content_type} onValueChange={(v) => setFormData({...formData, content_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                  <SelectItem value="Inspirational">Inspirational</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Content</Label>
            <Textarea rows={6} value={formData.content_text} onChange={(e) => setFormData({...formData, content_text: e.target.value})} required placeholder="Write your post content..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
