import React from "react";
import { Instance } from "../types";

interface LaunchingInfoWidgetProps {
  open: boolean;
  instance?: Instance;
  state: { type: string; value?: any } | null;
  onClose: () => void;
}

const LaunchingInfoWidget: React.FC<LaunchingInfoWidgetProps> = ({ open, instance, state, onClose }) => {
  if (!open || !instance || !state) return null;
  return (
    <div className="fixed top-10 right-10 z-[60] w-96 bg-white/10 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-bold text-lg text-white">Launching: <span className="text-orange-400">{instance.name}</span></div>
          <div className="text-sm text-white/70">Version: {instance.version}</div>
        </div>
        <button className="text-white hover:text-orange-400" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-white/90 text-sm">
          {state.type === 'progress' && <span>Downloading assets...</span>}
          {state.type === 'extract' && <span>Extracting: <span className="text-orange-400">{state.value}</span></span>}
          {state.type === 'patch' && <span>Applying patches...</span>}
          {state.type === 'error' && <span className="text-red-400">Error: {state.value}</span>}
          {state.type === 'close' && <span className="text-green-400">Game exited.</span>}
          {state.type === 'start' && <span>Starting launch...</span>}
          {state.type === 'playing' && <span>Playing...</span>}
        </div>
      </div>
    </div>
  );
};

export default LaunchingInfoWidget; 