// stores/loadingStore.ts
let loadingCount = 0;
let listeners: ((visible: boolean) => void)[] = [];

export const loadingStore = {
  show: () => {
    loadingCount++;
    notify();
  },
  hide: () => {
    loadingCount = Math.max(loadingCount - 1, 0);
    notify();
  },
  subscribe: (listener: (visible: boolean) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

function notify() {
  const visible = loadingCount > 0;
  listeners.forEach((l) => l(visible));
}
