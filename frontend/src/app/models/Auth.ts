export interface LoginPayload {
  username: string,
  password: string
}

export interface RegisterPayload {
  name: string,
  surname: string,
  email: string,
  password: string,
  confirmPassword: string
}

export interface Auth {
  access_token?: string
}
