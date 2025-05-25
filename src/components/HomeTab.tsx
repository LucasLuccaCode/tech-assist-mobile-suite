
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockScheduledCleans, mockApps } from '@/data/mockApps';
import { ProcessingQueue } from '@/types/app';
import { AppSelectionDialog } from './AppSelectionDialog';

interface HomeTabProps {
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const HomeTab = ({ addToQueue }: HomeTabProps) => {
  const [schedules, setSchedules] = useState(mockScheduledCleans);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [showAppSelection, setShowAppSelection] = useState(false);
  const [cleanOptions, setCleanOptions] = useState({
    cache: false,
    apps: false
  });

  const toggleSchedule = (id: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const handleQuickClean = () => {
    if (!cleanOptions.cache && !cleanOptions.apps) return;

    const queueItems: ProcessingQueue[] = [];

    if (cleanOptions.cache) {
      mockApps.slice(0, 3).forEach((app, index) => {
        queueItems.push({
          id: `cache-${app.id}-${Date.now()}-${index}`,
          appId: app.id,
          appName: app.name,
          type: 'cache',
          status: 'pending',
          command: `adb shell pm clear ${app.packageName}`
        });
      });
    }

    if (cleanOptions.apps) {
      mockApps.filter(app => app.isRunning).forEach((app, index) => {
        queueItems.push({
          id: `kill-${app.id}-${Date.now()}-${index}`,
          appId: app.id,
          appName: app.name,
          type: 'kill',
          status: 'pending',
          command: `adb shell am force-stop ${app.packageName}`
        });
      });
    }

    addToQueue(queueItems);
    setCleanOptions({ cache: false, apps: false });
  };

  const getStatusColor = (enabled: boolean) => 
    enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cache': return '🧹';
      case 'apps': return '🔄';
      case 'both': return '⚡';
      default: return '📱';
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-tech-200/50 to-tech-300/50 border-tech-400/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            ⚡ Limpeza Rápida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🧹 Limpar Cache</span>
              </div>
              <Switch 
                checked={cleanOptions.cache}
                onCheckedChange={(checked) => 
                  setCleanOptions(prev => ({ ...prev, cache: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🔄 Encerrar Apps</span>
              </div>
              <Switch 
                checked={cleanOptions.apps}
                onCheckedChange={(checked) => 
                  setCleanOptions(prev => ({ ...prev, apps: checked }))
                }
              />
            </div>
          </div>

          {(cleanOptions.cache || cleanOptions.apps) && (
            <div className="space-y-2">
              <Button 
                onClick={() => setShowAppSelection(true)}
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                📱 Selecionar Apps
              </Button>
              
              <Button 
                onClick={handleQuickClean}
                className="w-full bg-gradient-to-r from-cyan-500 to-tech-600 hover:from-cyan-600 hover:to-tech-700"
                disabled={!cleanOptions.cache && !cleanOptions.apps}
              >
                🚀 Iniciar Limpeza
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Cleanings */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            📅 Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((schedule, index) => (
              <div key={schedule.id}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 backdrop-blur-sm scan-effect">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{getTypeIcon(schedule.type)}</span>
                      <span className="font-medium text-sm">{schedule.name}</span>
                      <Badge className={getStatusColor(schedule.enabled)}>
                        {schedule.enabled ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {schedule.schedule}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {schedule.selectedApps.length} apps selecionados
                    </p>
                  </div>
                  <Switch 
                    checked={schedule.enabled}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                  />
                </div>
                {index < schedules.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Stats */}
      <Card className="bg-gradient-to-r from-tech-300/30 to-tech-400/30 border-tech-500/30">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-cyan-400">
                {mockApps.filter(app => app.isRunning).length}
              </div>
              <div className="text-xs text-muted-foreground">Apps Ativos</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">
                {mockApps.reduce((acc, app) => acc + parseInt(app.cacheSize || '0'), 0)} MB
              </div>
              <div className="text-xs text-muted-foreground">Cache Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AppSelectionDialog 
        open={showAppSelection}
        onOpenChange={setShowAppSelection}
        onSelectionComplete={() => setShowAppSelection(false)}
      />
    </div>
  );
};
