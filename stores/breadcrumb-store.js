import { create } from "zustand";

export const useBreadcrumbStore = create((set) => ({
  detailLabel: null,
  setDetailLabel: (detailLabel) => set({ detailLabel }),
}));
