import { Roles } from "../../../models/User";

export interface RouteElement {
  iconName: string,
  label: string,
  path: string,
  provideRoles?: Roles[],
  roleSelector?: string,
  children?: Omit<RouteElement, "children">[],
  isLast?: boolean,
}

export const sidebarRoutes: RouteElement[] = [
  {
    iconName: "home",
    path: '/home',
    label: "Dashboard",
    children: [],
    isLast: true,
  },
  {
    iconName: "package_2",
    path: "/products",
    label: "Prodotti",
    children: [
      { iconName: "package_2", label: "Lista Prodotti", path: "/products" },
      { iconName: "category", label: "Categorie", path: "/categories" }
    ]
  },
  {
    iconName: "open_with",
    path: "/cargos",
    label: "Movimentazioni"
  },
  {
    iconName: "local_shipping",
    path: "/suppliers",
    label: "Fornitori",
    roleSelector: "sidebar.body.suppliers"
  },
  {
    iconName: "group",
    path: "/customers",
    label: "Clienti",
  },
  {
    iconName: "person",
    path: "/resources",
    label: "Risorse",
    roleSelector: "sidebar.body.resources",
    isLast: true,
  },
  {
    iconName: "road",
    path: "/inspections",
    label: "Allestimenti",
    children: [
      { iconName: "category_search", label: "Sopralluoghi", path: "/inspections" },
      { iconName: "assignment", label: "Schede tecniche", path: "/taskSteps" },
      { iconName: "service_toolbox", label: "Lavori avviati", path: "/inspections/new/view" },
      { iconName: "work_history", label: "Lavori conclusi", path: "/inspections/new/view" },
    ]
  },
];
