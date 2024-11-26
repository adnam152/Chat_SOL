import { create } from "zustand";

export const useChatGroupStore = create((set) => ({
    listChats: [],
    selectedChat: null,

    setChats: (listChats) => set({ listChats }),
    insertChat: (chat) => set((state) => ({ listChats: [chat, ...state.listChats] })),
    deleteChat: (chatId) => set((state) => ({ listChats: state.listChats.filter(chat => chat._id !== chatId) })),
    setSelectedChat: (chat) => set({ selectedChat: chat }),
}));