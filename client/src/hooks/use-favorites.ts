import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import type { Customer } from "@shared/schema";

export interface FavoriteToggleInput {
  menuItemId: string;
  name: string;
  price: string | number;
  image: string;
  category: string;
  isVeg?: boolean;
}

export function useFavorites() {
  const { customer } = useCustomer();
  const queryClient = useQueryClient();
  const queryKey = ["/api/customers/by-phone", customer?.phone];

  const { data: customerDoc } = useQuery<Customer | null>({
    queryKey,
    queryFn: async () => {
      if (!customer?.phone) return null;
      const res = await fetch(`/api/customers/by-phone/${customer.phone}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!customer?.phone,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const favorites = customerDoc?.favorites ?? [];

  const toggleMutation = useMutation({
    mutationFn: async (item: FavoriteToggleInput) => {
      if (!customer?.phone) throw new Error("No customer");
      const res = await fetch(`/api/customers/${customer.phone}/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to toggle favorite");
      return res.json();
    },
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData(queryKey, updatedCustomer);
    },
  });

  function isFavorite(menuItemId: string) {
    return favorites.some((f) => f.menuItemId === menuItemId);
  }

  function toggleFavorite(item: FavoriteToggleInput) {
    if (!customer?.phone) return;
    toggleMutation.mutate(item);
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    hasCustomer: !!customer?.phone,
    customerDoc,
    queryKey,
  };
}
