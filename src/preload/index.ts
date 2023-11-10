import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

// electron store
contextBridge.exposeInMainWorld("electronStore", {
  get(key) {
    return ipcRenderer.sendSync("electron-store-get", key);
  },
  set(property, val) {
    ipcRenderer.send("electron-store-set", property, val);
  },
  onDidAnyChange(callback) {
    ipcRenderer.on("electron-store-change", callback)
    return callback
  },
  removeChangeListener(callback) {
    ipcRenderer.removeListener("electron-store-change", callback)
  }
});

contextBridge.exposeInMainWorld("files", {
  askForImport() {
    return ipcRenderer.invoke("ask-for-file");
  },
  openExternally(path: string) {
    return ipcRenderer.invoke("open-external", path)
  }
})