import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FillInContainerComponent } from "../../components/fill-in-container.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { getRouterData, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../../components/input/input.component";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Customer, PartialCustomer } from "../../../../models/Customer";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { CustomersService } from "../../../customers/services/customers.service";
import { map, Observable, of, Subject, takeUntil } from "rxjs";
import { PaginateDatasource } from "../../../../models/Table";
import { debounceTime, distinctUntilChanged, pairwise } from "rxjs/operators";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { Location, PartialLocation } from "../../../../models/Location";
import * as RouterActions from "../../../../core/router/store/router.actions";
import * as ReportActions from "../../store/actions/reports.actions";
import { getCurrentReport } from "../../store/selectors/reports.selectors";
import { createReportPayload, PartialReport } from "../../../../models/Report";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatNativeDateModule } from "@angular/material/core";

@Component({
    selector: 'app-edit-report',
    standalone: true,
    template: `
      <div class="flex flex-col gap-4 px-3" [formGroup]="reportForm">
        <div class="flex flex-col gap-2">
          <div class="text-xl font-bold">INFORMAZIONI GENERALI</div>
          <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex flex-col grow">
              <label class="text-md justify-left block px-3 py-0 font-medium">Cliente</label>
              <input
                type="text"
                class="focus:outline-none p-3 rounded-md w-full border-input"
                placeholder="Scegli il cliente"
                matInput
                formControlName="customer"
                [matAutocomplete]="customerAutocomplete"
                [readonly]="viewOnly()"
              >

              <mat-autocomplete #customerAutocomplete="matAutocomplete" [displayWith]="displayCustomer"
                                (optionSelected)="onCustomerSelect($event)">
                <mat-option *ngFor="let customer of (customers$ | async)" [value]="customer">
                  {{ customer.name }}
                </mat-option>
              </mat-autocomplete>
            </div>
            <div class="flex flex-col grow">
              <label class="text-md justify-left block px-3 py-0 font-medium">Sede</label>
              <input
                type="text"
                class="focus:outline-none p-3 rounded-md w-full border-input"
                [ngClass]="{
                  'viewOnly opacity-50 pointer-events-none': !(locations$ | async)?.length
                }"
                placeholder="Scegli la sede"
                matInput
                formControlName="location"
                [matAutocomplete]="locationAutocomplete"
                [readonly]="viewOnly()"
              >
              <mat-autocomplete #locationAutocomplete="matAutocomplete" [displayWith]="displayLocation"
                                (optionSelected)="onCustomerLocationSelect($event)">
                <mat-option *ngFor="let location of (locations$ | async)" [value]="location">
                  {{ location.name }}
                </mat-option>
              </mat-autocomplete>
            </div>
            <div class="flex flex-col grow relative">
              <mat-label>Data lettura</mat-label>
              <input matInput [matDatepicker]="datePicker"
                     formControlName="readDate"
                     placeholder="gg/mm/yyyy"
                     class="focus:outline-none p-3 rounded-md w-full border-input"
                     [ngClass]="{'viewOnly' : viewOnly()}">
              <mat-datepicker-toggle class="absolute end-0.5 top-6" matIconSuffix [for]="datePicker">
                <mat-icon class="material-symbols-rounded">event</mat-icon>
              </mat-datepicker-toggle>
              <mat-datepicker #datePicker></mat-datepicker>
              
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-bold">COMPILAZIONE</div>
          <app-fill-in-container componentStyle="accent" [showBg]="true" [completedNumber]="completedDepartments" [totalNumber]="totalDepartments" [viewOnly]="!totalDepartments" (onClick)="compileReport()"/>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-bold">NOTE CONCLUSIVE</div>
          <div class="flex flex-col">
            <div class="flex flex-col gap-2 md:flex-row">
              <div class="flex grow">
                <app-input [formControl]="f.warningSignage" label="Cartellonistica di avvertimento" id="warningSignage" type="text" class="w-full"/>
              </div>
              <div class="flex grow">
                <app-input [formControl]="f.safetyLights" label="Segnaletica luminosa di sicurezza" id="safetyLights" type="text" class="w-full"/>
              </div>
              <div class="flex grow">
                <app-input [formControl]="f.ppe" label="Dispositivi per la protezione individuale" id="ppe" type="text" class="w-full"/>
              </div>
            </div>
            <div class="flex flex-col gap-2 md:flex-row">
              <div class="flex grow">
                <app-input [formControl]="f.safetyDevices" label="Dispositivi di sicurezza" id="safetyDevices" type="text" class="w-full"/>
              </div>
              <div class="flex grow">
                <app-input [formControl]="f.dosimeters" label="Dosimetri individuali assegnati e idonei" id="dosimeters" type="text" class="w-full"/>
              </div>
              <div class="flex grow">
                <app-input [formControl]="f.radiationRules" label="Norme interne di radioprotezione" id="radiationRules" type="text" class="w-full"/>
              </div>
            </div>
            <div class="flex grow">
              <div class="flex flex-col basis-full mb-2">
                <label for="prevReportNotes" class="text-md justify-left block px-3 py-0 font-medium">Note (su precedente verbale)</label>
                <textarea class="focus:outline-none p-3 rounded-md w-full border-input"
                          id="prevReportNotes"
                          formControlName="prevReportNotes">
                </textarea>
              </div>
            </div>
            <div class="flex grow">
              <app-input [formControl]="f.actionsRequired" label="Provvedimenti da adottare" id="actionsRequired" type="text" class="w-full"/>
            </div>
            <div class="flex grow">
              <app-input [formControl]="f.recommendations" label="Raccomandazioni" id="recommendations" type="text" class="w-full"/>
            </div>
            <div class="flex grow">
              <app-input [formControl]="f.conclusion" label="Conclusione" id="conclusion" type="text" class="w-full"/>
            </div>
          </div>
        </div>
      </div>
    `,
    styles: [``],
  imports: [
    CommonModule,
    FillInContainerComponent,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    InputComponent
  ]
})
export default class EditReportComponent implements OnInit, OnDestroy {
  store: Store<AppState> = inject(Store);
  customerService = inject(CustomersService);
  fb = inject(FormBuilder);
  subject = new Subject();
  defaultFilterOptions = { page: 1, limit: 30 };

  active$ = this.store.select(getCurrentReport)
    .pipe(takeUntilDestroyed());
  initFormValue: PartialReport = {};

  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  customers$ = this.customerService.loadCustomers({ query: {}, options: this.defaultFilterOptions })
    .pipe(map((res: PaginateDatasource<Customer>) => res.content));
  locations$: Observable<Location[]> = of([]);

  reportForm = this.fb.group({
    customer: [{} as Customer , Validators.required],
    location: [{} as Location, Validators.required],
    readDate: [""],
    warningSignage: [""],
    safetyLights: [""],
    ppe: [""],
    safetyDevices: [""],
    dosimeters: [""],
    radiationRules: [""],
    prevReportNotes: [""],
    actionsRequired: [""],
    recommendations: [""],
    conclusion: [""],
  });

  get f() {
    return this.reportForm.controls;
  }

  get totalDepartments(): number {
    return this.f.location.value?.departments?.length || 0;
  }

  get completedDepartments(): number {
    return this.f.location.value?.completedDepartments || 0;
  }

  get isNewReport() {
    return this.id() === "new";
  }

  constructor() {
    this.f.customer.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.subject)
    ).subscribe((textOrCustomer: any) => {

      if(!!(textOrCustomer as Customer | null)?.id) {
        return;
      }

      this.customers$ = this.customerService.loadCustomers({ query: {
          value: textOrCustomer || ""
        }, options: this.defaultFilterOptions }).pipe(map((res: PaginateDatasource<Customer>) => res.content));

    });
  }

  displayCustomer(customer: PartialCustomer): string {
    return customer?.name ?? "";
  }

  displayLocation(location: PartialLocation): string {
    return location?.name ?? "";
  }

  onCustomerSelect(event: any) {
    this.f.location.reset();

    const customer = event.option.value as Customer | any;
    this.locations$ = this.customerService.getCustomer(customer.id).pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.subject),
      map((res: Customer) => {
        this.f.customer.patchValue(res);
        return res.locations
      })
    );
  }

  onCustomerLocationSelect(event: any) {
    // const location = event.option.value as PartialLocation;
  }

  compileReport(): void {
    this.store.dispatch(RouterActions.go({ path: [`/reports/${this.id()}/compile/0`] }));
  }

  ngOnInit() {

    if (!this.isNewReport) {
      this.store.dispatch(
        ReportActions.getReport({ id: this.id(), params: {} })
      );
    }

    this.active$
      .subscribe((value: PartialReport | any) => {
        if(!value) {
          return;
        }

        this.reportForm.patchValue(value);
        if(!!value.customer) {
          this.locations$ = of(value.customer.locations);
        }

        this.initFormValue = this.reportForm.value as PartialReport;
      });

    this.editReportChanges();
  }

  editReportChanges() {
    this.reportForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length && !this.isNewReport) {
          return {};
        }

        return createReportPayload(newState);
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.reportForm.invalid ? { ...changes, id: this.id() } : {}),
      takeUntil(this.subject),
    ).subscribe((changes: any) => this.store.dispatch(ReportActions.reportActiveChanges({ changes })));
  }

  ngOnDestroy() {
    this.store.dispatch(ReportActions.updateCurrentReport());
  }
}
