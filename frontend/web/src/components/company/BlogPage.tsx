import { useMemo, useState } from 'react';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PenTool, CalendarDays, Tag, ArrowRight } from 'lucide-react';
import { BlogPostModal, BlogPost } from './BlogPostModal';

const postsSeed: BlogPost[] = [
  {
    id: 'design-sentiment-ui',
    title: 'Designing Calm Sentiment UIs',
    excerpt: 'How we reduce noise and bias while keeping speed and clarity for trading flows.',
    date: new Date().toISOString(),
    author: 'NeomSense Team',
    tags: ['Design', 'Product'],
    content: [
      'Great financial tools are quiet by default. We reduce cognitive load with clear hierarchy, generous spacing, and predictable motion.',
      'Our sentiment views focus on trend, not every tick. We surface what changed and why, then let you drill in when it matters.',
      'Accessibility and speed are non‑negotiable. Components are keyboard‑friendly, color‑contrast tested, and tuned for sub‑100ms interactions.'
    ]
  },
  {
    id: 'plugins-roadmap',
    title: 'Plugin Ecosystem Roadmap',
    excerpt: 'A look at upcoming SDK changes, security model, and community highlights.',
    date: new Date(Date.now()-86400000*7).toISOString(),
    author: 'NeomSense Team',
    tags: ['Plugins', 'Roadmap'],
    content: [
      'We are formalizing our plugin capabilities with scoped permissions, settings sync, and a stable UI kit.',
      'Security is first: capability-based permissions, audited manifests, and transparent changelogs.',
      'Expect better discovery, ratings, and auto‑updates with rollback for safety.'
    ]
  },
  {
    id: 'ai-assist-ethics',
    title: 'AI Assistance and Market Ethics',
    excerpt: 'Principles guiding our AI features—transparency, safety, and control.',
    date: new Date(Date.now()-86400000*21).toISOString(),
    author: 'NeomSense Team',
    tags: ['AI', 'Policy'],
    content: [
      'AI suggestions are labeled, explainable, and opt‑in. Users keep control and can always see the why behind a suggestion.',
      'We avoid definitive calls; instead we provide probabilities, alternatives, and citations when available.',
      'Your data remains yours. Private workspaces, export tools, and clear retention policies back this up.'
    ]
  },
];

export const BlogPage = () => {
  const { themeMode, bodyGradient } = useMoodTheme();
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [open, setOpen] = useState(false);

  const posts = useMemo(() => {
    return postsSeed
      .filter(p => !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
      .filter(p => !tag || p.tags.includes(tag));
  }, [q, tag]);

  const allTags = Array.from(new Set(postsSeed.flatMap(p => p.tags)));

  const openPost = (post: BlogPost) => { setSelected(post); setOpen(true); };

  return (
    <div className={cn('min-h-screen', bodyGradient)}>
      {/* Hero */}
      <div className={cn('px-6 py-20', themeMode==='light' ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20')}>
        <div className="max-w-6xl mx-auto">
          <Badge className="mb-4">Company</Badge>
          <h1 className={cn('text-5xl font-bold mb-2', themeMode==='light' ? 'text-gray-900' : 'text-white')}>NeomSense Blog</h1>
          <p className={cn('text-lg', themeMode==='light' ? 'text-gray-600' : 'text-gray-300')}>Product updates, design notes, and technical deep-dives.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Input placeholder="Search articles..." value={q} onChange={(e)=>setQ(e.target.value)} className="sm:w-80"/>
            <div className="flex flex-wrap gap-2 items-center">
              {allTags.map(t => (
                <Button key={t} size="sm" variant={tag===t? 'default':'outline'} onClick={()=> setTag(tag===t? null : t)}>
                  <Tag className="w-4 h-4 mr-1"/>{t}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(p => (
          <Card key={p.id} className={cn(themeMode==='light' ? 'border-gray-200' : 'border-purple-500/20', 'cursor-pointer hover:shadow-lg transition')} onClick={() => openPost(p)}>
            <CardHeader>
              <CardTitle className="text-2xl">{p.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <PenTool className="w-4 h-4"/> {p.author}
                <CalendarDays className="w-4 h-4 ml-3"/> {new Date(p.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn('mb-4', themeMode==='light' ? 'text-gray-700' : 'text-gray-300')}>{p.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {p.tags.map(t => (
                    <Badge key={t} variant="outline" className={cn(themeMode==='light' ? 'border-gray-300' : 'border-gray-600')}>{t}</Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={(e)=>{ e.stopPropagation(); openPost(p); }}>Read More <ArrowRight className="w-4 h-4 ml-2"/></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BlogPostModal post={selected} open={open} onClose={()=> setOpen(false)} />
    </div>
  );
};

export default BlogPage;
