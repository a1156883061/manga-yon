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
  ipcMain.handle(channel, (ipcEvent, ...args) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Response<unknown>>(async (resolve) => {
      const res: Response<unknown> = { code: 0, message: '' };
      try {
        res.data = await listener(ipcEvent, ...args);
        resolve(res);
      } catch (e) {
        console.error('error', e);
        if (e instanceof MsgError) {
          res.code = e.code;
          res.message = e.message;
          resolve(res);
        }
        res.code = 500;
        res.message = '后台应用错误';
        resolve(res);
      }
    });
  });
}
