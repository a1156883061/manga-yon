// import { RendererProcessIpc } from "electron-better-ipc";
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'leveldown' {
  export default any;
}

declare module 'pouchdb-adapter-leveldb' {
  export default any
}