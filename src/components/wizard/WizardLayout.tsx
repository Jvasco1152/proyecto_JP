import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { InspectionFormData, InspectionItemData } from '../../types/inspection';
import { useFormPersistence, getDefaultFormData } from '../../hooks/useFormPersistence';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { clearAllPhotos } from '../../hooks/usePhotoCapture';
import { generateWordReport } from '../report/WordGenerator';
import { generateExcelReport } from '../report/ExcelGenerator';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import StepHeader from './StepHeader';
import StepInspectionGroup from './StepInspectionGroup';
import StepComentarios from './StepComentarios';
import StepReview from './StepReview';

const STEP_LABELS = [
  'Datos', 'Seguridad', 'Aseo', 'Infraestr.', 'Proyectos',
  'Comunic.', 'Serv.Púb.', 'Conviv.', 'Coment.', 'Informe',
];

const SECTION_IDS = [
  'seguridad', 'aseo', 'infraestructura', 'proyectos',
  'comunicacion', 'servicios_publicos', 'convivencia',
];

export default function WizardLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<InspectionFormData>(getDefaultFormData());
  const [reportLoading, setReportLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { clearSavedData } = useFormPersistence(formData, setFormData);
  const { analysis, loading: aiLoading, error: aiError, analyze, reset: resetAI } = useAIAnalysis();

  const handleItemChange = useCallback((itemId: string, data: InspectionItemData) => {
    setFormData(prev => ({
      ...prev,
      sections: { ...prev.sections, [itemId]: data },
    }));
  }, []);

  const handleReset = useCallback(async () => {
    clearSavedData();
    await clearAllPhotos();
    setFormData(getDefaultFormData());
    resetAI();
    setCurrentStep(0);
    setShowResetConfirm(false);
  }, [clearSavedData, resetAI]);

  const handleAnalyze = useCallback(() => {
    analyze(formData);
  }, [analyze, formData]);

  const handleGenerateReport = useCallback(async () => {
    setReportLoading(true);
    try {
      await generateWordReport(formData, analysis);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Error al generar informe: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setReportLoading(false);
    }
  }, [formData, analysis]);

  const handleGenerateExcel = useCallback(async () => {
    setExcelLoading(true);
    try {
      await generateExcelReport(formData);
    } catch (err) {
      console.error('Error generating Excel:', err);
      alert('Error al generar Excel: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setExcelLoading(false);
    }
  }, [formData]);

  const canGoNext = () => {
    if (currentStep === 0) {
      const h = formData.header;
      return h.fecha && h.director && h.auditor && h.copropiedad;
    }
    return true;
  };

  const renderStep = () => {
    // Step 0: Header
    if (currentStep === 0) {
      return (
        <StepHeader
          data={formData.header}
          onChange={header => setFormData(prev => ({ ...prev, header }))}
        />
      );
    }

    // Steps 1-7: Inspection groups
    if (currentStep >= 1 && currentStep <= 7) {
      const sectionId = SECTION_IDS[currentStep - 1];
      return (
        <StepInspectionGroup
          sectionId={sectionId}
          items={formData.sections}
          onItemChange={handleItemChange}
        />
      );
    }

    // Step 8: Comments
    if (currentStep === 8) {
      return (
        <StepComentarios
          comentarios={formData.comentarios}
          onChange={comentarios => setFormData(prev => ({ ...prev, comentarios }))}
        />
      );
    }

    // Step 9: Review
    if (currentStep === 9) {
      return (
        <StepReview
          formData={formData}
          analysis={analysis}
          aiLoading={aiLoading}
          aiError={aiError}
          onAnalyze={handleAnalyze}
          onGenerateReport={handleGenerateReport}
          reportLoading={reportLoading}
          onGenerateExcel={handleGenerateExcel}
          excelLoading={excelLoading}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-primary-800 text-white px-4 py-3 shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Auditor JP</h1>
            <p className="text-primary-200 text-xs">Inspección de Copropiedades</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
            title="Nueva inspección"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-[60px] z-30">
        <div className="max-w-lg mx-auto">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEP_LABELS.length}
            labels={STEP_LABELS}
          />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {renderStep()}
      </main>

      {/* Navigation */}
      <nav className="bg-white border-t border-slate-200 px-4 py-3 sticky bottom-0 z-30">
        <div className="flex gap-3 max-w-lg mx-auto">
          {currentStep > 0 && (
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(s => s - 1)}
              icon={<ChevronLeft className="w-4 h-4" />}
              className="flex-1"
            >
              Anterior
            </Button>
          )}
          {currentStep < STEP_LABELS.length - 1 && (
            <Button
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canGoNext()}
              className="flex-1"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </nav>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nueva inspección</h3>
            <p className="text-sm text-slate-600 mb-4">
              Se borrarán todos los datos y fotos de la inspección actual. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowResetConfirm(false)} className="flex-1">
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleReset} className="flex-1">
                Borrar todo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
