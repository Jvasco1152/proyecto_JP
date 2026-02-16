interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  const percentage = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className="absolute inset-y-0 left-0 bg-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step label + dot indicators */}
      <div className="flex items-center justify-between">
        {labels.map((label, index) => (
          <div key={index} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                index < currentStep
                  ? 'bg-primary-600'
                  : index === currentStep
                  ? 'bg-primary-600 ring-3 ring-primary-100'
                  : 'bg-slate-200'
              }`}
            />
            <span
              className={`mt-0.5 text-[8px] text-center leading-tight truncate w-full ${
                index === currentStep ? 'text-primary-700 font-bold' :
                index < currentStep ? 'text-primary-600 font-medium' : 'text-slate-400'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
