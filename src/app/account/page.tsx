"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Key, Shield, AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    router.push("/login");
    return null;
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{session.user?.name}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{session.user?.email}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type</label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>Standard User</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Profile editing is coming soon. Contact support if you need to update your information.
            </p>
          </div>
        );
        
      case "security":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Password</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Change your password to keep your account secure.
                </p>
                <button 
                  disabled 
                  className="btn-flat text-sm opacity-50 cursor-not-allowed"
                >
                  Change Password (Coming Soon)
                </button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account.
                </p>
                <button 
                  disabled 
                  className="btn-flat text-sm opacity-50 cursor-not-allowed"
                >
                  Enable 2FA (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        );
        
      case "danger":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-destructive">Danger Zone</h2>
            
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="flex items-center gap-3 mb-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                <h3 className="font-medium text-destructive">Delete Account</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. This will permanently delete 
                your profile, chat history, and all associated data.
              </p>
              <button 
                disabled 
                className="btn-flat text-sm text-destructive border-destructive opacity-50 cursor-not-allowed"
              >
                Delete Account (Coming Soon)
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-flat p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account and security preferences</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="btn-flat text-destructive hover:bg-destructive/10"
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="surface-elevated p-6 rounded-xl"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}