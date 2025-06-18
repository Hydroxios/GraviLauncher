import { Instance } from "../types"
import mcLogo from  "../public/images/mc.png"
import Image from "next/image"
import Button from "./Button"

interface InstanceListProps {
    instances: Instance[]
    openModal: () => void
}

const InstanceList = ({
    instances,
    openModal
}:InstanceListProps) => {

    if(instances.length == 0){
        return <Button onClick={openModal}>Create an Instance</Button>
    }

    return (
        <div className="grid grid-cols-6 gap-2 fixed left-10 top-[50px] overflow-auto">
            {instances.map((i) => (
                <div key={i.id} className="flex flex-col border border-zinc-900 rounded">
                    <Image src={mcLogo} alt="mc" className="w-48 h-48"/>
                    <div key={i.id + "-footer"} className="bg-zinc-900 h-14 p-2 flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <span>{i.name}</span>
                            <span>v{i.version}</span>
                        </div>
                        <Button
                            onClick={() => {
                                window.ipc.send("launch-instance", i.id)
                            }}
                        >Play</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default InstanceList