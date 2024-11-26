import { create } from "zustand";

export const useModalStore = create((set) => ({
    isModalOpen: false,
    modalContent: null,

    openModal: (content) => set({ isModalOpen: true, modalContent: content }),
    closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));