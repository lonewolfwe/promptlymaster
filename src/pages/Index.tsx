import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, Zap, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="gradient-hero min-h-[90vh] flex items-center justify-center px-4">
        <div className="container mx-auto text-center text-white space-y-8">
          <div className="space-y-4 animate-in fade-in duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Transform Plain Language
              <br />
              Into Structured AI Prompts
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              No XML knowledge required. Get better AI responses instantly with our intelligent prompt builder.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-1000">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Use promptlymaster?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Auto-Detection</h3>
              <p className="text-muted-foreground">
                Our AI automatically detects your intent and selects the perfect XML template
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Instant Results</h3>
              <p className="text-muted-foreground">
                Generate structured prompts and AI responses in seconds, not minutes
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your prompts are stored securely and only accessible to you
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 gradient-card">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Improve Your AI Interactions?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join users who are getting better, more accurate AI responses with structured prompts
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Building Prompts
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
