import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Sparkles, Loader2, Code2, Eye, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface EnhancedXMLDisplayProps {
  xml: string;
  explanation: string;
  onGenerateAI?: () => void;
  aiLoading?: boolean;
}

const EnhancedXMLDisplay = ({ xml, explanation, onGenerateAI, aiLoading }: EnhancedXMLDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "explanation">("code");
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    
    // Ripple effect
    toast({
      title: "Copied!",
      description: "XML copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* XML Output Card */}
      <Card className="relative overflow-hidden shadow-card hover:shadow-lifted transition-all duration-300 group">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Code2 className="h-5 w-5 text-accent" />
              </motion.div>
              <div>
                <CardTitle className="text-lg">Structured XML Output</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Dynamically generated from your input
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === "code" ? "default" : "ghost"}
                onClick={() => setViewMode("code")}
                className="h-8"
              >
                <Code2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "explanation" ? "default" : "ghost"}
                onClick={() => setViewMode("explanation")}
                className="h-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {viewMode === "code" ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative group/code"
              >
                <div className={`relative rounded-lg overflow-hidden border border-border shadow-inner transition-all duration-300 ${
                  isExpanded ? 'max-h-[600px]' : 'max-h-[300px]'
                } overflow-y-auto`}>
                  <SyntaxHighlighter
                    language="xml"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'hsl(var(--muted) / 0.5)',
                      fontSize: '0.875rem',
                    }}
                    showLineNumbers
                  >
                    {xml}
                  </SyntaxHighlighter>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="h-8 shadow-md"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleCopy}
                      className="h-8 shadow-md"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>

                {/* Copy Ripple Effect */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 right-2 w-20 h-20 rounded-full bg-accent/30 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/20 mt-1">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Why This Structure?</h4>
                    <p className="text-muted-foreground leading-relaxed">{explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Generate AI Button */}
          {onGenerateAI && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                onClick={onGenerateAI} 
                className="w-full shadow-card hover:shadow-lifted transition-all relative overflow-hidden group/btn"
                disabled={aiLoading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  {aiLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting AI Response...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Response
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          )}
        </CardContent>

        {/* Card Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-accent/0 group-hover:border-accent/30 transition-colors pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0px rgba(var(--accent), 0)",
              "0 0 20px rgba(var(--accent), 0.3)",
              "0 0 0px rgba(var(--accent), 0)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </Card>
    </motion.div>
  );
};

export default EnhancedXMLDisplay;