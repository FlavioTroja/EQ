import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../components/input/input.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { getRouterData, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import * as MachineActions from "../../store/actions/machines.actions";
import { getCurrentMachine } from "../../store/selectors/machines.selectors";
import { difference } from "../../../../../utils/utils";
import { map, pairwise, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { createMachinePayload, getLabelFromMachineType, MachineType, PartialMachine } from "../../../../models/Machine";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-machine-edit',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, InputComponent, MatIconModule, MatOptionModule, MatSelectModule ],
  template: `
    <ng-container>
      <div class="text-1xl font-extrabold uppercase">Informazioni generali</div>
      <form [formGroup]="machineForm" class="flex flex-col">
        <div class="flex flex-col gap-2 md:flex-row">
          <div class="flex grow md:w-1/2">
            <app-input [formControl]="f.name" label="nome" id="name" type="text" class="w-full"/>
          </div>
          <div class="flex flex-col md:w-1/2">
            <label for="machine-type" class="text-md justify-left block px-3 py-0 font-medium"
                   [ngClass]="f.type.invalid && f.type.dirty ? ('text-red-800') : ('text-gray-900')">
              tipo
            </label>
            <div
              class="w-full flex shadow-md bg-foreground text-gray-900 text-sm rounded-lg border-input focus:outline-none p-3 font-bold"
              [ngClass]="{'viewOnly' : viewOnly()}">
              <mat-select id="machine-type" [formControl]="f.type" placeholder="seleziona">
                <mat-option *ngFor="let type of types" [value]="type">{{ getLabelFromMachineType[type] }}
                </mat-option>
              </mat-select>
            </div>
          </div>
        </div>
      </form>
    </ng-container>
  `,
  styles: []
})
export default class EditMachineComponent implements OnInit, OnDestroy  {
  store: Store<AppState> = inject(Store);
  subject = new Subject();

  fb = inject(FormBuilder);

  active$ = this.store.select(getCurrentMachine)
    .pipe(takeUntilDestroyed());

  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  machineForm = this.fb.group({
    name: [{ value: "", disabled: this.viewOnly() }, Validators.required],
    type: [{ value: "", disabled: this.viewOnly() }, Validators.required],
  });

  initFormValue: PartialMachine = {};

  get f() {
    return this.machineForm.controls;
  }

  get isNewMachine() {
    return this.id() === "new";
  }

  get types(): string[] {
    return Object.keys(MachineType);
  }

  ngOnInit() {

    if (!this.isNewMachine) {
      this.store.dispatch(
        MachineActions.getMachine({ id: this.id(), params: { populate: "address" } })
      );
    }

    this.active$
      .subscribe((value: PartialMachine | any) => {
        if(!value) {
          return;
        }

        this.machineForm.patchValue(value);

        this.initFormValue = this.machineForm.value as PartialMachine;
      });

    this.editSupplierChanges();
  }

  editSupplierChanges() {
    this.machineForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length && !this.isNewMachine) {
          return {};
        }

        const diff = {
          ...difference(this.initFormValue, newState),
        };

        return createMachinePayload(diff);
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.machineForm.invalid ? { ...changes, id: this.id() } : {}),
      takeUntil(this.subject),
    ).subscribe((changes: any) => this.store.dispatch(MachineActions.machineActiveChanges({ changes })));
  }

  ngOnDestroy(): void {
    this.machineForm.reset();

    this.store.dispatch(MachineActions.clearMachineActive());
    this.store.dispatch(MachineActions.clearMachineHttpError());
  }

  protected readonly getLabelFromMachineType = getLabelFromMachineType;
}
