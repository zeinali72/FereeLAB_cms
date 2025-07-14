import React, { useState, useEffect, useCallback, useRef } from 'react';

// Throttle function to limit how often a function is called
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Reusable component for resizable panels
const ResizablePanel = ({ 
  children, 
  direction = 'horizontal', 
  initialSize = 280, 
  minSize = 200, 
  maxSize = 500,
  className = '',
  handleClassName = '',
  onResize = () => {},
  isOpen = true,
  handlePosition = 'right' // 'right' or 'left' for horizontal, 'top' or 'bottom' for vertical
}) => {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef(null);
  const startPos = useRef(0);
  const startSize = useRef(initialSize);

  // Handle mouse down to start resizing
  const handleMouseDown = useCallback((e) => {
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
  const handleMouseMove = useCallback(throttle((e) => {
    if (!isDragging) return;
    
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    let newSize;
    
    if (direction === 'horizontal') {
      // For horizontal resizing
      if (handlePosition === 'right') {
        newSize = startSize.current + (currentPos - startPos.current);
      } else {
        newSize = startSize.current - (currentPos - startPos.current);
      }
    } else {
      // For vertical resizing
      if (handlePosition === 'bottom') {
        newSize = startSize.current + (currentPos - startPos.current);
      } else {
        newSize = startSize.current - (currentPos - startPos.current);
      }
    }
    
    // Clamp the size between min and max values
    newSize = Math.max(minSize, Math.min(newSize, maxSize));
    
    setSize(newSize);
    onResize(newSize); // Notify parent of resize
  }, 10), [isDragging, direction, handlePosition, minSize, maxSize, onResize]);
  
  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.classList.remove('resize-active');
    }
  }, [isDragging]);
  
  // Set up global mouse move and mouse up listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Reset size when panel is closed/opened
  useEffect(() => {
    if (!isOpen) {
      setSize(0);
    } else {
      setSize(initialSize);
    }
  }, [isOpen, initialSize]);

  const containerStyle = {
    ...(direction === 'horizontal' ? { width: `${size}px` } : { height: `${size}px` }),
    transition: isDragging ? 'none' : 'all 0.2s ease',
  };
  
  const resizeHandleClasses = `
    absolute z-10 ${isDragging ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
    ${direction === 'horizontal' 
      ? `w-1 cursor-col-resize ${handlePosition === 'right' ? 'right-0' : 'left-0'} top-0 bottom-0` 
      : `h-1 cursor-row-resize ${handlePosition === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0`
    }
    transition-opacity bg-border-focus ${handleClassName}
  `;

  return (
    <div 
      ref={panelRef} 
      className={`relative ${className}`} 
      style={containerStyle}
    >
      <div className={resizeHandleClasses} onMouseDown={handleMouseDown}></div>
      <div className="h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResizablePanel;
