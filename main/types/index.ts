export interface User {
    access_token: string
    uuid: string
    name: string
}

export interface Instance {
    id: string
    name: string
    version: string
    modloader?: string
    modloaderVersion?: string
}

export interface Settings {
    instancesPath: string;
    memoryMin: string;
    memoryMax: string;
}