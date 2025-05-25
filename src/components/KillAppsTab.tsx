
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Play, CheckSquare, Square, Minus, Check, Search, Smartphone } from 'lucide-react';
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
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Encerrar aplicativos"
          className="w-full bg-blue-600/20 border border-blue-500/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          readOnly
        />
      </div>

      {/* Stats Card */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-slate-700/20 border-blue-500/30 rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Smartphone className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">TOTAL</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{runningApps.length}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckSquare className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">SELECIONADOS</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{selectedApps.length}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Minus className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">EXCEÇÕES</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{runningApps.length - selectedApps.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={selectAll}
          className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Selecionar Todos
        </Button>
        <Button 
          variant="outline" 
          onClick={clearSelection}
          className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          <Square className="w-4 h-4 mr-2" />
          Limpar Seleção
        </Button>
      </div>

      {/* App List */}
      <Card className="bg-slate-800/30 border-slate-700/50 rounded-2xl">
        <CardContent className="p-0">
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-1 p-4">
              {runningApps.map((app) => (
                <div 
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 hover:bg-slate-700/40 transition-all duration-200 border border-slate-700/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {app.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{app.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-48">
                        {app.packageName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        selectedApps.includes(app.id) 
                          ? 'bg-red-500/20 border-2 border-red-500' 
                          : 'bg-slate-700/50 border-2 border-slate-600'
                      }`}
                      onClick={() => toggleApp(app.id)}
                    >
                      {selectedApps.includes(app.id) ? (
                        <Minus className="w-4 h-4 text-red-400" />
                      ) : (
                        <Check className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Execute Button */}
      <Button 
        onClick={handleKillApps}
        disabled={selectedApps.length === 0}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="w-5 h-5 mr-2" />
        Encerrar Aplicativos Selecionados ({selectedApps.length})
      </Button>

      {/* Processing Modal */}
      <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
        <DialogContent className="max-w-sm bg-slate-900/95 backdrop-blur-xl border-slate-700/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center text-white">
              <X className="w-5 h-5 mr-2 text-red-500" />
              Encerrando Aplicativos
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {processingQueue.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/30"
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
