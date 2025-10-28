import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, Library, Users, Globe, Sparkles } from 'lucide-react';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { CreateTemplateModal } from '@/components/templates/CreateTemplateModal';
import { ShareTemplateModal } from '@/components/templates/ShareTemplateModal';
import { AITemplateGenerator } from '@/components/templates/AITemplateGenerator';

interface Template {
  id: string;
  user_id: string;
  name: string;
  description: string;
  content_type: string;
  structure: any;
  variables: string[];
  is_public: boolean;
  is_team_shared: boolean;
  usage_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function Templates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [sharedTemplates, setSharedTemplates] = useState<Template[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Load user's own templates
      const { data: userTemplates } = await supabase
        .from('content_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userTemplates) setTemplates(userTemplates);

      // Load shared templates
      const { data: shares } = await supabase
        .from('team_template_shares')
        .select('template_id')
        .or(`shared_with_user_id.eq.${user.id},shared_with_email.eq.${user.email}`)
        .eq('accepted', true);

      if (shares && shares.length > 0) {
        const templateIds = shares.map(s => s.template_id);
        const { data: sharedData } = await supabase
          .from('content_templates')
          .select('*')
          .in('id', templateIds);
        
        if (sharedData) setSharedTemplates(sharedData);
      }

      // Load public templates
      const { data: publicData } = await supabase
        .from('content_templates')
        .select('*')
        .eq('is_public', true)
        .neq('user_id', user.id)
        .order('usage_count', { ascending: false })
        .limit(50);

      if (publicData) setPublicTemplates(publicData);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    const template = [...templates, ...sharedTemplates, ...publicTemplates]
      .find(t => t.id === templateId);
    
    if (!template) return;

    // Update usage count
    await supabase
      .from('content_templates')
      .update({ usage_count: template.usage_count + 1 })
      .eq('id', templateId);

    // Record usage history
    await supabase
      .from('template_usage_history')
      .insert({
        template_id: templateId,
        user_id: user?.id
      });

    toast({
      title: 'Template Applied',
      description: `Using "${template.name}" template for content creation`
    });

    // Navigate to dashboard with template pre-loaded
    window.location.href = `/dashboard?template=${templateId}`;
  };

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(template);
      setShowCreateModal(true);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    const { error } = await supabase
      .from('content_templates')
      .delete()
      .eq('id', templateId);

    if (!error) {
      toast({ title: 'Template deleted successfully' });
      loadTemplates();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive'
      });
    }
  };

  const handleShareTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setShowShareModal(true);
    }
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    const template = [...templates, ...sharedTemplates, ...publicTemplates]
      .find(t => t.id === templateId);
    
    if (!template) return;

    const { error } = await supabase
      .from('content_templates')
      .insert({
        user_id: user?.id,
        name: `${template.name} (Copy)`,
        description: template.description,
        content_type: template.content_type,
        structure: template.structure,
        variables: template.variables,
        tags: template.tags,
        is_public: false,
        is_team_shared: false
      });

    if (!error) {
      toast({ title: 'Template duplicated successfully' });
      loadTemplates();
    }
  };

  const handleSaveTemplate = async (templateData: any) => {
    if (editingTemplate) {
      const { error } = await supabase
        .from('content_templates')
        .update(templateData)
        .eq('id', editingTemplate.id);

      if (!error) {
        toast({ title: 'Template updated successfully' });
        setEditingTemplate(null);
        loadTemplates();
      }
    } else {
      const { error } = await supabase
        .from('content_templates')
        .insert({
          ...templateData,
          user_id: user?.id
        });

      if (!error) {
        toast({ title: 'Template created successfully' });
        loadTemplates();
      }
    }
  };

  const handleAITemplateGenerated = (template: any) => {
    loadTemplates();
    setShowAIGenerator(false);
    toast({
      title: 'AI Template Generated!',
      description: 'Your template has been saved to your library'
    });
  };

  const filteredTemplates = (templateList: Template[]) => {
    return templateList.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = contentTypeFilter === 'all' || template.content_type === contentTypeFilter;
      return matchesSearch && matchesType;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Template Library</h1>
            <p className="text-gray-600 mt-2">Create and manage reusable content templates</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAIGenerator(true)} size="lg" variant="outline">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Generate
            </Button>
            <Button onClick={() => setShowCreateModal(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Template
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Tutorial">Tutorial</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Storytelling">Storytelling</SelectItem>
              <SelectItem value="Comparison">Comparison</SelectItem>
              <SelectItem value="Listicle">Listicle</SelectItem>
              <SelectItem value="How-to">How-to</SelectItem>
              <SelectItem value="Case Study">Case Study</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="my-templates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-templates">
              <Library className="w-4 h-4 mr-2" />
              My Templates
            </TabsTrigger>
            <TabsTrigger value="shared">
              <Users className="w-4 h-4 mr-2" />
              Shared with Me
            </TabsTrigger>
            <TabsTrigger value="public">
              <Globe className="w-4 h-4 mr-2" />
              Public Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-templates" className="mt-6">
            {loading ? (
              <div className="text-center py-12">Loading templates...</div>
            ) : filteredTemplates(templates).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No templates found</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create your first template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates(templates).map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onShare={handleShareTemplate}
                    onDuplicate={handleDuplicateTemplate}
                    isOwner={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            {filteredTemplates(sharedTemplates).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No shared templates yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates(sharedTemplates).map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onShare={() => {}}
                    onDuplicate={handleDuplicateTemplate}
                    isOwner={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="public" className="mt-6">
            {filteredTemplates(publicTemplates).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No public templates available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates(publicTemplates).map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onShare={() => {}}
                    onDuplicate={handleDuplicateTemplate}
                    isOwner={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CreateTemplateModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTemplate(null);
          }}
          onSave={handleSaveTemplate}
          editingTemplate={editingTemplate}
        />

        {selectedTemplate && (
          <ShareTemplateModal
            isOpen={showShareModal}
            onClose={() => {
              setShowShareModal(false);
              setSelectedTemplate(null);
            }}
            templateId={selectedTemplate.id}
            templateName={selectedTemplate.name}
          />
        )}

        {showAIGenerator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">AI Template Generator</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIGenerator(false)}
                >
                  ✕
                </Button>
              </div>
              <AITemplateGenerator onTemplateGenerated={handleAITemplateGenerated} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}