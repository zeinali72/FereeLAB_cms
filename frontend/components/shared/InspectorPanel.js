// frontend/components/shared/InspectorPanel.js
import React, { useState } from 'react';
import { X, Copy, Check } from 'react-feather';

const InspectorPanel = ({ isOpen, onClose, width }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Sample content that will be copied
  const canvasContent = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Gravida eu feugiat quis. Purus nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius id feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim nobis.

Additional content to demonstrate scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(canvasContent);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full panel-translucent panel-layout-default">
      <div className="panel-header">
        <h2 className="text-lg font-semibold">Canvas Frame</h2>
        <div className="flex items-center">
          <button 
            onClick={handleCopy} 
            className={`btn btn-icon mr-2 ${isCopied ? 'text-success' : ''}`}
            title="Copy content"
          >
            {isCopied ? 
              <Check size={20} className="animate-pulse" /> : 
              <Copy size={20} />
            }
          </button>
          <button
            onClick={onClose}
            className="btn btn-icon"
            title="Close panel"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="panel-content bg-surface-secondary">
        <pre className="whitespace-pre-wrap text-sm">
          {canvasContent}
        </pre>
      </div>
    </div>
  );
};

export default InspectorPanel;