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

      {/* Step indicators */}
      <div className="flex justify-between">
        {labels.map((label, index) => (
          <div key={index} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                index < currentStep
                  ? 'bg-primary-600 text-white'
                  : index === currentStep
                  ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-1 text-[10px] text-center leading-tight ${
                index <= currentStep ? 'text-primary-700 font-medium' : 'text-slate-400'
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
