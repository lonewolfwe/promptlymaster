import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AIResponseProps {
  response: string;
}

const AIResponse = ({ response }: AIResponseProps) => {
  return (
    <Card className="shadow-card animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Response</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="leading-relaxed whitespace-pre-wrap">{response}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
