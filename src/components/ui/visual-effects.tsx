"use client";

import React from "react";
import { motion } from "framer-motion";

// Enhanced gradient backgrounds for modern visual appeal
export function GradientOverlay({ 
  variant = "subtle", 
  className = "",
  children 
}: {
  variant?: "subtle" | "medium" | "strong" | "aurora" | "sunset" | "ocean";
  className?: string;
  children?: React.ReactNode;
}) {
  const gradients = {
    subtle: "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
    medium: "bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10",
    strong: "bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20",
    aurora: "bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-pink-500/20",
    sunset: "bg-gradient-to-br from-orange-500/20 via-red-500/10 to-pink-500/20",
    ocean: "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20"
  };

  return (
    <div className={`${gradients[variant]} ${className}`}>
      {children}
    </div>
  );
}

// Animated background patterns
export function AnimatedPattern({ 
  pattern = "dots",
  className = ""
}: {
  pattern?: "dots" | "grid" | "waves" | "particles";
  className?: string;
}) {
  switch (pattern) {
    case "dots":
      return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px"
            }}
            animate={{
              backgroundPosition: ["0px 0px", "20px 20px"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      );
    
    case "grid":
      return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px"
            }}
            animate={{
              backgroundPosition: ["0px 0px", "40px 40px"],
            }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      );

    case "waves":
      return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                hsl(var(--primary)),
                hsl(var(--primary)) 2px,
                transparent 2px,
                transparent 20px
              )`
            }}
            animate={{
              backgroundPosition: ["0px 0px", "20px 20px"],
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      );

    case "particles":
      return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}

// Enhanced card component with modern glass effect
export function ModernCard({
  children,
  className = "",
  variant = "glass",
  hover = true,
  glow = false,
  gradient = false
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "elevated" | "flat" | "floating";
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}) {
  const variants = {
    glass: "glass-medium backdrop-blur-xl",
    elevated: "surface-elevated",
    flat: "surface-flat",
    floating: "surface-floating"
  };

  return (
    <motion.div
      className={`
        relative rounded-2xl border border-border/50 transition-all duration-300
        ${variants[variant]}
        ${hover ? 'hover-lift' : ''}
        ${glow ? 'hover-glow' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? { y: -2 } : undefined}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Smooth reveal animation for content
export function RevealText({
  children,
  delay = 0,
  direction = "up"
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: 20 },
    right: { y: 0, x: -20 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: 0
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger animation for lists
export function StaggeredList({
  children,
  staggerDelay = 0.1,
  className = ""
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Interactive hover card
export function InteractiveCard({
  children,
  className = "",
  tilt = true,
  glow = true,
  scale = true
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  scale?: boolean;
}) {
  return (
    <motion.div
      className={`
        relative rounded-xl overflow-hidden cursor-pointer
        ${glow ? 'hover-glow' : ''}
        ${className}
      `}
      whileHover={{
        ...(scale && { scale: 1.02 }),
        ...(tilt && { rotateX: 5, rotateY: 5 })
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for notifications/alerts
export function PulseIndicator({
  className = "",
  color = "primary",
  size = "md"
}: {
  className?: string;
  color?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}) {
  const colors = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`${sizes[size]} ${colors[color]} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className={`absolute inset-0 ${colors[color]} rounded-full opacity-30`}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Smooth page transition wrapper
export function PageTransition({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
