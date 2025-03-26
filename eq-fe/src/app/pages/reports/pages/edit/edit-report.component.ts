import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FillInContainerComponent } from "../../components/fill-in-container.component";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { getRouterData, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { toSignal } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../../components/input/input.component";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Customer, PartialCustomer } from "../../../../models/Customer";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { CustomersService } from "../../../customers/services/customers.service";
import { map, Observable, of, Subject, takeUntil, tap } from "rxjs";
import { PaginateDatasource } from "../../../../models/Table";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { Location, PartialLocation } from "../../../../models/Location";

@Component({
    selector: 'app-edit-report',
    standalone: true,
    template: `
      <div class="flex flex-col gap-4 px-3" [formGroup]="reportForm">
        <div class="flex flex-col gap-2">
          <div class="text-xl font-bold">INFORMAZIONI GENERALI</div>
          <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex flex-col grow">
              <label class="text-md justify-left block px-3 py-0 font-medium">cliente</label>
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
              <label class="text-md justify-left block px-3 py-0 font-medium">sede</label>
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
            <app-input class="grow" [formControl]="f.readDate" label="Data Lettura" id="readDate" type="string"/>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-bold">COMPILAZIONE</div>
          <app-fill-in-container componentStyle="accent" [showBg]="true" (onClick)="compileReport()"/>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-bold">NOTE CONCLUSIVE</div>
          <div class="flex"></div>
        </div>
      </div>
    `,
    styles: [``],
  imports: [
    CommonModule,
    FillInContainerComponent,
    InputComponent,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule
  ]
})
export default class EditReportComponent {
  store: Store<AppState> = inject(Store);
  customerService = inject(CustomersService);
  fb = inject(FormBuilder);
  subject = new Subject();
  defaultFilterOptions = { page: 1, limit: 30 };

  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  customers$ = this.customerService.loadCustomers({ query: {}, options: this.defaultFilterOptions })
    .pipe(map((res: PaginateDatasource<Customer>) => res.content));
  locations$: Observable<Location[]> = of([]);

  reportForm = this.fb.group({
    customer: ["", Validators.required],
    location: ["", Validators.required],
    readDate: ["", Validators.required],
    note: ["", Validators.required],
    note1: ["", Validators.required],
    note2: ["", Validators.required],
    note3: ["", Validators.required],
    note4: ["", Validators.required],
    note5: ["", Validators.required],
    note6: ["", Validators.required],
    note7: ["", Validators.required],
    note8: ["", Validators.required],
    note9: ["", Validators.required],
  });

  get f() {
    return this.reportForm.controls;
  }

  constructor() {
    this.f.customer.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.subject)
    ).subscribe((textOrCustomer: any) => {

      if((textOrCustomer as Customer | null)?.id) {
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
    console.log("called select customer")
    const customer = event.option.value as Customer | any;
    this.locations$ = this.customerService.loadCustomerLocations({query: { customerId: customer.id } }).pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.subject),
      tap(() => console.log("tap loadcustomerlocation")),
      map((res: PaginateDatasource<Location>) => {
        console.log("inside map")
        return res.content
      })
    );
  }

  onCustomerLocationSelect(event: any) {
    const location = event.option.value as PartialLocation;
    let a = this.customerService.getLocation(location).subscribe((value => console.log(value)));
  }

  compileReport(): void {
    this.store.dispatch(RouterActions.go({ path: [`/reports/${this.id()}/compile/67b88f0f56vs3c19fgf5afb9`] }));
  }
}
