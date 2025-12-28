import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Plugin } from '@/types/plugins';
import { CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstallFlowProps {
  plugin: Plugin | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (plugin: Plugin) => void;
}

export const InstallFlow: React.FC<InstallFlowProps> = ({ plugin, isOpen, onClose, onInstall }) => {
  const { themeMode } = useMoodTheme();
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [pinToDashboard, setPinToDashboard] = useState(true);
  const [installed, setInstalled] = useState(false);

  if (!plugin) return null;

  const permissions = [
    'Read market sentiment data',
    'Access user watchlist',
    'Display notifications',
    'Store user preferences'
  ];

  const handleInstall = () => {
    onInstall(plugin);
    setInstalled(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        'max-w-4xl max-h-[90vh] overflow-y-auto p-0',
        themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-black/95 border-purple-500/20 backdrop-blur-xl'
      )}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className={cn('text-2xl font-bold flex items-center gap-3', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
            <span className="text-3xl">{plugin.icon}</span>
            {installed ? 'Installed' : 'Install Plugin'}
          </DialogTitle>
        </DialogHeader>

        {!installed ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 p-6">
            {/* Left: Summary */}
            <div className="space-y-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/10">
              <Card className={cn(themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/40 border-purple-500/20')}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className={cn('text-xl font-semibold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>{plugin.name}</div>
                      <div className={cn('text-sm', themeMode === 'light' ? 'text-gray-600' : 'text-gray-400')}>by {plugin.author}</div>
                    </div>
                    <Badge className="text-sm">{plugin.price === 0 ? 'Free' : `$${plugin.price}`}</Badge>
                  </div>
                  <p className={cn('text-sm leading-relaxed', themeMode === 'light' ? 'text-gray-700' : 'text-gray-300')}>{plugin.shortDescription}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {plugin.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className={cn(themeMode === 'light' ? 'border-gray-300 text-gray-700' : 'border-gray-600 text-gray-300')}>{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={cn(themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-black/40 border-purple-500/20')}>
                <CardContent className="p-6">
                  <CardTitle className={cn('text-base mb-3', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>Permissions</CardTitle>
                  <div className="space-y-2">
                    {permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2 text-sm">
                        <Shield className={cn('w-4 h-4', themeMode === 'light' ? 'text-blue-600' : 'text-purple-400')} />
                        <span className={cn(themeMode === 'light' ? 'text-gray-700' : 'text-gray-300')}>{perm}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Options */}
            <div className="pt-6 lg:pt-0 lg:pl-6 space-y-4">
              <Card className={cn(themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-black/40 border-purple-500/20')}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-updates" className={cn(themeMode === 'light' ? 'text-gray-800' : 'text-white')}>Enable auto updates</Label>
                    <Switch id="auto-updates" checked={autoUpdates} onCheckedChange={setAutoUpdates} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className={cn(themeMode === 'light' ? 'text-gray-800' : 'text-white')}>Allow notifications</Label>
                    <Switch id="notifications" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pin-dashboard" className={cn(themeMode === 'light' ? 'text-gray-800' : 'text-white')}>Pin to dashboard</Label>
                    <Switch id="pin-dashboard" checked={pinToDashboard} onCheckedChange={setPinToDashboard} />
                  </div>
                  <div className="pt-2 text-xs text-muted-foreground">These settings can be changed anytime in Settings → Plugins.</div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button className="flex-1" onClick={handleInstall}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Install
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center bg-green-500/15">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <h3 className={cn('text-2xl font-bold mb-2', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>Installed Successfully</h3>
            <p className={cn('mb-6', themeMode === 'light' ? 'text-gray-600' : 'text-gray-300')}>{plugin.name} is now available in your dashboard.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={onClose}>Open Dashboard</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InstallFlow;
