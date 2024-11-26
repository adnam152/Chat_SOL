import { create } from "zustand";

export const useGameStore = create((set) => ({
    isShowGame: false,
    game: null,

    setGame: (game) => set({ game }),
    removeGame : () => set({ game: null }),
    setShowGame: (isShowGame) => set({ isShowGame }),
    resetGameStore: () => set({ isShowGame: false, game: null }),
}));