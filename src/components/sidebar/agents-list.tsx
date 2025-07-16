"use client";

import { BookOpen, FileText, Database, Monitor, User, Search, Zap } from "lucide-react";
import { ReactNode } from "react";

type Agent = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  isActive?: boolean;
};

// Mock agents data
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Deep Research",
    description: "For in-depth analysis and research",
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "2",
    name: "Web Creator",
    description: "Design and build web experiences",
    icon: <Monitor className="h-5 w-5 text-green-500" />,
    isActive: true,
  },
  {
    id: "3",
    name: "AI Writer",
    description: "Generate creative content and copy",
    icon: <FileText className="h-5 w-5 text-purple-500" />,
  },
  {
    id: "4",
    name: "Data Analyst",
    description: "Analyze and visualize data",
    icon: <Database className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: "5",
    name: "AI Slides",
    description: "Create presentation slides",
    icon: <Zap className="h-5 w-5 text-orange-500" />,
  },
];

export default function AgentsList() {
  return (
    <div className="py-2">
      {mockAgents.map((agent) => (
        <div
          key={agent.id}
          className={`flex items-start px-3 py-2 cursor-pointer hover:bg-accent/10 ${
            agent.isActive ? "bg-accent/10" : ""
          }`}
        >
          <div className="flex-shrink-0 pt-1 mr-3">{agent.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{agent.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{agent.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
