import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Crown,
  Rocket,
  Zap,
  Bell,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react";

interface UpgradeToProModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => void;
  onStartTrial?: () => void;
  className?: string;
}

const FeatureRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-emerald-400">{icon}</div>
    <div>
      <div className="text-white font-medium leading-tight">{title}</div>
      <div className="text-sm text-gray-300 leading-relaxed">{description}</div>
    </div>
  </div>
);

const UpgradeToProModal: React.FC<UpgradeToProModalProps> = ({
  open,
  onOpenChange,
  onUpgrade,
  onStartTrial,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[700px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/30 text-white",
        "p-0 overflow-hidden",
        className
      )}>
        {/* Header Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-black shadow-[0_0_24px_rgba(16,185,129,0.35)]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Upgrade to Pro</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Unlock advanced filters, unlimited results, and priority tools for serious traders.
                </DialogDescription>
              </div>
              <div className="ml-auto">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full">Best value</Badge>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Why upgrade */}
          <div className="space-y-5">
            <FeatureRow
              icon={<BarChart3 className="w-5 h-5" />}
              title="Advanced screeners"
              description="Filter by RSI, MA crossovers, valuation ratios, institutional flows, and 30+ pro criteria."
            />
            <FeatureRow
              icon={<Zap className="w-5 h-5" />}
              title="Unlimited results"
              description="See every match without caps. Export full CSV to continue analysis elsewhere."
            />
            <FeatureRow
              icon={<Bell className="w-5 h-5" />}
              title="Smart alerts"
              description="Create signal alerts on your saved filters and receive instant notifications."
            />
            <FeatureRow
              icon={<Rocket className="w-5 h-5" />}
              title="Backtesting & templates"
              description="Validate strategies with historical data and reuse presets tailored to your style."
            />
            <FeatureRow
              icon={<Shield className="w-5 h-5" />}
              title="Priority performance"
              description="Faster refresh rates, priority API bandwidth, and dedicated support."
            />
          </div>

          {/* Right: Plan card */}
          <div className="rounded-2xl border border-purple-500/30 bg-white/5 backdrop-blur-xl p-5 flex flex-col">
            <div className="text-sm text-gray-300">Pro plan</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-4xl font-extrabold">$19</div>
              <div className="text-gray-400">/ month</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-200">
              <li>• All advanced filters and strategies</li>
              <li>• Unlimited saved templates</li>
              <li>• CSV exports and API priority</li>
              <li>• Strategy backtesting module</li>
              <li>• Email and in-app alerts</li>
            </ul>
            <div className="mt-auto pt-5 grid grid-cols-1 gap-3">
              <Button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold gap-2"
              >
                Upgrade now <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onStartTrial}
                className="w-full border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
              >
                Start 7‑day trial
              </Button>
              <div className="text-xs text-gray-400 text-center">
                Cancel anytime. Secure checkout.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6" />
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProModal;
