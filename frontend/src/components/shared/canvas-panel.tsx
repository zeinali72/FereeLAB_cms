"use client";

import { InspectorPanel } from "./inspector-panel";

interface CanvasPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

export function CanvasPanel({ isOpen, onClose, width }: CanvasPanelProps) {
  return (
    <InspectorPanel 
      isOpen={isOpen}
      onClose={onClose}
      width={width}
    />
  );
}
