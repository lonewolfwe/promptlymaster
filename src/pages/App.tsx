import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Home, Sparkles } from "lucide-react";
import PromptInput from "@/components/PromptInput";
import AIResponse from "@/components/AIResponse";
import PromptHistory from "@/components/PromptHistory";
import IntentDetectionVisualizer from "@/components/IntentDetectionVisualizer";
import EnhancedXMLDisplay from "@/components/EnhancedXMLDisplay";
import ParallaxHero from "@/components/ParallaxHero";
import WorkflowSteps from "@/components/WorkflowSteps";
import { detectIntent, generateXML, type IntentType, type IntentDetectionResult } from "@/lib/xmlGenerator";

const AppPage = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentXML, setCurrentXML] = useState<string>("");
  const [currentExplanation, setCurrentExplanation] = useState<string>("");
  const [currentDetection, setCurrentDetection] = useState<IntentDetectionResult | null>(null);
  const [currentPlainText, setCurrentPlainText] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [workflowStep, setWorkflowStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async (plainText: string) => {
    setLoading(true);
    setAiResponse("");
    setWorkflowStep(1);
    
    try {
      // Step 1: Input received
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 2: Detect intent
      setWorkflowStep(2);
      const detection = detectIntent(plainText);
      setCurrentDetection(detection);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Generate XML
      setWorkflowStep(3);
      const template = generateXML(plainText, detection.intent);
      
      setCurrentXML(template.xml);
      setCurrentExplanation(template.explanation);
      setCurrentPlainText(plainText);

      const title = plainText.length > 50 
        ? plainText.substring(0, 47) + "..." 
        : plainText;

      // Store in localStorage
      const historyItem = {
        id: Date.now().toString(),
        title,
        plain_text: plainText,
        xml_output: template.xml,
        explanation: template.explanation,
        intent_type: detection.intent,
        created_at: new Date().toISOString(),
        ai_response: null
      };

      const existingHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
      const updatedHistory = [historyItem, ...existingHistory].slice(0, 10);
      localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));

      toast({
        title: "XML Generated!",
        description: "Your structured prompt is ready.",
      });

      setRefreshHistory(prev => prev + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate XML",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIntentOverride = (newIntent: string) => {
    if (!currentPlainText) return;
    
    const template = generateXML(currentPlainText, newIntent as IntentType);
    const detection = detectIntent(currentPlainText);
    
    setCurrentXML(template.xml);
    setCurrentExplanation(template.explanation);
    setCurrentDetection({
      ...detection,
      intent: newIntent as IntentType,
    });

    toast({
      title: "Template Updated",
      description: `Switched to ${newIntent} template`,
    });
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: { xml_prompt: currentXML }
      });

      if (error) throw error;

      setAiResponse(data.response);

      // Update localStorage with AI response
      const existingHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
      const updatedHistory = existingHistory.map((item: any) => {
        if (item.plain_text === currentPlainText && !item.ai_response) {
          return { ...item, ai_response: data.response };
        }
        return item;
      });
      localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));

      toast({
        title: "AI Response Generated!",
        description: "The AI has responded to your structured prompt.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI response",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: any) => {
    setCurrentXML(prompt.xml_output);
    setCurrentExplanation(prompt.explanation);
    setCurrentPlainText(prompt.plain_text);
    setAiResponse(prompt.ai_response || "");
    
    // Recreate detection result
    const detection = detectIntent(prompt.plain_text);
    setCurrentDetection(detection);
    setWorkflowStep(3);
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <header className="border-b bg-card/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Promptly
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Parallax Hero */}
        <ParallaxHero />

        {/* Workflow Header */}
        <div className="mb-8 text-center space-y-2 animate-in fade-in duration-700">
          <h2 className="text-3xl font-bold">Transform Your Prompts</h2>
          <p className="text-muted-foreground text-lg">
            Intelligent context detection • Dynamic XML generation • Better AI results
          </p>
        </div>

        {/* Workflow Steps Indicator */}
        {workflowStep > 0 && (
          <WorkflowSteps 
            currentStep={workflowStep} 
            intent={currentDetection?.intent}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="bg-card rounded-xl border p-6 shadow-card hover:shadow-lifted transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Step 1: Enter Your Prompt</h3>
                <p className="text-sm text-muted-foreground">
                  Write naturally - our AI will detect the context automatically
                </p>
              </div>
              <PromptInput onGenerate={handleGenerate} loading={loading} />
            </div>

            {/* Output Section */}
            {currentDetection && (
              <>
                {/* Intent Detection */}
                <div className="space-y-6">
                  <IntentDetectionVisualizer
                    detection={currentDetection}
                    onOverride={handleIntentOverride}
                  />
                  
                  {/* XML Display */}
                  <EnhancedXMLDisplay
                    xml={currentXML}
                    explanation={currentExplanation}
                    onGenerateAI={handleGenerateAI}
                    aiLoading={aiLoading}
                  />
                </div>
                
                {/* AI Response */}
                {aiResponse && (
                  <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-primary to-accent rounded-full opacity-50"></div>
                    <AIResponse response={aiResponse} />
                  </div>
                )}
              </>
            )}

            {!currentXML && (
              <div className="bg-card/50 rounded-xl border-2 border-dashed p-12 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
                  Ready to Transform Your Prompts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter a prompt above to see intelligent context detection and XML generation in action
                </p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <PromptHistory 
              onSelectPrompt={handleSelectPrompt}
              refreshTrigger={refreshHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppPage;
