
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockApps } from '@/data/mockApps';

interface AppSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectionComplete: (selectedApps: string[]) => void;
  title?: string;
}

export const AppSelectionDialog = ({ 
  open, 
  onOpenChange, 
  onSelectionComplete,
  title = "Selecionar Aplicativos"
}: AppSelectionDialogProps) => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const toggleApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleComplete = () => {
    onSelectionComplete(selectedApps);
    setSelectedApps([]);
  };

  const handleCancel = () => {
    setSelectedApps([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-white/95 backdrop-blur-md border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center text-gray-800">
            📱 {title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {mockApps.map((app) => (
              <div 
                key={app.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Checkbox 
                  checked={selectedApps.includes(app.id)}
                  onCheckedChange={() => toggleApp(app.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{app.icon}</span>
                    <span className="font-medium text-sm truncate text-gray-800">{app.name}</span>
                    {app.isRunning && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {app.packageName}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>📦 {app.size}</span>
                    <span>🧹 {app.cacheSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            {selectedApps.length} selecionados
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              size="sm"
              onClick={handleComplete}
              disabled={selectedApps.length === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
