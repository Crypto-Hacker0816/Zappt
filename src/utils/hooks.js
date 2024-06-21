import { useCallback, useEffect, useState } from 'react';

export default function useDebounce(callback, delay) {
  const [debouncingTimer, setDebouncingTimer] = useState(null);

  const debouncedCallback = useCallback(() => {
    if (debouncingTimer !== null) {
      clearTimeout(debouncingTimer);
    }
    setDebouncingTimer(
      setTimeout(() => {
        callback();
      }, delay),
    );
  }, [callback, delay, debouncingTimer]);

  // Cleanup timer when component unmounts or the dependencies change
  useEffect(() => {
    return () => {
      if (debouncingTimer) {
        clearTimeout(debouncingTimer);
      }
    };
  }, [debouncingTimer]);

  return debouncedCallback;
}
