export interface ReportData {
  title: string;
  period: string;
  kpis: KPI[];
  analysis: string;
  summary: string;
  conclusion: string;
  mainImage: string;
  secondaryImage: string;
}

export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ExcelRow {
  [key: string]: any;
}

export interface AppConfig {
  driveExcelUrl: string;
  imageFolderId: string;
  defaultImages: string[];
}
