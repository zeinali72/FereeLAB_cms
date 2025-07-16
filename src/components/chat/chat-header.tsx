"use client";

import { Edit2, MoreHorizontal, Share2 } from "lucide-react";

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
