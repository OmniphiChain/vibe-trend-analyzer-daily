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
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  Zap,
  Eye,
  BarChart3,
  Cpu,
} from "lucide-react";
import {
  nlpSentimentAnalyzer,
  SentimentResult,
} from "@/services/nlpSentimentAnalysis";

export function NLPSentimentDemo() {
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<SentimentResult | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleTexts = [
    "The market is experiencing incredible growth with strong bullish momentum and excellent profit margins!",
    "Investors are worried about the declining market trends and potential economic recession concerns.",
    "The company reported quarterly earnings that met analyst expectations with stable performance.",
    "Bitcoin surged to new highs as institutional adoption accelerates, but some experts warn of volatility risks.",
    "Not good news for tech stocks as they failed to meet earnings expectations despite strong revenue growth.",
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = nlpSentimentAnalyzer.analyzeSentiment(inputText);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSampleText = (text: string) => {
    setInputText(text);
    setAnalysisResult(null);
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: "bg-yellow-500",
      fear: "bg-purple-500",
      anger: "bg-red-500",
      sadness: "bg-blue-500",
      surprise: "bg-pink-500",
      trust: "bg-green-500",
      anticipation: "bg-orange-500",
      disgust: "bg-gray-500",
    };
    return colors[emotion as keyof typeof colors] || "bg-gray-400";
  };

  const modelMetrics = nlpSentimentAnalyzer.getModelMetrics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          Advanced NLP Sentiment Analysis
        </h1>
        <p className="text-muted-foreground">
          Machine Learning-inspired Natural Language Processing with emotion
          detection, context awareness, and advanced feature extraction
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Text Analysis
          </CardTitle>
          <CardDescription>
            Enter text to analyze with advanced NLP techniques including
            negation handling, emotion detection, and financial domain expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to analyze (e.g., news headlines, social posts, market commentary)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {inputText.length} characters
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Cpu className="h-4 w-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Analyze Sentiment
                </>
              )}
            </Button>
          </div>

          {/* Sample Texts */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Try these examples:</p>
            <div className="grid grid-cols-1 gap-2">
              {sampleTexts.map((text, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSampleText(text)}
                  className="text-left justify-start h-auto p-3 whitespace-normal"
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="emotions">Emotions</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="model">Model Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSentimentIcon(analysisResult.label)}
                  Sentiment Analysis Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Score */}
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <div
                      className={`text-4xl font-bold ${getSentimentColor(analysisResult.label)}`}
                    >
                      {analysisResult.score.toFixed(1)}
                    </div>
                    <div className="text-lg font-medium capitalize">
                      {analysisResult.label} Sentiment
                    </div>
                  </div>

                  <Progress
                    value={analysisResult.score}
                    className="w-full h-3"
                  />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Negative (0)</span>
                    <span>Neutral (50)</span>
                    <span>Positive (100)</span>
                  </div>
                </div>

                {/* Confidence and Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Confidence</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {(analysisResult.confidence * 100).toFixed(1)}%
                    </div>
                    <Progress
                      value={analysisResult.confidence * 100}
                      className="mt-2"
                    />
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">Complexity</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {analysisResult.features.complexityScore.toFixed(0)}
                    </div>
                    <Progress
                      value={analysisResult.features.complexityScore}
                      className="mt-2"
                    />
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">Context Shifts</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {analysisResult.breakdown.contextShifts}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Negation patterns detected
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emotions">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Detection</CardTitle>
                <CardDescription>
                  Multi-dimensional emotion analysis using Plutchik's Wheel of
                  Emotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysisResult.emotions).map(
                    ([emotion, score]) => (
                      <div key={emotion} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getEmotionColor(emotion)}`}
                          />
                          <span className="font-medium capitalize">
                            {emotion}
                          </span>
                        </div>
                        <Progress value={score * 100} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {(score * 100).toFixed(1)}%
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Linguistic Features</CardTitle>
                <CardDescription>
                  Advanced NLP feature extraction and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Text Characteristics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Text Length:</span>
                        <Badge variant="outline">
                          {analysisResult.features.textLength} chars
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Emotional Words:</span>
                        <Badge variant="outline">
                          {analysisResult.features.emotionalWords}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Financial Terms:</span>
                        <Badge variant="outline">
                          {analysisResult.features.financialTerms}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Urgency Indicators:</span>
                        <Badge variant="outline">
                          {analysisResult.features.urgencyIndicators}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Linguistic Modifiers</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Negation Words:</span>
                        <Badge variant="outline">
                          {analysisResult.features.negationCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Intensifiers:</span>
                        <Badge variant="outline">
                          {analysisResult.features.intensifierCount}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Complexity Score:</span>
                        <Badge variant="outline">
                          {analysisResult.features.complexityScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Word Analysis</CardTitle>
                <CardDescription>
                  Breakdown of sentiment-bearing words and linguistic modifiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">
                      Positive Words
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.breakdown.positiveWords.length > 0 ? (
                        analysisResult.breakdown.positiveWords.map(
                          (word, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="mr-1 mb-1"
                            >
                              {word}
                            </Badge>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          None detected
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">
                      Negative Words
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.breakdown.negativeWords.length > 0 ? (
                        analysisResult.breakdown.negativeWords.map(
                          (word, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="mr-1 mb-1"
                            >
                              {word}
                            </Badge>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          None detected
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3">
                      Modifiers
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.breakdown.modifiers.length > 0 ? (
                        analysisResult.breakdown.modifiers.map(
                          (word, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="mr-1 mb-1"
                            >
                              {word}
                            </Badge>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          None detected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {analysisResult.breakdown.neutralWords.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-600 mb-3">
                      Context Words
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.breakdown.neutralWords
                        .slice(0, 20)
                        .map((word, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {word}
                          </Badge>
                        ))}
                      {analysisResult.breakdown.neutralWords.length > 20 && (
                        <Badge variant="outline" className="text-xs">
                          +{analysisResult.breakdown.neutralWords.length - 20}{" "}
                          more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="model">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Model Performance & Information
                </CardTitle>
                <CardDescription>
                  Advanced NLP model specifications and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Overall Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Accuracy:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={modelMetrics.accuracy * 100}
                            className="w-20 h-2"
                          />
                          <span className="font-mono text-sm">
                            {(modelMetrics.accuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Precision:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={modelMetrics.precision * 100}
                            className="w-20 h-2"
                          />
                          <span className="font-mono text-sm">
                            {(modelMetrics.precision * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Recall:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={modelMetrics.recall * 100}
                            className="w-20 h-2"
                          />
                          <span className="font-mono text-sm">
                            {(modelMetrics.recall * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>F1-Score:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={modelMetrics.f1Score * 100}
                            className="w-20 h-2"
                          />
                          <span className="font-mono text-sm">
                            {(modelMetrics.f1Score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Feature Performance</h4>
                    <div className="space-y-3">
                      {Object.entries(modelMetrics.features).map(
                        ([feature, score]) => (
                          <div
                            key={feature}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">
                              {feature.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={score * 100}
                                className="w-20 h-2"
                              />
                              <span className="font-mono text-xs">
                                {(score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Training Data</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-3">
                      <div className="text-lg font-bold">
                        {modelMetrics.trainingData.samples.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Samples
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-lg font-bold text-green-600">
                        {modelMetrics.trainingData.positiveExamples.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Positive
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-lg font-bold text-red-600">
                        {modelMetrics.trainingData.negativeExamples.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Negative
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-lg font-bold text-yellow-600">
                        {modelMetrics.trainingData.neutralExamples.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Neutral
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Model Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <ul className="space-y-1">
                      <li>• Lexical analysis with weighted terms</li>
                      <li>• Negation and context handling</li>
                      <li>• Emotion detection (8 dimensions)</li>
                      <li>• Financial domain expertise</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Intensifier and modifier recognition</li>
                      <li>• Complexity scoring</li>
                      <li>• Urgency detection</li>
                      <li>• Confidence calibration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
