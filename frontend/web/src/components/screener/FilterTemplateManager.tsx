import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";

import {
  Save,
  FolderOpen,
  Trash2,
  Star,
  Clock,
  Filter,
  Crown,
  Check,
  X
} from "lucide-react";

export interface FilterTemplate {
  id: string;
  name: string;
  description: string;
  filters: any;
  isDefault: boolean;
  isFavorite: boolean;
  createdAt: Date;
  category: "custom" | "preset";
}

interface FilterTemplateManagerProps {
  currentFilters: any;
  onLoadTemplate: (filters: any) => void;
  onSaveTemplate?: (template: FilterTemplate) => void;
}

const PRESET_TEMPLATES: FilterTemplate[] = [
  {
    id: "growth-tech",
    name: "Growth Tech Stocks",
    description: "High-growth technology stocks with strong momentum",
    filters: {
      sectorFilter: "Technology",
      sentimentRange: [60, 100],
      rsiRange: [40, 80],
      change1DRange: [0, 20],
      marketCapFilter: "Large"
    },
    isDefault: false,
    isFavorite: true,
    createdAt: new Date("2024-01-01"),
    category: "preset"
  },
  {
    id: "value-dividend",
    name: "Value Dividend Plays",
    description: "Undervalued dividend-paying stocks",
    filters: {
      peRange: [5, 20],
      sentimentRange: [40, 80],
      marketCapFilter: "Large",
      change1DRange: [-5, 10]
    },
    isDefault: false,
    isFavorite: false,
    createdAt: new Date("2024-01-01"),
    category: "preset"
  },
  {
    id: "oversold-bounce",
    name: "Oversold Bounce Candidates",
    description: "Stocks in oversold territory with potential for reversal",
    filters: {
      rsiRange: [10, 35],
      sentimentRange: [30, 70],
      volumeFilter: "High",
      change1DRange: [-15, 0]
    },
    isDefault: false,
    isFavorite: true,
    createdAt: new Date("2024-01-01"),
    category: "preset"
  },
  {
    id: "momentum-breakout",
    name: "Momentum Breakout",
    description: "High momentum stocks breaking out with volume",
    filters: {
      change1DRange: [5, 20],
      volumeFilter: "High",
      sentimentRange: [70, 100],
      rsiRange: [60, 100]
    },
    isDefault: false,
    isFavorite: false,
    createdAt: new Date("2024-01-01"),
    category: "preset"
  },
  {
    id: "social-buzz",
    name: "Social Media Darlings",
    description: "Stocks with high social sentiment and buzz",
    filters: {
      sentimentRange: [75, 100],
      socialBuzzFilter: "High",
      newsScoreRange: [70, 100],
      marketCapFilter: "All"
    },
    isDefault: true,
    isFavorite: true,
    createdAt: new Date("2024-01-01"),
    category: "preset"
  }
];

export const FilterTemplateManager: React.FC<FilterTemplateManagerProps> = ({
  currentFilters,
  onLoadTemplate,
  onSaveTemplate
}) => {
  const [templates, setTemplates] = useState<FilterTemplate[]>(PRESET_TEMPLATES);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "preset" | "custom">("all");

  useEffect(() => {
    // Load saved templates from localStorage
    const savedTemplates = localStorage.getItem("moorMeter-screener-templates");
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        }));
        setTemplates([...PRESET_TEMPLATES, ...parsed]);
      } catch (error) {
        console.error("Failed to load saved templates:", error);
      }
    }
  }, []);

  const saveTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: FilterTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName.trim(),
      description: newTemplateDescription.trim() || "Custom filter template",
      filters: currentFilters,
      isDefault: false,
      isFavorite: false,
      createdAt: new Date(),
      category: "custom"
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);

    // Save custom templates to localStorage
    const customTemplates = updatedTemplates.filter(t => t.category === "custom");
    localStorage.setItem("moorMeter-screener-templates", JSON.stringify(customTemplates));

    if (onSaveTemplate) {
      onSaveTemplate(newTemplate);
    }

    setNewTemplateName("");
    setNewTemplateDescription("");
    setShowSaveDialog(false);
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);

    // Update localStorage
    const customTemplates = updatedTemplates.filter(t => t.category === "custom");
    localStorage.setItem("moorMeter-screener-templates", JSON.stringify(customTemplates));
  };

  const toggleFavorite = (templateId: string) => {
    const updatedTemplates = templates.map(t => 
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    );
    setTemplates(updatedTemplates);

    // Update localStorage for custom templates
    const customTemplates = updatedTemplates.filter(t => t.category === "custom");
    localStorage.setItem("moorMeter-screener-templates", JSON.stringify(customTemplates));
  };

  const loadTemplate = (template: FilterTemplate) => {
    onLoadTemplate(template.filters);
    setShowLoadDialog(false);
  };

  const filteredTemplates = templates.filter(t => 
    selectedCategory === "all" || t.category === selectedCategory
  );

  const favoriteTemplates = templates.filter(t => t.isFavorite);

  return (
    <div className="flex gap-2">
      {/* Quick Load Favorites */}
      {favoriteTemplates.slice(0, 2).map((template) => (
        <Button
          key={template.id}
          variant="outline"
          size="sm"
          onClick={() => loadTemplate(template)}
          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 gap-1"
        >
          <Star className="w-3 h-3 fill-current" />
          {template.name}
        </Button>
      ))}

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:text-white gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Save Filter Template</DialogTitle>
            <DialogDescription className="text-gray-400">
              Save your current filter settings as a reusable template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., My Growth Strategy"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Input
                id="template-description"
                placeholder="Brief description of this filter strategy"
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveTemplate}
              disabled={!newTemplateName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Template Dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:text-white gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            Load Template
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Load Filter Template</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose from preset templates or your saved custom filters.
            </DialogDescription>
          </DialogHeader>
          
          {/* Category Filter */}
          <div className="flex gap-2 border-b border-gray-700 pb-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Templates
            </Button>
            <Button
              variant={selectedCategory === "preset" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("preset")}
            >
              <Crown className="w-3 h-3 mr-1" />
              Presets
            </Button>
            <Button
              variant={selectedCategory === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("custom")}
            >
              <Filter className="w-3 h-3 mr-1" />
              Custom
            </Button>
          </div>

          {/* Templates List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{template.name}</h4>
                        {template.isDefault && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            Default
                          </Badge>
                        )}
                        {template.category === "preset" && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Preset
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{template.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {template.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(template.id)}
                        className={cn(
                          "h-8 w-8 p-0",
                          template.isFavorite ? "text-yellow-400" : "text-gray-500"
                        )}
                      >
                        <Star className={cn("w-4 h-4", template.isFavorite && "fill-current")} />
                      </Button>
                      {template.category === "custom" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Template</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete "{template.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTemplate(template.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button
                        onClick={() => loadTemplate(template)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Load
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-gray-400 font-medium mb-2">No templates found</h3>
              <p className="text-gray-500 text-sm">
                {selectedCategory === "custom" 
                  ? "You haven't saved any custom templates yet."
                  : "No templates match the selected category."
                }
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterTemplateManager;
