import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const ParallaxHero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative h-[200px] mb-8 flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10 rounded-3xl"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
      />

      {/* Floating 3D Mock Panels */}
      <div className="relative w-full max-w-4xl mx-auto px-4" style={{ perspective: 1000 }}>
        <div className="flex items-center justify-center gap-8">
          {/* Input Panel Mock */}
          <motion.div
            className="relative w-64 h-32"
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-card to-accent/20 rounded-xl border-2 border-accent/30 shadow-2xl backdrop-blur-sm">
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs">✍️</div>
                  <div className="text-xs font-semibold">Plain English</div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-muted rounded-full w-full animate-pulse" />
                  <div className="h-2 bg-muted rounded-full w-4/5 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="h-2 bg-muted rounded-full w-3/5 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            animate={{
              x: [0, 10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-accent text-4xl"
          >
            →
          </motion.div>

          {/* XML Panel Mock */}
          <motion.div
            className="relative w-64 h-32"
            style={{
              rotateX: useTransform(rotateX, (v) => -v),
              rotateY: useTransform(rotateY, (v) => -v),
              transformPerspective: 1000,
            }}
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-card rounded-xl border-2 border-primary/30 shadow-2xl backdrop-blur-sm">
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs">📋</div>
                  <div className="text-xs font-semibold">Structured XML</div>
                </div>
                <div className="space-y-1 font-mono text-[10px] text-primary">
                  <div>&lt;task&gt;</div>
                  <div className="pl-3">&lt;instruction&gt;...</div>
                  <div className="pl-3">&lt;context&gt;...</div>
                  <div>&lt;/task&gt;</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ambient Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-accent/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxHero;