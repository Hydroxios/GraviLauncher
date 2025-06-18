import { Instance } from "../types"
import mcLogo from  "../public/images/mc.png"
import Image from "next/image"
import Button from "./Button"

interface InstanceListProps {
    instances: Instance[]
    openModal: () => void
    onLaunch?: () => void
}

const InstanceList = ({
    instances,
    openModal,
    onLaunch
}:InstanceListProps) => {

    if(instances.length == 0){
        return <Button onClick={openModal}>Create an Instance</Button>
    }

    return (
        <div className="grid grid-cols-6 gap-2 fixed left-10 top-[50px] overflow-auto">
            {instances.map((i) => (
                <div key={i.id} className="flex flex-col bg-white/10 backdrop-blur-md border border-white/30 rounded-lg shadow-md transition-all duration-200 hover:bg-orange-600/10 hover:shadow-lg hover:border-orange-400/30">
                    <Image src={mcLogo} alt="mc" className="w-48 h-48 rounded"/>
                    <div key={i.id + "-footer"} className="bg-white/10 backdrop-blur-md border-t border-white/20 h-16 p-3 flex flex-row justify-between items-center rounded-b-lg shadow-inner">
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg">{i.name}</span>
                            <span className="text-sm opacity-80">v{i.version}</span>
                        </div>
                        <Button
                            onClick={() => {
                                window.ipc.send("launch-instance", i.id)
                                if (onLaunch) onLaunch();
                            }}
                        >Play</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default InstanceList