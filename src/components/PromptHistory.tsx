import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Clock } from "lucide-react";
import { format } from "date-fns";
import { getIntentDisplayName } from "@/lib/xmlGenerator";

interface Prompt {
  id: string;
  title: string;
  intent_type: string;
  created_at: string;
  plain_text: string;
  xml_output: string;
  explanation: string;
  ai_response?: string | null;
}

interface PromptHistoryProps {
  onSelectPrompt: (prompt: Prompt) => void;
  refreshTrigger?: number;
}

const PromptHistory = ({ onSelectPrompt, refreshTrigger }: PromptHistoryProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, [refreshTrigger]);

  const fetchPrompts = () => {
    try {
      const historyData = localStorage.getItem('promptHistory');
      const history = historyData ? JSON.parse(historyData) : [];
      setPrompts(history);
    } catch (error) {
      console.error('Error fetching prompt history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Prompts
          </CardTitle>
          <CardDescription>Loading your history...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-card hover:shadow-lifted transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Prompts
        </CardTitle>
        <CardDescription>
          Your last {prompts.length} prompts (stored locally)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No prompts yet</p>
            <p className="text-xs">Your history will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-start hover:bg-accent/50 hover:border-primary/50 transition-all duration-200"
                  onClick={() => onSelectPrompt(prompt)}
                >
                  <div className="w-full">
                    <p className="font-medium text-left line-clamp-2 mb-2">
                      {prompt.title}
                    </p>
                    <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {getIntentDisplayName(prompt.intent_type as any)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(prompt.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptHistory;
