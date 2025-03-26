import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Auth, LoginPayload, RegisterPayload } from "../../../models/Auth";

const BASE_URL = environment.BASE_URL;
const AUTH_KEY = "Authorization";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  register(payload: RegisterPayload) {
    return this.http.post<Auth>(`${BASE_URL}/auth/register`, payload);
  }

  login(payload: LoginPayload) {
    return this.http.post<Auth>(`${BASE_URL}/auth/login`, payload);
  }

  saveAuth(auth: Auth) {
    localStorage.setItem(AUTH_KEY, auth.access_token ?? "");
  }

  getAccessToken() {
    return localStorage.getItem(AUTH_KEY);
  }

  cleanAuth() {
    localStorage.removeItem(AUTH_KEY)
  }
}
