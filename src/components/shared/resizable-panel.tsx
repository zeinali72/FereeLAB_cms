"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Throttle function to limit how often a function is called
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

interface ResizablePanelProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  handleClassName?: string;
  onResize?: (size: number) => void;
  isOpen?: boolean;
  handlePosition?: 'right' | 'left' | 'top' | 'bottom';
}

// Reusable component for resizable panels
export const ResizablePanel: React.FC<ResizablePanelProps> = ({ 
  children, 
  direction = 'horizontal', 
  initialSize = 280, 
  minSize = 200, 
  maxSize = 500,
  className = '',
  handleClassName = '',
  onResize = () => {},
  isOpen = true,
  handlePosition = 'right'
}) => {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startPos = useRef(0);
  const startSize = useRef(initialSize);

  // Handle mouse down to start resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSize.current = size;
    setIsDragging(true);
    
    // Add specific cursor styling to the document body during resize
    if (direction === 'horizontal') {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'row-resize';
    }
    
    // Disable text selection during resize
    document.body.classList.add('resize-active');
  }, [direction, size]);
  
  // Handle mouse move for resizing (throttled to improve performance)
  const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
    if (!isDragging) return;
    
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    const delta = currentPos - startPos.current;
    
    let newSize;
    if (handlePosition === 'right' || handlePosition === 'bottom') {
      newSize = startSize.current + delta;
    } else {
      newSize = startSize.current - delta;
    }
    
    // Constrain the size within bounds
    newSize = Math.max(minSize, Math.min(maxSize, newSize));
    
    setSize(newSize);
    onResize(newSize);
  }, 16), [isDragging, direction, minSize, maxSize, handlePosition, onResize]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.classList.remove('resize-active');
  }, [isDragging]);

  // Set up global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update internal size when initialSize prop changes
  useEffect(() => {
    setSize(initialSize);
  }, [initialSize]);

  if (!isOpen) return null;

  const panelStyle = direction === 'horizontal' 
    ? { width: `${size}px` }
    : { height: `${size}px` };

  const handleStyle = direction === 'horizontal'
    ? { 
        cursor: 'col-resize',
        width: '4px',
        height: '100%',
        position: 'absolute' as const,
        [handlePosition]: '-2px',
        top: 0,
        zIndex: 10
      }
    : { 
        cursor: 'row-resize',
        height: '4px',
        width: '100%',
        position: 'absolute' as const,
        [handlePosition]: '-2px',
        left: 0,
        zIndex: 10
      };

  return (
    <>
      <style jsx>{`
        .resize-active {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .resize-handle:hover {
          background-color: var(--primary-500, #3b82f6);
        }
        
        .resize-handle.dragging {
          background-color: var(--primary-600, #2563eb);
        }
      `}</style>
      <div 
        ref={panelRef}
        className={`relative flex-shrink-0 ${className}`}
        style={panelStyle}
      >
        {children}
        
        {/* Resize handle */}
        <div
          className={`resize-handle ${isDragging ? 'dragging' : ''} ${handleClassName}`}
          style={handleStyle}
          onMouseDown={handleMouseDown}
        />
      </div>
    </>
  );
};
