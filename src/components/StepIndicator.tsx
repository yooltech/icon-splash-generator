import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`
                  flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full 
                  text-sm font-semibold transition-all duration-300
                  ${isActive ? 'step-indicator-active' : ''}
                  ${isCompleted ? 'step-indicator-completed' : ''}
                  ${!isActive && !isCompleted ? 'step-indicator-inactive' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  index + 1
                )}
              </motion.div>
              <span
                className={`
                  mt-2 text-xs md:text-sm font-medium transition-colors
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-8 md:w-16 h-0.5 mx-2 md:mx-4 mt-[-1.5rem] transition-colors duration-300
                  ${isCompleted ? 'bg-primary' : 'bg-border'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
