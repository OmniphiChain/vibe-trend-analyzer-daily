import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { cn } from '@/lib/utils';
import { DollarSign, ShoppingCart, Rocket, BookOpen, Puzzle, Repeat, Download } from 'lucide-react';

export type PurchaseType = 'membership' | 'course' | 'plugin' | 'subscription' | 'other';

type PurchaseStatus = 'completed' | 'refunded' | 'pending';

export interface PurchaseHistoryItem {
  id: string;
  type: PurchaseType;
  title: string;
  amount: number;
  date: string; // ISO
  status: PurchaseStatus;
  reference?: string;
}

const STORAGE_KEY = 'moodmeter-purchase-history';

const typeIcon = (type: PurchaseType) => {
  switch (type) {
    case 'membership': return <Rocket className="w-4 h-4"/>;
    case 'course': return <BookOpen className="w-4 h-4"/>;
    case 'plugin': return <Puzzle className="w-4 h-4"/>;
    case 'subscription': return <Repeat className="w-4 h-4"/>;
    default: return <ShoppingCart className="w-4 h-4"/>;
  }
};

const statusBadge = (status: PurchaseStatus) => {
  if (status === 'completed') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (status === 'refunded') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
};

export const PurchaseHistory = () => {
  const { themeMode } = useMoodTheme();
  const [active, setActive] = useState<PurchaseType | 'all'>('all');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<PurchaseHistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setItems(JSON.parse(raw));
    } else {
      // Seed with a couple examples until user buys/installs something
      setItems([
        { id: 'seed-1', type: 'membership', title: 'NeomSense Premium', amount: 19, date: new Date().toISOString(), status: 'completed' },
        { id: 'seed-2', type: 'course', title: 'AI Sentiment Trading 101', amount: 99, date: new Date(Date.now()-86400000*12).toISOString(), status: 'completed' },
      ]);
    }
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter(i => active === 'all' || i.type === active)
      .filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items, active, query]);

  const formatAmount = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const exportCsv = () => {
    const header = 'id,type,title,amount,date,status,reference\n';
    const rows = filtered.map(i => [i.id, i.type, `"${i.title}"`, i.amount, i.date, i.status, i.reference || ''].join(','));
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'purchase-history.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn(themeMode==='light' ? 'border-gray-200' : 'border-purple-500/20') }>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5"/>
              Purchase History
            </CardTitle>
            <CardDescription>Memberships, courses, plugins, subscriptions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search purchases..." value={query} onChange={e=>setQuery(e.target.value)} className="w-56"/>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-2"/>Export
            </Button>
          </div>
        </div>
        <Tabs value={active} onValueChange={(v)=>setActive(v as any)} className="mt-4">
          <TabsList className={cn(themeMode==='light' ? 'bg-gray-100' : 'bg-gray-800/50')}>
            {['all','membership','course','plugin','subscription'].map(t => (
              <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filtered.map((i) => (
            <div key={i.id} className={cn(
              'p-4 rounded-xl border flex items-center justify-between transition hover:shadow',
              themeMode==='light' ? 'bg-white border-gray-200' : 'bg-black/40 border-purple-500/20'
            )}>
              <div className="flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', themeMode==='light' ? 'bg-gray-100' : 'bg-gray-800/60')}>{typeIcon(i.type)}</div>
                <div>
                  <div className="font-semibold">{i.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{i.type} • {new Date(i.date).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusBadge(i.status)} variant="outline">{i.status}</Badge>
                <div className="font-semibold">{formatAmount(i.amount)}</div>
              </div>
            </div>
          ))}
          {filtered.length===0 && (
            <div className="text-center text-muted-foreground py-8">No purchases found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseHistory;
