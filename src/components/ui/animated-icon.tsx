"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  animate?: "bounce" | "pulse" | "spin" | "scale" | "shake" | "float" | "glow" | "none";
  delay?: number;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
}

export function AnimatedIcon({
  icon: Icon,
  className = "",
  size = 20,
  animate = "none",
  delay = 0,
  onClick,
  isActive = false,
  disabled = false,
  title
}: AnimatedIconProps) {
  const baseClasses = `transition-colors duration-200 ${className}`;
  
  const iconElement = (
    <Icon 
      size={size} 
      className={`${isActive ? 'text-primary' : ''} ${disabled ? 'opacity-50' : ''}`}
    />
  );

  if (animate === "none" && !onClick) {
    return (
      <div className={baseClasses} title={title}>
        {iconElement}
      </div>
    );
  }

  // Create animation props based on the animate type
  const getAnimationProps = () => {
    if (animate === "none") return {};
    
    switch (animate) {
      case "bounce":
        return {
          animate: {
            y: [0, -8, 0],
          },
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut"
          }
        };
      case "pulse":
        return {
          animate: {
            scale: [1, 1.1, 1],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case "spin":
        return {
          animate: {
            rotate: [0, 360],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }
        };
      case "scale":
        return {
          animate: {
            scale: [1, 1.2, 1],
          },
          transition: {
            duration: 0.3,
            ease: "easeInOut"
          }
        };
      case "shake":
        return {
          animate: {
            x: [0, -2, 2, -2, 2, 0],
          },
          transition: {
            duration: 0.4,
            ease: "easeInOut"
          }
        };
      case "float":
        return {
          animate: {
            y: [0, -6, 0],
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case "glow":
        return {
          animate: {
            filter: [
              "drop-shadow(0 0 0px hsl(var(--primary)))",
              "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))",
              "drop-shadow(0 0 0px hsl(var(--primary)))"
            ],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      default:
        return {};
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''}`}
      {...animationProps}
      whileHover={onClick && !disabled ? { scale: 1.1 } : undefined}
      whileTap={onClick && !disabled ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        ...animationProps.animate
      }}
      transition={{ 
        opacity: { duration: 0.3, delay },
        scale: { duration: 0.3, delay }
      }}
      onClick={disabled ? undefined : onClick}
      title={title}
    >
      {iconElement}
    </motion.div>
  );
}

// Specific animated icon components for common use cases
export function LoadingIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <AnimatedIcon
      icon={Loader2}
      className={className}
      size={size}
      animate="spin"
    />
  );
}

export function TypingIcon({ className = "", size = 16 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <motion.div
        className="w-1 h-1 bg-primary rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0
        }}
      />
      <motion.div
        className="w-1 h-1 bg-primary rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.2
        }}
      />
      <motion.div
        className="w-1 h-1 bg-primary rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.4
        }}
      />
    </div>
  );
}

export function SendingIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        x: [0, 20, 0],
        opacity: [1, 0.3, 1]
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity
      }}
    >
      <AnimatedIcon
        icon={Send}
        size={size}
        animate="glow"
      />
    </motion.div>
  );
}

// Success feedback icon with celebration animation
export function SuccessIcon({ className = "", size = 20, onComplete }: { 
  className?: string; 
  size?: number;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 10
      }}
      onAnimationComplete={onComplete}
    >
      <AnimatedIcon
        icon={CheckCircle}
        size={size}
        className="text-green-500"
        animate="pulse"
      />
    </motion.div>
  );
}

// Error feedback icon with shake animation
export function ErrorIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <AnimatedIcon
      icon={AlertCircle}
      className={`text-destructive ${className}`}
      size={size}
      animate="shake"
    />
  );
}
