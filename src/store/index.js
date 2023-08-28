import { create } from "zustand";
export const useWalletAccount = create((set) => {
  return {
    account: { address: "" },
    setAccount: (newAccount) => set({ account: newAccount }),
  };
});
