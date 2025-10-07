import { motion } from "framer-motion";
import { type IntentType, getIntentDisplayName } from "@/lib/xmlGenerator";
import { Check } from "lucide-react";

interface WorkflowStepsProps {
  currentStep: number;
  intent?: IntentType;
}

const WorkflowSteps = ({ currentStep, intent }: WorkflowStepsProps) => {
  const steps = [
    { number: 1, title: "Input", subtitle: "Plain English" },
    { number: 2, title: "Detect", subtitle: intent ? getIntentDisplayName(intent) : "Analyzing..." },
    { number: 3, title: "Generate", subtitle: "Structured XML" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-card border rounded-xl px-4 py-3 shadow-card flex-1 relative overflow-hidden"
            >
              {/* Active Step Glow */}
              {currentStep === step.number && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Step Number/Check */}
              <motion.div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  currentStep > step.number
                    ? "bg-accent text-accent-foreground"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                animate={currentStep === step.number ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 1,
                  repeat: currentStep === step.number ? Infinity : 0,
                }}
              >
                {currentStep > step.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </motion.div>

              {/* Step Info */}
              <div className="flex-1 relative z-10">
                <p className={`text-sm font-medium transition-colors ${
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.title}
                </p>
                <p className={`text-xs transition-colors ${
                  currentStep >= step.number ? "text-muted-foreground" : "text-muted-foreground/50"
                }`}>
                  {step.subtitle}
                </p>
              </div>
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="h-px w-8 mx-2 bg-border relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WorkflowSteps;