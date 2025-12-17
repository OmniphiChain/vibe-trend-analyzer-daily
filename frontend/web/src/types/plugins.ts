export interface Plugin {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  author: string;
  version: string;
  category: PluginCategory;
  icon: string;
  previewImage?: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  price: number; // 0 for free
  tags: string[];
  status: 'active' | 'beta' | 'deprecated';
  featured: boolean;
  dateCreated: string;
  lastUpdated: string;
  compatibility: string[];
  size: string;
  documentation?: string;
  changelog?: string;
}

export type PluginCategory =
  | 'all'
  | 'screeners'
  | 'alerts'
  | 'visualizers'
  | 'community'
  | 'ai-tools'
  | 'analytics'
  | 'installed';

export interface PluginSubmission {
  id: string;
  name: string;
  description: string;
  author: string;
  category: PluginCategory;
  sourceCodeUrl?: string;
  demoUrl?: string;
  documentation: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}

export interface PluginFilter {
  category: PluginCategory;
  priceType: 'all' | 'free' | 'paid';
  rating: number;
  sortBy: 'popular' | 'newest' | 'rating' | 'name';
}
