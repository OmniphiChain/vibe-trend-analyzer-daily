import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Crown, ArrowLeft, Check } from 'lucide-react';

interface UpgradePageProps {
  onNavigate?: (section: string) => void;
  onBack?: () => void;
}

const UpgradePage: React.FC<UpgradePageProps> = ({ onNavigate, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [formStep, setFormStep] = useState<'summary' | 'payment' | 'success'>('summary');
  const [formData, setFormData] = useState({
    email: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const monthlyPrice = 19;
  const annualPrice = 180;
  const savingsPercent = Math.round((1 - annualPrice / (monthlyPrice * 12)) * 100);

  const proFeatures = [
    'Advanced screeners with 30+ pro criteria',
    'Unlimited results and CSV exports',
    'Custom alerts and notifications',
    'Strategy backtesting module',
    'Email and in-app alerts',
    'API priority and faster refresh rates',
    'Dedicated customer support',
    'Historical data export',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProcessPayment = () => {
    // Simulate payment processing
    setFormStep('success');
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('trial-activated');
      } else if (onBack) {
        onBack();
      }
    }, 3000);
  };

  const handleBack = () => {
    if (formStep === 'payment') {
      setFormStep('summary');
    } else if (onNavigate) {
      onNavigate('analytics');
    } else if (onBack) {
      onBack();
    }
  };

  if (formStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-300 mb-8">Your Pro subscription is now active. Redirecting...</p>
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-black shadow-[0_0_24px_rgba(16,185,129,0.35)]">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Upgrade to Pro</h1>
              <p className="text-gray-300">Unlock unlimited potential for serious traders</p>
            </div>
          </div>
        </div>

        {formStep === 'summary' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Features */}
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Pro Features Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Select Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Monthly Plan */}
                  <div
                    onClick={() => setSelectedPlan('monthly')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === 'monthly'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-600/30 bg-black/20 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-sm text-gray-300">Monthly</div>
                      {selectedPlan === 'monthly' && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">${monthlyPrice}</div>
                    <div className="text-xs text-gray-400">per month, billed monthly</div>
                  </div>

                  {/* Annual Plan */}
                  <div
                    onClick={() => setSelectedPlan('annual')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                      selectedPlan === 'annual'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-600/30 bg-black/20 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Save {savingsPercent}%
                      </Badge>
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-sm text-gray-300">Annual</div>
                      {selectedPlan === 'annual' && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">${annualPrice}</div>
                    <div className="text-xs text-gray-400">per year, billed annually</div>
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={() => setFormStep('payment')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold mt-6"
                  >
                    Continue to Payment
                  </Button>

                  <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-600/30">
                    Cancel anytime. No credit card required for 7-day trial.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Payment Form Step */
          <div className="max-w-2xl">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder-gray-500"
                  />
                </div>

                {/* Card Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                  <Input
                    placeholder="Full name on card"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder-gray-500"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder-gray-500"
                  />
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                    <Input
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                      className="bg-black/40 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                    <Input
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                      className="bg-black/40 border-purple-500/30 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-black/60 rounded-lg p-4 border border-gray-600/30 my-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">
                      {selectedPlan === 'monthly' ? 'Pro (Monthly)' : 'Pro (Annual)'}
                    </span>
                    <span className="text-white font-semibold">
                      ${selectedPlan === 'monthly' ? monthlyPrice : annualPrice}
                    </span>
                  </div>
                  <div className="border-t border-gray-600/30 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-emerald-400 font-bold text-lg">
                        ${selectedPlan === 'monthly' ? monthlyPrice : annualPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setFormStep('summary')}
                    variant="outline"
                    className="flex-1 border-gray-600/30 text-gray-300 hover:bg-gray-600/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleProcessPayment}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
                    disabled={!formData.email || !formData.cardName || !formData.cardNumber}
                  >
                    Complete Purchase
                  </Button>
                </div>

                <div className="text-xs text-gray-400 text-center pt-2">
                  🔒 Payments processed securely. Your information is encrypted.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePage;
