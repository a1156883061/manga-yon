import { Channel } from '@/interface/Api';
import message from 'ant-design-vue/lib/message';

/**
 * 使用IpcRender.invoke的形式请求Node
 * @param channel 请求名
 * @param args 变量
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function<K extends keyof Channel, T extends Channel>(
  channel: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): Promise<T[K]> {
  const res = await window.ipcRenderer.invoke(channel, ...args);
  if (res.code == 0) {
    return res.data;
  }
  if (res.code > 500) {
    message.error(res.message);
    console.error('error', res.message);
    throw new Error(res.message);
  }
  message.warning(res.message);
  console.error('error', res.message);
  throw new Error(res.message);
}
