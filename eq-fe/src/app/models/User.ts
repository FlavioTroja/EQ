import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export enum Roles {
  USER = "USER",
  ADMIN = "ADMIN",
  OVERZOOM = "OVERZOOM",
}

export interface Role {
  id: number;
  isActive: boolean;
  roleName: Roles
  userId: number;
}

export interface RoleName {
  name: string,
  label: string,
  rank: number,
  isActive: boolean,
}

export interface User {
  id: number,
  username: string,
  email: string,
  roles: Role[],
  avatarUrl: string
  note: string
  deleted: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export type PartialUser = Partial<User>;

function createRolesPayload(initRoles: Role[], newRoles: Roles[]) {
  const roles = newRoles.map(role => ({
    id: initRoles.find(r => r.roleName === role)?.id || -1,
    roleName: role
  })) || [];

  const deleted = initRoles
    .filter(r => !roles.find(role => role.roleName === r.roleName))
    .map(r => ({ ...r, toBeDisconnected: true }));

  return [ ...roles, ...deleted ];
}

// export function createUserPayload(user: any, initialRoles: Role[]): PartialUser {
//   const userDto = {
//     username: user.username,
//     email: user.email,
//     avatarUrl: user.avatarUrl,
//     password: user.password,
//     roles: createRolesPayload(initialRoles, user.roles ?? []),
//   }
//   return <ProductDTO>omitBy(userDto, overSome([isNil, isNaN]));
// }

export interface UserFilter {
  value?: string
}

export function findRoleLabel(rolesNames: RoleName[], role: Roles | string): string {
  return rolesNames.find((roleName) => roleName.name === role)?.label ?? "";
}
