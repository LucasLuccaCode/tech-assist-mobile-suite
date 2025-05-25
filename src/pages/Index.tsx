
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
    <div className="min-h-screen bg-gradient-to-br from-tech-50 via-tech-100 to-tech-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-tech-600 rounded-lg mr-3 flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-tech-600 bg-clip-text text-transparent">
              App Tools
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Advanced Android Management System
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger 
                value="home" 
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                🏠 Home
              </TabsTrigger>
              <TabsTrigger 
                value="kill" 
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                🔄 Kill
              </TabsTrigger>
              <TabsTrigger 
                value="cache" 
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                🧹 Cache
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
          <div className="inline-flex items-center space-x-2 bg-muted/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">ADB Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
