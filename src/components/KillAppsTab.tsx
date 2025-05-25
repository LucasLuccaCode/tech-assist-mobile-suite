
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Play, CheckSquare, Square } from 'lucide-react';
import { mockApps } from '@/data/mockApps';
import { ProcessingQueue } from '@/types/app';

interface KillAppsTabProps {
  processingQueue: ProcessingQueue[];
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const KillAppsTab = ({ processingQueue, addToQueue }: KillAppsTabProps) => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const runningApps = mockApps.filter(app => app.isRunning);

  const toggleApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const selectAll = () => {
    setSelectedApps(runningApps.map(app => app.id));
  };

  const clearSelection = () => {
    setSelectedApps([]);
  };

  const handleKillApps = () => {
    const selectedAppObjects = mockApps.filter(app => selectedApps.includes(app.id));
    
    const queueItems: ProcessingQueue[] = selectedAppObjects.map((app, index) => ({
      id: `kill-${app.id}-${Date.now()}-${index}`,
      appId: app.id,
      appName: app.name,
      type: 'kill',
      status: 'pending',
      command: `adb shell am force-stop ${app.packageName}`
    }));

    addToQueue(queueItems);
    setSelectedApps([]);
    setShowProcessingModal(true);
    
    // Fechar modal após processamento
    setTimeout(() => {
      setShowProcessingModal(false);
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-red-800">
            <X className="w-5 h-5 mr-2" />
            Encerrar Aplicativos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{runningApps.length} apps em execução</span>
            <span className="text-gray-700">{selectedApps.length} selecionados</span>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="flex-1"
            >
              <CheckSquare className="w-3 h-3 mr-1" />
              Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="flex-1"
            >
              <Square className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          </div>

          <Button 
            onClick={handleKillApps}
            disabled={selectedApps.length === 0}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Encerrar Apps Selecionados ({selectedApps.length})
          </Button>
        </CardContent>
      </Card>

      {/* App List */}
      <Card className="bg-white/80 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-gray-800">
            📱 Apps em Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {runningApps.map((app) => (
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
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Ativo
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {app.packageName}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📦 {app.size}</span>
                      <span>🕒 {app.lastUsed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Processing Modal */}
      <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
        <DialogContent className="max-w-sm bg-white/95 backdrop-blur-md border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center text-gray-800">
              <X className="w-5 h-5 mr-2 text-red-600" />
              Encerrando Aplicativos
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {processingQueue.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getStatusIcon(item.status)}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-800">{item.appName}</div>
                        <div className="text-xs text-gray-500">
                          {item.command}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>
                  {processingQueue.filter(q => q.status === 'completed').length} / {processingQueue.length}
                </span>
              </div>
              <Progress 
                value={(processingQueue.filter(q => q.status === 'completed').length / processingQueue.length) * 100}
                className="h-2"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
