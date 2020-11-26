import { ipcMain } from 'electron';
import createWindow from '../create-window';
import { IpcMsg } from '@/interface';

ipcMain.handle('read-comic', async (e, comicPaths: string[], title: string) => {
  const win = await createWindow(title);
  win.title = title;
  ipcMain.eventNames();
  ipcMain.handle('get-win-id', (e) => {
    debugger;
    win.webContents.addListener('destroyed', () => {
      const id = String(e.sender.id);
      ipcMain.removeHandler(id);
    });
    win.addListener('closed', () => {
      // if (win) {
      //   win = (null as unknown) as BrowserWindow;
      // }
      console.log('closed');
    });
    ipcMain.handle(String(e.sender.id), (e2) => {
      const returnMsg: IpcMsg = {
        code: 0,
        msg: 'success',
      };
      if (e.sender.id == e2.sender.id) {
        returnMsg.data = comicPaths;
        return returnMsg;
      }
      returnMsg.code = 300;
      returnMsg.msg = 'window id is different';
      return returnMsg;
    });
    return e.sender.id;
  });
  // win.webContents.executeJavaScript(`
  //   window.winId = ${win.id}
  // `);
});
