import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Sparkles } from "lucide-react";
import { getIntentDisplayName } from "@/lib/xmlGenerator";
import PromptInput from "@/components/PromptInput";
import XMLDisplay from "@/components/XMLDisplay";
import AIResponse from "@/components/AIResponse";
import PromptHistory from "@/components/PromptHistory";
import { detectIntent, generateXML, type IntentType } from "@/lib/xmlGenerator";

const AppPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentXML, setCurrentXML] = useState<string>("");
  const [currentExplanation, setCurrentExplanation] = useState<string>("");
  const [currentIntent, setCurrentIntent] = useState<IntentType>("general");
  const [currentPlainText, setCurrentPlainText] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [refreshHistory, setRefreshHistory] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGenerate = async (plainText: string) => {
    setLoading(true);
    setAiResponse("");
    
    try {
      const intent = detectIntent(plainText);
      const template = generateXML(plainText, intent);
      
      setCurrentXML(template.xml);
      setCurrentExplanation(template.explanation);
      setCurrentIntent(template.intent);
      setCurrentPlainText(plainText);

      const title = plainText.length > 50 
        ? plainText.substring(0, 47) + "..." 
        : plainText;

      const { error } = await supabase.from('prompts').insert({
        user_id: user.id,
        title,
        plain_text: plainText,
        xml_output: template.xml,
        explanation: template.explanation,
        intent_type: intent,
      });

      if (error) throw error;

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

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: { xml_prompt: currentXML }
      });

      if (error) throw error;

      setAiResponse(data.response);

      const { error: updateError } = await supabase
        .from('prompts')
        .update({ ai_response: data.response })
        .eq('plain_text', currentPlainText)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

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
    setCurrentIntent(prompt.intent_type);
    setCurrentPlainText(prompt.plain_text);
    setAiResponse(prompt.ai_response || "");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Workflow Header */}
        <div className="mb-8 text-center space-y-2 animate-in fade-in duration-700">
          <h2 className="text-3xl font-bold">Transform Your Prompts</h2>
          <p className="text-muted-foreground text-lg">
            Our AI automatically detects context and generates optimized XML structures
          </p>
        </div>

        {/* Workflow Steps Indicator */}
        {currentXML && (
          <div className="mb-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-3 shadow-card flex-1">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Input Received</p>
                  <p className="text-xs text-muted-foreground">Plain English</p>
                </div>
              </div>
              
              <div className="h-px w-8 bg-border"></div>
              
              <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-3 shadow-card flex-1">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Context Detected</p>
                  <p className="text-xs text-muted-foreground">{getIntentDisplayName(currentIntent)}</p>
                </div>
              </div>
              
              <div className="h-px w-8 bg-border"></div>
              
              <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-3 shadow-card flex-1">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">XML Generated</p>
                  <p className="text-xs text-muted-foreground">Structured Output</p>
                </div>
              </div>
            </div>
          </div>
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
            {currentXML && (
              <>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary rounded-full opacity-50"></div>
                  <XMLDisplay
                    xml={currentXML}
                    explanation={currentExplanation}
                    intent={currentIntent}
                    onGenerateAI={handleGenerateAI}
                    aiLoading={aiLoading}
                  />
                </div>
                
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
