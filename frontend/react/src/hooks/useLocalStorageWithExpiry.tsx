import { networkInterfaces } from "os";
import { useState } from "react";

function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T | null
): [T | null, (value: T | null, ttl_ms: number) => void] {
  const now = new Date();
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item_json = window.localStorage.getItem(key);
      if (!item_json) {
        return initialValue;
      }
      const item = JSON.parse(item_json);
      // Parse stored json or if none return initialValue
      if (item?.expiry || item?.expiry > now.getTime()) {
        return item.value;
      }
      localStorage.removeItem(key);
      return initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | null, ttl_ms: number) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      const store_obj = {
        value: valueToStore,
        expiry: now.getTime() + ttl_ms,
      };
      // Save to local storage
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(store_obj));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export default useLocalStorageWithExpiry;
