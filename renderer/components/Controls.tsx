import Button from "./Button";

interface ControlsProps {
    onCreate: () => void
    onSettings: () => void
}

const Controls = ({
    onCreate,
    onSettings
} :ControlsProps) => {
  return (
    <div className="flex flew-row items-center justify-center gap-2 p-4 w-64 rounded fixed left-10 bottom-10 inset z-[49]">
      <Button onClick={onCreate}>Create</Button>
      <Button onClick={onSettings}>Settings</Button>
    </div>
  );
};

export default Controls;
