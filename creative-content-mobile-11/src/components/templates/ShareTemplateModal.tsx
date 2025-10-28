import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Mail, Shield, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ShareTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateName: string;
}

interface SharedUser {
  email: string;
  permission: string;
}

export const ShareTemplateModal: React.FC<ShareTemplateModalProps> = ({
  isOpen,
  onClose,
  templateId,
  templateName
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to share with.",
        variant: "destructive"
      });
      return;
    }

    if (sharedUsers.some(u => u.email === email)) {
      toast({
        title: "Already Shared",
        description: "This template is already shared with this user.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Add to local state
      setSharedUsers([...sharedUsers, { email, permission }]);

      // Save to database
      const { error } = await supabase
        .from('team_template_shares')
        .insert({
          template_id: templateId,
          shared_by: user.id,
          shared_with_email: email,
          permission
        });

      if (error) throw error;

      toast({
        title: "Invitation Sent",
        description: `Template shared with ${email}`,
      });

      setEmail('');
    } catch (error) {
      console.error('Error sharing template:', error);
      toast({
        title: "Error",
        description: "Failed to share template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = (emailToRemove: string) => {
    setSharedUsers(sharedUsers.filter(u => u.email !== emailToRemove));
  };

  const handleSave = async () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Share Template
          </DialogTitle>
          <DialogDescription>
            Share "{templateName}" with team members for collaboration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Shared users will receive an email invitation to access this template.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Invite Team Members</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="edit">Can Edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddUser} disabled={loading}>
                <Mail className="h-4 w-4 mr-1" />
                Invite
              </Button>
            </div>
          </div>

          {sharedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Shared With</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sharedUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{user.email}</span>
                      <Badge variant="secondary" className="text-xs">
                        {user.permission === 'view' && 'View Only'}
                        {user.permission === 'edit' && 'Can Edit'}
                        {user.permission === 'admin' && 'Admin'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p className="font-medium mb-1">Permission Levels:</p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>View Only:</strong> Can use the template but not modify it</li>
              <li>• <strong>Can Edit:</strong> Can modify and save changes to the template</li>
              <li>• <strong>Admin:</strong> Full access including sharing and deletion</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};