import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface CustomerInfo {
  name: string;
  phone: string;
}

interface CustomerContextValue {
  customer: CustomerInfo | null;
  setCustomer: (c: CustomerInfo) => void;
  clearCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

const LS_KEY = "bungle_customer";

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomerState] = useState<CustomerInfo | null>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as CustomerInfo) : null;
    } catch {
      return null;
    }
  });

  const setCustomer = useCallback((c: CustomerInfo) => {
    localStorage.setItem(LS_KEY, JSON.stringify(c));
    setCustomerState(c);
  }, []);

  const clearCustomer = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setCustomerState(null);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}
