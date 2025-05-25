
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockApps } from '@/data/mockApps';
import { ProcessingQueue } from '@/types/app';

interface KillAppsTabProps {
  processingQueue: ProcessingQueue[];
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const KillAppsTab = ({ processingQueue, addToQueue }: KillAppsTabProps) => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

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
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            🔄 Encerrar Aplicativos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>{runningApps.length} apps em execução</span>
            <span>{selectedApps.length} selecionados</span>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="flex-1"
            >
              Selecionar Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="flex-1"
            >
              Limpar Seleção
            </Button>
          </div>

          <Button 
            onClick={handleKillApps}
            disabled={selectedApps.length === 0}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            🚫 Encerrar Apps Selecionados ({selectedApps.length})
          </Button>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {processingQueue.length > 0 && (
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              📋 Fila de Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {processingQueue.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getStatusIcon(item.status)}</span>
                      <div>
                        <div className="font-medium text-sm">{item.appName}</div>
                        <div className="text-xs text-muted-foreground">
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
            
            <div className="mt-4">
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
          </CardContent>
        </Card>
      )}

      {/* App List */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            📱 Apps em Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {runningApps.map((app) => (
                <div 
                  key={app.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors scan-effect"
                >
                  <Checkbox 
                    checked={selectedApps.includes(app.id)}
                    onCheckedChange={() => toggleApp(app.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{app.icon}</span>
                      <span className="font-medium text-sm truncate">{app.name}</span>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        Ativo
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {app.packageName}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
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
    </div>
  );
};
