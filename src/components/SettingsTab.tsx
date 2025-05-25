
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

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
    // Simular download do arquivo
    alert('Configurações exportadas! (simulado)');
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-sm">ADB Conectado</div>
                <div className="text-xs text-muted-foreground">
                  192.168.1.100:5555
                </div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400">
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            🤖 Automação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Limpeza Automática</div>
                <div className="text-xs text-muted-foreground">
                  Executa limpeza em intervalos regulares
                </div>
              </div>
              <Switch 
                checked={settings.autoCleanEnabled}
                onCheckedChange={() => toggleSetting('autoCleanEnabled')}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intervalo de Limpeza</span>
                <span>{cleanInterval[0]}h</span>
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

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Auto Conectar ADB</div>
                <div className="text-xs text-muted-foreground">
                  Conecta automaticamente ao iniciar
                </div>
              </div>
              <Switch 
                checked={settings.autoConnectADB}
                onCheckedChange={() => toggleSetting('autoConnectADB')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Encerrar Apps Automaticamente</div>
                <div className="text-xs text-muted-foreground">
                  Apps inativos por mais de 2h
                </div>
              </div>
              <Switch 
                checked={settings.autoKillApps}
                onCheckedChange={() => toggleSetting('autoKillApps')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            ⚡ Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Limite de Cache Automático</span>
              <span>{maxCacheSize[0]}MB</span>
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

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Modo Seguro</div>
              <div className="text-xs text-muted-foreground">
                Protege apps do sistema
              </div>
            </div>
            <Switch 
              checked={settings.safeMode}
              onCheckedChange={() => toggleSetting('safeMode')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Varredura Profunda</div>
              <div className="text-xs text-muted-foreground">
                Analisa arquivos temporários
              </div>
            </div>
            <Switch 
              checked={settings.deepScan}
              onCheckedChange={() => toggleSetting('deepScan')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Modo Bateria Baixa</div>
              <div className="text-xs text-muted-foreground">
                Reduz operações quando bateria &lt; 20%
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
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            🔧 Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Notificações</div>
              <div className="text-xs text-muted-foreground">
                Alertas de limpeza e status
              </div>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={() => toggleSetting('notifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Modo Debug</div>
              <div className="text-xs text-muted-foreground">
                Logs detalhados para desenvolvimento
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
      <Card className="bg-gradient-to-r from-tech-300/20 to-tech-400/20 border-tech-500/30">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={exportSettings}
              className="flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Exportar</span>
            </Button>
            <Button 
              variant="outline"
              onClick={resetSettings}
              className="flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="bg-gradient-to-r from-tech-200/30 to-tech-300/30 border-tech-400/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            📊 Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versão App Tools</span>
              <span className="font-mono">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ADB Version</span>
              <span className="font-mono">1.0.41</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Device API</span>
              <span className="font-mono">Android 13 (API 33)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comandos Executados</span>
              <span className="font-mono">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cache Limpo</span>
              <span className="font-mono">15.6 GB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
