import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export enum Roles {
  USER = "user",
  ADMIN = "admin",
  OVERZOOM = "OVERZOOM",
}

export interface User {
  id: number,
  username: string,
  email: string,
  roles: Roles[],
  avatarUrl: string
  note: string
  deleted: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export type PartialUser = Partial<User>;



// export function createUserPayload(user: any): PartialUser {
//   const userDto = {
//     username: user.username,
//     email: user.email,
//     avatarUrl: user.avatarUrl,
//     password: user.password,
//     roles: user.roles,
//   }
//   return <UserDTO>omitBy(userDto, overSome([isNil, isNaN]));
// }

export interface UserFilter {
  value?: string
}
