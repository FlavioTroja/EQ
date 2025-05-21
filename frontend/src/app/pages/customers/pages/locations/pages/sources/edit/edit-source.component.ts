import { Component, inject, OnDestroy, OnInit, Signal } from "@angular/core";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../../components/input/input.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../../../app.config";
import { Subject } from "rxjs";
import { getCurrentLocation } from "../../../store/selectors/locations.selectors";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { getRouterData, selectCustomRouteParam } from "../../../../../../../core/router/store/router.selectors";
import { map, pairwise, takeUntil } from "rxjs/operators";
import { PartialLocation } from "../../../../../../../models/Location";
import * as LocationsActions from "../../../store/actions/locations.actions";
import { difference, toggleBooleanFormValue } from "../../../../../../../../utils/utils";
import { PartialSource } from "../../../../../../../models/Source";
import { SectionHeaderComponent } from "../../../../../../../components/section-header/section-header.component";
import {
  MessageContainerComponent
} from "../../../../../../../components/message-container/message-container.component";
import { ConditionsCardComponent } from "../components/conditions-card.component";
import { InputBooleanComponent } from "../../../../../../../components/input-boolean/input-boolean.component";

@Component({
  selector: "app-edit-source",
  standalone: true,
  template: `
    <form [formGroup]="sourceForm">
      <div class="flex flex-col gap-2">
        <div class="flex font-bold uppercase">Modifica sorgente</div>
        <div class="flex flex-col w-full gap-2 md:flex-row">
          <div class="flex md:w-1/4">
            <app-input [formControl]="f.state" formControlName="state" label="macchina" id="location-state" type="text"
                       class="w-full"/>
          </div>
          <div class="flex md:w-1/4">
            <app-input [formControl]="f.region" formControlName="region" label="codice seriale" id="location-region"
                       type="text"
                       class="w-full"/>
          </div>
          <div class="flex md:w-1/4">
            <app-input [formControl]="f.province" formControlName="province" label="u.m. carico" id="location-province"
                       type="text" class="w-full"/>
          </div>
          <div class="flex md:w-1/4">
            <app-input-boolean [formControl]="this.f.showPhantom" message="Mostra &quot;Phantom&quot;" class="w-full self-end" />
          </div>
        </div>
        <div class="bg-grey-1 rounded gap-2 p-2">
          <app-section-header title="Condizioni" [viewOnly]="false" (btnAdd)="click()"/>
          <div class="flex justify-center">
            <!--            <app-message-container-->
            <!--              type="warning"-->
            <!--              icon="warning"-->
            <!--              title="NESSUNA CONDIZIONE"-->
            <!--              message="Per aggiungere una condizione di rilevazione"-->
            <!--              [add]="true"/>-->
          </div>
          <app-conditions-card/>
        </div>
      </div>
    </form>
  `,
  imports: [
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    SectionHeaderComponent,
    MessageContainerComponent,
    ConditionsCardComponent,
    InputBooleanComponent
  ],
  styles: [ `` ]
})
export class EditSourceComponent implements OnInit, OnDestroy {

  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);

  subject = new Subject();

  active$ = this.store.select(getCurrentLocation)
    .pipe(takeUntilDestroyed());

  id = toSignal(this.store.select(selectCustomRouteParam("locationId")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  sourceForm = this.fb.group({
    state: [{ value: "", disabled: this.viewOnly() }, Validators.required ],
    region: [{ value: "", disabled: this.viewOnly() }],
    province: [{ value: "", disabled: this.viewOnly() }],
    showPhantom: [{ value: false, disabled: this.viewOnly() }],
    conditions: [[{}]],
  });

  initFormValue: PartialLocation = {};

  get f() {
    return this.sourceForm.controls;
  }

  get conditions() {
    return this.f.conditions.value?.filter(o => Object.keys(o).length > 0) as any[];
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

        this.sourceForm.patchValue(value);

        this.loadConditions(value.conditions);

        this.initFormValue = this.sourceForm.value as PartialSource;
      });

    this.editLocationChanges();

  }

  loadConditions(conditions: any[]) {
    this.sourceForm.patchValue({
      conditions: conditions
    });
  }

  editLocationChanges() {
    this.sourceForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length && !this.isNewLocation) {
          return {};
        }
        const diff = {
          ...difference(this.initFormValue, newState),

          // Array data
          conditions: [
            ...(newState.conditions || []),
          ]
        };

        return /*createLocationPayload(diff)*/;
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.sourceForm.invalid ? { ...changes, id: this.id() } : {}),
      takeUntil(this.subject),
      // tap(changes => console.log(changes)),
    ).subscribe((changes: any) => this.store.dispatch(LocationsActions.locationActiveChanges({ changes })));
  }

  click() {}

  ngOnDestroy(): void {
    this.sourceForm.reset();

    this.store.dispatch(LocationsActions.clearLocationActive());
    this.store.dispatch(LocationsActions.clearLocationHttpError());
  }

  protected readonly toggleBooleanFormValue = toggleBooleanFormValue;
}