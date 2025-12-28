import { useState } from 'react';
import { Upload, Code2, Github, ExternalLink, CheckCircle, AlertCircle, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { PluginCategory } from '@/types/plugins';
import { cn } from '@/lib/utils';

interface DeveloperSubmissionPageProps {
  onNavigate?: (section: string) => void;
}

interface SubmissionForm {
  name: string;
  description: string;
  shortDescription: string;
  category: PluginCategory | '';
  version: string;
  author: string;
  email: string;
  githubUrl: string;
  demoUrl: string;
  documentation: string;
  tags: string[];
  permissions: string[];
  screenshots: File[];
  codeFiles: File[];
  icon: string;
  agreeToTerms: boolean;
  agreeToModeration: boolean;
}

const defaultForm: SubmissionForm = {
  name: '',
  description: '',
  shortDescription: '',
  category: '',
  version: '1.0.0',
  author: '',
  email: '',
  githubUrl: '',
  demoUrl: '',
  documentation: '',
  tags: [],
  permissions: [],
  screenshots: [],
  codeFiles: [],
  icon: '',
  agreeToTerms: false,
  agreeToModeration: false,
};

export const DeveloperSubmissionPage = ({ onNavigate }: DeveloperSubmissionPageProps) => {
  const { themeMode, bodyGradient } = useMoodTheme();
  const [form, setForm] = useState<SubmissionForm>(defaultForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const availablePermissions = [
    'Read market sentiment data',
    'Access user watchlist',
    'Display notifications',
    'Store user preferences',
    'Access trading history',
    'Modify dashboard layout',
    'Send external API requests',
    'Access portfolio data'
  ];

  const availableCategories = [
    { value: 'screeners', label: 'Custom Screeners' },
    { value: 'alerts', label: 'AI Alerts' },
    { value: 'visualizers', label: 'Visual Tools' },
    { value: 'community', label: 'Community Tools' },
    { value: 'ai-tools', label: 'AI Tools' },
    { value: 'analytics', label: 'Analytics' }
  ];

  const handleInputChange = (field: keyof SubmissionForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handlePermissionToggle = (permission: string) => {
    const updatedPermissions = form.permissions.includes(permission)
      ? form.permissions.filter(p => p !== permission)
      : [...form.permissions, permission];
    setForm(prev => ({ ...prev, permissions: updatedPermissions }));
  };

  const handleFileUpload = (field: 'screenshots' | 'codeFiles', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setForm(prev => ({ ...prev, [field]: [...prev[field], ...fileArray] }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return form.name && form.description && form.category && form.author && form.email;
      case 3:
        return form.permissions.length > 0 && form.tags.length > 0;
      case 4:
        return form.agreeToTerms && form.agreeToModeration;
      default:
        return true;
    }
  };

  if (submitSuccess) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", bodyGradient)}>
        <Card className={cn(
          "max-w-md w-full mx-6",
          themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
        )}>
          <CardContent className="p-8 text-center">
            <CheckCircle className={cn(
              "w-16 h-16 mx-auto mb-4",
              themeMode === 'light' ? 'text-green-600' : 'text-green-400'
            )} />
            <h2 className={cn(
              "text-2xl font-bold mb-4",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Submission Successful!
            </h2>
            <p className={cn(
              "mb-6",
              themeMode === 'light' ? 'text-gray-600' : 'text-gray-300'
            )}>
              Thank you for submitting your plugin. Our team will review it within 2-3 business days.
            </p>
            <Button onClick={() => onNavigate?.('plugins')} className="w-full">
              Back to Plugin Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", bodyGradient)}>
      {/* Header */}
      <div className={cn(
        "px-6 py-12 text-center",
        themeMode === 'light'
          ? "bg-gradient-to-br from-blue-50 to-indigo-100"
          : "bg-gradient-to-br from-purple-900/20 to-pink-900/20"
      )}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 className={cn(
              "w-8 h-8",
              themeMode === 'light' ? 'text-blue-600' : 'text-purple-400'
            )} />
          </div>
          <h1 className={cn(
            "text-4xl font-bold mb-4",
            themeMode === 'light'
              ? "text-gray-900"
              : "bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
          )}>
            Submit Your Plugin
          </h1>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-300'
          )}>
            Join our developer community and share your innovation with thousands of traders worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={cn(
              "text-sm font-medium",
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            )}>
              Step {currentStep} of {totalSteps}
            </span>
            <span className={cn(
              "text-sm font-medium",
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            )}>
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className={cn(
            themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
          )}>
            <CardHeader>
              <CardTitle className={cn(
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about your plugin and provide basic details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Plugin Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Advanced RSI Screener"
                  />
                </div>
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={form.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input
                  id="shortDescription"
                  value={form.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="A brief one-line description of your plugin"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of what your plugin does, its features, and benefits..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={form.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    value={form.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Your name or company"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Technical Details */}
        {currentStep === 2 && (
          <Card className={cn(
            themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
          )}>
            <CardHeader>
              <CardTitle className={cn(
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                Technical Details
              </CardTitle>
              <CardDescription>
                Provide links to your code and documentation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="githubUrl">GitHub Repository</Label>
                  <div className="flex">
                    <div className={cn(
                      "flex items-center px-3 border rounded-l-md",
                      themeMode === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800 border-gray-600'
                    )}>
                      <Github className="w-4 h-4" />
                    </div>
                    <Input
                      id="githubUrl"
                      value={form.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="demoUrl">Demo URL (Optional)</Label>
                  <div className="flex">
                    <div className={cn(
                      "flex items-center px-3 border rounded-l-md",
                      themeMode === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800 border-gray-600'
                    )}>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <Input
                      id="demoUrl"
                      value={form.demoUrl}
                      onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                      placeholder="https://your-demo.com"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="documentation">Documentation *</Label>
                <Textarea
                  id="documentation"
                  value={form.documentation}
                  onChange={(e) => handleInputChange('documentation', e.target.value)}
                  placeholder="Provide installation instructions, usage examples, and API documentation..."
                  rows={6}
                />
              </div>

              <div>
                <Label>File Uploads</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center",
                    themeMode === 'light' ? 'border-gray-300' : 'border-gray-600'
                  )}>
                    <File className={cn(
                      "w-8 h-8 mx-auto mb-2",
                      themeMode === 'light' ? 'text-gray-400' : 'text-gray-500'
                    )} />
                    <p className={cn(
                      "text-sm mb-2",
                      themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                    )}>
                      Upload Code Files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".js,.ts,.json,.md"
                      onChange={(e) => handleFileUpload('codeFiles', e.target.files)}
                      className="hidden"
                      id="codeFiles"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('codeFiles')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                  <div className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center",
                    themeMode === 'light' ? 'border-gray-300' : 'border-gray-600'
                  )}>
                    <Image className={cn(
                      "w-8 h-8 mx-auto mb-2",
                      themeMode === 'light' ? 'text-gray-400' : 'text-gray-500'
                    )} />
                    <p className={cn(
                      "text-sm mb-2",
                      themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                    )}>
                      Upload Screenshots
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload('screenshots', e.target.files)}
                      className="hidden"
                      id="screenshots"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('screenshots')?.click()}
                    >
                      Choose Images
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Permissions & Tags */}
        {currentStep === 3 && (
          <Card className={cn(
            themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
          )}>
            <CardHeader>
              <CardTitle className={cn(
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                Permissions & Tags
              </CardTitle>
              <CardDescription>
                Specify what permissions your plugin needs and add relevant tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Required Permissions *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={form.permissions.includes(permission)}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                      />
                      <Label
                        htmlFor={permission}
                        className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                        )}
                      >
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags *</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleTagRemove(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newTag"
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        handleTagAdd(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById('newTag') as HTMLInputElement;
                      handleTagAdd(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="icon">Plugin Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  placeholder="📊"
                  maxLength={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Terms & Submission */}
        {currentStep === 4 && (
          <Card className={cn(
            themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
          )}>
            <CardHeader>
              <CardTitle className={cn(
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                Terms & Agreement
              </CardTitle>
              <CardDescription>
                Review and accept our terms before submitting your plugin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Review Process</AlertTitle>
                <AlertDescription>
                  Your plugin will be reviewed by our team within 2-3 business days. We'll contact you via email with any questions or updates.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={form.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  />
                  <Label htmlFor="terms" className={cn(
                    "text-sm leading-relaxed",
                    themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                  )}>
                    I agree to the <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button> and 
                    <Button variant="link" className="p-0 h-auto text-sm"> Privacy Policy</Button>. I understand that my plugin must comply with MoodMeter's guidelines and may be removed if it violates our policies.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="moderation"
                    checked={form.agreeToModeration}
                    onCheckedChange={(checked) => handleInputChange('agreeToModeration', checked)}
                  />
                  <Label htmlFor="moderation" className={cn(
                    "text-sm leading-relaxed",
                    themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                  )}>
                    I agree to the moderation process and understand that my plugin will be reviewed for security, functionality, and compliance before being made available to users.
                  </Label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!form.agreeToTerms || !form.agreeToModeration || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Plugin for Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
            disabled={currentStep === totalSteps || !canProceedToStep(currentStep + 1)}
          >
            {currentStep === totalSteps ? 'Review' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
