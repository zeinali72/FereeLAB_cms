"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Heart, 
  Star, 
  Zap, 
  Download,
  Upload,
  Play,
  Pause,
  MessageCircle,
  Settings,
  Bell,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  AnimatedIcon, 
  LoadingIcon, 
  TypingIcon, 
  SendingIcon, 
  SuccessIcon, 
  ErrorIcon 
} from "../ui/animated-icon";
import { 
  AnimatedButton, 
  PrimaryButton, 
  SecondaryButton, 
  GhostButton, 
  MinimalButton, 
  GlassButton 
} from "../ui/animated-button";
import { 
  GradientOverlay, 
  AnimatedPattern, 
  ModernCard, 
  RevealText, 
  StaggeredList, 
  InteractiveCard, 
  PulseIndicator, 
  PageTransition 
} from "../ui/visual-effects";

export function AnimationShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <PageTransition className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <RevealText>
            <h1 className="text-4xl font-bold text-heading flex items-center justify-center gap-3">
              <AnimatedIcon 
                icon={Sparkles} 
                size={40} 
                animate="glow" 
                className="text-primary" 
              />
              Animation Showcase
              <AnimatedIcon 
                icon={Sparkles} 
                size={40} 
                animate="float" 
                className="text-accent" 
              />
            </h1>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Demonstrating animated icons, buttons, and visual effects
            </p>
          </RevealText>
        </div>

        {/* Animated Icons Section */}
        <ModernCard className="p-8" variant="glass" gradient>
          <h2 className="text-2xl font-semibold mb-6 text-heading">Animated Icons</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="text-center space-y-2">
              <AnimatedIcon icon={Heart} animate="pulse" className="text-red-500 mx-auto" />
              <p className="text-sm text-muted-foreground">Pulse</p>
            </div>
            
            <div className="text-center space-y-2">
              <AnimatedIcon icon={Star} animate="bounce" className="text-yellow-500 mx-auto" />
              <p className="text-sm text-muted-foreground">Bounce</p>
            </div>
            
            <div className="text-center space-y-2">
              <AnimatedIcon icon={Zap} animate="glow" className="text-purple-500 mx-auto" />
              <p className="text-sm text-muted-foreground">Glow</p>
            </div>
            
            <div className="text-center space-y-2">
              <AnimatedIcon icon={MessageCircle} animate="float" className="text-blue-500 mx-auto" />
              <p className="text-sm text-muted-foreground">Float</p>
            </div>
            
            <div className="text-center space-y-2">
              <AnimatedIcon icon={Bell} animate="shake" className="text-orange-500 mx-auto" />
              <p className="text-sm text-muted-foreground">Shake</p>
            </div>
            
            <div className="text-center space-y-2">
              <LoadingIcon className="text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Spin</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">Special Animations</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <TypingIcon />
                <span className="text-sm">Typing indicator</span>
              </div>
              
              <div className="flex items-center gap-2">
                <SendingIcon />
                <span className="text-sm">Sending animation</span>
              </div>
              
              <button
                onClick={() => setShowSuccess(!showSuccess)}
                className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors"
              >
                {showSuccess ? (
                  <SuccessIcon onComplete={() => setShowSuccess(false)} />
                ) : (
                  <span>Show success ✓</span>
                )}
              </button>
              
              <button
                onClick={() => setShowError(!showError)}
                className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
              >
                {showError ? (
                  <ErrorIcon />
                ) : (
                  <span>Show error ⚠</span>
                )}
              </button>
            </div>
          </div>
        </ModernCard>

        {/* Animated Buttons Section */}
        <ModernCard className="p-8" variant="elevated" glow>
          <h2 className="text-2xl font-semibold mb-6 text-heading">Animated Buttons</h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <PrimaryButton 
                  icon={Send} 
                  iconAnimation="glow"
                  onClick={() => console.log("Primary clicked")}
                >
                  Primary Button
                </PrimaryButton>
                
                <SecondaryButton 
                  icon={Download} 
                  iconAnimation="bounce"
                  onClick={() => console.log("Secondary clicked")}
                >
                  Secondary Button
                </SecondaryButton>
                
                <GhostButton 
                  icon={Upload} 
                  iconAnimation="float"
                  onClick={() => console.log("Ghost clicked")}
                >
                  Ghost Button
                </GhostButton>
                
                <GlassButton 
                  icon={Settings} 
                  iconAnimation="pulse"
                  onClick={() => console.log("Glass clicked")}
                >
                  Glass Button
                </GlassButton>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Interactive States</h3>
              <div className="flex flex-wrap gap-4">
                <PrimaryButton 
                  icon={isPlaying ? Pause : Play}
                  iconAnimation={isPlaying ? "pulse" : "bounce"}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "Pause" : "Play"}
                </PrimaryButton>
                
                <PrimaryButton 
                  loading
                  disabled
                  className="min-w-[140px]"
                >
                  Loading...
                </PrimaryButton>
                
                <MinimalButton 
                  icon={Search} 
                  iconAnimation="glow"
                  title="Search"
                />
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Visual Effects Section */}
        <ModernCard className="p-8" variant="floating" hover>
          <h2 className="text-2xl font-semibold mb-6 text-heading">Visual Effects</h2>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Gradient Overlays</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GradientOverlay variant="aurora" className="p-6 rounded-xl border border-border/50">
                  <p className="text-center">Aurora</p>
                </GradientOverlay>
                <GradientOverlay variant="sunset" className="p-6 rounded-xl border border-border/50">
                  <p className="text-center">Sunset</p>
                </GradientOverlay>
                <GradientOverlay variant="ocean" className="p-6 rounded-xl border border-border/50">
                  <p className="text-center">Ocean</p>
                </GradientOverlay>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Animated Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative h-32 rounded-xl border border-border/50 overflow-hidden">
                  <AnimatedPattern pattern="dots" />
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <p>Animated Dots</p>
                  </div>
                </div>
                <div className="relative h-32 rounded-xl border border-border/50 overflow-hidden">
                  <AnimatedPattern pattern="particles" />
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <p>Floating Particles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interactive Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InteractiveCard className="p-6 bg-card border border-border rounded-xl">
                  <h4 className="font-semibold mb-2">Hover Effects</h4>
                  <p className="text-sm text-muted-foreground">
                    This card has tilt and glow effects on hover
                  </p>
                </InteractiveCard>
                <InteractiveCard 
                  className="p-6 bg-card border border-border rounded-xl"
                  tilt={false}
                >
                  <h4 className="font-semibold mb-2">Scale Only</h4>
                  <p className="text-sm text-muted-foreground">
                    This card only scales on hover
                  </p>
                </InteractiveCard>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status Indicators</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <PulseIndicator color="success" />
                  <span className="text-sm">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <PulseIndicator color="warning" />
                  <span className="text-sm">Away</span>
                </div>
                <div className="flex items-center gap-2">
                  <PulseIndicator color="error" />
                  <span className="text-sm">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <PulseIndicator color="primary" size="lg" />
                  <span className="text-sm">Recording</span>
                </div>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Staggered Animation List */}
        <ModernCard className="p-8" variant="glass">
          <h2 className="text-2xl font-semibold mb-6 text-heading">Staggered Animations</h2>
          
          <StaggeredList className="space-y-4">
            {[
              "First item appears",
              "Then the second item",
              "Followed by the third",
              "And finally this one",
              "All with smooth staggered timing"
            ].map((text, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                <p>{text}</p>
              </div>
            ))}
          </StaggeredList>
        </ModernCard>

        {/* Text Reveal Animation */}
        <ModernCard className="p-8 text-center" variant="elevated">
          <RevealText direction="up">
            <h2 className="text-3xl font-bold text-heading mb-4">
              Smooth Text Reveal
            </h2>
          </RevealText>
          <RevealText direction="left" delay={0.3}>
            <p className="text-lg text-muted-foreground">
              Text can animate in from different directions
            </p>
          </RevealText>
        </ModernCard>

      </div>
    </PageTransition>
  );
}
