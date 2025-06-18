import { useEffect, useState } from "react";
import Button from "./Button";
import { webUtils } from "electron";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [instanceFolder, setInstanceFolder] = useState("./instances");
  const [minMemory, setMinMemory] = useState("4");
  const [maxMemory, setMaxMemory] = useState("8");

  useEffect(() => {
    window.ipc.on("settings", (settings: any) => {
      setInstanceFolder(settings.instancesPath)
      setMinMemory(settings.memoryMin)
      setMaxMemory(settings.memoryMax)
      console.log(settings)
    })
    window.ipc.send("settings", null)
  }, [])

  const handleSave = () => {
    window.ipc.send("save-settings", {instanceFolder, memory: {min: minMemory, max: maxMemory}})
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-transparent backdrop-blur-sm p-6 rounded-lg shadow-lg z-10 w-full max-w-md mx-auto relative">
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 relative">
            <label className="block text-white text-sm font-bold mb-2">Instances Folder:</label>
            <input
              type="text"
              className="bg-white/10 backdrop-blur-md border border-white/30 rounded text-white p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-md w-full"
              value={instanceFolder}
              onChange={e => setInstanceFolder(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-8 right-2 flex items-center justify-center h-8 w-8 text-white hover:text-orange-400 focus:outline-none"
              onClick={async () => {
                const folder = await window.ipc.invoke('open-folder-dialog');
                if (folder) setInstanceFolder(folder);
              }}
              tabIndex={-1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-white text-sm font-bold mb-2">Min Memory (GB):</label>
            <input
              type="number"
              min={1}
              className="bg-white/10 backdrop-blur-md border border-white/30 rounded text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-md w-full"
              value={minMemory}
              onChange={e => setMinMemory(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-white text-sm font-bold mb-2">Max Memory (GB):</label>
            <input
              type="number"
              min={1}
              className="bg-white/10 backdrop-blur-md border border-white/30 rounded text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-md w-full"
              value={maxMemory}
              onChange={e => setMaxMemory(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 