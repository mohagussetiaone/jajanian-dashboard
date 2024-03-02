import { create } from 'zustand';

export const useEmailResetPassword = create((set) => ({
  emailResetPassword: '',
  setEmailResetPassword: (emailReset) => set(() => ({ emailReset })),
}));
