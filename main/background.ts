import path from 'path'
import { app, ipcMain, BrowserWindow, dialog } from 'electron'
import serve from "electron-serve"
import { createWindow } from './helpers'
import { autoUpdater } from 'electron-updater'
import { Launch, Microsoft } from "minecraft-java-core"
import { Instance, User } from './types'
import { getCurrentSession, loadSession, setSession } from './sessionStorage'
import { addInstance, getInstance, getInstances, setInstancesPath, getInstancesPath } from './instanceStorage'
import { v4 as uuidv4 } from "uuid"
import { loadSettings, getSettings, setInstancesPath as setSettingsInstancesPath, setMemory } from './settingsStorage'

const isProd = process.env.NODE_ENV === 'production'

let mainWindow: BrowserWindow | undefined
let splashWindow: BrowserWindow | undefined

const startSettings = loadSettings();
loadSession()
setInstancesPath(startSettings.instancesPath)
let auth: Microsoft = new Microsoft("");
let launcher = new Launch()
launcher.on('progress', p => {
  console.log(`[DL] ${p}%`)
  if (mainWindow) mainWindow.webContents.send('launch-progress', { type: 'progress', value: p })
})
  .on('data', line => {
    process.stdout.write(line)
    if (mainWindow) mainWindow.webContents.send("launch-progress", {type: "playing"})
  })
  .on("extract", (extract) => {
    console.log(`[EXTRACTING] ${extract}`)
    if (mainWindow) mainWindow.webContents.send('launch-progress', { type: 'extract', value: extract })
  })
  .on("patch", (patch) => {
    console.log(`[PATCH] ${patch}`)
    if (mainWindow) mainWindow.webContents.send('launch-progress', { type: 'patch', value: patch })
  })
  .on("error", err => {
    console.error(err)
    if (mainWindow) mainWindow.webContents.send('launch-progress', { type: 'error', value: err?.message || String(err) })
  })
  .on('close', () => {
    console.log('Game exited.')
    if (mainWindow) mainWindow.webContents.send('launch-progress', { type: 'close' })
  });

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
    console.log("Refresing user session...")
    const refreshedUser = await auth.refresh(u)
    setSession(refreshedUser as User)
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
    if (mainWindow) mainWindow.webContents.send('launch-progress', { type: 'start', instance })
    try {
      const settings = getSettings();
      const basePath = settings?.instancesPath || getInstancesPath();
      await launcher.Launch({
        path: `${basePath}/${id}`,
        authenticator: getCurrentSession(),
        version: instance.version,
        memory: {
          min: settings?.memoryMin + "G" || "4G",
          max: settings?.memoryMax + "G" || "8G"
        },
        java: {
          type: "jre"
        },
        GAME_ARGS: [],
        JVM_ARGS: [],
        ignored: [],
        loader: {
          path: `/loader`,
          type: instance.modloader ?? "",
          build: instance.modloaderVersion ?? "",
          enable: instance.modloader ? true : false,
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

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});

ipcMain.on("save-settings", (event, settings) => {
  setInstancesPath(settings.instanceFolder)
  setMemory(settings.memory.min, settings.memory.max)
})

ipcMain.on("settings", (event, arg) => {
  event.reply("settings", getSettings())
})