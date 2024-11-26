import { create } from "zustand";

export const useLoaderStore = create((set) => ({
    isLoading: false,
    
    setLoading: (status) => set({ isLoading: status }),
}));
