import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../app.config";
import { truncatePillText } from "../../../../../../utils/utils";
import { LocationOnCustomerSection } from "../../../../../models/Customer";
import * as RouterActions from "../../../../../core/router/store/router.actions";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl } from "../../../../../core/router/store/router.selectors";

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ReactiveFormsModule, MatOptionModule, MatSelectModule ],
  template: `
    <div class="flex justify-between bg-white rounded border p-2 gap-2">
      <div class="flex w-4/5 gap-7">
        <div class="flex self-center w-1/4">{{ truncatePillText(location.address || "", 30) }}</div>
        <div class="flex self-center w-1/4">{{ truncatePillText(location.city || "") }}</div>
        <div class="flex self-center w-1/4">{{ truncatePillText(location.name || "", 30) }}</div>
        <div class="flex self-center w-1/4 gap-2">
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
        <div class="flex flex-row p-1 accent gap-2.5 items-center text-center max-h-10 rounded default-shadow default-shadow-hover cursor-pointer" (click)="navigateToView()">
          <mat-icon class="icon-size material-symbols-rounded">visibility</mat-icon>
        </div>
        <div class="flex flex-row p-1 warning gap-2.5 items-center text-center max-h-10 rounded default-shadow default-shadow-hover cursor-pointer" (click)="navigateToEdit()">
          <mat-icon class="icon-size material-symbols-rounded">edit</mat-icon>
        </div>
        <div class="flex flex-row p-1 error gap-2.5 items-center text-center max-h-10 rounded default-shadow default-shadow-hover cursor-pointer" (click)="deleteLocation()">
          <mat-icon class="icon-size material-symbols-rounded">delete</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class LocationCardComponent {
  @Input({ required: true }) location!: Partial<LocationOnCustomerSection>;
  @Input({ required: true }) viewOnly = false;

  store: Store<AppState> = inject(Store);
  path = toSignal(this.store.select(getRouterUrl));

  getTotalLocationMachine(location: Partial<LocationOnCustomerSection>) {
    return location.departments?.reduce((acc, curr) => acc+= +(curr?.sources?.length || 0), 0);
  }

  navigateToView(){
    this.store.dispatch(RouterActions.go({ path: [ `customers/${ this.location.customerId }/locations/${this.location.id}/view` ] }));
  }

  navigateToEdit(){
    this.store.dispatch(RouterActions.go({ path: [ `customers/${ this.location.customerId }/locations/${this.location.id}` ] }));
  }

  deleteLocation(){

  }

  protected readonly truncatePillText = truncatePillText;
}