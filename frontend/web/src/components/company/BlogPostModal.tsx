import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { cn } from '@/lib/utils';
import { CalendarDays, PenTool, Share2 } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  tags: string[];
  content: string[]; // paragraphs
}

interface BlogPostModalProps {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
}

export const BlogPostModal = ({ post, open, onClose }: BlogPostModalProps) => {
  const { themeMode } = useMoodTheme();
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(
        'max-w-3xl max-h-[90vh] overflow-y-auto p-0',
        themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-black/95 border-purple-500/20 backdrop-blur-xl'
      )}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className={cn('text-3xl font-bold', themeMode==='light' ? 'text-gray-900':'text-white')}>{post.title}</DialogTitle>
          <DialogDescription className="mt-2">
            {post.excerpt}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className={cn('flex items-center gap-3 text-sm', themeMode==='light' ? 'text-gray-600' : 'text-gray-400')}>
            <PenTool className="w-4 h-4"/> {post.author}
            <CalendarDays className="w-4 h-4 ml-3"/> {new Date(post.date).toLocaleDateString()}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(t => (
              <Badge key={t} variant="outline" className={themeMode==='light' ? 'border-gray-300' : 'border-gray-600'}>{t}</Badge>
            ))}
          </div>
          <article className={cn('prose max-w-none leading-relaxed', themeMode==='light' ? 'prose-gray' : 'prose-invert') }>
            {post.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className={cn('text-xs', themeMode==='light' ? 'text-gray-500':'text-gray-500')}>Share this article</div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2"/> Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
