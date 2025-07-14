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

  // Handle mouse move for resizing with throttling for better performance
  const handleMouseMove = useCallback(throttle((e) => {
    if (!isDragging) return;
    
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    let delta;
    
    if (direction === 'horizontal') {
      delta = handlePosition === 'right' ? currentPos - startPos.current : startPos.current - currentPos;
    } else {
      delta = handlePosition === 'bottom' ? currentPos - startPos.current : startPos.current - currentPos;
    }

    const newSize = Math.max(minSize, Math.min(maxSize, startSize.current + delta));
    
    // Apply the size directly to the DOM element for smoother resizing
    if (panelRef.current) {
      if (direction === 'horizontal') {
        panelRef.current.style.width = `${newSize}px`;
      } else {
        panelRef.current.style.height = `${newSize}px`;
      }
    }
    
    setSize(newSize);
    onResize(newSize);
  }, 10), [direction, isDragging, maxSize, minSize, onResize, handlePosition]);

  // Handle mouse up to end resizing
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Reset cursor and enable text selection
    document.body.style.cursor = '';
    document.body.classList.remove('resize-active');
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Handle cases when mouse leaves the window
      document.addEventListener('mouseleave', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
      document.body.style.cursor = '';
      document.body.classList.remove('resize-active');
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Determine handle position class
  const getHandlePositionClass = () => {
    if (direction === 'horizontal') {
      return handlePosition === 'right' ? 'right-0' : 'left-0';
    } else {
      return handlePosition === 'bottom' ? 'bottom-0' : 'top-0';
    }
  };

  // Common resize handle styles
  const handleStyle = direction === 'horizontal' 
    ? { width: '8px', height: '100%', cursor: 'col-resize' }
    : { width: '100%', height: '8px', cursor: 'row-resize' };

  // Apply the right size to the element based on direction
  const style = {
    ...(direction === 'horizontal' 
      ? { width: isOpen ? `${size}px` : '0px', transition: isDragging ? 'none' : 'width 0.2s ease-out' }
      : { height: `${size}px`, transition: isDragging ? 'none' : 'height 0.2s ease-out' })
  };

  return (
    <div 
      ref={panelRef} 
      className={`relative ${className}`} 
      style={style}
    >
      {children}
      {isOpen && (
        <div
          className={`absolute ${getHandlePositionClass()} top-0 bottom-0 z-40 bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600 opacity-0 hover:opacity-100 transition-opacity duration-200 ${handleClassName}`}
          style={handleStyle}
          onMouseDown={handleMouseDown}
        >
          {/* Visual indicator for resize handle */}
          <div className={`absolute ${direction === 'horizontal' 
            ? 'top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-12' 
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-12'} bg-gray-400 dark:bg-gray-500 rounded-full opacity-70 pointer-events-none`} />
        </div>
      )}
    </div>
  );
};

export default ResizablePanel;
