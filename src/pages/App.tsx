import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Promptly</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-card">
              <PromptInput onGenerate={handleGenerate} loading={loading} />
            </div>

            {currentXML && (
              <>
                <XMLDisplay
                  xml={currentXML}
                  explanation={currentExplanation}
                  intent={currentIntent}
                  onGenerateAI={handleGenerateAI}
                  aiLoading={aiLoading}
                />
                
                {aiResponse && <AIResponse response={aiResponse} />}
              </>
            )}
          </div>

          <div>
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
