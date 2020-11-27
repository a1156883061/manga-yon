// import { RendererProcessIpc } from "electron-better-ipc";
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
