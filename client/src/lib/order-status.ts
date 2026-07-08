// Maps an order's lifecycle status (set by this app or by the POS system)
// to a friendly label + color for the customer-facing status bar.
export interface StatusDisplay {
  label: string;
  color: string;
}

const STATUS_MAP: Record<string, StatusDisplay> = {
  pending: { label: "Occupied", color: "#E63946" },
  confirmed: { label: "Preparing", color: "#E49B1D" },
  preparing: { label: "Preparing", color: "#E49B1D" },
  ready: { label: "Ready", color: "#2E86DE" },
  served: { label: "Served", color: "#6C5CE7" },
  completed: { label: "Available", color: "#2FA84F" },
  cancelled: { label: "Available", color: "#2FA84F" },
};

export function getStatusDisplay(status?: string | null): StatusDisplay {
  if (!status) return { label: "Available", color: "#2FA84F" };
  const key = status.toLowerCase();
  if (STATUS_MAP[key]) return STATUS_MAP[key];
  return { label: status.charAt(0).toUpperCase() + status.slice(1), color: "#888888" };
}
