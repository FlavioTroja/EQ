import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { truncatePillText } from "../../../../../utils/utils";
import { AppState } from "../../../../app.config";
import { selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { LocationOnCustomerSection } from "../../../../models/Customer";
import * as CustomersActions from "../../store/actions/customers.actions";
import { getCurrentCustomer } from "../../store/selectors/customers.selectors";
import {
  LocationCardComponent
} from "../../components/customer-locations-selections/location-card/location-card.component";

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ClipboardModule, MatTooltipModule, LocationCardComponent ],
  template: `
    <div class="flex flex-col gap-2" *ngIf="active() as customer">
      <div class="bg-white default-shadow p-2 rounded-md">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col justify-between">
            <div *ngIf="customer.fiscalCode"
                 class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 fit-content"
                 [cdkCopyToClipboard]="customer.fiscalCode.toUpperCase()"
                 matTooltip="Clicca per copiare il codice fiscale negli appunti">
              {{ customer.fiscalCode.toUpperCase() }}
            </div>
            <div class="text-4xl pt-6 pb-4 font-extrabold"> {{ customer.name }}</div>
            <div class="flex gap-2">

              <div *ngIf="customer.sdi"
                   class="bg-gray-100 rounded-full max-w-max py-1 px-2 flex justify-between items-center">
                <span class="font-bold letter-spacing">SDI</span>
                <span class="px-1">{{ customer.sdi }}</span>
              </div>

              <div *ngIf="customer.pec"
                   class="bg-gray-100 rounded-full max-w-max py-1 px-2 flex justify-between items-center">
                <span class="font-bold letter-spacing">PEC</span>
                <span class="px-1">{{ customer.pec }}</span>
              </div>

              <div *ngIf="customer.vatNumber"
                   class="bg-gray-100 rounded-full max-w-max py-1 px-2 flex justify-between items-center">
                <span class="font-bold letter-spacing">IVA</span>
                <span class="px-1">{{ customer.vatNumber }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 items-end">
            <a *ngIf="customer.email" [href]="'mailto:' + customer.email"
               class="inline-flex items-center px-2.5 py-0.5 rounded-md shadow-sm accent text-sm font-medium">
              <mat-icon class="icon-size material-symbols-rounded">mail
              </mat-icon>&nbsp;{{ customer?.email?.toLowerCase() }}
            </a>
            <a *ngIf="customer.phone" [href]="'https://wa.me/' + customer.phone" target="_blank"
               class="inline-flex items-center px-2.5 py-0.5 rounded-md shadow-sm accent text-sm font-medium">
              <mat-icon class="icon-size material-symbols-rounded">phone</mat-icon>&nbsp;{{ customer.phone }}
            </a>
          </div>
        </div>

        <div *ngIf="customer.note">
          <div class="font-bold py-1">NOTE</div>
          <div>{{ customer.note }}</div>
        </div>
      </div>

      <!--      <app-customer-locations-section-->
      <!--        [viewOnly]="true"-->
      <!--        [locations]="locations"-->
      <!--      />-->
      <app-location-card *ngFor="let location of locations" [location]="location" [viewOnly]="true"/>
    </div>
  `,
  styles: [``]
})
export default class ViewCustomerComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  active = this.store.selectSignal(getCurrentCustomer);
  id = toSignal(this.store.select(selectCustomRouteParam("id")));

  ngOnInit() {
    this.store.dispatch(
      CustomersActions.getCustomer({ id: this.id()})
    );
  }

  get locations() {
    return this.active()?.locations.filter(o => Object.keys(o).length > 0) as LocationOnCustomerSection[];
  }

  protected readonly truncatePillText = truncatePillText;
}
