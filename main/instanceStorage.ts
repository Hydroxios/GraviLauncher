import { Instance } from "./types";
import fs from "node:fs"

export const getInstances = () :Instance[] => {
    if(!fs.existsSync("./instances")){
        fs.mkdirSync("./instances")
        fs.writeFileSync("./instances/manifest.json", JSON.stringify([]))
        return []
    }
    const instances = JSON.parse(fs.readFileSync("./instances/manifest.json").toString()) as Instance[]
    return instances;
}

export const addInstance = (instance: Instance) => {
    const instances = getInstances()
    const nI = [...instances, instance]
    fs.writeFileSync("./instances/manifest.json", JSON.stringify(nI))
}

export const getInstance = (id: string) => {
    return getInstances().filter((i) => i.id === id)[0];
}