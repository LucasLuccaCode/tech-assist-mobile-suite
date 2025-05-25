
export interface App {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  size: string;
  lastUsed: string;
  isRunning?: boolean;
  cacheSize?: string;
}

export interface ScheduledClean {
  id: string;
  name: string;
  type: 'cache' | 'apps' | 'both';
  schedule: string;
  enabled: boolean;
  selectedApps: string[];
}

export interface ProcessingQueue {
  id: string;
  appId: string;
  appName: string;
  type: 'kill' | 'cache';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  command?: string;
}
