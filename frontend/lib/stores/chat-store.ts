import { create } from 'zustand';

interface ChatInitData {
  threadId: string;
  initialQuery: string;
  timestamp: number;
}

interface ChatStore {
  chatInitData: Map<string, ChatInitData>;
  setChatInitData: (threadId: string, initialQuery: string) => void;
  getChatInitData: (threadId: string) => ChatInitData | undefined;
  removeChatInitData: (threadId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatInitData: new Map(),

  setChatInitData: (threadId: string, initialQuery: string) => {
    set((state) => {
      const newMap = new Map(state.chatInitData);
      newMap.set(threadId, {
        threadId,
        initialQuery,
        timestamp: Date.now(),
      });
      return { chatInitData: newMap };
    });
  },

  getChatInitData: (threadId: string) => {
    return get().chatInitData.get(threadId);
  },

  removeChatInitData: (threadId: string) => {
    set((state) => {
      const newMap = new Map(state.chatInitData);
      newMap.delete(threadId);
      return { chatInitData: newMap };
    });
  },
}));