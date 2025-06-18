import { Instance } from "./types";
import fs from "node:fs"

let instancesPath = "./instances";

export const setInstancesPath = (path: string) => {
    instancesPath = path;
}
export const getInstancesPath = () => instancesPath;

export const getInstances = () :Instance[] => {
    if(!fs.existsSync(instancesPath)){
        fs.mkdirSync(instancesPath, { recursive: true })
        fs.writeFileSync(`${instancesPath}/manifest.json`, JSON.stringify([]))
        return []
    }

    if(!fs.existsSync(`${instancesPath}/manifest.json`)){
        fs.writeFileSync(`${instancesPath}/manifest.json`, JSON.stringify([]))
    }

    const instances = JSON.parse(fs.readFileSync(`${instancesPath}/manifest.json`).toString()) as Instance[]
    return instances;
}

export const addInstance = (instance: Instance) => {
    const instances = getInstances()
    const nI = [...instances, instance]
    fs.writeFileSync(`${instancesPath}/manifest.json`, JSON.stringify(nI))
}

export const getInstance = (id: string) => {
    return getInstances().filter((i) => i.id === id)[0];
}