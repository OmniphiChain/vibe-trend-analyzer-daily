import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import {
  Check,
  Star,
  Crown,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  Shield,
  Brain,
  Eye,
  Bell,
  Target,
  Palette,
  HeadphonesIcon,
  ArrowRight,
  Clock,
  Globe,
  PieChart,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MoorMeterMembershipPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingTiers = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Get started with essential market sentiment tools',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/30',
      bgColor: 'bg-green-500/5',
      monthly: 0,
      yearly: 0,
      isPopular: false,
      features: [
        { text: 'Daily Mood Score', icon: <TrendingUp className="w-4 h-4" /> },
        { text: 'Top 10 Stocks Widget', icon: <BarChart3 className="w-4 h-4" /> },
        { text: 'Smart News Feed (limited)', icon: <Brain className="w-4 h-4" /> },
        { text: 'Watchlist (up to 3 tickers)', icon: <Eye className="w-4 h-4" /> },
        { text: 'Public Community View', icon: <Users className="w-4 h-4" /> },
        { text: 'Ad-supported', icon: <Star className="w-4 h-4" />, isLimitation: true }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Unlock advanced AI insights and remove limitations',
      icon: <Star className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      monthly: 5.99,
      yearly: 59,
      isPopular: true,
      features: [
        { text: 'Everything in Basic', icon: <Check className="w-4 h-4" /> },
        { text: 'Ad-Free Experience', icon: <Shield className="w-4 h-4" /> },
        { text: 'Real-time Smart News Summaries (AI)', icon: <Brain className="w-4 h-4" /> },
        { text: 'Expanded Sentiment Heatmap (24h–90d)', icon: <BarChart3 className="w-4 h-4" /> },
        { text: 'Unlimited Watchlists', icon: <Eye className="w-4 h-4" /> },
        { text: 'Full Community Access (Post + Comment)', icon: <Users className="w-4 h-4" /> },
        { text: 'Trending Topics & Sentiment Explorer', icon: <TrendingUp className="w-4 h-4" /> },
        { text: 'Private Room (read-only)', icon: <Users className="w-4 h-4" /> },
        { text: 'Access to Finance Tab (Beta)', icon: <PieChart className="w-4 h-4" /> }
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'default' as const
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Complete AI-powered trading intelligence suite',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/10',
      monthly: 9.99,
      yearly: 99,
      isPopular: false,
      features: [
        { text: 'Everything in Pro', icon: <Check className="w-4 h-4" /> },
        { text: 'Create Private Rooms (up to 5)', icon: <Users className="w-4 h-4" /> },
        { text: 'AI Trade Alerts with Confidence Score', icon: <Bell className="w-4 h-4" /> },
        { text: 'Portfolio Mood Score (daily)', icon: <Target className="w-4 h-4" /> },
        { text: 'Weekly Market Mood Outlook (AI generated)', icon: <Brain className="w-4 h-4" /> },
        { text: 'Sector Sentiment & Risk Insights', icon: <BarChart3 className="w-4 h-4" /> },
        { text: 'Widget Theme Customization', icon: <Palette className="w-4 h-4" /> },
        { text: 'Priority Support', icon: <HeadphonesIcon className="w-4 h-4" /> }
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'default' as const
    }
  ];

  const comingSoonFeatures = [
    {
      title: 'Brokerage Integration',
      description: 'Connect your trading accounts for real portfolio tracking',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Historical Sentiment Playback',
      description: 'Replay past market sentiment to learn from history',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Personalized Economic Outlook',
      description: 'AI-generated forecasts tailored to your portfolio',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const getPrice = (tier: typeof pricingTiers[0]) => {
    if (tier.monthly === 0) return '$0';
    return isYearly 
      ? `$${tier.yearly}` 
      : `$${tier.monthly.toFixed(2)}`;
  };

  const getPeriod = () => isYearly ? '/year' : '/month';

  const getSavings = (tier: typeof pricingTiers[0]) => {
    if (tier.monthly === 0) return null;
    const yearlyMonthly = tier.yearly / 12;
    const savings = ((tier.monthly - yearlyMonthly) / tier.monthly * 100);
    return isYearly && savings > 0 ? `Save ${Math.round(savings)}%` : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#1F2937] via-[#3730A3] to-[#4338CA] dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                MoorMeter
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your AI Edge in Every Trade
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Advanced sentiment analysis and AI-powered insights to help you make smarter trading decisions
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-white" : "text-gray-400")}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
              <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-white" : "text-gray-400")}>
                Yearly
              </span>
            </div>
            <p className="text-sm text-green-400 font-medium">
              Save up to 17% with yearly plans!
            </p>
          </div>

          {/* Compare Plan Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Compare Plan Features</h3>
              <p className="text-gray-400 text-lg">See what each plan includes at a glance</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={cn(
                  "relative backdrop-blur-xl border-2 transition-all duration-500 hover:shadow-2xl hover:scale-105",
                  tier.borderColor,
                  tier.bgColor,
                  tier.isPopular && "ring-4 ring-blue-500/20 ring-offset-4 ring-offset-slate-900"
                )}
              >
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 text-sm font-bold shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Best Value
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={cn("w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-r", tier.color)}>
                    {tier.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-white mb-2">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-400 mb-4">{tier.description}</CardDescription>
                  
                  <div className="space-y-2">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{getPrice(tier)}</span>
                      <span className="text-gray-400 text-lg pb-1">{getPeriod()}</span>
                    </div>
                    {getSavings(tier) && (
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        {getSavings(tier)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button 
                    className={cn(
                      "w-full py-3 font-semibold transition-all duration-300",
                      tier.buttonVariant === 'default' 
                        ? `bg-gradient-to-r ${tier.color} hover:shadow-lg hover:shadow-purple-500/25 text-white` 
                        : `border-2 ${tier.borderColor} hover:${tier.bgColor} text-white`
                    )}
                    variant={tier.buttonVariant}
                  >
                    {tier.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          feature.isLimitation 
                            ? "bg-orange-500/20 text-orange-400" 
                            : "bg-green-500/20 text-green-400"
                        )}>
                          {feature.icon}
                        </div>
                        <span className={cn(
                          "text-sm leading-relaxed",
                          feature.isLimitation ? "text-gray-400" : "text-gray-300"
                        )}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Coming Soon</h3>
              <p className="text-gray-400 text-lg">Exciting features we're building for the future</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {comingSoonFeatures.map((feature, index) => (
                <Card key={index} className="bg-black/40 backdrop-blur-xl border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className={cn("w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-r", feature.color)}>
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    <Badge variant="outline" className="mt-4 border-gray-600 text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">How accurate is the sentiment analysis?</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Our AI models process millions of data points from news, social media, and market indicators with over 85% accuracy in sentiment prediction.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Can I cancel my subscription anytime?</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Do you offer a free trial?</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Our Basic plan is completely free forever. You can upgrade to Pro or Elite at any time to unlock advanced features.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">What payment methods do you accept?</h4>
                  <p className="text-gray-400 leading-relaxed">
                    We accept all major credit cards, PayPal, and cryptocurrency payments. All transactions are secured with enterprise-grade encryption.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Your AI Edge?</h3>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of traders who trust MoorMeter for smarter trading decisions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-8 py-3 text-lg">
                    Watch Demo
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">MoorMeter</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 MoorMeter. All rights reserved. Built with AI for smarter trading.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MoorMeterMembershipPage;
