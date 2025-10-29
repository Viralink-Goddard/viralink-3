import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Copy, Edit, Trash2, Share2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    content_type: string;
    tags: string[];
    usage_count: number;
    is_public: boolean;
    is_team_shared: boolean;
    created_at: string;
  };
  onUse: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDuplicate: (id: string) => void;
  isOwner: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUse,
  onEdit,
  onDelete,
  onShare,
  onDuplicate,
  isOwner
}) => {
  const getContentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tutorial': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-green-100 text-green-800';
      case 'storytelling': return 'bg-purple-100 text-purple-800';
      case 'comparison': return 'bg-orange-100 text-orange-800';
      case 'listicle': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {template.name}
            </CardTitle>
            <CardDescription className="mt-2">
              {template.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {template.is_public && (
              <Badge variant="secondary" className="bg-blue-50">
                <Eye className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
            {template.is_team_shared && (
              <Badge variant="secondary" className="bg-green-50">
                <Users className="h-3 w-3 mr-1" />
                Shared
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={getContentTypeColor(template.content_type)}>
              {template.content_type}
            </Badge>
            <span className="text-sm text-gray-500">
              Used {template.usage_count} times
            </span>
          </div>
          
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Created {format(new Date(template.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => onUse(template.id)}
          className="flex-1"
          variant="default"
        >
          Use Template
        </Button>
        
        <Button
          onClick={() => onDuplicate(template.id)}
          variant="outline"
          size="icon"
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        {isOwner && (
          <>
            <Button
              onClick={() => onEdit(template.id)}
              variant="outline"
              size="icon"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => onShare(template.id)}
              variant="outline"
              size="icon"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => onDelete(template.id)}
              variant="outline"
              size="icon"
              title="Delete"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};