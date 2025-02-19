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
    iconName: "description",
    path: "/verbals",
    label: "Verbali",
  },
  {
    iconName: "precision_manufacturing",
    path: "/machines",
    label: "Macchine"
  },
  {
    iconName: "group",
    path: "/customers",
    label: "Clienti",
  },
];
