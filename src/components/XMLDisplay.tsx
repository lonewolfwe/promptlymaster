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
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">XML Output</CardTitle>
            <Badge variant="secondary">{getIntentDisplayName(intent)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="code-block p-4 overflow-x-auto text-sm">
              <code>{xml}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {onGenerateAI && (
            <Button 
              onClick={onGenerateAI} 
              className="w-full"
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

      <Card className="gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">What This Means</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default XMLDisplay;
