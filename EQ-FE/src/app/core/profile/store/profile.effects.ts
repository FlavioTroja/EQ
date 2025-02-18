import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as ProfileAction from "./profile.actions";
import { ProfileService } from "../services/profile.service";
import { catchError, concatMap, exhaustMap, map, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  constructor(private actions$: Actions,
              private profileService: ProfileService) {}

  loadProfile$ = createEffect(() => this.actions$.pipe(
    ofType(ProfileAction.loadProfile),
    exhaustMap(() => this.profileService.load().pipe(
        concatMap((user) => [
          ProfileAction.loadProfileSuccess({ user: user }),
        ]),
        catchError(() => of(ProfileAction.loadProfileFailed()))
      ))
  ));


  editProfile$ = createEffect(() => this.actions$.pipe(
    ofType(ProfileAction.editProfile),
    exhaustMap(({user}) => this.profileService.edit(user).pipe(
        map((user) => ProfileAction.editProfileSuccess({ user })),
        catchError(() => of(ProfileAction.editProfileFailed()))
      ))
  ));

}
