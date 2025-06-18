import path from 'path'
import { app, ipcMain, BrowserWindow } from 'electron'
import serve from "electron-serve"
import { createWindow } from './helpers'
import { autoUpdater } from 'electron-updater'
import { Launch, Microsoft } from "minecraft-java-core"
import { Instance, User } from './types'
import { getCurrentSession, loadSession, setSession } from './sessionStorage'
import { addInstance, getInstance, getInstances } from './instanceStorage'
import { v4 as uuidv4 } from "uuid"

const isProd = process.env.NODE_ENV === 'production'

let mainWindow: BrowserWindow | undefined
let splashWindow: BrowserWindow | undefined

loadSession()
let auth: Microsoft = new Microsoft("");
let launcher = new Launch()
launcher.on('progress', p => console.log(`[DL] ${p}%`))
        .on('data', line => process.stdout.write(line))
        .on("error", console.error)
        .on('close', () => console.log('Game exited.'));

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  if(isProd){
    splashWindow = new BrowserWindow({
      width: 300,
      height: 400,
      frame: false,
      alwaysOnTop: true,
    })
  
    autoUpdater.checkForUpdates()
  
    autoUpdater.on('update-available', (info) => {
      console.log('update-available', info)
    })
    autoUpdater.on('update-downloaded', (info) => {
      autoUpdater.quitAndInstall()
    })

    autoUpdater.on("error", (err) => {
    })
    
    autoUpdater.on('update-not-available', async (info) => {
      console.log('update-not-available', info)
      splashWindow?.close()
      await createMainWindow()
    })
    autoUpdater.on('error', (error) => {
      console.log('error', error)
      splashWindow.close()
    })
    
    splashWindow.loadURL("app//./splash")
  } else {
    await createMainWindow()
  }
})()


const createMainWindow = async () => {
  mainWindow = createWindow('main', {
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },    
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      symbolColor: "#27272a",
      color: "#27272a00"
    },
    autoHideMenuBar: true,
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
}

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on("login", async (event, arg) => {
  const u = getCurrentSession()
  if(u){
    event.reply("user", u)
    return;
  }
  try {
    const res = await auth.getAuth("electron");
    setSession(res as User)
    event.reply("user", getCurrentSession())
  } catch(err) {
    console.error(err)
  }
})

ipcMain.on("instances", (event) => {
  event.reply("instances", getInstances())
})

ipcMain.on("create-instance", (event, arg: Instance) => {
  const nI: Instance = {id: uuidv4(), ...arg}
  addInstance(nI)
  event.reply("instances", getInstances())
})

ipcMain.on("launch-instance", async (event, id: string) => {
  const instance = getInstance(id)
  if(instance){
    console.log("launching " + id)
    try {
      await launcher.Launch({
        path: `./instances/${id}`, 
        authenticator: getCurrentSession(),
        version: instance.version,
        memory: {
          min: "4G",
          max: "8G"
        },
        java: {
          type: "jre"
        },
        GAME_ARGS: [],
        JVM_ARGS: [
          "-XX:+UseShenandoahGC",
          "-XX:+AlwaysPreTouch"
        ],
        ignored: [],
        loader: {
          path: `./instances/${id}/loader`,               // Where to install loaders
          type: instance.modloader ?? "",                     // forge | neoforge | fabric | …
          build: instance.modloaderVersion ?? "",                // Build number / tag
          enable: instance.modloader ? true : false,                  // Whether to install the loader
        },    
        mcp: null,
        screen: {
          fullscreen: false,
          width: null,
          height: null
        },
        verify: false
      })
    } catch(err) {
      console.error(err)
    }
    
  }
})