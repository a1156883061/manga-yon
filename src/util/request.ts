import { message } from 'ant-design-vue';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function(channel: string, args: any[]) {
  const res = await window.ipcRenderer.invoke(channel, args);
  if (res.code == 0) {
    return res.data;
  }
  if (res.code > 500) {
    message.error(res.message);
    throw new Error(res.message);
  }
  message.warning(res.message);
  console.log('error', res.message);
  throw new Error(res.message);
}
