import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from "@ngrx/store";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AppState } from "../../../../../../app.config";
import { getRouterData, selectCustomRouteParam } from "../../../../../../core/router/store/router.selectors";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { map, pairwise, takeUntil } from "rxjs/operators";
import * as LocationsActions from "../../store/actions/locations.actions";
import { Subject } from "rxjs";
import { PartialLocation } from "../../../../../../models/Location";
import { difference } from "../../../../../../../utils/utils";
import { getCurrentLocation } from "../../store/selectors/locations.selectors";
import { InputComponent } from "../../../../../../components/input/input.component";

@Component({
  selector: 'app-edit-location',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ClipboardModule, MatTooltipModule, ReactiveFormsModule, InputComponent ],
  template: `
    <form [formGroup]="locationForm">
      <div class="flex flex-col gap-2">
        <div class="flex font-bold uppercase">informazioni generali</div>
        <div class="flex flex-col w-full gap-2 md:flex-row">
          <div class="flex md:w-1/3">
            <app-input [formControl]="f.state" formControlName="state" label="stato" id="location-state" type="text" class="w-full" />
          </div>
          <div class="flex md:w-1/3">
            <app-input [formControl]="f.region" formControlName="region" label="regione" id="location-region" type="text" class="w-full" />
          </div>
          <div class="flex md:w-1/3">
            <app-input [formControl]="f.province" formControlName="province" label="provincia" id="location-province" type="text" class="w-full" />
          </div>
        </div>
        <div class="flex flex-col gap-2 md:flex-row">
          <div class="flex gap-2 md:w-1/2">
            <div class="flex w-4/5">
              <app-input [formControl]="f.city" formControlName="city" label="città" id="location-city" type="text" class="w-full" />
            </div>
            <div class="flex w-1/5">
              <app-input [formControl]="f.cap" formControlName="cap" label="cap" id="location-cap" type="text" class="w-full" />
            </div>
          </div>
          <div class="flex gap-2 md:w-1/2">
            <div class="flex w-4/5">
              <app-input [formControl]="f.address" formControlName="address" label="indirizzo" id="location-address" type="text" class="w-full" />
            </div>
            <div class="flex w-1/5">
              <app-input [formControl]="f.number" formControlName="number" label="civico" id="location-number" type="text" class="w-full" />
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="flex flex-col basis-full">
            <label for="location-note" class="text-md justify-left block px-3 py-0 font-medium"
                   [ngClass]="f.note.invalid && f.note.dirty ? ('text-red-800') : ('text-gray-900')">
              note
            </label>
            <textarea class="focus:outline-none p-3 rounded-md w-full border-input"
                      [ngClass]="{'border-input-error' : f.note.invalid && f.note.dirty, 'viewOnly' : viewOnly()}"
                      id="location-note"
                      formControlName="note"></textarea>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [``]
})
export default class EditLocationComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  subject = new Subject();

  fb = inject(FormBuilder);

  active$ = this.store.select(getCurrentLocation)
    .pipe(takeUntilDestroyed());

  id = toSignal(this.store.select(selectCustomRouteParam("locationId")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  locationForm = this.fb.group({
    state: [{ value: "", disabled: this.viewOnly() }, Validators.required ],
    region: [{ value: "", disabled: this.viewOnly() }],
    province: [{ value: "", disabled: this.viewOnly() }],
    city: [{ value: "", disabled: this.viewOnly() }],
    cap: [{ value: "", disabled: this.viewOnly() }],
    address: [{ value: "", disabled: this.viewOnly() }],
    number: [{ value: "", disabled: this.viewOnly() }],
    note: [{ value: "", disabled: this.viewOnly() }],
    departments: [[{}]],
  });

  initFormValue: PartialLocation = {};

  get f() {
    return this.locationForm.controls;
  }

  get departments() {
    return this.f.departments.value?.filter(o => Object.keys(o).length > 0) as any[];
  }

  get isNewLocation() {
    return this.id() === "new";
  }

  ngOnInit() {
    if (!this.isNewLocation) {
      this.store.dispatch(
        LocationsActions.getLocation({ id: this.id() })
      );
    }

    this.active$
      .subscribe((value: PartialLocation | any) => {
        if(!value) {
          return;
        }

        this.locationForm.patchValue(value);

        this.loadLocations(value.departments);

        this.initFormValue = this.locationForm.value as PartialLocation;
      });

    this.editLocationChanges();

  }

  loadLocations(departments: any[]) {
    this.locationForm.patchValue({
      departments: departments
    });
  }

  editLocationChanges() {
    this.locationForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length && !this.isNewLocation) {
          return {};
        }
        const diff = {
          ...difference(this.initFormValue, newState),

          // Array data
          departments: [
            ...(newState.departments || []),
          ]
        };

        return /*createLocationPayload(diff)*/;
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.locationForm.invalid ? { ...changes, id: this.id() } : {}),
      takeUntil(this.subject),
      // tap(changes => console.log(changes)),
    ).subscribe((changes: any) => this.store.dispatch(LocationsActions.locationActiveChanges({ changes })));
  }

  ngOnDestroy(): void {
    this.locationForm.reset();

    this.store.dispatch(LocationsActions.clearLocationActive());
    this.store.dispatch(LocationsActions.clearLocationHttpError());
  }
}
