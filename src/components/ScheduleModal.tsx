
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, X, Plus } from 'lucide-react';
import { AppSelectionDialog } from './AppSelectionDialog';

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleCreate: (schedule: any) => void;
}

export const ScheduleModal = ({ open, onOpenChange, onScheduleCreate }: ScheduleModalProps) => {
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [killAppsEnabled, setKillAppsEnabled] = useState(false);
  const [clearCacheEnabled, setClearCacheEnabled] = useState(false);
  const [selectedKillApps, setSelectedKillApps] = useState<string[]>([]);
  const [selectedCacheApps, setSelectedCacheApps] = useState<string[]>([]);
  const [showKillAppSelection, setShowKillAppSelection] = useState(false);
  const [showCacheAppSelection, setShowCacheAppSelection] = useState(false);

  const weekDays = [
    { id: 'mon', label: 'Seg' },
    { id: 'tue', label: 'Ter' },
    { id: 'wed', label: 'Qua' },
    { id: 'thu', label: 'Qui' },
    { id: 'fri', label: 'Sex' },
    { id: 'sat', label: 'Sáb' },
    { id: 'sun', label: 'Dom' }
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleKillAppsToggle = (enabled: boolean) => {
    setKillAppsEnabled(enabled);
    if (enabled) {
      setShowKillAppSelection(true);
    } else {
      setSelectedKillApps([]);
    }
  };

  const handleClearCacheToggle = (enabled: boolean) => {
    setClearCacheEnabled(enabled);
    if (enabled) {
      setShowCacheAppSelection(true);
    } else {
      setSelectedCacheApps([]);
    }
  };

  const handleCreateSchedule = () => {
    const schedule = {
      id: `schedule-${Date.now()}`,
      name: scheduleName,
      time: scheduleTime,
      days: selectedDays,
      killApps: killAppsEnabled,
      clearCache: clearCacheEnabled,
      selectedKillApps,
      selectedCacheApps,
      enabled: true
    };

    onScheduleCreate(schedule);
    
    // Reset form
    setScheduleName('');
    setScheduleTime('');
    setSelectedDays([]);
    setKillAppsEnabled(false);
    setClearCacheEnabled(false);
    setSelectedKillApps([]);
    setSelectedCacheApps([]);
    
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm bg-white/95 backdrop-blur-md border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center text-gray-800">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Novo Agendamento
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome do Agendamento
              </Label>
              <Input
                id="name"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                placeholder="Ex: Limpeza Noturna"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Horário
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Dias da Semana
              </Label>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <Button
                    key={day.id}
                    variant={selectedDays.includes(day.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.id)}
                    className="text-xs h-8"
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Encerrar Apps</span>
                  {killAppsEnabled && selectedKillApps.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedKillApps.length} apps
                    </Badge>
                  )}
                </div>
                <Switch 
                  checked={killAppsEnabled}
                  onCheckedChange={handleKillAppsToggle}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Limpar Cache</span>
                  {clearCacheEnabled && selectedCacheApps.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedCacheApps.length} apps
                    </Badge>
                  )}
                </div>
                <Switch 
                  checked={clearCacheEnabled}
                  onCheckedChange={handleClearCacheToggle}
                />
              </div>
            </div>

            <Button 
              onClick={handleCreateSchedule}
              disabled={!scheduleName || !scheduleTime || selectedDays.length === 0 || (!killAppsEnabled && !clearCacheEnabled)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              Criar Agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AppSelectionDialog 
        open={showKillAppSelection}
        onOpenChange={setShowKillAppSelection}
        onSelectionComplete={(apps) => {
          setSelectedKillApps(apps);
          setShowKillAppSelection(false);
        }}
        title="Selecionar Apps para Encerrar"
      />

      <AppSelectionDialog 
        open={showCacheAppSelection}
        onOpenChange={setShowCacheAppSelection}
        onSelectionComplete={(apps) => {
          setSelectedCacheApps(apps);
          setShowCacheAppSelection(false);
        }}
        title="Selecionar Apps para Limpar Cache"
      />
    </>
  );
};
