
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Plus, Calendar, X, Trash2, Play } from 'lucide-react';
import { mockScheduledCleans } from '@/data/mockApps';
import { ProcessingQueue, ScheduledClean } from '@/types/app';
import { AppSelectionDialog } from './AppSelectionDialog';
import { ScheduleModal } from './ScheduleModal';

interface HomeTabProps {
  addToQueue: (items: ProcessingQueue[]) => void;
}

export const HomeTab = ({ addToQueue }: HomeTabProps) => {
  const [schedules, setSchedules] = useState(mockScheduledCleans);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const toggleSchedule = (id: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const handleScheduleCreate = (newSchedule: any) => {
    const formattedSchedule: ScheduledClean = {
      id: newSchedule.id,
      name: newSchedule.name,
      type: (newSchedule.killApps && newSchedule.clearCache ? 'both' : 
            newSchedule.killApps ? 'apps' : 'cache') as 'cache' | 'apps' | 'both',
      schedule: newSchedule.time,
      enabled: newSchedule.enabled,
      selectedApps: [...(newSchedule.selectedKillApps || []), ...(newSchedule.selectedCacheApps || [])],
      days: newSchedule.days || []
    };
    setSchedules(prev => [...prev, formattedSchedule]);
  };

  const getStatusColor = (enabled: boolean) => 
    enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

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

  const activeSchedules = schedules.filter(s => s.enabled).length;

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {schedules.length}
            </div>
            <div className="text-sm text-slate-400">Total de Agendamentos</div>
            <div className="text-xs text-slate-500 mt-1">
              {activeSchedules} ativos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Cleanings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-slate-200">
              <Calendar className="w-5 h-5 mr-2" />
              Agendamentos
            </CardTitle>
            <Button 
              onClick={() => setShowScheduleModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(schedule.type)}
                      <span className="font-medium text-sm text-slate-200">{schedule.name}</span>
                      <Badge className={getStatusColor(schedule.enabled)}>
                        {schedule.enabled ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
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
                {index < schedules.length - 1 && <Separator className="my-2 bg-slate-700" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ScheduleModal 
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        onScheduleCreate={handleScheduleCreate}
      />
    </div>
  );
};
