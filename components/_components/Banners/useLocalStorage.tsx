import * as React from "react";

type SetValue<T> = T | ((value: T) => T);
export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState<any>(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      try {
        // Get from local storage by key
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error: any) {
        return item;
      }
    }
    return initialValue;
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = React.useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have same API as useState
        // Save state
        setStoredValue((storedValue: any) => {
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
        // Save to local storage
      } catch (error: any) {
        // A more advanced implementation would handle the error case
      }
    },
    [key],
  );

  return [storedValue, setValue];
}
