import { writable } from 'svelte/store';

export type Message = {
  kind: 'info' | 'success' | 'error';
  message: string;
  details?: string;
  id: string;
};

export const messages = writable<Message[]>([]);

export const addMessage = (m: Omit<Message, 'id'>, timeout = 1000 * 5) => {
  const id = crypto.randomUUID();

  setTimeout(() => {
    delMessage(id);
  }, timeout);

  messages.update((p) => [...p, { ...m, id }]);

  return id;
};

export const delMessage = (toDel: string) => {
  messages.update((p) => p.filter(({ id }) => id !== toDel));
};
