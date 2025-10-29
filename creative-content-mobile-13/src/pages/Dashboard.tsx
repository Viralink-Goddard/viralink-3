import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { aiService, type ContentIdeaWithFramework } from '@/lib/ai-service';
import { exportToCSV, exportToPDF } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Zap, Target, Hash, RefreshCw, Calendar, ChevronRight, Layers, TrendingUp, Award, Megaphone, Bookmark, BookmarkCheck, Library, Download, FileText, Filter } from 'lucide-react';
import CalendarView from '@/components/calendar/CalendarView';
import AddPostModal from '@/components/calendar/AddPostModal';
import ExportModal, { type ExportOptions } from '@/components/ExportModal';
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';

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
interface SavedFramework {
  id: string;
  user_id: string;
  platform: string;
  niche: string;
  content_type: string;
  keywords?: string;
  title: string;
  hook: string;
  setup_context: string;
  value_delivery: string;
  climax_payoff: string;
  cta_loop: string;
  saved_at: string;
  notes?: string;
}

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [keywords, setKeywords] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [niche, setNiche] = useState('Fitness');
  const [contentType, setContentType] = useState('Educational or Tutorial');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editPost, setEditPost] = useState<ScheduledPost | null>(null);
  const [contentFrameworks, setContentFrameworks] = useState<ContentIdeaWithFramework[]>([]);
  const [savedFrameworks, setSavedFrameworks] = useState<SavedFramework[]>([]);
  const [savedFrameworkIds, setSavedFrameworkIds] = useState<Set<string>>(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadIdeas();
    loadScheduledPosts();
    loadSavedFrameworks();
    checkDailyReset();
  }, [user]);

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

  const loadSavedFrameworks = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('saved_content_frameworks')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });
    
    if (data) {
      setSavedFrameworks(data);
      const ids = new Set(data.map(f => `${f.platform}-${f.niche}-${f.title}`));
      setSavedFrameworkIds(ids);
    }
  };

  const handleSaveFramework = async (framework: ContentIdeaWithFramework, index: number) => {
    if (!user?.id) {
      toast({ title: 'Please log in to save ideas', variant: 'destructive' });
      return;
    }

    const frameworkId = `${platform}-${niche}-${framework.idea}`;
    
    if (savedFrameworkIds.has(frameworkId)) {
      // Unsave
      const { error } = await supabase
        .from('saved_content_frameworks')
        .delete()
        .eq('user_id', user.id)
        .eq('title', framework.idea)
        .eq('platform', platform)
        .eq('niche', niche);

      if (!error) {
        toast({ title: 'Removed from favorites' });
        await loadSavedFrameworks();
      }
    } else {
      // Save
      const { error } = await supabase
        .from('saved_content_frameworks')
        .insert({
          user_id: user.id,
          platform,
          niche,
          content_type: contentType,
          keywords: keywords || null,
          title: framework.idea,
          hook: framework.framework.hook,
          setup_context: framework.framework.setup,
          value_delivery: framework.framework.value,
          climax_payoff: framework.framework.climax,
          cta_loop: framework.framework.cta
        });

      if (!error) {
        toast({ title: 'Saved to favorites!' });
        await loadSavedFrameworks();
      } else {
        toast({ title: 'Error saving idea', variant: 'destructive' });
      }
    }
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
      const frameworks = await aiService.generateContentFrameworks({ 
        platform, niche, contentType, keywords: keywords.trim() 
      });
      setContentFrameworks(frameworks);
      toast({ title: 'Success!', description: `Generated ${frameworks.length} viral content ideas` });
    } catch (error) {
      toast({ title: 'Error generating ideas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (options: ExportOptions) => {
    let frameworksToExport = [...savedFrameworks];
    
    // Apply filters
    if (options.filters.platforms.length > 0) {
      frameworksToExport = frameworksToExport.filter(f => 
        options.filters.platforms.includes(f.platform)
      );
    }
    
    if (options.filters.niches.length > 0) {
      frameworksToExport = frameworksToExport.filter(f => 
        options.filters.niches.includes(f.niche)
      );
    }
    
    if (options.filters.contentTypes.length > 0) {
      frameworksToExport = frameworksToExport.filter(f => 
        options.filters.contentTypes.includes(f.content_type)
      );
    }
    
    if (options.filters.dateRange) {
      frameworksToExport = frameworksToExport.filter(f => {
        const savedDate = new Date(f.saved_at);
        return savedDate >= options.filters.dateRange!.from && 
               savedDate <= options.filters.dateRange!.to;
      });
    }
    
    if (frameworksToExport.length === 0) {
      toast({ title: 'No frameworks match the selected filters', variant: 'destructive' });
      return;
    }
    
    // Format for export
    const exportData = frameworksToExport.map(f => ({
      id: f.id,
      title: f.title,
      hook: f.hook,
      setup_context: f.setup_context,
      value_delivery: f.value_delivery,
      climax_payoff: f.climax_payoff,
      cta_loop: f.cta_loop,
      platform: f.platform,
      niche: f.niche,
      content_type: f.content_type,
      keywords: f.keywords,
      created_at: f.saved_at
    }));
    
    if (options.format === 'csv') {
      exportToCSV(exportData, 'content-frameworks');
      toast({ title: 'CSV exported successfully!' });
    } else {
      exportToPDF(exportData, 'content-frameworks');
      toast({ title: 'PDF exported successfully!' });
    }
  };

  const exportSingleFramework = (framework: SavedFramework) => {
    const exportData = [{
      id: framework.id,
      title: framework.title,
      hook: framework.hook,
      setup_context: framework.setup_context,
      value_delivery: framework.value_delivery,
      climax_payoff: framework.climax_payoff,
      cta_loop: framework.cta_loop,
      platform: framework.platform,
      niche: framework.niche,
      content_type: framework.content_type,
      keywords: framework.keywords,
      created_at: framework.saved_at
    }];
    
    exportToPDF(exportData, `framework-${framework.title.slice(0, 20)}`);
    toast({ title: 'Framework exported as PDF!' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <EmailVerificationBanner />
        
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
            {!contentFrameworks.length ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Generate Viral Content Ideas</CardTitle>
                  <CardDescription>Select your platform, niche, and content type to generate 10 viral content frameworks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium mb-2">Platform</label>
                      <Select value={platform} onValueChange={setPlatform}><SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                        </SelectContent></Select></div>
                    <div><label className="block text-sm font-medium mb-2">Niche</label>
                      <Select value={niche} onValueChange={setNiche}><SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fitness">Fitness</SelectItem>
                          <SelectItem value="Conscious Lifestyle">Conscious Lifestyle</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Health and Wellness">Health and Wellness</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Travel and Leisure">Travel and Leisure</SelectItem>
                          <SelectItem value="Food and Cooking">Food and Cooking</SelectItem>
                          <SelectItem value="Fashion Beauty and Style">Fashion Beauty and Style</SelectItem>
                          <SelectItem value="Gaming and Esports">Gaming and Esports</SelectItem>
                          <SelectItem value="Education and Skill">Education and Skill</SelectItem>
                          <SelectItem value="Lifestyle and Personal">Lifestyle and Personal</SelectItem>
                        </SelectContent></Select></div>
                    <div><label className="block text-sm font-medium mb-2">Content Type</label>
                      <Select value={contentType} onValueChange={setContentType}><SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Educational or Tutorial">Educational or Tutorial</SelectItem>
                          <SelectItem value="Storytelling/Relatable">Storytelling/Relatable</SelectItem>
                          <SelectItem value="Inspirational/Motivational">Inspirational/Motivational</SelectItem>
                          <SelectItem value="Entertaining/Funny">Entertaining/Funny</SelectItem>
                          <SelectItem value="Controversial/Opinion">Controversial/Opinion</SelectItem>
                          <SelectItem value="Promotional/Product Focused">Promotional/Product Focused</SelectItem>
                          <SelectItem value="Behind the Scenes/Authentic">Behind the Scenes/Authentic</SelectItem>
                        </SelectContent></Select></div>
                  </div>
                  <div><label className="block text-sm font-medium mb-2">Keywords (Optional)</label>
                    <Textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Enter keywords to focus your content (optional)..." rows={2} /></div>
                  <Button onClick={handleGenerate} disabled={loading || !canGenerateContent()} className="w-full" size="lg">
                    {loading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Generating 10 Ideas...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Content Ideas</>}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">10 Viral Content Frameworks</h2>
                  <Button onClick={() => setContentFrameworks([])} variant="outline">Generate New Ideas</Button>
                </div>
                {contentFrameworks.map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <CardTitle className="text-lg flex-1">{idx + 1}. {item.idea}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveFramework(item, idx)}
                        className="ml-2"
                      >
                        {savedFrameworkIds.has(`${platform}-${niche}-${item.idea}`) ? (
                          <BookmarkCheck className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                        <div><p className="font-semibold text-sm">Hook (3-5 sec)</p><p className="text-gray-700">{item.framework.hook}</p></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Layers className="w-5 h-5 text-blue-500 mt-1" />
                        <div><p className="font-semibold text-sm">Setup/Context</p><p className="text-gray-700">{item.framework.setup}</p></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                        <div><p className="font-semibold text-sm">Value/Delivery</p><p className="text-gray-700">{item.framework.value}</p></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-purple-500 mt-1" />
                        <div><p className="font-semibold text-sm">Climax/Payoff</p><p className="text-gray-700">{item.framework.climax}</p></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Megaphone className="w-5 h-5 text-red-500 mt-1" />
                        <div><p className="font-semibold text-sm">CTA/Loop</p><p className="text-gray-700">{item.framework.cta}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {savedFrameworks.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Library className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">Your Saved Content Library</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowExportModal(true)}
                      disabled={savedFrameworks.length === 0}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Export Library
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4">
                  {savedFrameworks.map((saved) => (
                    <Card key={saved.id} className="border-blue-200 bg-blue-50/50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{saved.title}</CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{saved.platform}</Badge>
                              <Badge variant="outline">{saved.niche}</Badge>
                              <Badge variant="outline">{saved.content_type}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => exportSingleFramework(saved)}
                              title="Export as PDF"
                            >
                              <FileText className="w-5 h-5 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                await supabase
                                  .from('saved_content_frameworks')
                                  .delete()
                                  .eq('id', saved.id);
                                toast({ title: 'Removed from library' });
                                loadSavedFrameworks();
                              }}
                            >
                              <BookmarkCheck className="w-5 h-5 text-blue-600" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                          <div><p className="font-semibold text-sm">Hook</p><p className="text-gray-700">{saved.hook}</p></div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Layers className="w-5 h-5 text-blue-500 mt-1" />
                          <div><p className="font-semibold text-sm">Setup</p><p className="text-gray-700">{saved.setup_context}</p></div>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                          <div><p className="font-semibold text-sm">Value</p><p className="text-gray-700">{saved.value_delivery}</p></div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Award className="w-5 h-5 text-purple-500 mt-1" />
                          <div><p className="font-semibold text-sm">Climax</p><p className="text-gray-700">{saved.climax_payoff}</p></div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Megaphone className="w-5 h-5 text-red-500 mt-1" />
                          <div><p className="font-semibold text-sm">CTA</p><p className="text-gray-700">{saved.cta_loop}</p></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Saved on {new Date(saved.saved_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

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
        
        <ExportModal 
          open={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          platforms={[...new Set(savedFrameworks.map(f => f.platform))]}
          niches={[...new Set(savedFrameworks.map(f => f.niche))]}
          contentTypes={[...new Set(savedFrameworks.map(f => f.content_type))]}
        />
      </div>
    </div>
  );
}