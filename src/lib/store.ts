"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderLine = {
  itemSlug: string;
  name: string;
  categorySlug: string;
  imageUrl: string | null;
  qty: number;
};

type SiteStore = {
  /** Selected outlet slug (null = not chosen yet) */
  outlet: string | null;
  setOutlet: (slug: string) => void;
  orderList: OrderLine[];
  addItem: (line: Omit<OrderLine, "qty">, qty?: number) => void;
  removeItem: (itemSlug: string) => void;
  setQty: (itemSlug: string, qty: number) => void;
  clearOrder: () => void;
};

export const useSiteStore = create<SiteStore>()(
  persist(
    (set) => ({
      outlet: null,
      setOutlet: (slug) => set({ outlet: slug }),
      orderList: [],
      addItem: (line, qty = 1) =>
        set((state) => {
          const existing = state.orderList.find((l) => l.itemSlug === line.itemSlug);
          if (existing) {
            return {
              orderList: state.orderList.map((l) =>
                l.itemSlug === line.itemSlug ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          return { orderList: [...state.orderList, { ...line, qty }] };
        }),
      removeItem: (itemSlug) =>
        set((state) => ({ orderList: state.orderList.filter((l) => l.itemSlug !== itemSlug) })),
      setQty: (itemSlug, qty) =>
        set((state) => ({
          orderList:
            qty <= 0
              ? state.orderList.filter((l) => l.itemSlug !== itemSlug)
              : state.orderList.map((l) => (l.itemSlug === itemSlug ? { ...l, qty } : l)),
        })),
      clearOrder: () => set({ orderList: [] }),
    }),
    {
      name: "restaurant-platform-v1",
      partialize: (state) => ({ outlet: state.outlet, orderList: state.orderList }),
    }
  )
);

export function orderCount(state: { orderList: OrderLine[] }): number {
  return state.orderList.reduce((sum, l) => sum + l.qty, 0);
}
