import * as XLSX from 'xlsx';
import { ExcelRow, KPI, ReportData } from '../types';

export const ExcelProcessor = {
  /**
   * Parses an ArrayBuffer (from Excel file) into JSON
   */
  parseExcel(buffer: ArrayBuffer): ExcelRow[] {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  },

  /**
   * Extracts KPIs and generates report data from raw rows
   */
  generateReportData(rows: ExcelRow[]): Partial<ReportData> {
    if (rows.length === 0) return {};

    // Basic heuristic: find numeric columns and compare last two rows
    const lastRow = rows[rows.length - 1];
    const prevRow = rows.length > 1 ? rows[rows.length - 2] : null;

    const kpis: KPI[] = [];
    
    Object.keys(lastRow).forEach(key => {
      const val = lastRow[key];
      if (typeof val === 'number') {
        let change = 0;
        if (prevRow && typeof prevRow[key] === 'number') {
          const prevVal = prevRow[key] as number;
          change = prevVal !== 0 ? ((val - prevVal) / prevVal) * 100 : 0;
        }

        kpis.push({
          label: key,
          value: val.toLocaleString(),
          change: parseFloat(change.toFixed(2)),
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        });
      }
    });

    // Generate dynamic narrative
    const topKpi = kpis.reduce((prev, current) => (Math.abs(prev.change) > Math.abs(current.change)) ? prev : current, kpis[0]);
    
    const analysis = `El desempeño del periodo muestra una tendencia ${topKpi.trend === 'up' ? 'positiva' : 'a la baja'} liderada por ${topKpi.label}, que registró una variación del ${topKpi.change}%.`;
    
    const summary = `Resumen ejecutivo: Se observa un comportamiento estable en la mayoría de los indicadores clave, con oportunidades de optimización en las áreas de menor crecimiento.`;

    return {
      kpis: kpis.slice(0, 4), // Top 4 KPIs
      analysis,
      summary,
      conclusion: "Basado en los datos analizados, se recomienda mantener la estrategia actual con ajustes tácticos en los indicadores con tendencia negativa."
    };
  }
};
