import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Response } from '@/interface';
import { MsgError } from './MsgError';

export default function(
  channel: string,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: any[]
  ) => Promise<void> | unknown
): void {
  ipcMain.handle(channel, (ipcEvent, args) => {
    return new Promise<Response<unknown>>((resolve) => {
      const res: Response<unknown> = { code: 0, message: '' };
      try {
        res.data = listener(ipcEvent, args);
        resolve(res);
      } catch (e) {
        if (e instanceof MsgError) {
          res.code = e.code;
          res.message = e.message;
        }
        res.code = 500;
        res.message = '后台应用错误';
        resolve(res);
      }
    });
  });
}
