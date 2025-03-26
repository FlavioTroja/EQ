import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialUser, User, UserFilter } from "../../../models/User";
import { Query } from "../../../../global";
import { PaginateDatasource } from "../../../models/Table";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  http = inject(HttpClient);

  addUser(payload: PartialUser) {
    return this.http.post<User>(`${BASE_URL}/api/registry/users/create`, payload);
  }

  getUser(id: number) {
    return this.http.get<User>(`${BASE_URL}/api/registry/users/${id}`);
  }

  editUser(id: number, payload: PartialUser) {
    const body = { ...payload, id: undefined };
    return this.http.patch<User>(`${BASE_URL}/api/registry/users/${id}`, body);
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`${BASE_URL}/api/registry/users/${id}`);
  }

  loadUsers(payload: Query<UserFilter>) {
    return this.http.get<PaginateDatasource<User>>(`${BASE_URL}/api/registry/users`);
  }

  loadAllUsers(payload: Query<UserFilter>) {
    return this.http.post<User[]>(`${BASE_URL}/api/registry/users/all`, payload);
  }


}
