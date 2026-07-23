export const workIntro =
  "We create experiences that build trust, strengthen our brands, and deliver business results.";

export type WorkCard = {
  id: string;
  label: string;
  /** Placeholder fill color */
  color: string;
  /** Label ink color for contrast against `color` */
  ink: string;
};

/** Placeholder color cards for the arc gallery */
export const workCards: WorkCard[] = [
  { id: "shopping-assistant", label: "Shopping Assistant", color: "#b07d46", ink: "#fff" },
  { id: "pdp-next", label: "PDP Next", color: "#6e1f28", ink: "#fff" },
  { id: "cart", label: "Cart", color: "#f1efea", ink: "#111" },
  { id: "plp-next", label: "PLP Next", color: "#141414", ink: "#fff" },
  { id: "checkout", label: "Checkout", color: "#8f1d1d", ink: "#fff" },
  { id: "loyalty", label: "Loyalty Hub", color: "#8ea0ad", ink: "#111" },
  { id: "search", label: "Search", color: "#0b1f4d", ink: "#fff" },
  { id: "store-mode", label: "Store Mode", color: "#d8cdbd", ink: "#111" },
  { id: "wishlist", label: "Wishlist", color: "#c24a3a", ink: "#fff" },
  { id: "account", label: "Account", color: "#2b2b2b", ink: "#fff" },
  { id: "rewards", label: "Rewards", color: "#d7b9a0", ink: "#111" },
  { id: "editorial", label: "Editorial", color: "#3a4a5a", ink: "#fff" },
];
