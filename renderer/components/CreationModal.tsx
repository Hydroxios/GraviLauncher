import { useState } from "react";
import VersionSelector from "./VersionSelector";
import Button from "./Button";

interface CreationModalProps {
  open: boolean;
  onClose: () => void;
}

const CreationModal = ({ open, onClose }: CreationModalProps) => {
    const typeOptions = ["vanilla", "neoforge"];

    const [instanceType, setInstanceType] = useState(typeOptions[0]);
    const [name, setName] = useState("")
    const [vanillaVersion, setVanillaVersion] = useState("1.21.1")
    const [modloaderVersion, setModloaderVersion] = useState("")

    const handleCreate = () => {
        if(instanceType === "vanilla"){
          const i = {
            name: name.trim().length > 0 ? name : vanillaVersion,
            version: vanillaVersion
          } 
          window.ipc.send("create-instance", i)
          onClose()
        } else {
          const i = {
            name: name.trim().length > 0 ? name : instanceType + "-" + vanillaVersion,
            version: vanillaVersion,
            modloader: instanceType,
            modloaderVersion
          }
          window.ipc.send("create-instance", i)
          onClose()
        }
    }

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
        <h2 className="text-2xl font-bold mb-4">Create Minecraft Instance</h2>
        <div className="mb-4">
          <label
            htmlFor="instanceName"
            className="block text-white text-sm font-bold mb-2"
          >
            Instance Name:
          </label>
          <input
            type="text"
            id="instanceName"
            className="bg-white/10 backdrop-blur-md border border-white/30 rounded text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-md w-full"
            placeholder="My Minecraft Instance"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="mb-6 flex flex-col gap-2">
          <span className="font-semibold">Instance Type :</span>
          <div className="flex flex-row gap-4">
            {typeOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="instanceType"
                  value={opt}
                  checked={instanceType === opt}
                  onChange={(e) => setInstanceType(e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <VersionSelector title="Minecraft Version" instanceType={"vanilla"} onChange={(v) => setVanillaVersion(v)}/>
        {instanceType !== "vanilla" && <VersionSelector title="Modloader Version" instanceType={instanceType} vanillaVersion={vanillaVersion} onChange={(v) => setModloaderVersion(v)}/>}
        <div className="flex items-center justify-between">
            <Button
              onClick={handleCreate}
            >
                Create
            </Button>
            <Button
                onClick={onClose}
            >
                Cancel
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CreationModal;
