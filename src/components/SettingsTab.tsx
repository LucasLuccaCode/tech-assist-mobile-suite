
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Wifi, 
  Bell, 
  Shield, 
  Zap, 
  Battery, 
  Search, 
  Settings, 
  Smartphone, 
  HardDrive, 
  Clock, 
  Download, 
  RotateCcw,
  Bug
} from 'lucide-react';

export const SettingsTab = () => {
  const [settings, setSettings] = useState({
    autoCleanEnabled: true,
    debugMode: false,
    notifications: true,
    autoKillApps: false,
    safeMode: true,
    deepScan: false,
    autoConnectADB: true,
    lowBatteryMode: false
  });

  const [cleanInterval, setCleanInterval] = useState([6]);
  const [maxCacheSize, setMaxCacheSize] = useState([100]);

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const resetSettings = () => {
    setSettings({
      autoCleanEnabled: true,
      debugMode: false,
      notifications: true,
      autoKillApps: false,
      safeMode: true,
      deepScan: false,
      autoConnectADB: true,
      lowBatteryMode: false
    });
    setCleanInterval([6]);
    setMaxCacheSize([100]);
  };

  const exportSettings = () => {
    const settingsData = {
      settings,
      cleanInterval: cleanInterval[0],
      maxCacheSize: maxCacheSize[0],
      exportDate: new Date().toISOString()
    };
    
    console.log('Exporting settings:', settingsData);
    alert('Configurações exportadas! (simulado)');
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Configurações"
          className="w-full bg-green-600/20 border border-green-500/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
          readOnly
        />
      </div>

      {/* Connection Status */}
      <Card className="bg-gradient-to-r from-green-600/10 to-slate-700/20 border-green-500/30 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-white text-lg">ADB Conectado</div>
                <div className="text-sm text-slate-400">
                  192.168.1.100:5555
                </div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card className="bg-slate-800/30 border-slate-700/50 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center text-white">
            <Zap className="w-5 h-5 mr-3 text-yellow-400" />
            Automação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-sm text-white">Limpeza Automática</div>
                <div className="text-xs text-slate-400">
                  Executa limpeza em intervalos regulares
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.autoCleanEnabled}
              onCheckedChange={() => toggleSetting('autoCleanEnabled')}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Intervalo de Limpeza</span>
              <span className="text-blue-400">{cleanInterval[0]}h</span>
            </div>
            <Slider
              value={cleanInterval}
              onValueChange={setCleanInterval}
              max={24}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <Separator className="bg-slate-700/50" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-sm text-white">Auto Conectar ADB</div>
                <div className="text-xs text-slate-400">
                  Conecta automaticamente ao iniciar
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.autoConnectADB}
              onCheckedChange={() => toggleSetting('autoConnectADB')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-medium text-sm text-white">Encerrar Apps Automaticamente</div>
                <div className="text-xs text-slate-400">
                  Apps inativos por mais de 2h
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.autoKillApps}
              onCheckedChange={() => toggleSetting('autoKillApps')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card className="bg-slate-800/30 border-slate-700/50 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center text-white">
            <Zap className="w-5 h-5 mr-3 text-orange-400" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Limite de Cache Automático</span>
              <span className="text-purple-400">{maxCacheSize[0]}MB</span>
            </div>
            <Slider
              value={maxCacheSize}
              onValueChange={setMaxCacheSize}
              max={500}
              min={50}
              step={25}
              className="w-full"
            />
          </div>

          <Separator className="bg-slate-700/50" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-sm text-white">Modo Seguro</div>
                <div className="text-xs text-slate-400">
                  Protege apps do sistema
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.safeMode}
              onCheckedChange={() => toggleSetting('safeMode')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-sm text-white">Varredura Profunda</div>
                <div className="text-xs text-slate-400">
                  Analisa arquivos temporários
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.deepScan}
              onCheckedChange={() => toggleSetting('deepScan')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Battery className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-medium text-sm text-white">Modo Bateria Baixa</div>
                <div className="text-xs text-slate-400">
                  Reduz operações quando bateria &lt; 20%
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.lowBatteryMode}
              onCheckedChange={() => toggleSetting('lowBatteryMode')}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-slate-800/30 border-slate-700/50 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center text-white">
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-sm text-white">Notificações</div>
                <div className="text-xs text-slate-400">
                  Alertas de limpeza e status
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={() => toggleSetting('notifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bug className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-medium text-sm text-white">Modo Debug</div>
                <div className="text-xs text-slate-400">
                  Logs detalhados para desenvolvimento
                </div>
              </div>
            </div>
            <Switch 
              checked={settings.debugMode}
              onCheckedChange={() => toggleSetting('debugMode')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline"
          onClick={exportSettings}
          className="flex items-center justify-center space-x-2 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white py-3 rounded-xl"
        >
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </Button>
        <Button 
          variant="outline"
          onClick={resetSettings}
          className="flex items-center justify-center space-x-2 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white py-3 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </div>

      {/* System Info */}
      <Card className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 border-slate-600/50 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center text-white">
            <Smartphone className="w-5 h-5 mr-3 text-cyan-400" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Versão App Tools</span>
              <span className="font-mono text-white bg-slate-700/50 px-2 py-1 rounded">v2.1.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">ADB Version</span>
              <span className="font-mono text-white bg-slate-700/50 px-2 py-1 rounded">1.0.41</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Device API</span>
              <span className="font-mono text-white bg-slate-700/50 px-2 py-1 rounded">Android 13 (API 33)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Comandos Executados</span>
              <span className="font-mono text-green-400 bg-slate-700/50 px-2 py-1 rounded">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cache Limpo</span>
              <span className="font-mono text-purple-400 bg-slate-700/50 px-2 py-1 rounded">15.6 GB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
