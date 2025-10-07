import { useState } from "react";
import { motion } from "framer-motion";
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
  const [isFocused, setIsFocused] = useState(false);

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
        <motion.div
          animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Textarea
            id="prompt-input"
            placeholder="Example: Summarize the key points of quantum computing in simple terms..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`min-h-[150px] resize-none transition-all duration-300 ${
              isFocused ? "border-accent shadow-lg" : ""
            }`}
            disabled={loading}
          />
        </motion.div>
      </div>
      <motion.div
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        <Button 
          type="submit" 
          className="w-full relative overflow-hidden group" 
          disabled={!text.trim() || loading}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
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
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Context...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate XML
              </>
            )}
          </span>
        </Button>
      </motion.div>
    </form>
  );
};

export default PromptInput;
