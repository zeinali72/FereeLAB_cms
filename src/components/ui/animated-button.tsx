"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { AnimatedIcon } from "./animated-icon";

interface AnimatedButtonProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconAnimation?: "bounce" | "pulse" | "spin" | "scale" | "shake" | "float" | "glow" | "none";
  variant?: "default" | "primary" | "secondary" | "ghost" | "minimal" | "glass";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  ripple?: boolean;
  glow?: boolean;
  lift?: boolean;
}

const variants = {
  default: "btn-flat hover-lift",
  primary: "btn-raised btn-ripple hover-glow",
  secondary: "btn-flat hover-lift",
  ghost: "btn-ghost hover-lift",
  minimal: "btn-minimal hover-lift",
  glass: "glass-medium rounded-xl hover-lift hover-glow"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

const motionVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02 }
};

export function AnimatedButton({
  children,
  icon,
  iconPosition = "left",
  iconAnimation = "none",
  variant = "default",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  title,
  ripple = false,
  glow = false,
  lift = true
}: AnimatedButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
    ${variants[variant]}
    ${sizes[size]}
    ${lift && !disabled ? 'hover-lift' : ''}
    ${glow && !disabled ? 'hover-glow' : ''}
    ${ripple && !disabled ? 'btn-ripple' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const iconElement = icon ? (
    <AnimatedIcon
      icon={icon}
      size={size === "sm" ? 16 : size === "lg" ? 20 : 18}
      animate={loading ? "spin" : iconAnimation}
      disabled={disabled}
    />
  ) : null;

  const content = (
    <>
      {iconPosition === "left" && iconElement}
      {children && <span>{children}</span>}
      {iconPosition === "right" && iconElement}
    </>
  );

  if (disabled || !onClick) {
    return (
      <div className={baseClasses} title={title}>
        {content}
      </div>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      whileHover={!disabled && !loading ? motionVariants.hover : undefined}
      whileTap={!disabled && !loading ? motionVariants.tap : undefined}
      animate={loading ? { scale: [1, 1.05, 1] } : { opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      transition={loading ? { 
        duration: 1, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } : { 
        duration: 0.3, 
        ease: "easeOut" 
      }}
    >
      {content}
    </motion.button>
  );
}

// Specialized button variants
export function PrimaryButton(props: Omit<AnimatedButtonProps, "variant">) {
  return <AnimatedButton {...props} variant="primary" ripple glow />;
}

export function SecondaryButton(props: Omit<AnimatedButtonProps, "variant">) {
  return <AnimatedButton {...props} variant="secondary" />;
}

export function GhostButton(props: Omit<AnimatedButtonProps, "variant">) {
  return <AnimatedButton {...props} variant="ghost" />;
}

export function MinimalButton(props: Omit<AnimatedButtonProps, "variant">) {
  return <AnimatedButton {...props} variant="minimal" />;
}

export function GlassButton(props: Omit<AnimatedButtonProps, "variant">) {
  return <AnimatedButton {...props} variant="glass" glow />;
}
