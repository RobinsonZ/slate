import { useEffect, useState } from "react";

export function useElectronStore(key: string) {
  const [value, setValue] = useState(window.electronStore.get(key));
  useEffect(() => {
    const callback = window.electronStore.onDidAnyChange(
      (_oldValue, newValue) => {
        if (newValue[key]) {
          setValue(newValue[key]);
        }
      }
    );
    return () => {
      window.electronStore.removeChangeListener(callback);
    };
  }, []);

  return [
    value,
    (newVal: any) => {
      setValue(newVal);
      window.electronStore.set(key, newVal);
    },
  ];
}
