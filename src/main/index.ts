import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import Store from "electron-store";
import icon from "../../resources/icon.png?asset";
import { lstat, readdir } from "fs/promises";

const store = new Store();

ipcMain.on("electron-store-get", async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on("electron-store-set", async (_event, key, val) => {
  store.set(key, val);
});

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  store.onDidAnyChange((newValue, oldValue) => {
    mainWindow.webContents.send("electron-store-change", newValue, oldValue);
  });

  store.openInEditor();

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// "server-side API"
ipcMain.handle("ping", () => {
  return "pong";
});

ipcMain.handle("ask-for-file", async (event, args) => {
  const result = await dialog.showOpenDialog(
    BrowserWindow.fromWebContents(event.sender)!!,
    {
      properties: ["openFile", "openDirectory"],
      title: "Import Files",
    }
  );

  if (result.canceled || !result.filePaths) {
    return [];
  }

  // should just be one thing returned
  const fpath = result.filePaths[0];
  console.log(fpath);
  // if it's a file, just return with that; otherwise pull everything out of the dir
  if ((await lstat(fpath)).isDirectory()) {
    console.log(`Loading contents of dir at ${fpath}`);
    const dirContents = await readdir(fpath, { withFileTypes: true });

    const filenames = dirContents
      .filter((c) => c.isFile())
      .filter((c) => !c.name.startsWith('.')) // ignore hidden files
      .map((c) => path.join(fpath, c.name));
    console.log(filenames);
    return filenames;
  } else {
    console.log("Is a file");
    return [fpath];
  }
});
