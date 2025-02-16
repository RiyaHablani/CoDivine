export interface AnalysisHistory {
  id: string;
  inputCode: string;
  analysisResult: string;
  timestamp: number;
}

export interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}