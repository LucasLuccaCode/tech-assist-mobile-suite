
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomeTab } from '@/components/HomeTab';
import { KillAppsTab } from '@/components/KillAppsTab';
import { ClearCacheTab } from '@/components/ClearCacheTab';
import { SettingsTab } from '@/components/SettingsTab';
import { ProcessingQueue } from '@/types/app';
import { Home, X, Trash2, Settings } from 'lucide-react';

const Index = () => {
  const [processingQueue, setProcessingQueue] = useState<ProcessingQueue[]>([]);

  const addToQueue = (newItems: ProcessingQueue[]) => {
    setProcessingQueue(prev => [...prev, ...newItems]);
    
    // Simular processamento
    newItems.forEach((item, index) => {
      setTimeout(() => {
        setProcessingQueue(prev => 
          prev.map(qItem => 
            qItem.id === item.id 
              ? { ...qItem, status: 'processing' as const }
              : qItem
          )
        );
        
        setTimeout(() => {
          setProcessingQueue(prev => 
            prev.map(qItem => 
              qItem.id === item.id 
                ? { ...qItem, status: 'completed' as const }
                : qItem
            )
          );
        }, 2000);
      }, index * 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            App Tools
          </h1>
          <p className="text-slate-400 text-sm">
            Advanced Android Management System
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden">
          <Tabs defaultValue="kill" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 rounded-none h-16 p-0">
              <TabsTrigger 
                value="home" 
                className="flex flex-col items-center gap-1 h-full text-xs font-medium data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 text-slate-400 hover:text-slate-200 rounded-none border-b-2 border-transparent transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                <span>HOME</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kill" 
                className="flex flex-col items-center gap-1 h-full text-xs font-medium data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400 data-[state=active]:border-b-2 data-[state=active]:border-red-400 text-slate-400 hover:text-slate-200 rounded-none border-b-2 border-transparent transition-all duration-200"
              >
                <X className="w-5 h-5" />
                <span>ENCERRAR APPS</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cache" 
                className="flex flex-col items-center gap-1 h-full text-xs font-medium data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 text-slate-400 hover:text-slate-200 rounded-none border-b-2 border-transparent transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
                <span>LIMPAR CACHES</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex flex-col items-center gap-1 h-full text-xs font-medium data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 text-slate-400 hover:text-slate-200 rounded-none border-b-2 border-transparent transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>CONFIGURAÇÕES</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="bg-slate-900/50">
              <TabsContent value="home" className="m-0 p-6">
                <HomeTab addToQueue={addToQueue} />
              </TabsContent>

              <TabsContent value="kill" className="m-0 p-6">
                <KillAppsTab 
                  processingQueue={processingQueue.filter(q => q.type === 'kill')} 
                  addToQueue={addToQueue}
                />
              </TabsContent>

              <TabsContent value="cache" className="m-0 p-6">
                <ClearCacheTab 
                  processingQueue={processingQueue.filter(q => q.type === 'cache')} 
                  addToQueue={addToQueue}
                />
              </TabsContent>

              <TabsContent value="settings" className="m-0 p-6">
                <SettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Connection Status */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-3 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">ADB Connected</span>
            <span className="text-slate-500 text-xs">192.168.1.100:5555</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
