import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { map, pairwise, takeUntil } from "rxjs/operators";
import { difference } from "../../../../../utils/utils";
import { AppState } from "../../../../app.config";
import { InputComponent } from "../../../../components/input/input.component";
import { getRouterData, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import {
    createCustomerPayload,
    LocationOnCustomerSection,
    PartialCustomer
} from "../../../../models/Customer";
import {
    CustomerLocationsSectionComponent
} from "../../components/customer-locations-selections/customer-locations-section.component";
import * as CustomerActions from "../../store/actions/customers.actions";
import { getCurrentCustomer } from "../../store/selectors/customers.selectors";


@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, InputComponent, MatIconModule, MatSelectModule, CustomerLocationsSectionComponent ],
  templateUrl: "edit-customer.component.html",
  styles: [``]
})
export default class EditCustomerComponent implements OnInit, OnDestroy {

  store: Store<AppState> = inject(Store);
  subject = new Subject();

  fb = inject(FormBuilder);

  active$ = this.store.select(getCurrentCustomer)
    .pipe(takeUntilDestroyed());

  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  viewOnly: Signal<boolean> = toSignal(this.store.select(getRouterData).pipe(
    map(data => data!["viewOnly"] ?? false)
  ));

  customerForm = this.fb.group({
    name: [{ value: "", disabled: this.viewOnly() }, Validators.required ],
    fiscalCode: [{ value: "", disabled: this.viewOnly() }],
    vatNumber: [{ value: "", disabled: this.viewOnly() }],
    sdiNumber: [{ value: "", disabled: this.viewOnly() }],
    email: [{ value: "", disabled: this.viewOnly() }],
    pec: [{ value: "", disabled: this.viewOnly() }],
    phone: [{ value: "", disabled: this.viewOnly() }],
    note: [{ value: "", disabled: this.viewOnly() }],
    locations: [[{}]],
  });

  initFormValue: PartialCustomer = {};
  deletedLocations: LocationOnCustomerSection[] = [];

  get f() {
    return this.customerForm.controls;
  }

  get locations() {
    return this.f.locations.value?.filter(o => Object.keys(o).length > 0) as LocationOnCustomerSection[];
  }

  get isNewCustomer() {
    return this.id() === "new";
  }

  ngOnInit() {
    if (!this.isNewCustomer) {
      this.store.dispatch(
        CustomerActions.getCustomer({ id: this.id() })
      );
    }

    this.active$
      .subscribe((value: PartialCustomer | any) => {
        if(!value) {
          return;
        }

        this.customerForm.patchValue(value);

        this.loadLocations(value.locations);

        this.initFormValue = this.customerForm.value as PartialCustomer;
      });

    this.editCustomerChanges();

  }

  loadLocations(locations: LocationOnCustomerSection[]) {
    this.customerForm.patchValue({
      locations: locations
    });
  }

  editCustomerChanges() {
    this.customerForm.valueChanges.pipe(
      pairwise(),
      map(([_, newState]) => {
        if(!Object.values(this.initFormValue).length && !this.isNewCustomer) {
          return {};
        }
        const diff = {
          ...difference(this.initFormValue, newState),

          // Array data
          locations: [
            ...(newState.locations || []),
            ...this.deletedLocations
          ]
        };

        return createCustomerPayload(diff);
      }),
      map((changes: any) => Object.keys(changes).length !== 0 && !this.customerForm.invalid ? { ...changes, id: this.id() } : {}),
      takeUntil(this.subject),
      // tap(changes => console.log(changes)),
    ).subscribe((changes: any) => this.store.dispatch(CustomerActions.customerActiveChanges({ changes })));
  }

  onLocationAdd({ newLocation }: { newLocation: Partial<LocationOnCustomerSection> }) {
    let currentLocations = [ ...this.locations ];

    this.customerForm.patchValue({
      locations: [
        ...currentLocations,
        newLocation
      ]
    });
  }

  onRemoveLocation({ code }: { code: string }) {
    const deleted = this.locations.find((a) => a.code === code && a.id !== -1);
    if(deleted) {
      this.deletedLocations.push({ ...deleted, toBeDisconnected: true });
    }

    this.customerForm.patchValue({
      locations: this.locations.filter((a) => a.code !== code)
    });
  }

  onLocationChangeData({ data }: { data: Partial<LocationOnCustomerSection> }) {
    this.customerForm.patchValue({
      locations: this.locations.map((p , i) => {
        if(p.code === data.code) {
          return {
            ...p,
            address: data.address ? data.address : p.address,
            name: data.name ? data.name : p.name,
            city: data.city ? data.city : p.city,
            code: data.code ? data.code : p.code,
            departments: data.departments ? data.departments : p.departments,
            province: data.province ? data.province : p.province,
            customerId: data.customerId ? data.customerId : p.customerId,
          }
        }
        return {
          ...p,
        };
      })
    })
  }

  ngOnDestroy(): void {
    this.customerForm.reset();

    this.store.dispatch(CustomerActions.clearCustomerActive());
    this.store.dispatch(CustomerActions.clearCustomerHttpError());
  }

}