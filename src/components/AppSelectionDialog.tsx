
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
  onSelectionComplete: () => void;
}

export const AppSelectionDialog = ({ 
  open, 
  onOpenChange, 
  onSelectionComplete 
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
    console.log('Selected apps:', selectedApps);
    onSelectionComplete();
    setSelectedApps([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center">
            📱 Selecionar Aplicativos
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {mockApps.map((app) => (
              <div 
                key={app.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Checkbox 
                  checked={selectedApps.includes(app.id)}
                  onCheckedChange={() => toggleApp(app.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{app.icon}</span>
                    <span className="font-medium text-sm truncate">{app.name}</span>
                    {app.isRunning && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {app.packageName}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>📦 {app.size}</span>
                    <span>🧹 {app.cacheSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {selectedApps.length} selecionados
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              size="sm"
              onClick={handleComplete}
              disabled={selectedApps.length === 0}
              className="bg-gradient-to-r from-cyan-500 to-tech-600"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
