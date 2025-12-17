import { useState } from "react";
import { Settings as SettingsIcon, Bell, Eye, Zap, Crown, Shield, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [dataRetention, setDataRetention] = useState("30");
  const [updateFrequency, setUpdateFrequency] = useState("5");

  const subscriptionTiers = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Basic sentiment analysis",
        "Daily mood scores",
        "7-day historical data",
        "Standard support"
      ],
      current: true
    },
    {
      name: "Pro",
      price: "$29",
      features: [
        "Advanced analytics",
        "Real-time alerts",
        "90-day historical data",
        "Custom filters",
        "Priority support",
        "Export capabilities"
      ],
      current: false
    },
    {
      name: "Enterprise",
      price: "$99",
      features: [
        "Unlimited historical data",
        "Custom AI models",
        "API access",
        "White-label options",
        "Dedicated support",
        "Advanced integrations"
      ],
      current: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Settings & Preferences</h1>
        <p className="text-xl text-muted-foreground">
          Customize your MoodMeter experience and manage your account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Push Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for significant sentiment changes
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Email Alerts</label>
                  <p className="text-sm text-muted-foreground">
                    Daily summary reports and critical alerts via email
                  </p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Alert Threshold</label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">±5 points change</SelectItem>
                    <SelectItem value="10">±10 points change</SelectItem>
                    <SelectItem value="15">±15 points change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data & Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Data & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Real-time Updates</label>
                  <p className="text-sm text-muted-foreground">
                    Enable live data streaming for instant updates
                  </p>
                </div>
                <Switch checked={realTimeUpdates} onCheckedChange={setRealTimeUpdates} />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Update Frequency</label>
                <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every minute</SelectItem>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Data Retention</label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export My Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Privacy Settings
                </Button>
              </div>
              
              <Separator />
              
              <div className="text-sm space-y-2">
                <h4 className="font-medium">Data Usage Information</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Your data is anonymized for sentiment analysis</li>
                  <li>• We use cookies to improve your experience</li>
                  <li>• No personal data is shared with third parties</li>
                  <li>• You can request data deletion at any time</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscriptionTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    tier.current ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{tier.name}</h3>
                      <p className="text-2xl font-bold">
                        {tier.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>
                    </div>
                    {tier.current && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  
                  <ul className="text-sm space-y-1 mb-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={tier.current ? "outline" : "default"}
                    className="w-full"
                    disabled={tier.current}
                  >
                    {tier.current ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span>Jan 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API calls used:</span>
                  <span>1,247 / 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data retention:</span>
                  <span>7 days</span>
                </div>
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">
                Manage Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};