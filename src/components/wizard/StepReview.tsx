import {
  CheckCircle2, XCircle, AlertTriangle, TrendingUp,
  FileText, Sparkles, Download, RefreshCw, Shield,
  AlertCircle,
} from 'lucide-react';
import type { InspectionFormData, AIAnalysis } from '../../types/inspection';
import { calculateSectionScores, calculateOverallScore } from '../../utils/calculateScores';
import Button from '../ui/Button';

interface StepReviewProps {
  formData: InspectionFormData;
  analysis: AIAnalysis | null;
  aiLoading: boolean;
  aiError: string | null;
  onAnalyze: () => void;
  onGenerateReport: () => void;
  reportLoading: boolean;
}

const riskColors: Record<string, { bg: string; text: string; label: string }> = {
  bajo: { bg: 'bg-green-100', text: 'text-green-800', label: 'Bajo' },
  medio: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medio' },
  alto: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Alto' },
  critico: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critico' },
};

export default function StepReview({
  formData,
  analysis,
  aiLoading,
  aiError,
  onAnalyze,
  onGenerateReport,
  reportLoading,
}: StepReviewProps) {
  const scores = calculateSectionScores(formData);
  const overall = calculateOverallScore(formData);

  const scoreColor = overall >= 80 ? 'text-green-600' : overall >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = overall >= 80 ? 'bg-green-50 border-green-200' : overall >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Revision y Generacion</h2>
        <p className="text-sm text-slate-500 mt-0.5">Resumen de la inspeccion y generacion del informe</p>
      </div>

      {/* General info card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-bold text-slate-800">Datos de la inspeccion</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-slate-500">Fecha:</div>
          <div className="font-medium">{formData.header.fecha}</div>
          <div className="text-slate-500">Copropiedad:</div>
          <div className="font-medium">{formData.header.copropiedad || '—'}</div>
          <div className="text-slate-500">Director:</div>
          <div className="font-medium">{formData.header.director || '—'}</div>
          <div className="text-slate-500">Auditor:</div>
          <div className="font-medium">{formData.header.auditor || '—'}</div>
        </div>
      </div>

      {/* Overall score */}
      <div className={`rounded-xl border p-4 ${scoreBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${scoreColor}`} />
            <span className="text-sm font-bold text-slate-800">Cumplimiento General</span>
          </div>
          <span className={`text-3xl font-black ${scoreColor}`}>{overall}%</span>
        </div>
      </div>

      {/* Section scores */}
      <div className="space-y-2">
        {scores.map(score => (
          <div key={score.sectionId} className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-800">{score.sectionTitle}</span>
              <span className={`text-sm font-bold ${
                score.porcentaje >= 80 ? 'text-green-600' : score.porcentaje >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score.porcentaje}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  score.porcentaje >= 80 ? 'bg-green-500' : score.porcentaje >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score.porcentaje}%` }}
              />
            </div>
            <div className="flex gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                {score.cumple}
              </span>
              {score.cumpleParcial > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  {score.cumpleParcial}
                </span>
              )}
              <span className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-500" />
                {score.noCumple}
              </span>
              {score.noAplica > 0 && (
                <span className="flex items-center gap-1 text-slate-400">N/A: {score.noAplica}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis section */}
      <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl border border-primary-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-bold text-primary-900">Analisis con IA</span>
        </div>

        {!analysis && !aiLoading && !aiError && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-600 mb-3">
              Genera un analisis inteligente de los resultados de la inspeccion
            </p>
            <Button onClick={onAnalyze} icon={<Sparkles className="w-4 h-4" />}>
              Analizar con IA
            </Button>
          </div>
        )}

        {aiLoading && (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="animate-spin h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
            <p className="text-sm text-primary-700">Analizando inspeccion...</p>
          </div>
        )}

        {aiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-700">{aiError}</p>
                <Button size="sm" variant="ghost" onClick={onAnalyze} className="mt-2 text-red-600">
                  <RefreshCw className="w-3 h-3" /> Reintentar
                </Button>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-3">
            {/* Risk level */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Nivel de riesgo:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${riskColors[analysis.nivelRiesgo]?.bg} ${riskColors[analysis.nivelRiesgo]?.text}`}>
                {riskColors[analysis.nivelRiesgo]?.label || analysis.nivelRiesgo}
              </span>
            </div>

            {/* Executive summary */}
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 mb-1">Resumen Ejecutivo</p>
              <p className="text-sm text-slate-700 leading-relaxed">{analysis.resumenEjecutivo}</p>
            </div>

            {/* Critical findings */}
            {analysis.hallazgosCriticos.length > 0 && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500 mb-2">Hallazgos Criticos</p>
                <ul className="space-y-1.5">
                  {analysis.hallazgosCriticos.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recomendaciones.length > 0 && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500 mb-2">Recomendaciones</p>
                <ol className="space-y-1.5 list-decimal list-inside">
                  {analysis.recomendaciones.map((r, i) => (
                    <li key={i} className="text-sm text-slate-700">{r}</li>
                  ))}
                </ol>
              </div>
            )}

            <Button size="sm" variant="ghost" onClick={onAnalyze} className="text-primary-600">
              <RefreshCw className="w-3 h-3" /> Regenerar analisis
            </Button>
          </div>
        )}
      </div>

      {/* Generate Word Report */}
      <Button
        onClick={onGenerateReport}
        loading={reportLoading}
        icon={<Download className="w-4 h-4" />}
        size="lg"
        className="w-full"
      >
        Descargar Informe Word
      </Button>
    </div>
  );
}
