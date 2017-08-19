const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const { ipcMain } = require('electron')
const express = require('express')
const cors = require('cors')
let expressApp = express()

// const Downloader = require('./assets/lib/filedownloader')
// let downloadInstances = []
// let downloadInstanceKey = 0

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1144, height: 784, resizable: false})

  // COmment below line in production
  mainWindow.webContents.openDevTools()

  // Uncomment below line in production
  //mainWindow.setMenu(null)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // IPC communication script for download vide event
  ipcMain.on('download-video', (event, arg) => {
    console.log('comming here')
    let downloadPath = arg.downloadPath
    downloadPath = 'assets/' + downloadPath
    console.log('mainjs - 52')
    downloadInstances.push(new Downloader({url: arg.videoUrl, resume: true, saveto: downloadPath, deleteIfExists: true}))
    console.log('mainjs - 54')
    downloadInstances[downloadInstanceKey].on("progress", function(data){
      event.sender.send('video-download-progress', data)
    })
    console.log('mainjs - 58')
    downloadInstances[downloadInstanceKey].on("error", function(data){
      console.log(data)
    })
    console.log('mainjs - 62')
    downloadInstances[downloadInstanceKey].on("end", function(data){
      event.sender.send('video-downloaded', data)
    })
    downloadInstanceKey++
  })

  // Starting express server to serve downloaded videos
  expressApp.use(cors())
  expressApp.use(express.static('assets'))
  expressApp.listen(3000, function () {
    console.log('Server started on port - 3000');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
