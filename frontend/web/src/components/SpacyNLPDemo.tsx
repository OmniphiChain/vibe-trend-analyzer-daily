import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Brain,
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  Clock,
  Target,
  Zap,
  MessageSquare,
  Hash,
} from "lucide-react";
import {
  useSpacyAnalysis,
  useSpacyBatchAnalysis,
  spacyUtils,
  type SpacyAnalysisResult,
} from "@/hooks/useSpacyNLP";

export function SpacyNLPDemo() {
  const [inputText, setInputText] = useState("");
  const [batchTexts, setBatchTexts] = useState("");
  const [analysisResult, setAnalysisResult] = useState<SpacyAnalysisResult | null>(null);
  const [batchResults, setBatchResults] = useState<SpacyAnalysisResult[] | null>(null);

  const singleAnalysis = useSpacyAnalysis();
  const batchAnalysis = useSpacyBatchAnalysis();

  const sampleTexts = [
    "The market is experiencing incredible growth with strong bullish momentum and excellent profit margins!",
    "Investors are worried about declining market trends and potential economic recession concerns affecting portfolios.",
    "The company reported quarterly earnings that met analyst expectations with stable performance indicators.",
    "Bitcoin surged to new highs as institutional adoption accelerates, driving significant investor confidence.",
    "Tech stocks failed to meet earnings expectations despite strong revenue growth in the semiconductor sector.",
  ];

  const handleSingleAnalysis = async () => {
    if (!inputText.trim()) return;
    
    try {
      const result = await singleAnalysis.mutateAsync(inputText);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleBatchAnalysis = async () => {
    const texts = batchTexts.split('\n').filter(t => t.trim().length > 0);
    if (texts.length === 0) return;
    
    try {
      const result = await batchAnalysis.mutateAsync(texts);
      setBatchResults(result.results);
    } catch (error) {
      console.error("Batch analysis failed:", error);
    }
  };

  const handleSampleAnalysis = async (text: string) => {
    setInputText(text);
    try {
      const result = await singleAnalysis.mutateAsync(text);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Sample analysis failed:", error);
    }
  };

  const loadSampleBatch = () => {
    setBatchTexts(sampleTexts.join('\n'));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1F2937] via-[#3730A3] to-[#4338CA] dark:from-purple-600 dark:via-blue-600 dark:to-green-600 bg-clip-text text-transparent mb-4">
          spaCy Financial NLP Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced natural language processing with spaCy for comprehensive financial text analysis, 
          entity recognition, and sentiment scoring.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            spaCy v3.7+ NLP Pipeline
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Financial Domain Optimized
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Entity Recognition & POS Tagging
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Text Analysis</TabsTrigger>
          <TabsTrigger value="batch">Batch Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Text Input & Analysis
              </CardTitle>
              <CardDescription>
                Enter financial text for comprehensive spaCy NLP analysis including sentiment, entities, and linguistic features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="input-text">Enter text to analyze:</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter financial news, social media posts, or market commentary..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleSingleAnalysis} 
                  disabled={singleAnalysis.isPending || !inputText.trim()}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {singleAnalysis.isPending ? "Analyzing..." : "Analyze Text"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInputText("")}>
                  Clear
                </Button>
              </div>

              {/* Sample Texts */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Quick samples:</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {sampleTexts.map((text, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="text-left justify-start h-auto p-2 text-wrap"
                      onClick={() => handleSampleAnalysis(text)}
                      disabled={singleAnalysis.isPending}
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Single Analysis Results */}
          {analysisResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sentiment Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${spacyUtils.getSentimentColor(analysisResult.analysis.sentiment_score)}`}>
                      {analysisResult.analysis.sentiment_score.toFixed(1)}
                    </div>
                    <Badge variant={spacyUtils.getSentimentBadgeVariant(analysisResult.analysis.sentiment_score)}>
                      {analysisResult.analysis.sentiment_label}
                    </Badge>
                  </div>
                  <Progress value={analysisResult.analysis.sentiment_score} className="w-full" />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Confidence: {spacyUtils.getConfidenceLevel(analysisResult.analysis.confidence)}</div>
                    <div>Model: {analysisResult.metadata.model_version}</div>
                    {analysisResult.metadata.note && (
                      <div className="text-yellow-600">{analysisResult.metadata.note}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Entity Recognition */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Named Entities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(analysisResult.analysis.entities).map(([type, entities]) => (
                      entities.length > 0 && (
                        <div key={type}>
                          <Label className="text-xs font-medium capitalize">{type.replace('_', ' ')}:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entities.map((entity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  
                  <div className="border-t pt-3">
                    <Label className="text-xs font-medium">Financial Context:</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>Financial Terms: {analysisResult.analysis.financial_context.financial_entities_count}</div>
                      <div>Risk Indicators: {analysisResult.analysis.financial_context.risk_indicators.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Linguistic Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Linguistic Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs">Sentences:</Label>
                      <div className="font-medium">{analysisResult.analysis.linguistic_features.sentence_count}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Avg Length:</Label>
                      <div className="font-medium">{Math.round(analysisResult.analysis.linguistic_features.avg_sentence_length)}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Questions:</Label>
                      <div className="font-medium">{analysisResult.analysis.linguistic_features.question_count}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Exclamations:</Label>
                      <div className="font-medium">{analysisResult.analysis.linguistic_features.exclamation_count}</div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <Label className="text-xs font-medium">Sentiment Words:</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="text-green-600">
                        Positive: {analysisResult.analysis.sentiment_features.positive_count}
                      </div>
                      <div className="text-red-600">
                        Negative: {analysisResult.analysis.sentiment_features.negative_count}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Batch Text Analysis
              </CardTitle>
              <CardDescription>
                Analyze multiple texts simultaneously for comparative sentiment analysis and market insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batch-texts">Enter texts (one per line):</Label>
                <Textarea
                  id="batch-texts"
                  placeholder="Enter multiple texts, one per line..."
                  value={batchTexts}
                  onChange={(e) => setBatchTexts(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleBatchAnalysis} 
                  disabled={batchAnalysis.isPending || !batchTexts.trim()}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {batchAnalysis.isPending ? "Analyzing..." : "Analyze Batch"}
                </Button>
                <Button variant="outline" size="sm" onClick={loadSampleBatch}>
                  Load Samples
                </Button>
                <Button variant="outline" size="sm" onClick={() => setBatchTexts("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Batch Results */}
          {batchResults && (
            <div className="space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Batch Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const summary = spacyUtils.getMarketSentiment(batchResults);
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{summary.averageScore.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground">Avg Sentiment</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{summary.positiveCount}</div>
                          <div className="text-sm text-muted-foreground">Positive</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{summary.negativeCount}</div>
                          <div className="text-sm text-muted-foreground">Negative</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{summary.neutralCount}</div>
                          <div className="text-sm text-muted-foreground">Neutral</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{summary.totalEntities}</div>
                          <div className="text-sm text-muted-foreground">Financial Terms</div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Individual Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batchResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Text {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={spacyUtils.getSentimentBadgeVariant(result.analysis.sentiment_score)}>
                          {result.analysis.sentiment_label}
                        </Badge>
                        <span className={`font-bold ${spacyUtils.getSentimentColor(result.analysis.sentiment_score)}`}>
                          {result.analysis.sentiment_score.toFixed(1)}
                        </span>
                      </div>
                      <Progress value={result.analysis.sentiment_score} className="w-full h-2" />
                      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>Confidence: {(result.analysis.confidence * 100).toFixed(0)}%</div>
                        <div>Entities: {result.analysis.financial_context.financial_entities_count}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}