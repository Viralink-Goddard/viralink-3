import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Variable } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
  editingTemplate?: any;
}

const CONTENT_TYPES = [
  'Tutorial',
  'Review',
  'Storytelling',
  'Comparison',
  'Listicle',
  'How-to',
  'Case Study',
  'Interview',
  'News',
  'Opinion'
];

const TEMPLATE_STRUCTURES = {
  Tutorial: [
    { id: 'intro', label: 'Introduction', placeholder: 'Hook and overview' },
    { id: 'prerequisites', label: 'Prerequisites', placeholder: 'What viewers need to know' },
    { id: 'steps', label: 'Step-by-Step Guide', placeholder: 'Main tutorial content' },
    { id: 'tips', label: 'Pro Tips', placeholder: 'Advanced tips and tricks' },
    { id: 'conclusion', label: 'Conclusion', placeholder: 'Summary and next steps' }
  ],
  Review: [
    { id: 'intro', label: 'Introduction', placeholder: 'Product overview' },
    { id: 'pros', label: 'Pros', placeholder: 'Positive aspects' },
    { id: 'cons', label: 'Cons', placeholder: 'Negative aspects' },
    { id: 'verdict', label: 'Final Verdict', placeholder: 'Overall recommendation' }
  ],
  Storytelling: [
    { id: 'hook', label: 'Hook', placeholder: 'Attention-grabbing opening' },
    { id: 'setup', label: 'Setup', placeholder: 'Context and background' },
    { id: 'conflict', label: 'Conflict', placeholder: 'Main challenge or problem' },
    { id: 'resolution', label: 'Resolution', placeholder: 'How it was resolved' },
    { id: 'lesson', label: 'Lesson', placeholder: 'Key takeaway' }
  ]
};

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTemplate
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(editingTemplate?.name || '');
  const [description, setDescription] = useState(editingTemplate?.description || '');
  const [contentType, setContentType] = useState(editingTemplate?.content_type || 'Tutorial');
  const [tags, setTags] = useState<string[]>(editingTemplate?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(editingTemplate?.is_public || false);
  const [structure, setStructure] = useState(editingTemplate?.structure || TEMPLATE_STRUCTURES.Tutorial);
  const [variables, setVariables] = useState<string[]>(editingTemplate?.variables || []);
  const [variableInput, setVariableInput] = useState('');

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddVariable = () => {
    if (variableInput && !variables.includes(variableInput)) {
      setVariables([...variables, variableInput]);
      setVariableInput('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    setStructure(TEMPLATE_STRUCTURES[type as keyof typeof TEMPLATE_STRUCTURES] || TEMPLATE_STRUCTURES.Tutorial);
  };

  const handleSave = () => {
    if (!name || !description) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and description for your template.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      name,
      description,
      content_type: contentType,
      structure,
      variables,
      tags,
      is_public: isPublic
    });

    // Reset form
    setName('');
    setDescription('');
    setContentType('Tutorial');
    setTags([]);
    setVariables([]);
    setIsPublic(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
          <DialogDescription>
            Build a reusable content template with predefined structure and variables.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ultimate Product Review Template"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={handleContentTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Template Structure</Label>
            <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg">
              {structure.map((section: any, index: number) => (
                <div key={section.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className="text-xs text-gray-500">{section.placeholder}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Variables (Dynamic Content)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={variableInput}
                onChange={(e) => setVariableInput(e.target.value)}
                placeholder="e.g., {{product_name}}"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariable())}
              />
              <Button onClick={handleAddVariable} size="sm">
                <Variable className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {variables.map(variable => (
                <Badge key={variable} variant="secondary">
                  {variable}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleRemoveVariable(variable)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="public">Make template public</Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};