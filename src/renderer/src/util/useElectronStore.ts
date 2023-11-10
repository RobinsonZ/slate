import { SetStateAction, useEffect, useState } from "react";

export function useElectronStore<T>(
  key: string,
): [T, (newVal: SetStateAction<T>) => void] {
  const [value, setValue] = useState<T>(window.electronStore.get(key));
  useEffect(() => {
    const callback = window.electronStore.onDidAnyChange(
      (_oldValue, newValue) => {
        if (newValue[key]) {
          setValue(newValue[key] as T);
        }
      },
    );
    return () => {
      window.electronStore.removeChangeListener(callback);
    };
  }, []);

  return [
    value,
    (newVal: SetStateAction<T>) => {
      setValue(newVal);
      window.electronStore.set(key, newVal);
    },
  ];
}
