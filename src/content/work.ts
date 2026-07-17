export const workIntro = {
  subheader: "Design. Strategy. Execution.",
  title: "Our Work",
} as const;

export type WorkProject = {
  id: string;
  title: string;
  image: string;
  alt: string;
};

export const workProjects: WorkProject[] = [
  {
    id: "shopping-assistant",
    title: "Shopping Assistant",
    image: "/work/shopping-assistant.png",
    alt: "Shopping Assistant project thumbnail",
  },
  {
    id: "pdp-next",
    title: "PDP Next",
    image: "/work/pdp-next.png",
    alt: "PDP Next project thumbnail",
  },
  {
    id: "cart",
    title: "Cart",
    image: "/work/cart.png",
    alt: "Cart project thumbnail",
  },
  {
    id: "plp-next",
    title: "PLP Next",
    image: "/work/plp-next.png",
    alt: "PLP Next project thumbnail",
  },
];
