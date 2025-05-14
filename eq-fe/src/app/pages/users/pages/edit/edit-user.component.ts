import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../components/input/input.component";
import { MatIconModule } from "@angular/material/icon";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import * as UserActions from "../../../users/store/actions/users.actions";
import { PartialUser, Roles } from "../../../../models/User";
import { difference } from "../../../../../utils/utils";
import { getCurrentUser } from "../../store/selectors/users.selectors";
import { getRouterData, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FileService } from "../../../../components/upload-image/services/file.service";
import { concatMap, map, mergeMap, of, Subject, takeUntil, pairwise } from "rxjs";
import { FileUploadComponent } from "../../../../components/upload-image/file-upload.component";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatSelectModule, FileUploadComponent, MatDialogModule],
  template: `

    <form [formGroup]="userForm" autocomplete="off">
      <div class="grid gap-3">

        <div class="flex flex-row gap-4 p-2" [ngClass]="{ 'bg-white rounded-md default-shadow' : viewOnly() }">
          <div class="flex flex-col basis-1/6">
            <app-file-upload [ngClass]="{'pointer-events-none' : viewOnly() || userForm.getRawValue().avatarUrl }" [mainImage]="f.avatarUrl.value!" [multiple]="false" label="Foto profilo" (onUpload)="onUploadMainImage($event)" (onDeleteMainImage)="removeProfilePic()" [onlyImages]="true" />
          </div>

          <div *ngIf="!viewOnly() && userForm.getRawValue().avatarUrl" class="flex flex-col basis-1/6 gap-2">
            <div class="flex flex-row">
              <div class="flex items-center p-2 rounded-lg shadow-md default-shadow-hover accent cursor-pointer" (click)="input.click()">
                <mat-icon class="icon-size material-symbols-rounded">repeat</mat-icon>
                <input type="file"
                       #input
                       hidden
                       (change)="openChooseFileDialog($event)"
                       accept=".gif,.jpg,.jpeg,.png">
                Sostituisci
              </div>
            </div>

            <div class="flex flex-row">
              <button class="flex items-center p-2 rounded-lg shadow-md default-shadow-hover error" (click)="removeProfilePic()">
                <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon> Rimuovi
              </button>

            </div>
          </div>
        </div>
        <div *ngIf="!viewOnly()" class="grid gap-3" [ngClass]="isNewUser ? ('grid-cols-2') : ('grid-cols-3')">
          <div>
            <app-input [formControl]="f.username" formControlName="username" label="username" id="user-username" type="text" />
          </div>

          <div>
            <app-input [formControl]="f.email" formControlName="email" label="email" id="user-email" type="email" />
          </div>

          <div class="flex flex-col">
            <label for="user-role" class="text-md justify-left block px-3 py-0 font-medium"
                   [ngClass]="f.roles.invalid && f.roles.dirty ? ('text-red-800') : ('text-gray-900')">
              ruoli
            </label>
            <div
              class="w-full flex shadow-md bg-foreground text-gray-900 text-sm rounded-lg border-input focus:outline-none p-3 font-bold"
              [ngClass]="{'viewOnly' : viewOnly()}">
              <mat-select id="user-role" [multiple]="true" [formControl]="f.roles" placeholder="seleziona">
                <mat-option *ngFor="let role of roles" [value]="role">{{ role }}
                </mat-option>
              </mat-select>
            </div>
          </div>

          <div class="flex flex-row gap-2 w-full">
            <div *ngIf='isNewUser' class="relative flex flex-col w-full">
              <app-input [type]="showPassword ? 'text' : 'password'" [formControl]="f.password" autocomplete="new-password" formControlName="password" label="password" id="user-generate-password" type="password" />
              <button (click)="togglePassword()" type="button" class="absolute end-0.5 -bottom-1.5 rounded-lg text-sm px-4 py-3 items-center">
                <mat-icon class="material-symbols-rounded">visibility{{showPassword ? '_off' : ''}}</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [ ``]
})
export default class EditUserComponent implements OnInit, OnDestroy {

  fb = inject(FormBuilder);
  store: Store<AppState> = inject(Store);
  imageService = inject(FileService);

  subject = new Subject();

  active$ = this.store.select(getCurrentUser)
    .pipe(takeUntilDestroyed());

  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  userForm = this.fb.group({
    username: [{ value: "", disabled: this.viewOnly() }, Validators.required],
    password: [{ value: "", disabled: this.viewOnly() }],
    email: [{ value: "", disabled: this.viewOnly() }, Validators.required],
    roles: [[""], Validators.required],
    avatarUrl: [""]
  });

  initFormValue: PartialUser = {};
  showPassword = false;

  get f() {
    return this.userForm.controls;
  }

  get isNewUser() {
    return this.id() === "new";
  }

  get roles(): string[] {
    return Object.keys(Roles);
  }

  ngOnInit() {

    if (!this.isNewUser) {
      this.store.dispatch(
        UserActions.getUser({ id: this.id() })
      );
    }

    this.active$
      .subscribe((value: PartialUser | any) => {
        if (!value) {
          return;
        }


        this.initFormValue = value as PartialUser;
        this.userForm.patchValue({
          ...value,
          roles: ((value as PartialUser).roles ?? [])
        });
      });

    this.editUserChanges();
  }

  editUserChanges() {
    this.userForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length && !this.isNewUser) {
          return {};
        }
        const diff = {
          ...difference(this.initFormValue, newState),

          // Array data
          roles: newState.roles
        };

        return {} //createUserPayload(diff, this.initFormValue.roles ?? []);
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.userForm.invalid ? { ...changes, id: +this.id() } : {}),
      takeUntil(this.subject),
      // tap(changes => console.log(changes)),
    ).subscribe((changes) => {
      this.store.dispatch(UserActions.userActiveChanges({ changes }));
    });
  }

  openChooseFileDialog(event: any) {

    const files: File[] = event.target.files;
    if (files.length === 0) {
      return;
    }
    of(files).pipe(
      mergeMap(r => r),
      map(file => {
        const formData = new FormData();
        formData.append("image", file, file.name);
        return formData;
      }),
      concatMap(formData => this.imageService.uploadImage(formData)),
      takeUntil(this.subject)
    ).subscribe(res => {
        this.userForm.patchValue({ avatarUrl: res.url });
    });

  }

  removeProfilePic() {
    this.userForm.patchValue({ avatarUrl: '' });
  }

  onUploadMainImage(images: string[]) {
    this.userForm.patchValue({ avatarUrl: images[0] });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.userForm.reset();

    this.store.dispatch(UserActions.clearUserActive());
    this.store.dispatch(UserActions.clearUserHttpError());
  }

}
