import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Rocket, Shield, HeartHandshake, Globe2, Target, Sparkles } from 'lucide-react';

export const AboutUsPage = () => {
  const { themeMode, bodyGradient } = useMoodTheme();

  const values = [
    { icon: <Target className="w-5 h-5" />, title: 'Clarity First', text: 'We design tools that make complex markets understandable and actionable.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Trust by Default', text: 'Privacy-respecting experiences with transparent, auditable data flows.' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Delightful UX', text: 'Performance and craft in every interaction—fast, accessible, modern.' },
    { icon: <Globe2 className="w-5 h-5" />, title: 'Open Ecosystem', text: 'Plugins, APIs, and community-driven innovation at the core.' },
  ];

  const team = [
    { name: 'Avery Lee', role: 'Product & Design', initials: 'AL' },
    { name: 'Jordan Kim', role: 'Engineering', initials: 'JK' },
    { name: 'Riley Patel', role: 'Data & AI', initials: 'RP' },
    { name: 'Morgan Cruz', role: 'Community', initials: 'MC' },
  ];

  return (
    <div className={cn('min-h-screen', bodyGradient)}>
      {/* Hero */}
      <div className={cn(
        'relative px-6 py-24 overflow-hidden',
        themeMode === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20'
      )}>
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4">Company</Badge>
          <h1 className={cn('text-5xl font-bold mb-4', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>Building clarity in noisy markets</h1>
          <p className={cn('text-xl max-w-3xl mx-auto', themeMode === 'light' ? 'text-gray-600' : 'text-gray-300')}>NeomSense helps investors and creators understand sentiment, discover trends, and act with confidence—without sacrificing simplicity.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Mission */}
        <Card className={cn(themeMode==='light' ? 'border-gray-200' : 'border-purple-500/20') }>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5"/>Our Mission</CardTitle>
            <CardDescription>Why we exist</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={cn('text-lg leading-relaxed', themeMode==='light' ? 'text-gray-700' : 'text-gray-300')}>
              Empower people to read the market’s mood in real time and turn insight into action. We blend clean design, credible data, and AI assistance to create a calm, focused workspace for financial decisions.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map(v => (
            <Card key={v.title} className={cn(themeMode==='light' ? 'border-gray-200' : 'border-purple-500/20') }>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{v.icon}{v.title}</CardTitle>
                <CardDescription>{v.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Team */}
        <Card className={cn(themeMode==='light' ? 'border-gray-200' : 'border-purple-500/20') }>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartHandshake className="w-5 h-5"/>Team</CardTitle>
            <CardDescription>Small, senior, and hands-on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {team.map(m => (
                <div key={m.name} className="p-4 rounded-xl border flex items-center gap-3 dark:border-purple-500/20 border-gray-200">
                  <Avatar className="w-12 h-12"><AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">{m.initials}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-muted-foreground">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border bg-background/60 dark:bg-black/30 dark:border-purple-500/20">
          <div>
            <div className="text-xl font-semibold mb-1">We build in the open</div>
            <div className="text-muted-foreground">Join our community to influence the roadmap and test new features.</div>
          </div>
          <div className="flex gap-3">
            <Button>Join Community</Button>
            <Button variant="outline">Read the Blog</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
