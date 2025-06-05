import { Component, inject, OnDestroy, OnInit, Signal } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../../../components/input/input.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../../../../app.config";
import { Subject } from "rxjs";
import { getCurrentSource } from "../../store/selectors/sources.selectors";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { getRouterData } from "../../../../../../../../core/router/store/router.selectors";
import { debounceTime, map, pairwise, takeUntil } from "rxjs/operators";
import { createSourcePayload, PartialSource } from "../../../../../../../../models/Source";
import * as SourceActions from "../../store/actions/sources.actions";
import { difference } from "../../../../../../../../../utils/utils";
import { SectionHeaderComponent } from "../../../../../../../../components/section-header/section-header.component";
import { ConditionsCardComponent } from "../../components/conditions-card.component";
import { InputBooleanComponent } from "../../../../../../../../components/input-boolean/input-boolean.component";
import { CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { Machine, PartialMachine } from "../../../../../../../../models/Machine";
import { PaginateDatasource } from "../../../../../../../../models/Table";
import { MachinesService } from "../../../../../../../machines/services/machines.service";

@Component({
  selector: "app-edit-source",
  standalone: true,
  template: `
    <form [formGroup]="sourceForm">
      <div class="flex flex-col gap-2">
        <div class="flex font-bold uppercase">Modifica sorgente</div>
        <div class="flex flex-col w-full gap-2 md:flex-row">
          <div class="flex md:w-1/4">
            <div class="flex flex-col grow">
              <label class="text-md justify-left block px-3 py-0 font-medium">macchina</label>
              <input
                type="text"
                class="focus:outline-none p-3 rounded-md w-full border-input"
                placeholder="Scegli la macchina"
                matInput
                formControlName="machine"
                [matAutocomplete]="machineAutocomplete"
                [readonly]="viewOnly()"
              >

              <mat-autocomplete #machineAutocomplete="matAutocomplete" [displayWith]="displayMachine">
                <mat-option *ngFor="let machine of (machines$ | async)" [value]="machine">
                  {{ machine.name }}
                </mat-option>
              </mat-autocomplete>
            </div>
          </div>
          <div class="flex md:w-1/4">
            <app-input [formControl]="f.sn" formControlName="sn" label="codice seriale" id="source-sn"
                       type="text"
                       class="w-full"/>
          </div>
          <div class="flex md:w-1/4">
            <app-input [formControl]="f.umload" formControlName="umload" label="u.m. carico" id="source-umload"
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
    ConditionsCardComponent,
    InputBooleanComponent,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
  ],
  styles: [ `` ]
})
export class EditSourceComponent implements OnInit, OnDestroy {

  store: Store<AppState> = inject(Store);
  fb = inject(FormBuilder);
  machineService = inject(MachinesService)

  subject = new Subject();

  active$ = this.store.select(getCurrentSource)
    .pipe(takeUntilDestroyed());
  machines$ = this.machineService.loadMachines({ query: {} })
    .pipe(map((res: PaginateDatasource<Machine>) => res.content));

  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  sourceForm = this.fb.group({
    machine: [{ value: "", disabled: this.viewOnly() }, Validators.required ],
    sn: [{ value: "", disabled: this.viewOnly() }],
    umload: [{ value: "", disabled: this.viewOnly() }],
    showPhantom: [{ value: false, disabled: this.viewOnly() }],
    conditions: [[{}]],
  });

  initFormValue: PartialSource = {};

  get f() {
    return this.sourceForm.controls;
  }

  get conditions() {
    return this.f.conditions.value?.filter(o => Object.keys(o).length > 0) as any[];
  }

  displayMachine(machine: PartialMachine): string {
    return machine?.name ?? "";
  }

  constructor() {
    this.f.machine.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.subject)
    ).subscribe((textOrMachine: any) => {

      if ((textOrMachine as Machine | null)?.id) {
        return;
      }

      this.machines$ = this.machineService.loadMachines({
        query: {
          value: textOrMachine || ""
        }, options: {}
      }).pipe(map((res: PaginateDatasource<Machine>) => res.content));

    });
  }

  ngOnInit() {
    this.active$
      .subscribe((value: PartialSource | any) => {
        if(!value) {
          return;
        }

        this.sourceForm.patchValue(value);

        this.loadConditions(value.conditions);

        this.initFormValue = this.sourceForm.value as PartialSource;
      });

    this.editSourceChanges();

  }

  loadConditions(conditions: any[]) {
    this.sourceForm.patchValue({
      conditions: conditions
    });
  }

  editSourceChanges() {
    this.sourceForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length) {
          return {};
        }
        const diff = {
          ...difference(this.initFormValue, newState),

          // Array data
          conditions: [
            ...(newState.conditions || []),
          ]
        };

        return createSourcePayload(diff);
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.sourceForm.invalid ? { ...changes } : {}),
      takeUntil(this.subject),
      // tap(changes => console.log(changes)),
    ).subscribe((changes: any) => this.store.dispatch(SourceActions.sourceActiveChanges({ changes })));
  }

  click() {}

  ngOnDestroy(): void {
    this.sourceForm.reset();

    this.store.dispatch(SourceActions.clearSourceActive());
    this.store.dispatch(SourceActions.clearSourceHttpError());
  }

}