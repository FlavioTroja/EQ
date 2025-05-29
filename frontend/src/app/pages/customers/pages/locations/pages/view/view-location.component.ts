import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../../../app.config";
import { selectCustomRouteParam } from "../../../../../../core/router/store/router.selectors";
import * as LocationsActions from "../../store/actions/locations.actions";
import { getCurrentLocation } from "../../store/selectors/locations.selectors";
import { LocationDepartmentsSectionComponent } from "../../components/location-departments-section.component";

@Component({
  selector: 'app-view-location',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ClipboardModule, MatTooltipModule, LocationDepartmentsSectionComponent ],
  template: `
    <div class="flex flex-col gap-2" *ngIf="active() as location">
      <div class="bg-white default-shadow p-2 rounded-md">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col justify-between">
            <div *ngIf="location.customerId"
                 class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 fit-content">
              {{ location.customerId }}
            </div>
            <div class="text-4xl pt-6 pb-4 font-extrabold"> {{ location.name }}</div>
            <div class="flex gap-2">

              <div *ngIf="location.address" class="flex flex-col">
                <div class="font-bold text-lg">Indirizzo</div>
                <span>{{ location.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="location.zipcode">
          <div class="font-bold py-1">NOTE</div>
          <div>{{ location.zipcode }}</div>
        </div>
      </div>

      <app-location-departments-section [departments]="departments" [viewOnly]="true"/>
    </div>
  `,
  styles: [``]
})
export default class ViewLocationComponent implements OnInit {

  store: Store<AppState> = inject(Store);
  active = this.store.selectSignal(getCurrentLocation);
  locationId = toSignal(this.store.select(selectCustomRouteParam("locationId")));
  customerId = toSignal(this.store.select(selectCustomRouteParam("customerId")));

  ngOnInit() {
    this.store.dispatch(
      LocationsActions.getLocation({ locationId: this.locationId(), customerId: this.customerId() })
    );
  }

  get departments() {
    return this.active()?.departments.filter(o => Object.keys(o).length > 0) as any[];
  }
}
