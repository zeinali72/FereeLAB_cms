/**
 * Centralized Animation Configuration
 * Standardizes all animation variants, timings, and easings across the application
 */

// Standard easing curves for consistent feel
export const EASING = {
  smooth: [0.16, 1, 0.3, 1], // Smooth entrance/exit
  gentle: [0.25, 0.46, 0.45, 0.94], // Gentle interactions
  snappy: [0.4, 0, 0.2, 1], // Quick responses
  bounce: [0.68, -0.55, 0.265, 1.55], // Playful bounces
} as const;

// Standard durations for different types of animations
export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  typing: 0.05, // Per character for typing effect
} as const;

// Standard delays for staggered animations
export const DELAY = {
  none: 0,
  short: 0.05,
  medium: 0.1,
  long: 0.2,
} as const;

/**
 * Standard Chat Message Animation
 * Single, consistent animation for all chat messages (user and bot)
 */
export const CHAT_MESSAGE_ANIMATION = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  transition: {
    duration: DURATION.normal,
    ease: EASING.smooth,
    delay: DELAY.short,
  },
} as const;

/**
 * Standard Avatar Animation
 * Consistent avatar entrance for both user and bot
 */
export const AVATAR_ANIMATION = {
  initial: {
    scale: 0,
    rotate: -90,
  },
  animate: {
    scale: 1,
    rotate: 0,
  },
  transition: {
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: DELAY.medium,
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
} as const;

/**
 * Standard Message Bubble Animation
 * Consistent message bubble entrance
 */
export const MESSAGE_BUBBLE_ANIMATION = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 25,
    delay: DELAY.long,
  },
  hover: {
    scale: 1.01,
  },
} as const;

/**
 * Standard Typing Animation
 * Consistent typing effect for bot messages
 */
export const TYPING_ANIMATION = {
  cursor: {
    animate: {
      opacity: [1, 0.3, 1],
    },
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  typingSpeed: DURATION.typing * 1000, // Convert to milliseconds
} as const;

/**
 * Standard Control Panel Animation
 * Consistent animation for message controls (copy, edit, etc.)
 */
export const CONTROL_PANEL_ANIMATION = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
  transition: {
    duration: DURATION.fast,
    ease: EASING.gentle,
  },
} as const;

/**
 * Standard List Animation (for chat log)
 * Staggered entrance for multiple messages
 */
export const CHAT_LOG_ANIMATION = {
  container: {
    initial: "hidden",
    animate: "visible",
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: DELAY.short,
        },
      },
    },
  },
  item: {
    variants: {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: DURATION.normal,
          ease: EASING.smooth,
        },
      },
    },
  },
} as const;

/**
 * Standard UI Component Animations
 * For notifications, loading states, etc.
 */
export const UI_ANIMATION = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.normal, ease: EASING.gentle },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: DURATION.normal, ease: EASING.smooth },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: DURATION.fast, ease: EASING.gentle },
  },
} as const;

/**
 * Performance-optimized animation settings
 * Ensures animations are smooth on all devices
 */
export const PERFORMANCE = {
  // Reduce motion for users who prefer less animation
  respectReducedMotion: true,
  // Use transform instead of layout properties for better performance
  useGPUAcceleration: true,
  // Optimize for 60fps
  frameRate: 60,
} as const;

/**
 * Utility function to get reduced motion variants
 */
export const getReducedMotionVariant = (fullAnimation: typeof CHAT_MESSAGE_ANIMATION) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: DURATION.fast },
    };
  }
  return fullAnimation;
};

/**
 * Type definitions for consistent usage
 */
export type AnimationVariant = typeof CHAT_MESSAGE_ANIMATION;
export type EasingType = keyof typeof EASING;
export type DurationType = keyof typeof DURATION;
export type DelayType = keyof typeof DELAY;