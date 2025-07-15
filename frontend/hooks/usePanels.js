// frontend/hooks/usePanels.js
import { useState, useEffect } from 'react';

export const usePanels = () => {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [selectedModels, setSelectedModels] = useState([]);
  const [shouldStartNewConversation, setShouldStartNewConversation] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [canvasWidth, setCanvasWidth] = useState(380);

  useEffect(() => {
    const savedSidebarWidth = localStorage.getItem('sidebarWidth');
    if (savedSidebarWidth) {
      setSidebarWidth(parseInt(savedSidebarWidth, 10));
    }

    const savedCanvasWidth = localStorage.getItem('canvasWidth');
    if (savedCanvasWidth) {
      setCanvasWidth(parseInt(savedCanvasWidth, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth);
  }, [sidebarWidth]);
  
  useEffect(() => {
    localStorage.setItem('canvasWidth', canvasWidth);
  }, [canvasWidth]);

  const toggleCanvas = () => setIsCanvasOpen(!isCanvasOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleModelPanel = () => setIsModelPanelOpen(!isModelPanelOpen);

  const handleOpenMarketplace = () => {
    setIsModelPanelOpen(false);
    setIsMarketplaceOpen(true);
  };

  const handleCloseMarketplace = () => {
    setIsMarketplaceOpen(false);
  };

  const handleSidebarResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  const handleCanvasResize = (newWidth) => {
    setCanvasWidth(newWidth);
  };

  const handleApplyModels = (models) => {
    // Trigger new conversation when model changes
    if (selectedModels.length === 0 || 
        (models.length > 0 && selectedModels.length > 0 && models[0].id !== selectedModels[0].id)) {
      setShouldStartNewConversation(true);
    }
    setSelectedModels(models);
    setIsMarketplaceOpen(false);
  };

  // Reset the flag after it's been consumed
  const consumeNewConversationFlag = () => {
    const shouldStart = shouldStartNewConversation;
    setShouldStartNewConversation(false);
    return shouldStart;
  };

  return {
    isCanvasOpen,
    isSidebarOpen,
    isModelPanelOpen,
    isMarketplaceOpen,
    selectedModels,
    sidebarWidth,
    canvasWidth,
    shouldStartNewConversation,
    consumeNewConversationFlag,
    toggleCanvas,
    toggleSidebar,
    toggleModelPanel,
    handleOpenMarketplace,
    handleCloseMarketplace,
    handleSidebarResize,
    handleCanvasResize,
    handleApplyModels,
  };
};
