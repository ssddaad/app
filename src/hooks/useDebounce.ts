import { useRef } from 'react';

export function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  return useRef((...args: Parameters<T>) => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }).current;
}
