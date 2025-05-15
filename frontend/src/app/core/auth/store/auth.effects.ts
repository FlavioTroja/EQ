import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { catchError, exhaustMap, filter, map, of, tap } from "rxjs";
import * as ProfileActions from "../../profile/store/profile.actions";
import * as RouterActions from "../../router/store/router.actions";
import { AuthService } from "../services/auth.service";
import * as AuthActions from "./auth.actions";

@Injectable({
  providedIn: 'root'
})
export class AuthEffects  {

  initEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => this.authService.getAccessToken()),
    filter(accessToken => !!accessToken),
    exhaustMap((accessToken) => [
      AuthActions.saveAuth({ auth: { access_token: accessToken ?? undefined } }),
      ProfileActions.loadProfile()
    ])
  ));

  registerEffect$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.register),
    exhaustMap(({ username, password, confirmPassword, cellphone }) => this.authService.register({ username, password, confirmPassword, cellphone })
      .pipe(
        map(auth => AuthActions.registerSuccess({ auth: auth })),
        catchError((err) => {
          return of(AuthActions.registerFailed(err))
        })
      ))
  ));

  // Login → redirect a Cognito (no dispatch di altre azioni)
  loginRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(() => this.authService.login())
    ),
    { dispatch: false }
  );

  // Logout → redirect al logout handler di Spring
  logoutRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.authService.logout())
    ),
    { dispatch: false }
  );

  loginSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(({ auth }) => this.authService.saveAuth(auth)),
    exhaustMap(() => [
      ProfileActions.loadProfile(),
      RouterActions.go({ path: ["home"] })
    ])
  ));

  logoutEffect$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => this.authService.cleanAuth()),
    exhaustMap(() => [
      RouterActions.go({ path: [""] }),
      AuthActions.logoutSuccess()
    ])
  ));
  constructor(private actions$: Actions,
              private authService: AuthService) {}
}
