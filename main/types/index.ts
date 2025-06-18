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