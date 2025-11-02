import React, { useState } from 'react';
import { Sparkles, Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AITemplateGeneratorProps {
  onTemplateGenerated?: (template: any) => void;
}

export const AITemplateGenerator: React.FC<AITemplateGeneratorProps> = ({ onTemplateGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    niche: '',
    platform: 'instagram',
    contentType: 'tutorial',
    contentGoals: '',
    targetAudience: ''
  });
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.niche || !formData.contentGoals) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in your niche and content goals',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-template', {
        body: formData
      });

      if (error) throw error;

      if (data?.template) {
        setGeneratedTemplate(data.template);
        toast({
          title: 'Template Generated!',
          description: 'Your AI-powered template is ready'
        });
        if (onTemplateGenerated) {
          onTemplateGenerated(data.template);
        }
      }
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate template. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTemplate = async () => {
    if (!generatedTemplate) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to save templates',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('content_templates')
        .insert({
          user_id: user.id,
          name: generatedTemplate.name,
          description: generatedTemplate.description,
          platform: generatedTemplate.platform,
          content_type: generatedTemplate.contentType,
          niche: generatedTemplate.niche,
          structure: generatedTemplate.structure,
          is_public: false
        });

      if (error) throw error;

      toast({
        title: 'Template Saved!',
        description: 'Your template has been added to your library'
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Save Failed',
        description: 'Unable to save template',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Template Generator
          </CardTitle>
          <CardDescription>
            Generate custom templates optimized for your content strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="niche">Your Niche</Label>
              <Input
                id="niche"
                placeholder="e.g., Fitness, Tech Reviews, Cooking"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value })}
              >
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="storytelling">Storytelling</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Young professionals, Parents"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="goals">Content Goals</Label>
            <Textarea
              id="goals"
              placeholder="What do you want to achieve with your content? (e.g., Increase engagement, Build community, Drive sales)"
              value={formData.contentGoals}
              onChange={(e) => setFormData({ ...formData, contentGoals: e.target.value })}
              rows={3}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Template...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Template
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedTemplate.name}</CardTitle>
            <CardDescription>{generatedTemplate.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={saveTemplate} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save to Library
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};