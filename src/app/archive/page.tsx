"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Trash2, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { chatAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface ArchivedChat {
  id: string;
  title: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

export default function ArchivePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [archivedChats, setArchivedChats] = useState<ArchivedChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    loadArchivedChats();
  }, [session, router]);

  const loadArchivedChats = async () => {
    try {
      setIsLoading(true);
      // We need to create an API endpoint for archived chats
      // For now, this will return empty until implemented
      setArchivedChats([]);
    } catch (error) {
      console.error("Failed to load archived chats:", error);
      addToast({
        message: "Failed to load archived conversations",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (chatId: string) => {
    try {
      // TODO: Implement restore API endpoint
      console.log("Restoring chat:", chatId);
      
      setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));
      addToast({
        message: "Conversation restored successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to restore chat:", error);
      addToast({
        message: "Failed to restore conversation",
        type: "error",
      });
    }
  };

  const handlePermanentDelete = async (chatId: string) => {
    if (!confirm("Are you sure you want to permanently delete this conversation? This action cannot be undone.")) {
      return;
    }

    try {
      // TODO: Implement permanent delete API endpoint
      console.log("Permanently deleting chat:", chatId);
      
      setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));
      addToast({
        message: "Conversation permanently deleted",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to permanently delete chat:", error);
      addToast({
        message: "Failed to delete conversation",
        type: "error",
      });
    }
  };

  const handleBulkRestore = async () => {
    if (selectedChats.size === 0) return;

    try {
      for (const chatId of selectedChats) {
        await handleRestore(chatId);
      }
      setSelectedChats(new Set());
    } catch (error) {
      console.error("Failed to bulk restore:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedChats.size === 0) return;

    if (!confirm(`Are you sure you want to permanently delete ${selectedChats.size} conversations? This action cannot be undone.`)) {
      return;
    }

    try {
      for (const chatId of selectedChats) {
        await handlePermanentDelete(chatId);
      }
      setSelectedChats(new Set());
    } catch (error) {
      console.error("Failed to bulk delete:", error);
    }
  };

  const toggleChatSelection = (chatId: string) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
  };

  const filteredChats = archivedChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessage = (messages: any[]) => {
    if (!messages || messages.length === 0) return "No messages";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? "..." : "");
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-flat p-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Archive</h1>
              <p className="text-muted-foreground">
                Manage your archived conversations
              </p>
            </div>
          </div>
          
          {selectedChats.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleBulkRestore}
                className="btn-flat text-primary hover:bg-primary/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore ({selectedChats.size})
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn-flat text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedChats.size})
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search archived conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No archived conversations</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "No conversations match your search query."
                : "Your archived conversations will appear here."
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="btn-flat mt-4"
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedChats.has(chat.id)}
                    onChange={() => toggleChatSelection(chat.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {chat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {getLastMessage(chat.messages)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {formatDate(chat.createdAt)}</span>
                      <span>•</span>
                      <span>Last updated: {formatDate(chat.updatedAt)}</span>
                      <span>•</span>
                      <span>{chat.messages.length} messages</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(chat.id)}
                      className="btn-flat text-primary hover:bg-primary/10 p-2"
                      title="Restore conversation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(chat.id)}
                      className="btn-flat text-destructive hover:bg-destructive/10 p-2"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}