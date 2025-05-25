
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockApps } from '@/data/mockApps';
import { ProcessingQueue } from '@/types/app';

interface ClearCacheTabProps {
  processingQueue: ProcessingQueue[];
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const ClearCacheTab = ({ processingQueue, addToQueue }: ClearCacheTabProps) => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const appsWithCache = mockApps.filter(app => app.cacheSize && parseInt(app.cacheSize) > 0);

  const toggleApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const selectAll = () => {
    setSelectedApps(appsWithCache.map(app => app.id));
  };

  const selectHighCache = () => {
    const highCacheApps = appsWithCache
      .filter(app => parseInt(app.cacheSize || '0') > 100)
      .map(app => app.id);
    setSelectedApps(highCacheApps);
  };

  const clearSelection = () => {
    setSelectedApps([]);
  };

  const handleClearCache = () => {
    const selectedAppObjects = mockApps.filter(app => selectedApps.includes(app.id));
    
    const queueItems: ProcessingQueue[] = selectedAppObjects.map((app, index) => ({
      id: `cache-${app.id}-${Date.now()}-${index}`,
      appId: app.id,
      appName: app.name,
      type: 'cache',
      status: 'pending',
      command: `adb shell pm clear ${app.packageName}`
    }));

    addToQueue(queueItems);
    setSelectedApps([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🧹';
      case 'completed': return '✨';
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

  const getCacheSizeColor = (size: string) => {
    const sizeNum = parseInt(size);
    if (sizeNum > 200) return 'text-red-400';
    if (sizeNum > 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  const totalSelectedCache = selectedApps.reduce((total, appId) => {
    const app = mockApps.find(a => a.id === appId);
    return total + parseInt(app?.cacheSize || '0');
  }, 0);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-cyan-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            🧹 Limpeza de Cache
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-cyan-400">
                {appsWithCache.reduce((acc, app) => acc + parseInt(app.cacheSize || '0'), 0)} MB
              </div>
              <div className="text-muted-foreground">Cache Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-cyan-400">
                {totalSelectedCache} MB
              </div>
              <div className="text-muted-foreground">Selecionado</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="text-xs"
            >
              Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectHighCache}
              className="text-xs"
            >
              >100MB
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="text-xs"
            >
              Limpar
            </Button>
          </div>

          <Button 
            onClick={handleClearCache}
            disabled={selectedApps.length === 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            🧹 Limpar Cache ({selectedApps.length} apps, {totalSelectedCache}MB)
          </Button>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {processingQueue.length > 0 && (
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              📋 Fila de Limpeza
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
            📱 Apps com Cache
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {appsWithCache
                .sort((a, b) => parseInt(b.cacheSize || '0') - parseInt(a.cacheSize || '0'))
                .map((app) => (
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
                      {app.isRunning && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          Ativo
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {app.packageName}
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-muted-foreground">📦 {app.size}</span>
                      <span className={getCacheSizeColor(app.cacheSize || '0')}>
                        🧹 {app.cacheSize}
                      </span>
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
