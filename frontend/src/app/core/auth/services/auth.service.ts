import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Auth, RegisterPayload } from "../../../models/Auth";

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

   /**
   * Avvia il flusso OIDC Authorization Code:
   * Spring Security esporrà /oauth2/authorization/cognito
   * che reindirizza alla Hosted UI di Cognito.
   */
   login(): void {
    window.location.href = `${BASE_URL}/oauth2/authorization/cognito`;
  }

  /**
   * Logout: Spring Security esporrà /logout
   * (oppure personalizza in SecurityConfig il logoutSuccessUrl).
   */
  logout(): void {
    window.location.href = `${BASE_URL}/logout`;
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
