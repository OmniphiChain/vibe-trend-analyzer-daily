import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentIntegration } from '@/components/PaymentIntegration';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Plugin } from '@/types/plugins';
import { cn } from '@/lib/utils';

interface PurchaseFlowProps {
  plugin: Plugin | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plugin: Plugin) => void;
}

export const PurchaseFlow: React.FC<PurchaseFlowProps> = ({ plugin, isOpen, onClose, onSuccess }) => {
  const { themeMode } = useMoodTheme();
  if (!plugin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        'max-w-5xl max-h-[90vh] p-0 overflow-y-auto',
        themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-black/95 border-purple-500/20 backdrop-blur-xl'
      )}>
        <DialogHeader className={cn('p-6 pb-0', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">{plugin.icon}</span>
            Complete Purchase
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 p-6">
          {/* Left: Product Summary */}
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
                <div className="mt-4 text-xs text-muted-foreground">
                  One-time purchase. Instant install. 30-day money-back guarantee.
                </div>
              </CardContent>
            </Card>

            <Card className={cn(themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-black/40 border-purple-500/20')}>
              <CardContent className="p-6">
                <h4 className={cn('font-semibold mb-2', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>What you get</h4>
                <ul className={cn('text-sm space-y-2 list-disc pl-5', themeMode === 'light' ? 'text-gray-700' : 'text-gray-300')}>
                  <li>Unlimited use on your MoodMeter account</li>
                  <li>Future updates and improvements</li>
                  <li>Priority support from the developer</li>
                  <li>Seamless integration with your existing dashboard</li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span>Secure checkout</span>
                  <span>•</span>
                  <span>Encrypted payment</span>
                  <span>•</span>
                  <span>No hidden fees</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment */}
          <div className="pt-6 lg:pt-0 lg:pl-6">
            <PaymentIntegration
              amount={plugin.price}
              title={plugin.name}
              type="course"
              onSuccess={() => onSuccess(plugin)}
              onCancel={onClose}
            />
            <div className="mt-3 text-center">
              <Button variant="ghost" onClick={onClose}>Back</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseFlow;
