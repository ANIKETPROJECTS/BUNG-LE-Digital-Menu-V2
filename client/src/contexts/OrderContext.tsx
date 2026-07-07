import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { MenuItem } from "@shared/schema";

export interface OrderLineItem {
  item: MenuItem;
  quantity: number;
}

interface OrderContextValue {
  orderItems: OrderLineItem[];
  addToOrder: (item: MenuItem) => void;
  removeFromOrder: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearOrder: () => void;
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  totalItems: number;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToOrder = useCallback((item: MenuItem) => {
    setOrderItems(prev => {
      const id = item._id?.toString();
      const existing = prev.find(l => l.item._id?.toString() === id);
      if (existing) {
        return prev.map(l =>
          l.item._id?.toString() === id
            ? { ...l, quantity: l.quantity + 1 }
            : l
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeFromOrder = useCallback((itemId: string) => {
    setOrderItems(prev => prev.filter(l => l.item._id?.toString() !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(l => l.item._id?.toString() !== itemId));
    } else {
      setOrderItems(prev =>
        prev.map(l =>
          l.item._id?.toString() === itemId ? { ...l, quantity } : l
        )
      );
    }
  }, []);

  const clearOrder = useCallback(() => setOrderItems([]), []);
  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  const totalItems = orderItems.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <OrderContext.Provider value={{
      orderItems,
      addToOrder,
      removeFromOrder,
      updateQuantity,
      clearOrder,
      isOpen,
      openSidebar,
      closeSidebar,
      totalItems,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
