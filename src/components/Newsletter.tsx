import React from 'react';
import { KPI } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsletterProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ data, onUpdate }) => {
  const handleContentEdit = (field: string, e: React.FormEvent<HTMLDivElement>) => {
    onUpdate(field, e.currentTarget.innerText);
  };

  return (
    <div 
      id="newsletter-report"
      className="bg-white shadow-2xl mx-auto overflow-hidden"
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        padding: '20mm',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Header */}
      <header className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit('title', e)}
            className="text-4xl font-black uppercase tracking-tighter text-slate-900 outline-none focus:bg-slate-50"
          >
            {data.title || 'BOLETÍN CORPORATIVO'}
          </h1>
          <p 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit('period', e)}
            className="text-slate-500 font-medium mt-1 outline-none"
          >
            {data.period || 'Reporte de Desempeño Mensual'}
          </p>
        </div>
        <div className="text-right text-xs font-mono text-slate-400 uppercase">
          Confidencial / Uso Interno
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-64 bg-slate-100 mb-8 rounded-sm overflow-hidden group">
        <img 
          src={data.mainImage || 'https://picsum.photos/seed/corp/1200/600'} 
          alt="Main" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Summary Section */}
      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-l-4 border-slate-900 pl-3">
          Resumen Ejecutivo
        </h2>
        <div 
          contentEditable 
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit('summary', e)}
          className="text-xl leading-relaxed text-slate-700 font-light italic outline-none focus:bg-slate-50 p-2"
        >
          {data.summary}
        </div>
      </section>

      {/* KPIs Grid */}
      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-l-4 border-slate-900 pl-3">
          Indicadores Clave (KPIs)
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {data.kpis?.map((kpi: KPI, index: number) => (
            <div key={index} className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">{kpi.label}</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900">{kpi.value}</span>
                <div className={`flex items-center text-sm font-bold ${
                  kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-rose-600' : 'text-slate-400'
                }`}>
                  {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                  {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                  {kpi.trend === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis Section */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-l-4 border-slate-900 pl-3">
            Análisis Narrativo
          </h2>
          <div 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit('analysis', e)}
            className="text-slate-600 leading-relaxed outline-none focus:bg-slate-50 p-2 whitespace-pre-wrap"
          >
            {data.analysis}
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-sm text-white">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Conclusión</h3>
          <div 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit('conclusion', e)}
            className="text-sm leading-relaxed font-light outline-none"
          >
            {data.conclusion}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
        <div>Generado automáticamente • {new Date().toLocaleDateString()}</div>
        <div className="font-bold text-slate-900">Departamento de Estrategia</div>
      </footer>
    </div>
  );
};
