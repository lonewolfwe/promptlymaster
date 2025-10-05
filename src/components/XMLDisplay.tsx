import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getIntentDisplayName, type IntentType } from "@/lib/xmlGenerator";

interface XMLDisplayProps {
  xml: string;
  explanation: string;
  intent: IntentType;
  onGenerateAI?: () => void;
  aiLoading?: boolean;
}

const XMLDisplay = ({ xml, explanation, intent, onGenerateAI, aiLoading }: XMLDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "XML copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Intent Detection Banner */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 border border-accent/20 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Context Detected</h4>
            <p className="text-xs text-muted-foreground">
              Identified as <Badge variant="secondary" className="ml-1 font-semibold">{getIntentDisplayName(intent)}</Badge>
            </p>
          </div>
        </div>
      </div>

      {/* XML Output Card */}
      <Card className="shadow-card hover:shadow-lifted transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Step 2: Structured XML Output</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Dynamically generated based on detected context
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative group">
            <pre className="code-block p-4 overflow-x-auto text-sm transition-all duration-300 group-hover:shadow-inner">
              <code>{xml}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
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
          </div>
          
          {onGenerateAI && (
            <Button 
              onClick={onGenerateAI} 
              className="w-full shadow-card hover:shadow-lifted transition-all"
              disabled={aiLoading}
            >
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
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card className="gradient-card shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm">💡</span>
            </div>
            Why This Structure?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default XMLDisplay;
