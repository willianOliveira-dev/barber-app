interface QuickSearchOptions {
  label: string
  icon: string
}

export const QUICK_SEARCH_OPTIONS: QuickSearchOptions[] = [
  {
    label: "Cabelo",
    icon: "/icons/hair.svg",
  },
  {
    label: "Barba",
    icon: "/icons/beard.svg",
  },
  {
    label: "Acabamento",
    icon: "/icons/razor.svg",
  },
  {
    label: "Sobrancelha",
    icon: "/icons/eyebrow.svg",
  },
  {
    label: "Massagem",
    icon: "/icons/towel.svg",
  },
  {
    label: "Hidratação",
    icon: "/icons/huge.svg",
  },
]

export const QUICK_SEARCH_ALL_OPTIONS: QuickSearchOptions[] = [
  {
    label: "Todos",
    icon: "/icons/all.svg",
  },
  ...QUICK_SEARCH_OPTIONS,
]
