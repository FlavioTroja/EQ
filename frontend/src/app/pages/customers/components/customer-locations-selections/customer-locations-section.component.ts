import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Subject } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { LocationCardComponent } from "./location-card/location-card.component";
import { Location } from "../../../../models/Location";
import { LocationOnCustomerSection } from "../../../../models/Customer";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { getRouterUrl, selectCustomRouteParam } from "../../../../core/router/store/router.selectors";
import { SectionHeaderComponent } from "../../../../components/section-header/section-header.component";

@Component({
  selector: 'app-customer-locations-section',
  standalone: true,
  imports: [ CommonModule, MatIconModule, LocationCardComponent, ReactiveFormsModule, SectionHeaderComponent ],
  template: `

    <div class="flex flex-col gap-2">
      <app-section-header title="Sedi" [viewOnly]="viewOnly" (btnAdd)="addNewLocation()" />
      <div>
        <div class="flex flex-col w-full gap-2.5">
          <app-location-card
            *ngFor="let location of locations; index as i"
            [viewOnly]="viewOnly"
            [location]="location"
            (onSave)="onLocationSaveChanges($event)"
            (onDelete)="onLocationDelete(i)"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class CustomerLocationsSectionComponent {
  @Input({ required: true }) locations: LocationOnCustomerSection[] = [];
  @Input({ required: false }) viewOnly = false;

  fb = inject(FormBuilder);
  store: Store<AppState> = inject(Store);
  path = toSignal(this.store.select(getRouterUrl));

  subject = new Subject();

  isLocationFormOpen: boolean = false;

  toggleIsLocationFormOpen() {
    this.isLocationFormOpen = true;
  }

  onLocationSaveChanges(event: Location) {

  }

  addNewLocation(){
    this.store.dispatch(RouterActions.go({ path: [ `${ this.path() }/locations/new` ] }));
  }

  onLocationDelete(index: number) {

  }
}