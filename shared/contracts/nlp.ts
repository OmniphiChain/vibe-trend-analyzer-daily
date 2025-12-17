/**
 * NLP Service API Contracts
 *
 * These types define the contract between the backend API gateway
 * and the AI NLP microservice. Both sides should use these types.
 */

// =============================================================================
// Request Types
// =============================================================================

export interface TextRequest {
  text: string;
}

export interface BatchTextRequest {
  texts: string[];
}

export interface StreamAnalysisRequest {
  text: string;
  models?: Array<'finance' | 'social' | 'emotion' | 'ner'>;
}

// =============================================================================
// Sentiment Types
// =============================================================================

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface SentimentScore {
  label: SentimentLabel;
  score: number;
}

export interface ModelSentimentResult {
  model: string;
  sentiment: SentimentScore;
}

export interface EnsembleScore {
  label: SentimentLabel;
  confidence: number;
  raw_score: number;
}

export interface FinanceSentimentResponse {
  text: string;
  models: ModelSentimentResult[];
  ensemble: EnsembleScore;
}

export interface SocialSentimentResponse {
  text: string;
  label: SentimentLabel;
  confidence: number;
}

// =============================================================================
// Emotion Types
// =============================================================================

export interface EmotionScore {
  emotion: string;
  score: number;
}

export interface EmotionResponse {
  text: string;
  emotions: EmotionScore[];
  primary_emotion: string;
  primary_score: number;
}

// =============================================================================
// NER Types
// =============================================================================

export type EntityType = 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'MISCELLANEOUS';

export interface NEREntity {
  entity: string;
  entity_type: EntityType;
  confidence: number;
  start: number;
  end: number;
}

export interface NERResponse {
  text: string;
  entities: NEREntity[];
  entity_count: number;
}

// =============================================================================
// Full Analysis Types
// =============================================================================

export interface FullAnalysisResponse {
  text: string;
  finance_sentiment?: FinanceSentimentResponse;
  social_sentiment?: SocialSentimentResponse;
  emotion?: EmotionResponse;
  ner?: NERResponse;
}

// =============================================================================
// Batch Response Types
// =============================================================================

export interface BatchFinanceSentimentResponse {
  results: FinanceSentimentResponse[];
  count: number;
}

export interface BatchSocialSentimentResponse {
  results: SocialSentimentResponse[];
  count: number;
}

export interface BatchEmotionResponse {
  results: EmotionResponse[];
  count: number;
}

export interface BatchNERResponse {
  results: NERResponse[];
  count: number;
}

export interface BatchFullAnalysisResponse {
  results: FullAnalysisResponse[];
  count: number;
}

// =============================================================================
// Health Check Types
// =============================================================================

export interface ModelStatus {
  name: string;
  loaded: boolean;
}

export interface NLPHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  device: 'cpu' | 'cuda';
  models: ModelStatus[];
  models_loaded: number;
  total_models: number;
}

// =============================================================================
// Streaming Event Types
// =============================================================================

export interface StreamStartEvent {
  event: 'start';
  text: string;
  models: string[];
  total_steps: number;
}

export interface StreamProgressEvent {
  event: 'progress';
  model: string;
  step: number;
  total_steps: number;
  status: string;
}

export interface StreamModelCompleteEvent {
  event: 'model_complete';
  model: string;
  result_type: 'finance_sentiment' | 'social_sentiment' | 'emotion' | 'ner';
  result: FinanceSentimentResponse | SocialSentimentResponse | EmotionResponse | NERResponse;
  step: number;
  total_steps: number;
}

export interface StreamCompleteEvent {
  event: 'complete';
  full_result: FullAnalysisResponse;
}

export interface StreamErrorEvent {
  event: 'error';
  model?: string;
  error: string;
}

export type StreamEvent =
  | StreamStartEvent
  | StreamProgressEvent
  | StreamModelCompleteEvent
  | StreamCompleteEvent
  | StreamErrorEvent;
