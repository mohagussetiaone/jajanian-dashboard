import { create } from "zustand";

const useToggleSidebar = create((set) => ({
  sidebarOpen: [],
  setSidebarOpen: (sidebarOpen) => set(() => ({ sidebarOpen })),
}));

export default useToggleSidebar;
