import { useState, useEffect } from 'react';
import { Newsletter } from './components/Newsletter';
import { DriveService } from './services/driveService';
import { ExcelProcessor } from './services/excelProcessor';
import { ExportService } from './services/exportService';
import { ReportData } from './types';
import { 
  Download, 
  RefreshCw, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Settings, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [driveUrl, setDriveUrl] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reportData, setReportData] = useState<Partial<ReportData>>({
    title: 'REPORTE ESTRATÉGICO',
    period: 'Q1 2024 - Análisis de Desempeño',
    summary: 'Cargando datos del sistema...',
    analysis: 'Inicie la carga para generar el análisis automático.',
    conclusion: 'Pendiente de datos.',
    kpis: [],
    mainImage: 'https://picsum.photos/seed/business/1200/600',
  });

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const downloadUrl = DriveService.convertToDownloadUrl(driveUrl);
      const response = await DriveService.fetchWithCORS(downloadUrl);
      const buffer = await response.arrayBuffer();
      const rows = ExcelProcessor.parseExcel(buffer);
      const generated = ExcelProcessor.generateReportData(rows);
      
      setReportData(prev => ({
        ...prev,
        ...generated
      }));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Google Drive. Verifique que el archivo sea público.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    ExportService.exportToPDF('newsletter-report', `reporte-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar / Controls */}
      <aside className="w-full lg:w-96 bg-white border-r border-slate-200 p-8 flex flex-col gap-8 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Configuración</h2>
          </div>

          <div className="space-y-6">
            {/* Excel Source */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-3 h-3" /> Fuente de Datos (Drive)
              </label>
              <input 
                type="text" 
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="Link de Google Drive..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
              />
              <button 
                onClick={handleFetchData}
                disabled={loading}
                className="w-full mt-3 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Sincronizar Datos
              </button>
            </div>

            {/* Image Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Imagen de Portada
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['business', 'tech', 'growth', 'team', 'office'].map((seed) => (
                  <button 
                    key={seed}
                    onClick={() => handleUpdateField('mainImage', `https://picsum.photos/seed/${seed}/1200/600`)}
                    className="aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-slate-900 transition-all"
                  >
                    <img src={`https://picsum.photos/seed/${seed}/100/60`} alt={seed} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>Datos actualizados correctamente</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100">
          <button 
            onClick={handleExport}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
          >
            <Download className="w-6 h-6" />
            EXPORTAR PDF
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
            Formato A4 Profesional • 300 DPI
          </p>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto flex justify-center bg-slate-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] origin-top hover:shadow-[0_0_60px_-12px_rgba(0,0,0,0.2)] transition-shadow"
        >
          <Newsletter data={reportData} onUpdate={handleUpdateField} />
        </motion.div>
      </main>
    </div>
  );
}
