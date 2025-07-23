import { create } from 'zustand';

interface UIState {
  // Panel visibility
  sidebarOpen: boolean;
  canvasOpen: boolean;
  modelPanelOpen: boolean;
  marketplaceOpen: boolean;
  settingsOpen: boolean;
  userMenuOpen: boolean;
  
  // Panel dimensions
  sidebarWidth: number;
  canvasWidth: number;
  
  // Modal states
  showLoginModal: boolean;
  showSignupModal: boolean;
  
  // Loading states
  globalLoading: boolean;
  
  // Theme state (complementing next-themes)
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  toggleSidebar: () => void;
  toggleCanvas: () => void;
  toggleModelPanel: () => void;
  toggleMarketplace: () => void;
  toggleSettings: () => void;
  toggleUserMenu: () => void;
  setSidebarWidth: (width: number) => void;
  setCanvasWidth: (width: number) => void;
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  closeAllPanels: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Panel visibility
  sidebarOpen: true,
  canvasOpen: false,
  modelPanelOpen: false,
  marketplaceOpen: false,
  settingsOpen: false,
  userMenuOpen: false,
  
  // Panel dimensions
  sidebarWidth: 280,
  canvasWidth: 400,
  
  // Modal states
  showLoginModal: false,
  showSignupModal: false,
  
  // Loading states
  globalLoading: false,
  
  // Theme state
  theme: 'system',
  
  // Actions
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    
  toggleCanvas: () =>
    set((state) => ({ canvasOpen: !state.canvasOpen })),
    
  toggleModelPanel: () =>
    set((state) => ({ 
      modelPanelOpen: !state.modelPanelOpen,
      // Close other panels when opening model panel
      ...(state.modelPanelOpen ? {} : {
        marketplaceOpen: false,
        settingsOpen: false,
        userMenuOpen: false,
      })
    })),
    
  toggleMarketplace: () =>
    set((state) => ({ 
      marketplaceOpen: !state.marketplaceOpen,
      // Close other panels when opening marketplace
      ...(state.marketplaceOpen ? {} : {
        modelPanelOpen: false,
        settingsOpen: false,
        userMenuOpen: false,
      })
    })),
    
  toggleSettings: () =>
    set((state) => ({ 
      settingsOpen: !state.settingsOpen,
      // Close other panels when opening settings
      ...(state.settingsOpen ? {} : {
        modelPanelOpen: false,
        marketplaceOpen: false,
        userMenuOpen: false,
      })
    })),
    
  toggleUserMenu: () =>
    set((state) => ({ 
      userMenuOpen: !state.userMenuOpen,
      // Close other panels when opening user menu
      ...(state.userMenuOpen ? {} : {
        modelPanelOpen: false,
        marketplaceOpen: false,
        settingsOpen: false,
      })
    })),
    
  setSidebarWidth: (width) =>
    set(() => ({ sidebarWidth: Math.max(200, Math.min(400, width)) })),
    
  setCanvasWidth: (width) =>
    set(() => ({ canvasWidth: Math.max(300, Math.min(600, width)) })),
    
  setShowLoginModal: (show) =>
    set(() => ({ showLoginModal: show })),
    
  setShowSignupModal: (show) =>
    set(() => ({ showSignupModal: show })),
    
  setGlobalLoading: (loading) =>
    set(() => ({ globalLoading: loading })),
    
  setTheme: (theme) =>
    set(() => ({ theme })),
    
  closeAllPanels: () =>
    set(() => ({
      modelPanelOpen: false,
      marketplaceOpen: false,
      settingsOpen: false,
      userMenuOpen: false,
    })),
}));