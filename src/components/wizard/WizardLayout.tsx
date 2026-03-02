import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, LogOut } from 'lucide-react';
import type { FormType, InspectionFormData, InspectionItemData } from '../../types/inspection';
import { formRegistry } from '../../data/formRegistry';
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

interface WizardLayoutProps {
  formType: FormType;
  onBack: () => void;
  onLogout: () => void;
}

export default function WizardLayout({ formType, onBack, onLogout }: WizardLayoutProps) {
  const { sections, stepLabels, shortTitle } = formRegistry[formType];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<InspectionFormData>(getDefaultFormData());
  const [reportLoading, setReportLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { clearSavedData } = useFormPersistence(formData, setFormData);
  const { analysis, loading: aiLoading, error: aiError, analyze, reset: resetAI } = useAIAnalysis();

  // Step indices: 0=Datos, 1..N=sections, N+1=Comentarios, N+2=Informe
  const LAST_SECTION_STEP = sections.length;
  const COMMENT_STEP = sections.length + 1;
  const REVIEW_STEP = sections.length + 2;

  const handleItemChange = useCallback((itemId: string, data: InspectionItemData) => {
    setFormData(prev => ({
      ...prev,
      sections: { ...prev.sections, [itemId]: data },
    }));
  }, []);

  const handleReset = useCallback(async () => {
    clearSavedData();
    await clearAllPhotos();
    resetAI();
    setShowResetConfirm(false);
    onBack();
  }, [clearSavedData, resetAI, onBack]);

  const handleAnalyze = useCallback(() => {
    analyze(formData, sections);
  }, [analyze, formData, sections]);

  const handleGenerateReport = useCallback(async () => {
    setReportLoading(true);
    try {
      await generateWordReport(formData, analysis, sections);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Error al generar informe: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setReportLoading(false);
    }
  }, [formData, analysis, sections]);

  const handleGenerateExcel = useCallback(async () => {
    setExcelLoading(true);
    try {
      await generateExcelReport(formData, sections);
    } catch (err) {
      console.error('Error generating Excel:', err);
      alert('Error al generar Excel: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setExcelLoading(false);
    }
  }, [formData, sections]);

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

    // Steps 1..N: Inspection groups
    if (currentStep >= 1 && currentStep <= LAST_SECTION_STEP) {
      const section = sections[currentStep - 1];
      return (
        <StepInspectionGroup
          section={section}
          items={formData.sections}
          onItemChange={handleItemChange}
        />
      );
    }

    // Comments step
    if (currentStep === COMMENT_STEP) {
      return (
        <StepComentarios
          comentarios={formData.comentarios}
          onChange={comentarios => setFormData(prev => ({ ...prev, comentarios }))}
        />
      );
    }

    // Review step
    if (currentStep === REVIEW_STEP) {
      return (
        <StepReview
          formData={formData}
          sections={sections}
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
            <p className="text-primary-200 text-xs">{shortTitle}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
              title="Cambiar formulario"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-[60px] z-30">
        <div className="max-w-lg mx-auto">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={stepLabels.length}
            labels={stepLabels}
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
          {currentStep < stepLabels.length - 1 && (
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
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cambiar formulario</h3>
            <p className="text-sm text-slate-600 mb-4">
              Se borrarán todos los datos y fotos de la inspección actual y regresarás a la pantalla de selección. Esta acción no se puede deshacer.
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
