"use client";

import React, { useState, useEffect } from 'react';
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
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">User Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{session?.user?.name || 'Guest User'}</h4>
                    <p className="text-sm text-muted-foreground">{session?.user?.email || 'Not logged in'}</p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user ? 'Authenticated User' : 'Guest Session'}
                    </p>
                  </div>
                </div>
                
                {session?.user && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">{session.user.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account Type:</span>
                      <span>Standard</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'system'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
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
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};