
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, CheckSquare, Square, Check } from 'lucide-react';
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
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'processing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCacheSizeColor = (size: string) => {
    const sizeNum = parseInt(size);
    if (sizeNum > 200) return 'text-red-400';
    if (sizeNum > 100) return 'text-amber-400';
    return 'text-green-400';
  };

  const totalSelectedCache = selectedApps.reduce((total, appId) => {
    const app = mockApps.find(a => a.id === appId);
    return total + parseInt(app?.cacheSize || '0');
  }, 0);

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          onClick={selectAll}
          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
        >
          <CheckSquare className="w-4 h-4 mr-1" />
          Todos
        </Button>
        <Button 
          variant="outline" 
          onClick={selectHighCache}
          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
        >
          >100MB
        </Button>
        <Button 
          variant="outline" 
          onClick={clearSelection}
          className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
        >
          <Square className="w-4 h-4 mr-1" />
          Limpar
        </Button>
      </div>

      {/* App List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Apps com Cache</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {appsWithCache
                .sort((a, b) => parseInt(b.cacheSize || '0') - parseInt(a.cacheSize || '0'))
                .map((app) => (
                <div 
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {app.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{app.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-48">
                        {app.packageName}
                      </div>
                      <div className={`text-xs ${getCacheSizeColor(app.cacheSize || '0')} font-medium`}>
                        Cache: {app.cacheSize}MB
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      selectedApps.includes(app.id) 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-slate-700 border-2 border-slate-600'
                    }`}
                    onClick={() => toggleApp(app.id)}
                  >
                    {selectedApps.includes(app.id) && (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Execute Button */}
      <Button 
        onClick={handleClearCache}
        disabled={selectedApps.length === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Limpar Cache ({selectedApps.length} apps, {totalSelectedCache}MB)
      </Button>

      {/* Processing Modal */}
      <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
        <DialogContent className="max-w-sm bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center text-white">
              <Trash2 className="w-5 h-5 mr-2 text-purple-500" />
              Processando Limpeza
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {processingQueue.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getStatusIcon(item.status)}</span>
                      <div>
                        <div className="font-medium text-sm text-white">{item.appName}</div>
                        <div className="text-xs text-slate-400">
                          {item.command}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(item.status)} border`}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div>
              <div className="flex justify-between text-sm mb-2 text-slate-300">
                <span>Progresso</span>
                <span>
                  {processingQueue.filter(q => q.status === 'completed').length} / {processingQueue.length}
                </span>
              </div>
              <Progress 
                value={(processingQueue.filter(q => q.status === 'completed').length / processingQueue.length) * 100}
                className="h-2 bg-slate-700"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
