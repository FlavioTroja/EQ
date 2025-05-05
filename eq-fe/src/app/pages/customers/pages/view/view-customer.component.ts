import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { MatIconModule } from "@angular/material/icon";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatTooltipModule } from "@angular/material/tooltip";
import * as CustomersActions from "../../../customers/store/actions/customers.actions";
import { getCurrentCustomer } from "../../store/selectors/customers.selectors";
import { LocationOnCustomerSection } from "../../../../models/Customer";
import { truncatePillText } from "../../../../../utils/utils";

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ClipboardModule, MatTooltipModule ],
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
      <div class="flex justify-between bg-white rounded border p-2 gap-2" *ngFor="let location of locations">
        <div class="flex w-4/5 gap-7">
          <div class="flex w-1/4">{{ truncatePillText(location.address || "", 30) }}</div>
          <div class="flex w-1/4">{{ truncatePillText(location.city || "") }}</div>
          <div class="flex w-1/4">{{ truncatePillText(location.name || "", 30) }}</div>
          <div class="flex w-1/4 gap-2">
            <div>
              <div class="flex rounded-full bg-light-grey border p-1 pr-2 gap-1">
                <mat-icon class="material-symbols-rounded">space_dashboard</mat-icon>
                <div class="flex font-bold text-center gap-2">
                  {{ location.departments?.length }}
                  <div class="font-normal">reparti</div>
                </div>
              </div>
            </div>
            <div>
              <div class="flex rounded-full bg-light-grey border p-1 pr-2 gap-1">
                <mat-icon class="material-symbols-rounded">precision_manufacturing</mat-icon>
                <div class="flex font-bold text-center gap-2">
                  {{ getTotalLocationMachine(location) }}
                  <div class="font-normal">macchine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex w-1/5 justify-end items-center select-none gap-2">
          <div class="flex flex-row p-1 accent gap-2.5 items-center text-center max-h-10 rounded default-shadow default-shadow-hover cursor-pointer">
            <mat-icon class="icon-size material-symbols-rounded">visibility</mat-icon>
          </div>
          <div class="flex flex-row p-1 warning gap-2.5 items-center text-center max-h-10 rounded default-shadow default-shadow-hover cursor-pointer">
            <mat-icon class="icon-size material-symbols-rounded">edit</mat-icon>
          </div>
          <div class="flex flex-row p-1 error gap-2.5 items-center text-center max-h-10 rounded default-shadow default-shadow-hover cursor-pointer">
            <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
          </div>
        </div>
      </div>
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

  getTotalLocationMachine(location: LocationOnCustomerSection) {
    return location.departments?.reduce((acc, curr) => acc+= +(curr?.sources?.length || 0), 0);
  }

  protected readonly truncatePillText = truncatePillText;
}
