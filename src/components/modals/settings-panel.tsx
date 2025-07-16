"use client";

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Palette, 
  Globe, 
  Zap, 
  Shield, 
  Bell, 
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
}

const settingSections: SettingSection[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: <User className="h-5 w-5" />,
    description: 'Manage your account and profile settings'
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: <Palette className="h-5 w-5" />,
    description: 'Customize the look and feel'
  },
  {
    id: 'language',
    title: 'Language & Region',
    icon: <Globe className="h-5 w-5" />,
    description: 'Set your language and locale preferences'
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: <Zap className="h-5 w-5" />,
    description: 'Optimize app performance and resource usage'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: <Shield className="h-5 w-5" />,
    description: 'Control your privacy and security settings'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Bell className="h-5 w-5" />,
    description: 'Configure notification preferences'
  },
  {
    id: 'data',
    title: 'Data Management',
    icon: <Database className="h-5 w-5" />,
    description: 'Import, export, and manage your data'
  }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'User',
      email: 'user@example.com',
      avatar: null
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      density: 'comfortable',
      animations: true
    },
    language: {
      language: 'en',
      region: 'US',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    },
    performance: {
      animationsEnabled: true,
      autoSave: true,
      cacheSize: 'medium',
      preloadImages: true
    },
    privacy: {
      analytics: true,
      crashReports: true,
      shareUsage: false,
      clearOnExit: false
    },
    notifications: {
      desktop: true,
      sounds: true,
      email: false,
      mentions: true
    }
  });

  const { theme, setTheme } = useTheme();

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or API
    localStorage.setItem('appSettings', JSON.stringify(settings));
    onClose();
  };

  const handleResetSection = () => {
    // Reset current section to defaults
    console.log(`Resetting ${activeSection} section`);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fereelab-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Avatar</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <button className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors">
            Change Avatar
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Theme</label>
        <div className="grid grid-cols-3 gap-2">
          {['light', 'dark', 'system'].map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => {
                setTheme(themeOption);
                handleSettingChange('appearance', 'theme', themeOption);
              }}
              className={cn(
                "p-3 border rounded-md text-sm capitalize transition-colors",
                theme === themeOption 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-input hover:bg-muted"
              )}
            >
              {themeOption}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Font Size</label>
        <select
          value={settings.appearance.fontSize}
          onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.appearance.animations}
            onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Enable animations</span>
        </label>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Export & Import</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" />
            Import Settings
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Clear Data</h3>
        <div className="space-y-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-4 w-4" />
            Clear Chat History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-4 w-4" />
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'data':
        return renderDataSection();
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Settings for {settingSections.find(s => s.id === activeSection)?.title} coming soon...</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-4xl h-[80vh] m-4 bg-background border border-border rounded-lg shadow-lg flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-muted/30">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          
          <div className="p-2">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "hover:bg-muted"
                )}
              >
                {section.icon}
                <div>
                  <div className="font-medium">{section.title}</div>
                  {section.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold">
                {settingSections.find(s => s.id === activeSection)?.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {settingSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSection}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderSectionContent()}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
