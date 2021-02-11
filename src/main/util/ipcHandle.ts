import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Response } from '@/interface';
import { Channel } from '@/interface/Api';

export default function<K extends keyof Channel, T extends Channel>(
  channel: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<T[K]> | T[K]
): void {
  ipcMain.handle(channel, (ipcEvent, ...args) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Response<unknown>>(async (resolve) => {
      const res: Response<unknown> = { code: 0, message: '' };
      try {
        res.data = await listener(ipcEvent, ...args);
        resolve(res);
      } catch (e) {
        // 如果错误类型为MsgError，则返回自定义消息
        if (Object.getPrototypeOf(e).constructor.name == 'MsgError') {
          res.code = e.code;
          res.message = e.message;
          resolve(res);
          return;
        }
        res.code = 500;
        res.message = '后台应用错误';
        resolve(res);
      }
    });
  });
}
