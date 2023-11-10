import { ipcMain, dialog, BrowserWindow, shell } from "electron";
import { lstat, readdir } from "fs/promises";
import path from "path";

ipcMain.handle("ask-for-file", async (event, _args) => {
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

ipcMain.handle("open-external", async (_event, file) => {
  console.log("Opening ", file)
  const err = await shell.openPath(file)

  if (err) {
    console.log(`Error when opening ${file}: ${err}`)
    return true
  }

  return false
})