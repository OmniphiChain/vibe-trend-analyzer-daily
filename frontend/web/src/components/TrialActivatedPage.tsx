import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check, Clock, Zap, BarChart3, Bell, Shield } from 'lucide-react';

interface TrialActivatedPageProps {
  onNavigate?: (section: string) => void;
  onBack?: () => void;
}

const TrialActivatedPage: React.FC<TrialActivatedPageProps> = ({ onNavigate, onBack }) => {
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [autoClosing, setAutoClosing] = useState(true);

  useEffect(() => {
    if (!autoClosing) return;

    const timer = setTimeout(() => {
      if (onNavigate) {
        onNavigate('analytics');
      } else if (onBack) {
        onBack();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [autoClosing, onNavigate, onBack]);

  const trialFeatures = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Advanced Screeners',
      description: 'Access 30+ pro filtering criteria for precise stock discovery',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Unlimited Results',
      description: 'No caps on results. Export full datasets as CSV files',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Smart Alerts',
      description: 'Create custom alerts on your saved filters instantly',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Backtesting',
      description: 'Test strategies against historical data and refine approaches',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Priority Support',
      description: 'Fast response times from our dedicated support team',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'API Priority',
      description: 'Faster refresh rates and priority API bandwidth',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Trial Activated!</h1>
          <p className="text-xl text-gray-300 mb-4">
            Welcome to MoorMeter Pro. Your 7-day free trial is now active.
          </p>

          {/* Trial Timer */}
          <div className="flex justify-center gap-6 mb-8">
            <Card className="bg-emerald-500/10 border-emerald-500/30 px-8 py-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <div className="text-sm text-gray-400">Trial Period</div>
                  <div className="text-3xl font-bold text-emerald-400">{daysRemaining}</div>
                  <div className="text-xs text-gray-400">days remaining</div>
                </div>
              </div>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/30 px-8 py-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  ⚡ Pro
                </Badge>
                <div className="text-left">
                  <div className="text-sm text-gray-400">All Features</div>
                  <div className="text-lg font-bold text-yellow-300">Unlocked</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* What You Get */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What's Included in Your Trial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trialFeatures.map((feature, idx) => (
              <Card key={idx} className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-emerald-500/30 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Next Steps to Get Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-semibold text-white">Explore Advanced Filters</div>
                <p className="text-sm text-gray-400">Access 30+ pro criteria for powerful screening</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-semibold text-white">Create Custom Alerts</div>
                <p className="text-sm text-gray-400">Set up smart notifications for your strategies</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-semibold text-white">Run Backtests</div>
                <p className="text-sm text-gray-400">Validate strategies with historical data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-black/40 rounded-2xl border border-purple-500/20 p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Trial Ends In {daysRemaining} Days</h3>
          <p className="text-gray-300 mb-6">
            When your trial expires, you'll be able to continue with our free plan with basic features, or upgrade to Pro for just <span className="text-emerald-400 font-semibold">$19/month</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('analytics');
                } else if (onBack) {
                  onBack();
                }
              }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
            >
              Start Using Pro Features Now
            </Button>
            <Button
              onClick={() => setAutoClosing(false)}
              variant="outline"
              className="border-gray-600/30 text-gray-300"
            >
              Stay on this page
            </Button>
          </div>
        </div>

        {/* Auto Close Notice */}
        {autoClosing && (
          <div className="text-center text-gray-400 text-sm">
            Redirecting to analytics in 5 seconds...
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialActivatedPage;
