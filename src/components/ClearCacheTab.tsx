
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Play, CheckSquare, Square } from 'lucide-react';
import { mockApps } from '@/data/mockApps';
import { ProcessingQueue } from '@/types/app';

interface ClearCacheTabProps {
  processingQueue: ProcessingQueue[];
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const ClearCacheTab = ({ processingQueue, addToQueue }: ClearCacheTabProps) => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

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
    setShowProcessingModal(true);
    
    // Fechar modal após processamento
    setTimeout(() => {
      setShowProcessingModal(false);
    }, 5000);
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
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCacheSizeColor = (size: string) => {
    const sizeNum = parseInt(size);
    if (sizeNum > 200) return 'text-red-600';
    if (sizeNum > 100) return 'text-amber-600';
    return 'text-green-600';
  };

  const totalSelectedCache = selectedApps.reduce((total, appId) => {
    const app = mockApps.find(a => a.id === appId);
    return total + parseInt(app?.cacheSize || '0');
  }, 0);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-blue-800">
            <Trash2 className="w-5 h-5 mr-2" />
            Limpeza de Cache
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-700">
                {appsWithCache.reduce((acc, app) => acc + parseInt(app.cacheSize || '0'), 0)} MB
              </div>
              <div className="text-gray-600">Cache Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-700">
                {totalSelectedCache} MB
              </div>
              <div className="text-gray-600">Selecionado</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="text-xs"
            >
              <CheckSquare className="w-3 h-3 mr-1" />
              Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectHighCache}
              className="text-xs"
            >
              &gt;100MB
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="text-xs"
            >
              <Square className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          </div>

          <Button 
            onClick={handleClearCache}
            disabled={selectedApps.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Limpar Cache ({selectedApps.length} apps, {totalSelectedCache}MB)
          </Button>
        </CardContent>
      </Card>

      {/* App List */}
      <Card className="bg-white/80 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-gray-800">
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
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-500">📦 {app.size}</span>
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

      {/* Processing Modal */}
      <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
        <DialogContent className="max-w-sm bg-white/95 backdrop-blur-md border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center text-gray-800">
              <Trash2 className="w-5 h-5 mr-2 text-blue-600" />
              Processando Limpeza
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
