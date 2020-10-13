const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const status = {
    DEVELOPMENT: "DEVELOPMENT",
    PRODUCTION: "PRODUCTION"
}

process.env.NODE_ENV = status.DEVELOPMENT

let mainWindow = null
let infoWindow = null

const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
const isDev = process.env.NODE_ENV === status.DEVELOPMENT

function createMainWindow() {
    mainWindow = new BrowserWindow({
        height: 400,
        width: 350,
        frame: false,
        hasShadow: true,
        resizable: isDev,
        show: true,
        icon: path.join(__dirname, "assets", "img", "logo-white.png"),
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(isDev ? 'http://localhost:3000/' : path.join(__dirname, "front-end", "build", "index.html"))
    // mainWindow.on("blur", () => mainWindow.hide())
}

function createInfoWindow() {
    infoWindow = new BrowserWindow({
        height: 175,
        width: 300,
        frame: false,
        resizable: false,
        hasShadow: true,
        icon: path.join(__dirname, "assets", "img", "logo-white.png"),
        webPreferences: {
            nodeIntegration: true
        }
    })

    infoWindow.loadFile(path.join(__dirname, "info-window", "index.html"))
    ipcMain.on("info:close", () => {
        infoWindow.close()
        infoWindow = null
    })

    createMainWindow()
}

app.on('ready', createInfoWindow)

app.on('window-all-closed', () => {
    if (isMac) {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow()
    }
})

if (isWin) {
    app.setAppUserModelId(app.name)
}