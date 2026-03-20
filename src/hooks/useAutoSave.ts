import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

// 浅比较：仅支持可序列化的普通对象
function shallowEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;
  if (a === null || b === null) return a === b;
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(
    (key) => (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key],
  );
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const savedDataRef = useRef<T>(data);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const savingRef = useRef(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const save = useCallback(async () => {
    if (savingRef.current || shallowEqual(savedDataRef.current, data)) {
      return;
    }

    savingRef.current = true;
    setStatus('saving');

    try {
      await onSave(data);
      savedDataRef.current = data;
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    } finally {
      savingRef.current = false;
    }
  }, [data, onSave]);

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }

    if (!shallowEqual(savedDataRef.current, data)) {
      setStatus('idle');
      timeoutRef.current = setTimeout(save, delay);
    }

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  // 页面关闭前强制保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shallowEqual(savedDataRef.current, data)) {
        e.preventDefault();
        e.returnValue = '';
        save();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data, save]);

  return { status, save };
}
