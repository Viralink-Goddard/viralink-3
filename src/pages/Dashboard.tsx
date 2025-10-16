import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { aiService } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Zap, Target, Hash, RefreshCw, Calendar } from 'lucide-react';
import CalendarView from '@/components/calendar/CalendarView';
import AddPostModal from '@/components/calendar/AddPostModal';

interface ContentIdea {
  id: string;
  subject: string;
  hook: string;
  context: string;
  hashtags?: string[];
  platform?: string;
  contentType?: string;
  tone?: string;
  created_at: string;
}

interface ScheduledPost {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  content_text: string;
  content_type?: string;
  status: string;
}

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [keywords, setKeywords] = useState('');
  const [platform, setPlatform] = useState('Twitter');
  const [contentType, setContentType] = useState('Educational');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editPost, setEditPost] = useState<ScheduledPost | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadIdeas();
    loadScheduledPosts();
    checkDailyReset();
  }, []);

  const loadScheduledPosts = async () => {
    const { data } = await supabase
      .from('scheduled_content')
      .select('*')
      .eq('user_id', user?.id)
      .order('scheduled_date', { ascending: true });
    if (data) setScheduledPosts(data);
  };

  const handleAddPost = (date: string) => {
    setSelectedDate(date);
    setEditPost(null);
    setShowAddModal(true);
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditPost(post);
    setShowAddModal(true);
  };

  const handleSavePost = async (postData: Omit<ScheduledPost, 'id'>) => {
    if (editPost) {
      await supabase.from('scheduled_content').update(postData).eq('id', editPost.id);
      toast({ title: 'Post updated!' });
    } else {
      await supabase.from('scheduled_content').insert({ ...postData, user_id: user?.id });
      toast({ title: 'Post scheduled!' });
    }
    loadScheduledPosts();
  };

  const handleDeletePost = async (id: string) => {
    await supabase.from('scheduled_content').delete().eq('id', id);
    toast({ title: 'Post deleted' });
    loadScheduledPosts();
  };

  const checkDailyReset = async () => {
    if (!profile || profile.tier === 'pro') return;
    const today = new Date().toDateString();
    const lastEntry = profile.last_entry_date ? new Date(profile.last_entry_date).toDateString() : null;
    if (lastEntry !== today && profile.entries_today > 0) {
      await supabase.from('profiles').update({ entries_today: 0 }).eq('id', user?.id);
      await refreshProfile();
    }
  };

  const loadIdeas = async () => {
    const { data } = await supabase.from('content_ideas').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(10);
    if (data) setIdeas(data);
  };

  const canGenerateContent = () => {
    if (profile?.tier === 'pro') return true;
    const today = new Date().toDateString();
    const lastEntry = profile?.last_entry_date ? new Date(profile.last_entry_date).toDateString() : null;
    return lastEntry !== today || (profile?.entries_today || 0) < 1;
  };

  const handleGenerate = async () => {
    if (!canGenerateContent()) {
      toast({ title: 'Daily Limit Reached', description: 'Upgrade to Pro!', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const generatedIdeas = await aiService.generateContentIdeas({ platform, contentType, tone, keywords, count: profile?.tier === 'pro' ? 5 : 1 });
      if (generatedIdeas?.length > 0) {
        for (const idea of generatedIdeas) {
          await supabase.from('content_ideas').insert({ user_id: user?.id, subject: idea.subject, hook: idea.hook, context: idea.context, hashtags: idea.hashtags, platform: idea.platform, content_type: idea.contentType, tone: idea.tone });
          setIdeas(prev => [{ id: Date.now().toString() + Math.random(), ...idea, created_at: new Date().toISOString() } as ContentIdea, ...prev].slice(0, 10));
        }
        if (profile?.tier === 'free') {
          await supabase.from('profiles').update({ entries_today: (profile.entries_today || 0) + 1, last_entry_date: new Date().toISOString() }).eq('id', user?.id);
          await refreshProfile();
        }
        toast({ title: 'Success!', description: `Generated ${generatedIdeas.length} idea(s)` });
        setKeywords('');
      }
    } catch (error) {
      toast({ title: 'Using template generation', variant: 'default' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Content Dashboard</h1>
            <p className="text-gray-600 mt-2">Generate and schedule your content</p>
          </div>
          <Badge variant={profile?.tier === 'pro' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
            {profile?.tier === 'pro' ? '⭐ Pro' : `Free - ${canGenerateContent() ? '1 left' : '0 left'}`}
          </Badge>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator"><Sparkles className="w-4 h-4 mr-2" />Generator</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2" />Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Generate Content Ideas</CardTitle>
                <CardDescription>AI-powered content creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Promotional">Promotional</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords..." rows={2} />
                <Button onClick={handleGenerate} disabled={loading || !canGenerateContent()} className="w-full" size="lg">
                  {loading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate</>}
                </Button>
              </CardContent>
            </Card>
            <h2 className="text-2xl font-bold mb-4">Recent Ideas</h2>
            <div className="grid gap-4">
              {ideas.map((idea) => (
                <Card key={idea.id}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-2">
                      <Target className="w-5 h-5 text-purple-600 mt-1" />
                      <div><p className="font-semibold text-sm text-gray-600">Subject</p><p>{idea.subject}</p></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-5 h-5 text-blue-600 mt-1" />
                      <div><p className="font-semibold text-sm text-gray-600">Hook</p><p>{idea.hook}</p></div>
                    </div>
                    {idea.hashtags && <div className="flex gap-1">{idea.hashtags.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardContent className="pt-6">
                <CalendarView posts={scheduledPosts} onAddPost={handleAddPost} onEditPost={handleEditPost} onDeletePost={handleDeletePost} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddPostModal open={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSavePost} editPost={editPost} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
