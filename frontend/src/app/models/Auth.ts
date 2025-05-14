export interface LoginPayload {
  username: string,
  password: string
}

export interface RegisterPayload {
  username: string,
  cellphone: string,
  password: string,
  confirmPassword: string
}

export interface Auth {
  access_token?: string
}
