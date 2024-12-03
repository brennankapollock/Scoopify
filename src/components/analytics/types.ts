export interface AnalyticMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  chartData: number[];
}

export interface AnalyticCategory {
  id: string;
  title: string;
  metrics: AnalyticMetric[];
}