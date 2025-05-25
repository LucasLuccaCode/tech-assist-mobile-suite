
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
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              App Tools
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Advanced Android Management System
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-xl">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/80 backdrop-blur-sm border-slate-700">
              <TabsTrigger 
                value="home" 
                className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm text-slate-400 hover:text-slate-200"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </TabsTrigger>
              <TabsTrigger 
                value="kill" 
                className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-red-400 data-[state=active]:shadow-sm text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4 mr-1" />
                Kill
              </TabsTrigger>
              <TabsTrigger 
                value="cache" 
                className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm text-slate-400 hover:text-slate-200"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Cache
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-slate-200 data-[state=active]:shadow-sm text-slate-400 hover:text-slate-200"
              >
                <Settings className="w-4 h-4 mr-1" />
                Config
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="home" className="m-0">
                <HomeTab addToQueue={addToQueue} />
              </TabsContent>

              <TabsContent value="kill" className="m-0">
                <KillAppsTab 
                  processingQueue={processingQueue.filter(q => q.type === 'kill')} 
                  addToQueue={addToQueue}
                />
              </TabsContent>

              <TabsContent value="cache" className="m-0">
                <ClearCacheTab 
                  processingQueue={processingQueue.filter(q => q.type === 'cache')} 
                  addToQueue={addToQueue}
                />
              </TabsContent>

              <TabsContent value="settings" className="m-0">
                <SettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Status Bar */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs shadow-sm border border-slate-700">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300">ADB Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
