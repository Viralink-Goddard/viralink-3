import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  platforms: string[];
  niches: string[];
  contentTypes: string[];
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  filters: {
    platforms: string[];
    niches: string[];
    contentTypes: string[];
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
}

export default function ExportModal({ open, onClose, onExport, platforms, niches, contentTypes }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('pdf');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleExport = () => {
    onExport({
      format: exportFormat,
      filters: {
        platforms: selectedPlatforms,
        niches: selectedNiches,
        contentTypes: selectedContentTypes,
        dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined
      }
    });
    onClose();
  };

  const toggleItem = (item: string, list: string[], setter: (list: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Content Library</DialogTitle>
          <DialogDescription>Choose export format and apply filters to customize your export</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                onClick={() => setExportFormat('pdf')}
                className="justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF (Formatted)
              </Button>
              <Button
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                onClick={() => setExportFormat('csv')}
                className="justify-start"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV (Spreadsheet)
              </Button>
            </div>
          </div>

          <div>
            <Label>Filter by Platform</Label>
            <div className="space-y-2 mt-2">
              {platforms.map(platform => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedPlatforms.includes(platform)}
                    onCheckedChange={() => toggleItem(platform, selectedPlatforms, setSelectedPlatforms)}
                  />
                  <Label className="font-normal cursor-pointer">{platform}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Filter by Niche</Label>
            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
              {niches.map(niche => (
                <div key={niche} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedNiches.includes(niche)}
                    onCheckedChange={() => toggleItem(niche, selectedNiches, setSelectedNiches)}
                  />
                  <Label className="font-normal cursor-pointer">{niche}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Filter by Date Range</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}