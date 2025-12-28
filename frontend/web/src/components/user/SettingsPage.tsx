import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import {
  User,
  Lock,
  Palette,
  Shield,
  Bell,
  CreditCard,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Crown,
  Settings,
  Smartphone,
  Monitor,
  Zap,
  Sun,
  Moon,
  Check,
  AlertTriangle,
  ChevronRight,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMoodTheme } from '../../contexts/MoodThemeContext';
import DynamicThemeSelector from '../DynamicThemeSelector';

interface SettingsPageProps {
  onNavigate?: (section: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode } = useMoodTheme();
  
  // Settings state
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [moodAlerts, setMoodAlerts] = useState(true);
  const [watchlistAlerts, setWatchlistAlerts] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Implementation for saving profile changes
    console.log('Saving profile changes:', formData);
  };

  const handleChangePassword = () => {
    // Implementation for changing password
    console.log('Changing password');
    setPasswordModalOpen(false);
  };

  const handleExportData = () => {
    // Implementation for data export
    console.log('Exporting user data');
  };

  const handleDeleteAccount = () => {
    // Implementation for account deletion
    console.log('Deleting account');
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1F2937] via-[#3730A3] to-[#4338CA] dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-400">Manage your account, preferences, and privacy</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-black/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-2">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-transparent gap-2">
              <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 ring-4 ring-purple-500/30">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xl">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-black/10 border-gray-600 text-gray-400"
                  />
                  <p className="text-xs text-gray-400">Email cannot be changed. Contact support if needed.</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setPasswordModalOpen(true)}
                    className="border-purple-500/30 hover:bg-purple-500/10"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme & Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="w-5 h-5" />
                  Theme & Display
                </CardTitle>
                <CardDescription>Customize your visual experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 text-base font-medium">Theme Selection</Label>
                  <p className="text-sm text-gray-400 mb-4">Choose how MoodMeter looks and feels</p>
                  <div className="max-w-xs">
                    <DynamicThemeSelector />
                  </div>
                </div>

                <Separator className="bg-purple-500/20" />

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-purple-500/20 rounded-xl hover:bg-purple-500/5 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Sun className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium text-white">Light Mode</span>
                    </div>
                    <p className="text-sm text-gray-400">Clean and bright interface for daytime use</p>
                  </div>
                  
                  <div className="p-4 border border-purple-500/20 rounded-xl hover:bg-purple-500/5 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Moon className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-white">Dark Mode</span>
                    </div>
                    <p className="text-sm text-gray-400">Easy on the eyes for extended use</p>
                  </div>
                  
                  <div className="p-4 border border-purple-500/20 rounded-xl hover:bg-purple-500/5 transition-colors bg-purple-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-white">Dynamic Mood</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-400">Adapts colors to market sentiment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Security */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy and secure your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isProfilePublic ? <Eye className="w-5 h-5 text-green-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium text-white">Profile Visibility</p>
                      <p className="text-sm text-gray-400">Make your profile visible to other users</p>
                    </div>
                  </div>
                  <Switch
                    checked={isProfilePublic}
                    onCheckedChange={setIsProfilePublic}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">Data Sharing</p>
                      <p className="text-sm text-gray-400">Share anonymized data for market insights</p>
                    </div>
                  </div>
                  <Switch
                    checked={dataSharing}
                    onCheckedChange={setDataSharing}
                  />
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">2FA Enabled</span>
                    </div>
                    <p className="text-sm text-gray-400">Your account is protected with two-factor authentication</p>
                    <Button variant="outline" size="sm" className="mt-3 border-green-500/30 text-green-400 hover:bg-green-500/10">
                      Manage 2FA Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="font-medium text-white">Daily Mood Score Alerts</p>
                    <p className="text-sm text-gray-400">Get daily market sentiment summaries</p>
                  </div>
                  <Switch checked={moodAlerts} onCheckedChange={setMoodAlerts} />
                </div>

                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="font-medium text-white">Watchlist Updates</p>
                    <p className="text-sm text-gray-400">Notifications for your tracked stocks</p>
                  </div>
                  <Switch checked={watchlistAlerts} onCheckedChange={setWatchlistAlerts} />
                </div>

                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="font-medium text-white">AI Insight Recommendations</p>
                    <p className="text-sm text-gray-400">Personalized AI-powered insights</p>
                  </div>
                  <Switch checked={aiInsights} onCheckedChange={setAiInsights} />
                </div>

                <div className="flex items-center justify-between p-4 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="font-medium text-white">Marketing Emails</p>
                    <p className="text-sm text-gray-400">Product updates and feature announcements</p>
                  </div>
                  <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription & Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="w-5 h-5" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 border border-purple-500/20 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="flex items-center gap-4">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">Free Plan</h3>
                        <Badge variant="outline" className="border-gray-500 text-gray-400">Current</Badge>
                      </div>
                      <p className="text-gray-400">Basic market sentiment access</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate?.('membership')}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    View Plans
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Free Plan Features Card */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-500/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Free Plan Features</h4>
                          <p className="text-gray-400 text-xs">Essential tools to get started</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Basic mood score tracking</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Limited watchlist (5 stocks)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Daily sentiment summaries</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Community access</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>Ad-supported experience</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Pro Plan Features Card */}
                  <Card className="bg-black/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-500/30 transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-white">Pro Plan Features</h4>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                              Popular
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-xs">Advanced AI-powered tools</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Advanced AI insights</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Unlimited watchlist</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Real-time alerts</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Historical data access</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-3 text-green-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Ad-free experience</span>
                        </li>
                        <li className="flex items-center gap-3 text-purple-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>Full community access (Post + Comment)</span>
                        </li>
                        <li className="flex items-center gap-3 text-cyan-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span>Trending topics & sentiment explorer</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Download className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Export your data or manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Export My Data</h4>
                      <p className="text-sm text-gray-400">Download all your MoodMeter data</p>
                    </div>
                    <Button variant="outline" onClick={handleExportData} className="border-purple-500/30 hover:bg-purple-500/10">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h4 className="font-medium text-white">Danger Zone</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  <AlertDialog open={deleteAccountModalOpen} onOpenChange={setDeleteAccountModalOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete My Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black/95 border-red-500/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Modal */}
        <AlertDialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
          <AlertDialogContent className="bg-black/95 border-purple-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Change Password</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your current password and choose a new one.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleChangePassword}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Change Password
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsPage;
