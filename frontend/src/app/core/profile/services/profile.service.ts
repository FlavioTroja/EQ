import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PartialUser } from "../../../models/User";
import { environment } from "../../../../environments/environment";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.config";
import { of } from "rxjs";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);
  store: Store<AppState> = inject(Store);

  load() {
    return this.http.get<PartialUser>(`${BASE_URL}/api/registry/users/profile`);
    // return of({})
  }

  edit(user: PartialUser) {
    return this.http.patch<PartialUser>( `${BASE_URL}/auth/me`, user);
  }
}
