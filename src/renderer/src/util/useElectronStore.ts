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
      if ((newVal as (prev: T) => T).call !== undefined) {
        window.electronStore.set(key, (newVal as (prev: T) => T).call(null, value));
      } else {
        window.electronStore.set(key, newVal)
      }
      setValue(newVal);

    },
  ];
}
