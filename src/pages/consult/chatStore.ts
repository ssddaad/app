/**
 * chatStore.ts
 * 双端共享消息存储 —— 基于 localStorage + storage 事件
 * 患者端和医生端运行在同一浏览器不同标签页，通过 storage 事件实时同步。
 * 同一标签页内则通过直接 dispatch 一个自定义事件来触发更新。
 */

export interface SharedMessage {
  id: string;
  from: 'doctor' | 'patient';
  content: string;
  timestamp: number; // ms timestamp — 序列化安全
}

const STORAGE_KEY = 'breast_health_chat_messages';
const EVENT_NAME  = 'chat_store_updated';

/** 读取所有消息 */
export function loadMessages(): SharedMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SharedMessage[]) : [];
  } catch {
    return [];
  }
}

/** 追加一条消息并广播更新 */
export function appendMessage(msg: Omit<SharedMessage, 'id'>): SharedMessage {
  const full: SharedMessage = { ...msg, id: `${Date.now()}_${Math.random().toString(36).slice(2)}` };
  const prev = loadMessages();
  const next = [...prev, full];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  // 同页面内广播（跨 tab 依赖原生 storage 事件）
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  return full;
}

/** 清空消息（重置会话） */
export function clearMessages(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

/** 订阅消息变化，返回取消订阅函数 */
export function subscribeMessages(cb: (msgs: SharedMessage[]) => void): () => void {
  const onStorage = () => cb(loadMessages());
  const onCustom  = () => cb(loadMessages());
  window.addEventListener('storage', onStorage);        // 跨 tab
  window.addEventListener(EVENT_NAME, onCustom as EventListener); // 同 tab
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT_NAME, onCustom as EventListener);
  };
}
