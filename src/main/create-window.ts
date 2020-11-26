import { getWindowBounds, saveWindowBoundsConfig } from '@/config/windowConfig';
import path from 'path';
import { BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { WindowInfo } from '@/interface';

async function createWindow(winName: string) {
  let bounds: Electron.Rectangle;
  let windowConfig: WindowInfo;
  if (winName == 'main') {
    windowConfig = getWindowBounds('main');
  } else {
    windowConfig = getWindowBounds('reader');
  }

  const boundTmp = windowConfig.windowConfig;
  console.log('窗口信息', boundTmp);
  if (
    boundTmp == undefined ||
    Object.entries(boundTmp).length == 0 ||
    typeof boundTmp == 'string'
  ) {
    bounds = {
      width: 1920,
      height: 1080,
      x: 100,
      y: 100,
    };
  } else {
    bounds = boundTmp;
  }
  // Create the browser window.
  const win = new BrowserWindow({
    ...bounds,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: (process.env
      //   .ELECTRON_NODE_INTEGRATION as unknown) as boolean
      // nodeIntegration: process.env.NODE_ENV == 'development' ? true : false,
      nodeIntegration: true,
      // enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (windowConfig.isMaxSized) {
    win.hide();
    win.maximize();
  }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    const SERVER_ADDRESS = 'http://localhost:8080/';
    if (winName == 'main') {
      win.loadURL(SERVER_ADDRESS);
    } else {
      win.loadURL(SERVER_ADDRESS + 'reader.html');
    }
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    if (winName == 'main') {
      win.loadURL('app://./index.html');
    } else {
      win.loadURL('app://./reader.html');
    }
  }
  win.addListener('close', () => {
    let windowConfigNow: typeof windowConfig;
    if (!win.isMaximized()) {
      bounds = win.getBounds();
      windowConfigNow = { isMaxSized: false, windowConfig: bounds };
      // saveWindowBoundsConfig(bounds);
    } else {
      win.hide();
      win.unmaximize();
      bounds = win.getBounds();
      windowConfigNow = { isMaxSized: true, windowConfig: bounds };
    }
    saveWindowBoundsConfig('reader', windowConfigNow);
  });
  return win;
}

export default createWindow;
