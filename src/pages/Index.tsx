
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomeTab } from '@/components/HomeTab';
import { KillAppsTab } from '@/components/KillAppsTab';
import { ClearCacheTab } from '@/components/ClearCacheTab';
import { SettingsTab } from '@/components/SettingsTab';
import { ProcessingQueue } from '@/types/app';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              App Tools
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Advanced Android Management System
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 backdrop-blur-sm">
              <TabsTrigger 
                value="home" 
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                🏠 Home
              </TabsTrigger>
              <TabsTrigger 
                value="kill" 
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
              >
                🔄 Kill
              </TabsTrigger>
              <TabsTrigger 
                value="cache" 
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                🧹 Cache
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-700 data-[state=active]:shadow-sm"
              >
                ⚙️ Config
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
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs shadow-sm border border-gray-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-700">ADB Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
