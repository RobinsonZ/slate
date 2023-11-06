import { useEffect, useState } from "react";

export function useElectronStore(key: string) {
  const [value, setValue] = useState(window.electronStore.get(key))
  useEffect(() => {
    const callback = window.electronStore.onDidAnyChange(() => {
      const val = window.electronStore.get(key)
      console.log("resetting from change listener", val)
      setValue(val)
    })
    return () => {
      window.electronStore.removeChangeListener(callback)
    }
  }, [])

  return [value, (newVal: any) => {
    console.log("storing new", newVal)
    window.electronStore.set(key, newVal);
  }]
}