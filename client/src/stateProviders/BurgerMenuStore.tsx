import { create } from "zustand";


interface BurgerMenuState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const useBurgerMenuStore = create<BurgerMenuState>((set) => ({
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useBurgerMenuStore;