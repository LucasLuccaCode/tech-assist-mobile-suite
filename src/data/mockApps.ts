
import { App, ScheduledClean } from '@/types/app';

export const mockApps: App[] = [
  {
    id: '1',
    name: 'WhatsApp',
    packageName: 'com.whatsapp',
    icon: '💬',
    size: '156 MB',
    lastUsed: '2 min ago',
    isRunning: true,
    cacheSize: '45 MB'
  },
  {
    id: '2',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    icon: '📷',
    size: '234 MB',
    lastUsed: '15 min ago',
    isRunning: true,
    cacheSize: '78 MB'
  },
  {
    id: '3',
    name: 'Chrome',
    packageName: 'com.android.chrome',
    icon: '🌐',
    size: '189 MB',
    lastUsed: '1 hour ago',
    isRunning: false,
    cacheSize: '156 MB'
  },
  {
    id: '4',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    icon: '📺',
    size: '312 MB',
    lastUsed: '3 hours ago',
    isRunning: true,
    cacheSize: '234 MB'
  },
  {
    id: '5',
    name: 'Spotify',
    packageName: 'com.spotify.music',
    icon: '🎵',
    size: '198 MB',
    lastUsed: '5 hours ago',
    isRunning: false,
    cacheSize: '89 MB'
  },
  {
    id: '6',
    name: 'Facebook',
    packageName: 'com.facebook.katana',
    icon: '📘',
    size: '287 MB',
    lastUsed: '1 day ago',
    isRunning: false,
    cacheSize: '123 MB'
  },
  {
    id: '7',
    name: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    icon: '🎬',
    size: '267 MB',
    lastUsed: '2 days ago',
    isRunning: false,
    cacheSize: '145 MB'
  },
  {
    id: '8',
    name: 'Gmail',
    packageName: 'com.google.android.gm',
    icon: '📧',
    size: '134 MB',
    lastUsed: '3 days ago',
    isRunning: true,
    cacheSize: '67 MB'
  }
];

export const mockScheduledCleans: ScheduledClean[] = [
  {
    id: '1',
    name: 'Limpeza Diária',
    type: 'cache',
    schedule: 'Daily at 3:00 AM',
    enabled: true,
    selectedApps: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Encerramento Semanal',
    type: 'apps',
    schedule: 'Weekly on Sunday',
    enabled: false,
    selectedApps: ['4', '5', '6']
  },
  {
    id: '3',
    name: 'Limpeza Completa',
    type: 'both',
    schedule: 'Monthly',
    enabled: true,
    selectedApps: ['1', '2', '3', '4', '5']
  }
];
