import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  profile: [],
  setProfile: (profile) => set(() => ({ profile })),
}));
