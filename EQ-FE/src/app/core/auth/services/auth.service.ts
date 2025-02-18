import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Auth, LoginPayload } from "../../../models/Auth";

const BASE_URL = environment.BASE_URL;
const AUTH_KEY = "Authorization";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  login(credentials: LoginPayload) {
    const payload = {
      client_id: "eq-project",
      username: credentials.usernameOrEmail,
      password: credentials.password,
      grant_type: "password"
    };

    return this.http.post<Auth>(`${BASE_URL}/realms/EQ/protocol/openid-connect/token`, payload);
  }

  saveAuth(auth: Auth) {
    localStorage.setItem(AUTH_KEY, auth.token ?? "");
  }

  getAccessToken() {
    return localStorage.getItem(AUTH_KEY);
  }

  cleanAuth() {
    localStorage.removeItem(AUTH_KEY)
  }
}
