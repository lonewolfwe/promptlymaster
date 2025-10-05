import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Code2, Zap, Shield, ArrowRight, CheckCircle2, Brain, Target, FileCode, History } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with 3D Interactive Elements */}
      <section className="gradient-hero min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float"
            style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed"
            style={{ transform: `translate(${-parallaxX}px, ${-parallaxY}px)` }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-medium">Context Engineering Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Reduce AI Hallucinations
                <br />
                <span className="text-primary-glow">Get Clearer Outputs</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Structure your prompts with context automatically. No technical knowledge required. 
                Just better, more detailed AI responses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lifted group"
                >
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-white/80">No XML knowledge needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-white/80">Instant results</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Interactive Demo Panel */}
            <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
              <div 
                className="floating-3d relative"
                style={{ 
                  transform: `perspective(1000px) rotateY(${parallaxX * 0.5}deg) rotateX(${-parallaxY * 0.5}deg)` 
                }}
              >
                {/* Mock Dual Panel */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lifted overflow-hidden border border-white/20">
                  {/* Before Panel */}
                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-sm font-medium text-muted-foreground">Before: Plain Prompt</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground/70">
                      Summarize this article about climate change
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground italic">
                      ❌ Vague, potentially inaccurate responses
                    </div>
                  </div>

                  {/* After Panel */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-accent"></div>
                      <span className="text-sm font-medium text-accent">After: Structured with Context</span>
                    </div>
                    <div className="code-block p-4 text-xs font-mono overflow-x-auto">
                      <div className="text-primary">&lt;context_engineering&gt;</div>
                      <div className="pl-4 text-foreground/80">&lt;task&gt;summarization&lt;/task&gt;</div>
                      <div className="pl-4 text-foreground/80">&lt;content&gt;article&lt;/content&gt;</div>
                      <div className="pl-4 text-foreground/80">&lt;output_format&gt;concise&lt;/output_format&gt;</div>
                      <div className="text-primary">&lt;/context_engineering&gt;</div>
                    </div>
                    <div className="mt-3 text-xs text-accent font-medium">
                      ✓ Clear, detailed, hallucination-free responses
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -right-4 -top-4 bg-accent text-white px-4 py-2 rounded-full shadow-glow text-sm font-semibold animate-float">
                  Auto-detected
                </div>
                <div className="absolute -left-4 -bottom-4 bg-primary text-white px-4 py-2 rounded-full shadow-glow text-sm font-semibold animate-float-delayed">
                  AI-Powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 gradient-subtle">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your prompts in 3 simple steps with AI-powered context engineering
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Type Your Prompt",
                description: "Write in plain English, just like you normally would. No technical jargon required.",
                color: "text-primary"
              },
              {
                icon: Target,
                title: "Auto-Detect Intent",
                description: "Our AI instantly recognizes your goal and selects the perfect XML template structure.",
                color: "text-accent"
              },
              {
                icon: Sparkles,
                title: "Get Better Results",
                description: "Receive structured prompts that reduce hallucinations and produce clearer, more detailed AI outputs.",
                color: "text-primary"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="floating-3d bg-card rounded-2xl p-8 shadow-card hover:shadow-lifted transition-all duration-300 border border-border/50 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-card flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -left-2 w-12 h-12 bg-primary/10 rounded-full blur-xl"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary/20">0{index + 1}</span>
                    <h3 className="text-xl font-semibold text-card-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Interactive Cards */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to engineer better prompts and reduce AI hallucinations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Code2,
                title: "Auto-Detect Templates",
                description: "AI recognizes your intent and applies the perfect XML structure automatically"
              },
              {
                icon: FileCode,
                title: "Dual-View Display",
                description: "See both structured XML and friendly explanations side-by-side"
              },
              {
                icon: Zap,
                title: "Instant AI Integration",
                description: "Generate responses directly from structured prompts with one click"
              },
              {
                icon: History,
                title: "Prompt History",
                description: "Access and reuse your previous prompts anytime, saved securely"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your prompts are encrypted and only accessible to you"
              },
              {
                icon: Brain,
                title: "Smart Context",
                description: "Automatically adds context to reduce ambiguity and hallucinations"
              },
              {
                icon: Target,
                title: "Precision Output",
                description: "Get more accurate, detailed, and relevant AI responses"
              },
              {
                icon: Sparkles,
                title: "No Code Needed",
                description: "No technical knowledge required - works for everyone"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="floating-3d bg-card rounded-xl p-6 shadow-card hover:shadow-lifted transition-all duration-300 border border-border/50 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison Section */}
      <section className="py-24 px-4 gradient-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              See The Difference
            </h2>
            <p className="text-xl text-muted-foreground">
              Context engineering dramatically improves AI response quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-card rounded-2xl p-8 shadow-card border-2 border-destructive/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">Without Promptly</h3>
                  <p className="text-sm text-muted-foreground">Plain prompts = vague results</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Generic, surface-level responses",
                  "Frequent hallucinations and inaccuracies",
                  "Missing important context",
                  "Inconsistent output quality",
                  "Wasted time re-prompting"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✗</span>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-card rounded-2xl p-8 shadow-lifted border-2 border-accent/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">With Promptly</h3>
                  <p className="text-sm text-accent font-medium">Structured prompts = clear results</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Detailed, comprehensive responses",
                  "Drastically reduced hallucinations",
                  "Rich context automatically added",
                  "Consistently high-quality outputs",
                  "Faster, more productive workflow"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-card-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-glow/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Ready to Reduce AI Hallucinations?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Join productivity-focused professionals who get clearer, more accurate AI responses with structured prompts
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-12 py-6 bg-white text-primary hover:bg-white/90 shadow-lifted group"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Start Building Better Prompts
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Setup in 60 seconds</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
