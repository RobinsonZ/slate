import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    electronStore: {
      get: (key: string) => any;
      set: (key: string, val: any) => void;
      onDidAnyChange: (
        callback: (
          oldValue: Record<string, unknown>,
          newValue: Record<string, unknown>,
        ) => void,
      ) => (
        oldValue: Record<string, unknown>,
        newValue: Record<string, unknown>,
      ) => void;
      removeChangeListener: (
        callback: (
          oldValue: Record<string, unknown>,
          newValue: Record<string, unknown>,
        ) => void,
      ) => void;
    };
    files: {
      askForImport: () => Promise<string[]>;
      /** Returns `true` if there is an error opening the provided file
       *  (either because it doesn't exist or for other reasons). */
      openExternally(path: string): Promise<boolean>;
    };
    api: unknown;
  }
}
