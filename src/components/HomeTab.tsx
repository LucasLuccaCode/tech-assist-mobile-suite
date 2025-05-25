
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Plus, Calendar, X, Trash2, Play } from 'lucide-react';
import { mockScheduledCleans, mockApps } from '@/data/mockApps';
import { ProcessingQueue } from '@/types/app';
import { AppSelectionDialog } from './AppSelectionDialog';
import { ScheduleModal } from './ScheduleModal';

interface HomeTabProps {
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const HomeTab = ({ addToQueue }: HomeTabProps) => {
  const [schedules, setSchedules] = useState(mockScheduledCleans);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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

  const handleScheduleCreate = (newSchedule: any) => {
    const formattedSchedule = {
      id: newSchedule.id,
      name: newSchedule.name,
      type: newSchedule.killApps && newSchedule.clearCache ? 'both' : 
            newSchedule.killApps ? 'apps' : 'cache',
      schedule: newSchedule.time,
      enabled: newSchedule.enabled,
      selectedApps: [...(newSchedule.selectedKillApps || []), ...(newSchedule.selectedCacheApps || [])],
      days: newSchedule.days || []
    };
    setSchedules(prev => [...prev, formattedSchedule]);
  };

  const getStatusColor = (enabled: boolean) => 
    enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cache': return <Trash2 className="w-4 h-4" />;
      case 'apps': return <X className="w-4 h-4" />;
      case 'both': return <Play className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDays = (days: string[] = []) => {
    const dayMap: { [key: string]: string } = {
      'mon': 'Seg', 'tue': 'Ter', 'wed': 'Qua', 'thu': 'Qui',
      'fri': 'Sex', 'sat': 'Sáb', 'sun': 'Dom'
    };
    return days.map(day => dayMap[day] || day).join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-blue-800">
            <Play className="w-5 h-5 mr-2" />
            Limpeza Rápida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Limpar Cache</span>
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
                <X className="w-4 h-4 text-red-600" />
                <span className="text-sm">Encerrar Apps</span>
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                disabled={!cleanOptions.cache && !cleanOptions.apps}
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Limpeza
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Cleanings */}
      <Card className="bg-white/80 border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-gray-800">
              <Calendar className="w-5 h-5 mr-2" />
              Agendamentos
            </CardTitle>
            <Button 
              onClick={() => setShowScheduleModal(true)}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((schedule, index) => (
              <div key={schedule.id}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(schedule.type)}
                      <span className="font-medium text-sm text-gray-800">{schedule.name}</span>
                      <Badge className={getStatusColor(schedule.enabled)}>
                        {schedule.enabled ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{schedule.schedule}</span>
                      </div>
                      {schedule.days && schedule.days.length > 0 && (
                        <div>Dias: {formatDays(schedule.days)}</div>
                      )}
                      <div>{(schedule.selectedApps || []).length} apps selecionados</div>
                    </div>
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
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-blue-600">
                {mockApps.filter(app => app.isRunning).length}
              </div>
              <div className="text-xs text-gray-600">Apps Ativos</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">
                {mockApps.reduce((acc, app) => acc + parseInt(app.cacheSize || '0'), 0)} MB
              </div>
              <div className="text-xs text-gray-600">Cache Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AppSelectionDialog 
        open={showAppSelection}
        onOpenChange={setShowAppSelection}
        onSelectionComplete={() => setShowAppSelection(false)}
      />

      <ScheduleModal 
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        onScheduleCreate={handleScheduleCreate}
      />
    </div>
  );
};
