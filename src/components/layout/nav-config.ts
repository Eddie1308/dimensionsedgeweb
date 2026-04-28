// Single source of truth for the public navigation.
// Translation keys map to nav.* in src/i18n/messages/{en,ar}.json.
export type NavItem = { href: string; key: string };

export const primaryNav: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/partners", key: "partners" },
  { href: "/clients", key: "clients" },
  { href: "/contact", key: "contact" },
];
