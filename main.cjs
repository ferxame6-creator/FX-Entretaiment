const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const appUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;

function configureAutoUpdates() {
  if (!app.isPackaged) return;

  // Download updates quietly and install them on a normal app quit.
  // Do not automatically relaunch the app after the installer finishes.
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.autoRunAppAfterInstall = false;
  autoUpdater.on('error', (error) => {
    console.warn('Auto-update check failed:', error.message);
  });

  autoUpdater.checkForUpdates().catch((error) => {
    console.warn('Auto-update check failed:', error.message);
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 980,
    minHeight: 680,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#090909',
    title: 'FX Entretaiment Dance',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  window.once('ready-to-show', () => window.show());
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url).catch(() => {});
    }
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== appUrl) event.preventDefault();
  });

  window.loadURL(appUrl);
}

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [window] = BrowserWindow.getAllWindows();
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
    configureAutoUpdates();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
