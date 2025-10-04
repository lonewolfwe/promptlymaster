import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText } from "lucide-react";
import { getIntentDisplayName } from "@/lib/xmlGenerator";
import { useToast } from "@/hooks/use-toast";

interface Prompt {
  id: string;
  title: string;
  intent_type: string;
  created_at: string;
  plain_text: string;
  xml_output: string;
  explanation: string;
  ai_response: string | null;
}

interface PromptHistoryProps {
  onSelectPrompt: (prompt: Prompt) => void;
  refreshTrigger?: number;
}

const PromptHistory = ({ onSelectPrompt, refreshTrigger }: PromptHistoryProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
  }, [refreshTrigger]);

  const fetchPrompts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load prompt history",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Prompts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No prompts yet. Create your first one!</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => onSelectPrompt(prompt)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="font-medium text-sm truncate">{prompt.title}</span>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {getIntentDisplayName(prompt.intent_type as any)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(prompt.created_at).toLocaleDateString()} at{" "}
                    {new Date(prompt.created_at).toLocaleTimeString()}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptHistory;
