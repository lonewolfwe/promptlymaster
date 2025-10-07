import { motion } from "framer-motion";
import { type IntentDetectionResult, getIntentDisplayName, getIntentIcon } from "@/lib/xmlGenerator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain } from "lucide-react";

interface IntentDetectionVisualizerProps {
  detection: IntentDetectionResult;
  onOverride?: (intent: string) => void;
}

const IntentDetectionVisualizer = ({ detection, onOverride }: IntentDetectionVisualizerProps) => {
  const confidencePercentage = Math.round(detection.confidence * 100);
  const isHighConfidence = detection.confidence >= 0.7;
  const isMediumConfidence = detection.confidence >= 0.4 && detection.confidence < 0.7;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Main Detection Card */}
      <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl border border-accent/20 p-6 shadow-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="h-4 w-4 text-accent" />
              </motion.div>
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold">Context Detected</h3>
              <p className="text-sm text-muted-foreground">Intelligent analysis complete</p>
            </div>
          </div>

          {/* Confidence Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge 
              variant={isHighConfidence ? "default" : isMediumConfidence ? "secondary" : "outline"}
              className="text-sm font-semibold px-3 py-1"
            >
              {confidencePercentage}% confident
            </Badge>
          </motion.div>
        </div>

        {/* Primary Intent */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 border border-accent/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{getIntentIcon(detection.intent)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{getIntentDisplayName(detection.intent)}</h4>
                <p className="text-xs text-muted-foreground">Primary intent</p>
              </div>
            </div>

            {/* Matched Keywords */}
            {detection.matchedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {detection.matchedKeywords.map((keyword, index) => (
                  <motion.div
                    key={keyword}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Confidence Bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isHighConfidence 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : isMediumConfidence
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Alternative Intents */}
        {detection.alternativeIntents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <p className="text-xs text-muted-foreground mb-2">
              {isMediumConfidence ? "Not what you meant? Try these:" : "Other possibilities:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {detection.alternativeIntents.map((alt, index) => (
                <motion.button
                  key={alt.intent}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => onOverride?.(alt.intent)}
                  className="px-3 py-1.5 rounded-lg bg-muted hover:bg-accent/20 border border-border hover:border-accent/50 transition-all text-xs font-medium flex items-center gap-2"
                >
                  <span>{getIntentIcon(alt.intent)}</span>
                  <span>{getIntentDisplayName(alt.intent)}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {Math.round(alt.confidence * 100)}%
                  </Badge>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Help Text for Low Confidence */}
        {!isHighConfidence && !isMediumConfidence && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-xs text-muted-foreground text-center"
          >
            💡 Tip: Try being more specific with keywords to improve detection
          </motion.p>
        )}
      </div>

      {/* Pulse Animation Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 to-primary/20 -z-10"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default IntentDetectionVisualizer;