import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2 } from "lucide-react";

interface PromptInputProps {
  onGenerate: (text: string) => void;
  loading?: boolean;
}

const PromptInput = ({ onGenerate, loading }: PromptInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt-input">Enter your prompt in plain English</Label>
        <Textarea
          id="prompt-input"
          placeholder="Example: Summarize the key points of quantum computing in simple terms..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[150px] resize-none"
          disabled={loading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!text.trim() || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate XML
          </>
        )}
      </Button>
    </form>
  );
};

export default PromptInput;
